import { NextResponse } from "next/server";

import { normalizeStateToAbbr } from "@/lib/pricingEngine";
import { distanceBetweenStatesMiles } from "@/lib/route-builder";

import { calculateStructuredPrice } from "@/lib/pricing";
import {
  applyNegotiationDiscount,
  isHumanRequest,
  isNegotiationIntent,
  nextNegotiationLevel,
  shouldEscalate,
} from "@/lib/negotiation";

export const runtime = "nodejs";

type VehicleType = "sedan" | "suv" | "pickup";
type LeadState = {
  pickup: string | null;
  delivery: string | null;
  vehicleType: VehicleType | null;
  timeline: string | null;
  serviceLevel: "Standard" | "Priority" | "Premium";
  negotiationLevel: number;
  email: string | null;
  phone: string | null;
};

const DEFAULT_LEAD_STATE: LeadState = {
  pickup: null,
  delivery: null,
  vehicleType: null,
  timeline: null,
  serviceLevel: "Standard",
  negotiationLevel: 0,
  email: null,
  phone: null,
};

function getNextStep(state: LeadState) {
  if (!state.pickup) return "pickup";
  if (!state.delivery) return "delivery";
  if (!state.vehicleType) return "vehicle";
  if (!state.timeline) return "timeline";
  return "pricing";
}

function extractEmail(text: string) {
  const m = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.exec(text);
  return m?.[0] ?? "";
}

function extractPhone(text: string) {
  const m = /\b(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/.exec(text);
  return m?.[0] ?? "";
}

function normalizeVehicleType(input: string): VehicleType | null {
  const raw = String(input ?? "").trim().toLowerCase();
  if (!raw) return null;
  if (raw.includes("suv")) return "suv";
  if (raw.includes("pickup") || raw.includes("truck")) return "pickup";
  if (raw.includes("sedan") || raw.includes("car")) return "sedan";
  return null;
}

function normalizeServiceLevel(input: string): LeadState["serviceLevel"] | null {
  const raw = String(input ?? "").trim().toLowerCase();
  if (!raw) return null;
  if (raw.includes("standard")) return "Standard";
  if (raw.includes("priority")) return "Priority";
  if (raw.includes("premium")) return "Premium";
  return null;
}

function extractRoute(text: string): { pickup?: string; delivery?: string } {
  const fromTo = /from\s+([^\n,.;!?]+)\s+to\s+([^\n,.;!?]+)/i.exec(text);
  if (fromTo) {
    const pickup = normalizeStateToAbbr(fromTo[1]);
    const delivery = normalizeStateToAbbr(fromTo[2]);
    return { pickup: pickup || undefined, delivery: delivery || undefined };
  }

  const arrow = /\b([A-Za-z ]{2,})\s*(?:->|→)\s*([A-Za-z ]{2,})\b/.exec(text);
  if (arrow) {
    const pickup = normalizeStateToAbbr(arrow[1]);
    const delivery = normalizeStateToAbbr(arrow[2]);
    return { pickup: pickup || undefined, delivery: delivery || undefined };
  }

  return {};
}

function parseStateAnswer(text: string) {
  const raw = String(text ?? "").trim();
  if (!raw) return "";

  // If the user explicitly typed an all-caps 2-letter abbreviation, treat it as intentional.
  if (/^[A-Z]{2}$/.test(raw)) return raw;

  const token = raw.toLowerCase();
  const ambiguous = new Set([
    "hi",
    "hey",
    "hello",
    "ok",
    "okay",
    "no",
    "yes",
    "me",
    "we",
    "us",
    "am",
    "an",
    "to",
    "in",
    "on",
    "at",
    "it",
  ]);

  // Avoid mapping short chat tokens to 2-letter state abbreviations.
  if (!raw.includes(" ") && raw.length <= 3 && ambiguous.has(token)) return "";

  return normalizeStateToAbbr(raw);
}

function wantsToBook(text: string) {
  return /\b(yes|yep|yeah|sure|book|secure|go ahead|do it|lock it in)\b/i.test(text);
}

function formatMoney(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

async function notifyDispatcher(req: Request, payload: unknown) {
  await fetch(new URL("/api/notify-dispatcher", req.url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

async function saveLead(req: Request, payload: unknown) {
  await fetch(new URL("/api/save-lead", req.url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      leadState?: Partial<LeadState>;
    };

    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const lastMessage = messages[messages.length - 1]?.content ?? "";

    const incomingState = body?.leadState ?? {};
    const leadState: LeadState = {
      ...DEFAULT_LEAD_STATE,
      ...incomingState,
      negotiationLevel: Math.max(0, Math.min(3, Number(incomingState.negotiationLevel ?? 0) || 0)),
      serviceLevel: (incomingState.serviceLevel as LeadState["serviceLevel"]) ?? "Standard",
    };

    const expectedStepBefore = getNextStep(leadState);

    // Update state from the latest user message.
    const email = extractEmail(lastMessage);
    if (email) leadState.email = email;

    const phone = extractPhone(lastMessage);
    if (phone) leadState.phone = phone;

    const sl = normalizeServiceLevel(lastMessage);
    if (sl) leadState.serviceLevel = sl;

    leadState.negotiationLevel = nextNegotiationLevel(leadState.negotiationLevel, lastMessage);

    if (!leadState.pickup || !leadState.delivery) {
      const { pickup, delivery } = extractRoute(lastMessage);
      if (!leadState.pickup && pickup) leadState.pickup = pickup;
      if (!leadState.delivery && delivery) leadState.delivery = delivery;
    }

    // Only accept a single-state answer when we are explicitly collecting that field.
    if (!leadState.pickup && getNextStep(leadState) === "pickup") {
      const maybePickup = parseStateAnswer(lastMessage);
      if (maybePickup) leadState.pickup = maybePickup;
    } else if (!leadState.delivery && getNextStep(leadState) === "delivery") {
      const maybeDelivery = parseStateAnswer(lastMessage);
      if (maybeDelivery) leadState.delivery = maybeDelivery;
    }

    if (!leadState.vehicleType) {
      const vt = normalizeVehicleType(lastMessage);
      if (vt) leadState.vehicleType = vt;
    }

    // Timeline: only accept a natural answer when we were actually asking for the timeline.
    if (!leadState.timeline && expectedStepBefore === "timeline") {
      const t = lastMessage.trim();
      if (t && !isNegotiationIntent(t) && !isHumanRequest(t)) {
        leadState.timeline = t;
      }
    }

    const next = getNextStep(leadState);

    if (next === "pickup") {
      return NextResponse.json({
        message: "Where will the vehicle be picked up? (State)",
        leadState,
        escalate: false,
      });
    }

    if (next === "delivery") {
      return NextResponse.json({
        message: "Where is it being delivered? (State)",
        leadState,
        escalate: false,
      });
    }

    if (next === "vehicle") {
      return NextResponse.json({
        message: "What type of vehicle is it — Sedan, SUV, or Pickup?",
        leadState,
        escalate: false,
      });
    }

    if (next === "timeline") {
      return NextResponse.json({
        message: "When are you looking to ship? (e.g., today, this week, or a date)",
        leadState,
        escalate: false,
      });
    }
    // Pricing step
    const pickup = leadState.pickup as string;
    const delivery = leadState.delivery as string;
    const vehicleType = leadState.vehicleType as VehicleType;

    const distance = distanceBetweenStatesMiles(pickup, delivery);
    if (!distance) {
      return NextResponse.json({
        message: "Please confirm pickup and delivery states (e.g., TX → CA) so I can price accurately.",
        leadState,
        escalate: false,
      });
    }

    const pricing = calculateStructuredPrice({
      pickup,
      delivery,
      vehicleType,
      distance,
      serviceLevel: leadState.serviceLevel,
    });

    // Controlled discounting (never below margin floor).
    const marginFloor = Math.round(pricing.adjustedPrice * 0.92);
    const finalPrice = applyNegotiationDiscount(pricing.adjustedPrice, leadState.negotiationLevel, marginFloor);

    const escalate = shouldEscalate({ negotiationLevel: leadState.negotiationLevel, price: finalPrice, message: lastMessage });
    if (escalate) {
      await notifyDispatcher(req, {
        transcript: messages,
        leadState,
        price: finalPrice,
        reason: leadState.negotiationLevel >= 2 ? "negotiation" : isHumanRequest(lastMessage) ? "human_request" : "high_price",
      });

      return NextResponse.json({
        message: "Let me connect you with a senior dispatcher.",
        leadState,
        escalate: true,
        price: finalPrice,
      });
    }

    // Close script
    if (wantsToBook(lastMessage)) {
      if (!leadState.email) {
        return NextResponse.json({
          message: "Perfect — what’s your name and email so I can secure the carrier?",
          leadState,
          escalate: false,
          price: finalPrice,
        });
      }

      // Save lead once we have contact info + full lane.
      await saveLead(req, {
        pickup: leadState.pickup,
        delivery: leadState.delivery,
        vehicleType: leadState.vehicleType,
        timeline: leadState.timeline,
        price: finalPrice,
        negotiationLevel: leadState.negotiationLevel,
        email: leadState.email,
        phone: leadState.phone,
        conversationTranscript: messages,
      });

      return NextResponse.json({
        message: "Got it. We’ll secure availability and confirm dispatch details shortly.",
        leadState,
        escalate: false,
        price: finalPrice,
      });
    }

    // If we already have email in-state at pricing time, save automatically.
    if (leadState.email) {
      await saveLead(req, {
        pickup: leadState.pickup,
        delivery: leadState.delivery,
        vehicleType: leadState.vehicleType,
        timeline: leadState.timeline,
        price: finalPrice,
        negotiationLevel: leadState.negotiationLevel,
        email: leadState.email,
        phone: leadState.phone,
        conversationTranscript: messages,
      });
    }

    const negotiationLine =
      leadState.negotiationLevel >= 1
        ? "If we schedule within 24 hours, I can secure this rate."
        : "";

    const message =
      `Estimated price: $${formatMoney(finalPrice)}\n` +
      `Pickup window: ${pricing.pickupWindow}\n` +
      `Service level: ${pricing.serviceLevel}\n\n` +
      (negotiationLine ? `${negotiationLine}\n\n` : "") +
      "Would you like me to secure a carrier for you?";

    return NextResponse.json({
      message,
      leadState,
      escalate: false,
      price: finalPrice,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Something went wrong.",
        leadState: DEFAULT_LEAD_STATE,
        escalate: false,
      },
      { status: 500 }
    );
  }
}

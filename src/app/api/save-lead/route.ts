import { normalizeStateToAbbr, type VehicleType } from "@/lib/pricingEngine";

type Transcript = Array<{ role: "user" | "assistant"; content: string }>;

type StoredLead = {
  pickup: string | null;
  delivery: string | null;
  vehicleType: VehicleType | null;
  timeline: string | null;
  price: number | null;
  negotiationLevel: number;
  email: string | null;
  phone: string | null;
  conversationTranscript: Transcript;
};

function extractEmail(text: string) {
  const m = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.exec(text);
  return m?.[0] ?? "";
}

function extractPhone(text: string) {
  const m = /\b(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/.exec(text);
  return m?.[0] ?? "";
}

function normalizeVehicleType(input: unknown): VehicleType | null {
  const raw = String(input ?? "").trim().toLowerCase();
  if (!raw) return null;
  if (raw.includes("suv")) return "suv";
  if (raw.includes("sedan") || raw.includes("car")) return "sedan";
  if (raw.includes("pickup")) return "pickup";
  if (raw.includes("truck")) return "pickup";
  return null;
}

function extractRoute(text: string): { pickup?: string; delivery?: string } {
  const fromTo = /from\s+([^\n,.;!?]+)\s+to\s+([^\n,.;!?]+)/i.exec(text);
  if (fromTo) {
    const pickup = normalizeStateToAbbr(fromTo[1]);
    const delivery = normalizeStateToAbbr(fromTo[2]);
    return { pickup: pickup || undefined, delivery: delivery || undefined };
  }
  return {};
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<StoredLead> & { messages?: Transcript };

    // New structured payload
    const structuredTranscript = Array.isArray(body?.conversationTranscript)
      ? body.conversationTranscript
      : Array.isArray(body?.messages)
        ? body.messages
        : [];

    const lead: StoredLead = {
      pickup: typeof body?.pickup === "string" ? normalizeStateToAbbr(body.pickup) || null : null,
      delivery: typeof body?.delivery === "string" ? normalizeStateToAbbr(body.delivery) || null : null,
      vehicleType: (body?.vehicleType as VehicleType) ?? null,
      timeline: typeof body?.timeline === "string" ? body.timeline : null,
      price: Number.isFinite(body?.price) ? Math.round(Number(body?.price)) : null,
      negotiationLevel: Math.max(0, Math.min(3, Number(body?.negotiationLevel ?? 0) || 0)),
      email: typeof body?.email === "string" ? body.email : null,
      phone: typeof body?.phone === "string" ? body.phone : null,
      conversationTranscript: structuredTranscript,
    };

    // Backward-compat: attempt to extract basics from transcript if missing.
    for (const m of lead.conversationTranscript) {
      if (m.role !== "user") continue;
      const text = m.content ?? "";

      if (!lead.email) {
        const e = extractEmail(text);
        if (e) lead.email = e;
      }

      if (!lead.phone) {
        const p = extractPhone(text);
        if (p) lead.phone = p;
      }

      if (!lead.vehicleType) {
        const vt = normalizeVehicleType(text);
        if (vt) lead.vehicleType = vt;
      }

      if (!lead.pickup || !lead.delivery) {
        const { pickup, delivery } = extractRoute(text);
        if (!lead.pickup && pickup) lead.pickup = pickup;
        if (!lead.delivery && delivery) lead.delivery = delivery;
      }

      if (!lead.pickup) {
        const p = normalizeStateToAbbr(text);
        if (p) lead.pickup = p;
      }
    }

    console.log("[save-lead]", {
      pickup: lead.pickup,
      delivery: lead.delivery,
      vehicleType: lead.vehicleType,
      timeline: lead.timeline,
      price: lead.price,
      negotiationLevel: lead.negotiationLevel,
      email: lead.email,
      phone: lead.phone,
      messages: lead.conversationTranscript.length,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}

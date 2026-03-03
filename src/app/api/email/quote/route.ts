import { NextResponse } from "next/server";
import { Resend } from "resend";

import { calcMilesAndMeta } from "@/lib/estimate";
import { calculatePlanPrices } from "@/lib/pricingEngine";
import { sanitizeQuote } from "@/lib/quote-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function requireEnv(name: string) {
  return (process.env[name] ?? "").trim();
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildEmail({
  quote,
  miles,
  fromZip,
  toZip,
  fromState,
  toState,
  plans,
}: {
  quote: NonNullable<ReturnType<typeof sanitizeQuote>>;
  miles: number;
  fromZip?: string;
  toZip?: string;
  fromState?: string;
  toState?: string;
  plans: { standard: { totalPrice: number }; priority: { totalPrice: number }; expedited: { totalPrice: number } };
}) {
  const subject = `Your initial auto transport quote (${miles} miles)`;

  const routeLine = `${quote.fromLocation} → ${quote.toLocation}`;
  const metaBits = [
    fromZip && toZip ? `ZIP ${fromZip} → ${toZip}` : null,
    fromState && toState ? `${fromState} → ${toState}` : null,
  ].filter(Boolean);
  const metaLine = metaBits.length ? `(${metaBits.join(" • ")})` : "";

  const transportLine = `Transport: ${quote.transportType === "enclosed" ? "Enclosed" : "Open"}`;
  const expeditedLine = `Expedited: ${quote.expedited ? "Yes" : "No"}`;

  const planRows = [
    { name: "Standard", window: "5–7 days", bestFor: "Flexible schedule", price: plans.standard.totalPrice },
    { name: "Priority", window: "2–4 days", bestFor: "Faster pickup", price: plans.priority.totalPrice },
    { name: "Expedited", window: "24–48 hrs", bestFor: "Urgent shipment", price: plans.expedited.totalPrice },
  ];

  const textLines = [
    "Your initial quote",
    "",
    `${routeLine} ${metaLine}`.trim(),
    `Distance: ${miles} miles`,
    transportLine,
    expeditedLine,
    "",
    "Plans:",
    ...planRows.map((p) => `- ${p.name} (${p.window}): ${formatMoney(p.price)} (${p.bestFor})`),
    "",
    "Vehicle(s):",
    ...quote.vehicles.map((v, idx) => {
      const descriptor = [v.year, v.make, v.model]
        .map((s) => (s ?? "").trim())
        .filter(Boolean)
        .join(" ");
      return `- Vehicle ${idx + 1}: ${descriptor || "(details provided)"}`;
    }),
    "",
    "Contact:",
    `Name: ${quote.name || "-"}`,
    `Phone: ${quote.phone || "-"}`,
    `Email: ${quote.email || "-"}`,
    "",
    "Note: Pricing shown is an initial estimate and may vary based on availability and final pickup/delivery details.",
  ];

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.45; color: #171717;">
      <h2 style="margin: 0 0 12px;">Your initial quote</h2>
      <p style="margin: 0 0 6px;"><strong>Route:</strong> ${routeLine} ${metaLine}</p>
      <p style="margin: 0 0 6px;"><strong>Distance:</strong> ${miles} miles</p>
      <p style="margin: 0 0 6px;"><strong>${transportLine}</strong></p>
      <p style="margin: 0 0 14px;"><strong>${expeditedLine}</strong></p>

      <table style="width: 100%; border-collapse: collapse; margin: 10px 0 16px;">
        <thead>
          <tr>
            <th align="left" style="border-bottom: 1px solid #e5e7eb; padding: 10px 6px; font-size: 13px;">Plan</th>
            <th align="left" style="border-bottom: 1px solid #e5e7eb; padding: 10px 6px; font-size: 13px;">Pickup Window</th>
            <th align="left" style="border-bottom: 1px solid #e5e7eb; padding: 10px 6px; font-size: 13px;">Price</th>
            <th align="left" style="border-bottom: 1px solid #e5e7eb; padding: 10px 6px; font-size: 13px;">Best For</th>
          </tr>
        </thead>
        <tbody>
          ${planRows
            .map(
              (p) => `
            <tr>
              <td style="border-bottom: 1px solid #f3f4f6; padding: 10px 6px; font-weight: 700;">${p.name}</td>
              <td style="border-bottom: 1px solid #f3f4f6; padding: 10px 6px;">${p.window}</td>
              <td style="border-bottom: 1px solid #f3f4f6; padding: 10px 6px; font-weight: 700;">${formatMoney(p.price)}</td>
              <td style="border-bottom: 1px solid #f3f4f6; padding: 10px 6px;">${p.bestFor}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <p style="margin: 0 0 6px;"><strong>Vehicle(s):</strong></p>
      <ul style="margin: 6px 0 16px; padding-left: 18px;">
        ${quote.vehicles
          .map((v, idx) => {
            const descriptor = [v.year, v.make, v.model]
              .map((s) => (s ?? "").trim())
              .filter(Boolean)
              .join(" ");
            return `<li>Vehicle ${idx + 1}: ${descriptor || "(details provided)"}</li>`;
          })
          .join("")}
      </ul>

      <p style="margin: 0 0 6px;"><strong>Contact:</strong></p>
      <p style="margin: 0;">${quote.name || "-"}<br/>${quote.phone || "-"}<br/>${quote.email || "-"}</p>

      <p style="margin: 16px 0 0; font-size: 12px; color: #6b7280;">Note: Pricing shown is an initial estimate and may vary based on availability and final pickup/delivery details.</p>
    </div>
  `.trim();

  return { subject, text: textLines.join("\n"), html };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    const quote = sanitizeQuote(body);
    if (!quote) {
      return NextResponse.json({ error: "Invalid quote" }, { status: 400 });
    }

    const customerEmail = (quote.email ?? "").trim();
    if (!customerEmail) {
      return NextResponse.json({ error: "Missing customer email" }, { status: 400 });
    }

    const leadsEmail = requireEnv("LEADS_EMAIL") || "dispatch@quickcartrucking.com";
    const resendApiKey = requireEnv("RESEND_API_KEY");
    const fromEmail = requireEnv("RESEND_FROM");

    if (!resendApiKey || !fromEmail) {
      return NextResponse.json(
        { error: "Email is not configured. Set RESEND_API_KEY and RESEND_FROM (optional: LEADS_EMAIL)." },
        { status: 500 },
      );
    }

    const estimate = calcMilesAndMeta({ from: quote.fromLocation, to: quote.toLocation });
    if ("error" in estimate) {
      return NextResponse.json({ error: estimate.error }, { status: 400 });
    }

    const miles = Math.max(1, Math.round(estimate.miles));
    const vehicleTypes = quote.vehicles.map((v) => v.vehicleType);

    const tierResult = calculatePlanPrices({
      vehicleTypes,
      distance: miles,
      pickup: estimate.fromState,
      delivery: estimate.toState,
      transportType: quote.transportType,
    });

    const { subject, text, html } = buildEmail({
      quote,
      miles,
      fromZip: estimate.fromZip,
      toZip: estimate.toZip,
      fromState: estimate.fromState,
      toState: estimate.toState,
      plans: tierResult.plans,
    });

    const resend = new Resend(resendApiKey);

    const customerSend = await resend.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject,
      text,
      html,
      replyTo: leadsEmail,
    });

    if (customerSend.error) {
      return NextResponse.json({ error: customerSend.error.message || "Failed to send customer email" }, { status: 502 });
    }

    const leadSend = await resend.emails.send({
      from: fromEmail,
      to: leadsEmail,
      subject: `New lead: ${subject}`,
      text,
      html,
      replyTo: customerEmail,
    });

    if (leadSend.error) {
      return NextResponse.json({ error: leadSend.error.message || "Failed to send lead email" }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

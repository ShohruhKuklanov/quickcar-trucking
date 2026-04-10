import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type ContactPayload = {
  fullName?: string;
  phone?: string;
  email?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  message?: string;
};

function requireEnv(name: string) {
  return (process.env[name] ?? "").trim();
}

function sanitize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;

    const fullName = sanitize(body.fullName);
    const phone = sanitize(body.phone);
    const email = sanitize(body.email);
    const pickupLocation = sanitize(body.pickupLocation);
    const deliveryLocation = sanitize(body.deliveryLocation);
    const message = sanitize(body.message);

    if (!fullName || !phone || !email) {
      return NextResponse.json({ error: "Full name, phone number, and email address are required." }, { status: 400 });
    }

    const resendApiKey = requireEnv("RESEND_API_KEY");
    const toEmail = requireEnv("LEADS_EMAIL") || "support@quickcartrucking.com";
    const configuredFromEmail = requireEnv("RESEND_FROM");
    const fromEmail =
      process.env.NODE_ENV === "production"
        ? configuredFromEmail || "QuickCar Trucking <onboarding@resend.dev>"
        : "QuickCar Trucking <onboarding@resend.dev>";

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Contact email is not configured. Set RESEND_API_KEY to enable the form." },
        { status: 500 },
      );
    }

    const resend = new Resend(resendApiKey);

    const text = [
      "New contact request",
      "",
      `Full Name: ${fullName}`,
      `Phone Number: ${phone}`,
      `Email Address: ${email}`,
      `Pickup Location: ${pickupLocation || "-"}`,
      `Delivery Location: ${deliveryLocation || "-"}`,
      "",
      "Message:",
      message || "-",
    ].join("\n");

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #171717;">
        <h2 style="margin: 0 0 12px;">New contact request</h2>
        <p style="margin: 0 0 6px;"><strong>Full Name:</strong> ${fullName}</p>
        <p style="margin: 0 0 6px;"><strong>Phone Number:</strong> ${phone}</p>
        <p style="margin: 0 0 6px;"><strong>Email Address:</strong> ${email}</p>
        <p style="margin: 0 0 6px;"><strong>Pickup Location:</strong> ${pickupLocation || "-"}</p>
        <p style="margin: 0 0 16px;"><strong>Delivery Location:</strong> ${deliveryLocation || "-"}</p>
        <p style="margin: 0 0 6px;"><strong>Message:</strong></p>
        <p style="margin: 0; white-space: pre-wrap;">${message || "-"}</p>
      </div>
    `.trim();

    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Contact request from ${fullName}`,
      text,
      html,
      replyTo: email,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message || "Unable to send contact request." }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
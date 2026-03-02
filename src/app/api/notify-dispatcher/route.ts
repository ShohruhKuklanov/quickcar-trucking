import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Minimal webhook placeholder.
    // You can replace this with an outbound webhook call (Slack, email, CRM) later.
    console.log("[notify-dispatcher]", JSON.stringify(payload));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

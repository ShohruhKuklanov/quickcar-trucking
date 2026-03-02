import { NextResponse } from "next/server";
import { createQuote, getQuote, sanitizeQuote } from "@/lib/quote-store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    const quote = sanitizeQuote(body);
    if (!quote) {
      return NextResponse.json({ error: "Invalid quote" }, { status: 400 });
    }

    const stored = createQuote(quote);
    return NextResponse.json(
      { id: stored.id },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = (searchParams.get("id") ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const stored = getQuote(id);
  if (!stored) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(
    { id: stored.id, quote: stored.quote, createdAt: stored.createdAt },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

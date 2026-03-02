import { NextResponse } from "next/server";
import { calcMilesAndMeta } from "@/lib/estimate";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const from = (searchParams.get("from") ?? "").trim();
  const to = (searchParams.get("to") ?? "").trim();

  if (!from || !to) {
    return NextResponse.json({ error: "Missing from/to" }, { status: 400 });
  }

  const result = calcMilesAndMeta({ from, to });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(
    {
      fromZip: result.fromZip,
      toZip: result.toZip,
      fromState: result.fromState,
      toState: result.toState,
      fromCoord: result.fromCoord,
      toCoord: result.toCoord,
      miles: result.miles,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}

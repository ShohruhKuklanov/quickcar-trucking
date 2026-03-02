import { NextResponse } from "next/server";

type VPICModelRow = { Model_Name?: string };

type VPICResponse = {
  Results?: VPICModelRow[];
};

function uniqSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function normalizeMake(value: string) {
  return value.trim();
}

function normalizeYear(value: string) {
  const trimmed = value.trim();
  const match = /^\d{4}$/.exec(trimmed);
  return match?.[0] ?? "";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const make = normalizeMake(searchParams.get("make") ?? "");
  const year = normalizeYear(searchParams.get("year") ?? "");

  if (!make) {
    return NextResponse.json({ error: "Missing make" }, { status: 400 });
  }

  const encodedMake = encodeURIComponent(make);
  const url = year
    ? `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodedMake}/modelyear/${year}?format=json`
    : `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodedMake}?format=json`;

  try {
    const res = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch models" }, { status: 502 });
    }

    const data = (await res.json()) as VPICResponse;
    const models = uniqSorted(
      (data.Results ?? [])
        .map((r) => (r.Model_Name ?? "").trim())
        .filter((name) => name.length > 0),
    );

    return NextResponse.json(
      { make, year: year || undefined, models },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=86400",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 502 });
  }
}

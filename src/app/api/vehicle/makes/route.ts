import { NextResponse } from "next/server";

type VPICMakeRow = { MakeName?: string };

type VPICResponse = {
  Results?: VPICMakeRow[];
};

function uniqSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export async function GET() {
  try {
    const res = await fetch(
      "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json",
      {
        // Cache on the server; list changes infrequently.
        cache: "force-cache",
        next: { revalidate: 60 * 60 * 24 },
      },
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch makes" }, { status: 502 });
    }

    const data = (await res.json()) as VPICResponse;
    const makes = uniqSorted(
      (data.Results ?? [])
        .map((r) => (r.MakeName ?? "").trim())
        .filter((name) => name.length > 0),
    );

    return NextResponse.json(
      { makes },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=86400",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch makes" }, { status: 502 });
  }
}

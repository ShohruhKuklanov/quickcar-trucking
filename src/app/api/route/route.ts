import { NextResponse } from "next/server";

type OSRMRouteResponse = {
  routes?: Array<{
    geometry?: {
      coordinates?: Array<[number, number]>; // [lon, lat]
      type?: string;
    };
  }>;
  code?: string;
  message?: string;
};

export async function GET(req: Request) {
  const url = new URL(req.url);

  const fromLat = Number(url.searchParams.get("fromLat"));
  const fromLon = Number(url.searchParams.get("fromLon"));
  const toLat = Number(url.searchParams.get("toLat"));
  const toLon = Number(url.searchParams.get("toLon"));

  if (![fromLat, fromLon, toLat, toLon].every(Number.isFinite)) {
    return NextResponse.json({ error: "Invalid coordinates." }, { status: 400 });
  }

  // OSRM public demo server. If you want more reliability/SLAs, swap to a paid routing provider.
  const osrm = new URL(
    `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}`
  );
  osrm.searchParams.set("overview", "full");
  osrm.searchParams.set("geometries", "geojson");

  try {
    const res = await fetch(osrm.toString(), {
      // Keep this dynamic; routes depend on coordinates.
      cache: "no-store",
      headers: {
        "user-agent": "quickcar-transport/1.0",
      },
    });

    const data = (await res.json().catch(() => null)) as OSRMRouteResponse | null;
    const coords = data?.routes?.[0]?.geometry?.coordinates;

    if (!res.ok || !coords || coords.length < 2) {
      return NextResponse.json(
        {
          error: data?.message || "Failed to fetch route geometry.",
          code: data?.code,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ coordinates: coords });
  } catch {
    return NextResponse.json({ error: "Failed to fetch route geometry." }, { status: 502 });
  }
}

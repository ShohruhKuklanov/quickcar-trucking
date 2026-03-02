import zipcodes from "zipcodes";
import { normalizeStateToAbbr } from "@/lib/pricingEngine";

export type ZipCoord = { lat: number; lon: number };

function normalizeZip(zip: string) {
  const trimmed = zip.trim();
  const match = /\b(\d{5})(?:-\d{4})?\b/.exec(trimmed);
  return match?.[1] ?? "";
}

function parseCityState(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Prefer comma-separated forms: "Austin, TX" or "Austin, Texas"
  if (trimmed.includes(",")) {
    const parts = trimmed
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length >= 2) {
      const rawState = parts[parts.length - 1] ?? "";
      const city = parts.slice(0, -1).join(",").trim();
      const state = normalizeStateToAbbr(rawState);
      if (city && state) return { city, state };
    }
  }

  // Fallback: "Austin TX" or "Austin Texas"
  const match = /^(.+?)\s+([A-Za-z]{2}|[A-Za-z][A-Za-z\s]+)$/.exec(trimmed);
  if (!match) return null;
  const city = (match[1] ?? "").trim();
  const state = normalizeStateToAbbr(match[2]);
  if (!city || !state) return null;
  return { city, state };
}

export function resolveToZip(location: string) {
  const zip = normalizeZip(location);
  if (/^\d{5}$/.test(zip)) return zip;

  const cs = parseCityState(location);
  if (!cs) return "";

  const matches = zipcodes.lookupByName(cs.city, cs.state) as Array<{ zip?: string }> | null;
  const firstZip = (matches?.[0]?.zip ?? "").trim();
  return /^\d{5}$/.test(firstZip) ? firstZip : "";
}

export function calcMilesAndMeta({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  const fromZip = resolveToZip(from);
  const toZip = resolveToZip(to);
  if (!fromZip || !toZip) {
    return { error: "Could not resolve locations to ZIPs" as const };
  }

  const fromLookup = zipcodes.lookup(fromZip) as { latitude?: number; longitude?: number; state?: string } | null;
  const toLookup = zipcodes.lookup(toZip) as { latitude?: number; longitude?: number; state?: string } | null;

  const fromState = typeof fromLookup?.state === "string" ? fromLookup.state.trim().toUpperCase() : "";
  const toState = typeof toLookup?.state === "string" ? toLookup.state.trim().toUpperCase() : "";

  const fromCoord =
    typeof fromLookup?.latitude === "number" && typeof fromLookup?.longitude === "number"
      ? ({ lat: fromLookup.latitude, lon: fromLookup.longitude } satisfies ZipCoord)
      : null;
  const toCoord =
    typeof toLookup?.latitude === "number" && typeof toLookup?.longitude === "number"
      ? ({ lat: toLookup.latitude, lon: toLookup.longitude } satisfies ZipCoord)
      : null;

  const miles = zipcodes.distance(fromZip, toZip);
  if (!Number.isFinite(miles) || miles <= 0) {
    return { error: "Could not calculate distance" as const };
  }

  return { fromZip, toZip, fromState, toState, fromCoord, toCoord, miles };
}

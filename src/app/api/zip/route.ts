import { NextResponse } from "next/server";
import zipcodes from "zipcodes";

function normalizeZip(zip: string) {
  const trimmed = zip.trim();
  // Support ZIP+4 by taking the first 5 digits.
  const match = /^\d{5}/.exec(trimmed);
  return match?.[0] ?? "";
}

function normalizeZipPrefix(value: string) {
  const trimmed = value.trim();
  const match = /^\d{1,5}/.exec(trimmed);
  return match?.[0] ?? "";
}

type ZipRecord = {
  zip: string;
  city: string;
  state: string;
};

type LocationSuggestion =
  | { kind: "zip"; zip: string; city: string; state: string }
  | { kind: "city"; city: string; state: string; zip?: string };

const ZIP_KEYS: string[] = Object.keys((zipcodes as unknown as { codes: Record<string, ZipRecord> }).codes).sort(
  (a, b) => a.localeCompare(b),
);

type CityRecord = { key: string; city: string; state: string; zip: string };

const CITY_RECORDS_BY_KEY: Record<string, CityRecord> = (() => {
  const records: Record<string, CityRecord> = {};
  const codes = (zipcodes as unknown as { codes: Record<string, ZipRecord> }).codes;
  for (const zip of ZIP_KEYS) {
    const rec = codes[zip];
    const city = rec?.city?.trim() ?? "";
    const state = rec?.state?.trim() ?? "";
    if (!city || !state) continue;
    const key = `${city.toLowerCase()}|${state.toUpperCase()}`;
    if (records[key]) continue;
    records[key] = { key, city, state: state.toUpperCase(), zip: rec.zip ?? zip };
  }
  return records;
})();

const CITY_KEYS: string[] = Object.keys(CITY_RECORDS_BY_KEY).sort((a, b) => a.localeCompare(b));

function lowerBound(haystack: string[], needle: string) {
  let lo = 0;
  let hi = haystack.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (haystack[mid] < needle) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function suggestZipRecords(prefix: string, limit: number): ZipRecord[] {
  if (!/^\d{1,5}$/.test(prefix)) return [];
  const startKey = prefix.padEnd(5, "0");
  const startIdx = lowerBound(ZIP_KEYS, startKey);
  const records: ZipRecord[] = [];

  const codes = (zipcodes as unknown as { codes: Record<string, ZipRecord> }).codes;
  for (let i = startIdx; i < ZIP_KEYS.length && records.length < limit; i++) {
    const zip = ZIP_KEYS[i];
    if (!zip.startsWith(prefix)) break;
    const rec = codes[zip];
    if (!rec?.city || !rec?.state) continue;
    records.push({ zip: rec.zip ?? zip, city: rec.city, state: rec.state });
  }

  return records;
}

function normalizeCityPrefix(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z\s'.-]/g, "")
    .trim()
    .toLowerCase();
}

function parseCityStateQuery(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const commaIdx = trimmed.lastIndexOf(",");
  if (commaIdx !== -1) {
    const left = trimmed.slice(0, commaIdx).trim();
    const right = trimmed.slice(commaIdx + 1).trim();
    const state = (right.match(/[A-Za-z]{1,2}/)?.[0] ?? "").toUpperCase();
    const cityPrefix = normalizeCityPrefix(left);
    const statePrefix = state ? state : "";
    if (!cityPrefix) return null;
    return { cityPrefix, statePrefix };
  }

  const match = /^(.+?)\s+([A-Za-z]{1,2})$/.exec(trimmed);
  if (match) {
    const cityPrefix = normalizeCityPrefix(match[1] ?? "");
    const statePrefix = (match[2] ?? "").toUpperCase();
    if (!cityPrefix) return null;
    return { cityPrefix, statePrefix };
  }

  const cityPrefix = normalizeCityPrefix(trimmed);
  if (!cityPrefix) return null;
  return { cityPrefix, statePrefix: "" };
}

function suggestCityRecords(query: { cityPrefix: string; statePrefix: string }, limit: number): CityRecord[] {
  const { cityPrefix, statePrefix } = query;
  if (cityPrefix.length < 2) return [];

  const startIdx = lowerBound(CITY_KEYS, cityPrefix);
  const results: CityRecord[] = [];

  for (let i = startIdx; i < CITY_KEYS.length && results.length < limit; i++) {
    const key = CITY_KEYS[i];
    if (!key.startsWith(cityPrefix)) break;
    const rec = CITY_RECORDS_BY_KEY[key];
    if (!rec) continue;
    if (statePrefix && !rec.state.startsWith(statePrefix)) continue;
    results.push(rec);
  }

  return results;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const qParam = searchParams.get("q") ?? "";
  const q = normalizeZipPrefix(qParam);

  if (q && /^\d{1,5}$/.test(q)) {
    const limit = Math.max(1, Math.min(25, Number(searchParams.get("limit") ?? "10") || 10));
    const results = suggestZipRecords(q, limit).map(
      (r) => ({ kind: "zip", zip: r.zip, city: r.city, state: r.state }) satisfies LocationSuggestion,
    );
    return NextResponse.json(
      { query: q, results },
      {
        status: 200,
        headers: {
          // Cache for 1 day; ZIP database is stable.
          "Cache-Control": "public, max-age=86400",
        },
      },
    );
  }

  const cityQuery = parseCityStateQuery(qParam);
  if (cityQuery) {
    const limit = Math.max(1, Math.min(25, Number(searchParams.get("limit") ?? "10") || 10));
    const results = suggestCityRecords(cityQuery, limit).map(
      (r) => ({ kind: "city", city: r.city, state: r.state, zip: r.zip }) satisfies LocationSuggestion,
    );

    return NextResponse.json(
      { query: `${cityQuery.cityPrefix}${cityQuery.statePrefix ? "," + cityQuery.statePrefix : ""}`, results },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=86400",
        },
      },
    );
  }

  const zipParam = searchParams.get("zip") ?? "";
  const zip = normalizeZip(zipParam);

  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "Invalid ZIP" }, { status: 400 });
  }

  try {
    const local = zipcodes.lookup(zip) as { city?: string; state?: string } | null;
    const localCity = local?.city?.trim() ?? "";
    const localState = local?.state?.trim() ?? "";
    if (localCity && localState) {
      return NextResponse.json(
        { zip, city: localCity, state: localState },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=86400",
          },
        },
      );
    }

    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) {
      return NextResponse.json({ error: "ZIP not found" }, { status: 404 });
    }

    const data = (await res.json()) as {
      places?: Array<{ "place name": string; state: string; "state abbreviation"?: string }>;
    };

    const place = data.places?.[0];
    if (!place) {
      return NextResponse.json({ error: "ZIP not found" }, { status: 404 });
    }

    const city = place["place name"];
    const state = place["state abbreviation"] ?? place.state;

    return NextResponse.json(
      { zip, city, state },
      {
        status: 200,
        headers: {
          // Cache for 1 day; ZIP->city is stable.
          "Cache-Control": "public, max-age=86400",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
  }
}

import { getStateBySlug, type StateEntry } from "@/lib/states";

export const regionalDemand: Record<string, number> = {
  florida: 1.2,
  california: 1.1,
  texas: 1.05,
  midwest: 0.95,
};

const MIDWEST_ABBRS = new Set([
  "IL",
  "IN",
  "IA",
  "KS",
  "MI",
  "MN",
  "MO",
  "NE",
  "ND",
  "OH",
  "SD",
  "WI",
]);

function normalizeAbbr(input: string) {
  return String(input ?? "").trim().toUpperCase();
}

export function demandMultiplierForState(state: Pick<StateEntry, "slug" | "abbr"> | string | null | undefined) {
  if (!state) return 1;

  if (typeof state === "string") {
    const entry = getStateBySlug(state);
    if (entry) return demandMultiplierForState(entry);
    // allow passing state abbreviation directly
    const abbr = normalizeAbbr(state);
    if (abbr === "FL") return regionalDemand.florida;
    if (abbr === "CA") return regionalDemand.california;
    if (abbr === "TX") return regionalDemand.texas;
    if (MIDWEST_ABBRS.has(abbr)) return regionalDemand.midwest;
    return 1;
  }

  if (state.slug in regionalDemand) return regionalDemand[state.slug] ?? 1;
  if (MIDWEST_ABBRS.has(normalizeAbbr(state.abbr))) return regionalDemand.midwest;
  return 1;
}

export function laneDemandMultiplier(
  pickupState: Pick<StateEntry, "slug" | "abbr"> | string,
  deliveryState: Pick<StateEntry, "slug" | "abbr"> | string
) {
  return Math.max(demandMultiplierForState(pickupState), demandMultiplierForState(deliveryState));
}

// Centralized enterprise pricing engine.
// - Pure, reusable functions
// - Shared by Route Builder, Quote flows, API routes, email estimates
// - Prevents duplicated pricing logic

/** @typedef {"sedan"|"suv"|"pickup"|"truck"} VehicleType */
/** @typedef {"short"|"long"} DistanceType */

/**
 * Heatmap demand data (0–100). Higher demand -> higher interpolated rate.
 * Extend as needed; unknown states fall back to a conservative midpoint.
 */
export const HEAT_DATA = Object.freeze({
  TX: 90,
  CA: 85,
  FL: 75,
  NY: 70,
  IL: 65,
  GA: 60,
  WA: 55,
  AZ: 58,
  CO: 50,
  NC: 52,
  NJ: 50,
  PA: 48,
  MI: 46,
  OH: 45,
  VA: 47,
  // default fallback is handled in code
});

/**
 * State name -> abbreviation mapping for robust demand lookup.
 * Accepts either "TX" or "Texas" style inputs.
 */
const STATE_NAME_TO_ABBR = Object.freeze({
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
});

function clamp(n, min, max) {
  const v = Number.isFinite(n) ? n : min;
  return Math.max(min, Math.min(max, v));
}

/** @returns {DistanceType} */
export function classifyDistance(distanceMiles) {
  const miles = Number.isFinite(distanceMiles) ? Math.max(0, distanceMiles) : 0;
  return miles < 800 ? "short" : "long";
}

/**
 * Vehicle pricing tiers (per-mile rate range), per spec.
 * @type {Readonly<Record<VehicleType, Readonly<Record<DistanceType, {min:number,max:number}>>>>}
 */
export const VEHICLE_RATE_TABLE = Object.freeze({
  sedan: Object.freeze({
    short: Object.freeze({ min: 0.7, max: 1.5 }),
    long: Object.freeze({ min: 0.35, max: 0.6 }),
  }),
  suv: Object.freeze({
    short: Object.freeze({ min: 0.8, max: 1.5 }),
    long: Object.freeze({ min: 0.37, max: 0.7 }),
  }),
  pickup: Object.freeze({
    short: Object.freeze({ min: 0.8, max: 1.5 }),
    long: Object.freeze({ min: 0.5, max: 0.9 }),
  }),
  // Back-compat alias used elsewhere in the codebase.
  truck: Object.freeze({
    short: Object.freeze({ min: 0.8, max: 1.5 }),
    long: Object.freeze({ min: 0.5, max: 0.9 }),
  }),
});

/**
 * Normalize pickup/delivery inputs to a 2-letter state abbreviation if possible.
 * Accepts: "TX", "Texas", "Austin, TX", "Austin TX".
 */
export function normalizeStateToAbbr(input) {
  const raw = String(input ?? "").trim();
  if (!raw) return "";

  const upper = raw.toUpperCase();
  if (/^[A-Z]{2}$/.test(upper)) return upper;

  const match = /\b([A-Za-z]{2})\b\s*$/.exec(raw);
  if (match?.[1]) {
    const ab = match[1].toUpperCase();
    if (/^[A-Z]{2}$/.test(ab)) return ab;
  }

  // Try full state name (case-insensitive)
  for (const [name, abbr] of Object.entries(STATE_NAME_TO_ABBR)) {
    if (name.toLowerCase() === raw.toLowerCase()) return abbr;
  }

  return "";
}

export function demandScoreFor({ pickup, delivery, heatData = HEAT_DATA } = {}) {
  const fallback = 50;
  const p = normalizeStateToAbbr(pickup);
  const d = normalizeStateToAbbr(delivery);

  const pHeat = p ? (heatData[p] ?? fallback) : fallback;
  const dHeat = d ? (heatData[d] ?? fallback) : fallback;

  const score = (clamp(pHeat, 0, 100) + clamp(dHeat, 0, 100)) / 2;
  return Math.round(score);
}

export function interpolateRate(min, max, demandScore) {
  const demandFactor = clamp(demandScore / 100, 0, 1);
  return min + (max - min) * demandFactor;
}

function stateSpecialMultiplier(abbr) {
  // Optional extension: non-contiguous states.
  const special = { AK: 1.6, HI: 1.6 };
  const a = String(abbr ?? "").trim().toUpperCase();
  return special[a] ?? 1;
}

function transportMultiplier(transportType) {
  // Optional extension: enclosed premium.
  return transportType === "enclosed" ? 1.35 : 1;
}

const serviceMultipliers = {
  Standard: 1,
  Priority: 1.15,
  Premium: 1.3,
};

/**
 * Core pricing calculation.
 * @param {{vehicleType: VehicleType, distance: number, pickup?: string, delivery?: string, transportType?: "open"|"enclosed", serviceLevel?: "Standard"|"Priority"|"Premium", demandMultiplier?: number}} input
 * @returns {{ratePerMile:number,totalPrice:number,distanceType:DistanceType,demandScore:number}}
 */
export function calculatePrice(input) {
  const rawVehicleType = String(input?.vehicleType ?? "sedan").trim().toLowerCase();
  const vehicleType = /** @type {VehicleType} */ (rawVehicleType === "truck" ? "pickup" : rawVehicleType);
  const distance = Number(input?.distance);
  const miles = Number.isFinite(distance) ? Math.max(0, distance) : 0;

  const distanceType = classifyDistance(miles);
  const demandScore = demandScoreFor({ pickup: input?.pickup, delivery: input?.delivery });

  const table = VEHICLE_RATE_TABLE[vehicleType] ?? VEHICLE_RATE_TABLE.sedan;
  const range = table[distanceType];
  const rawRate = interpolateRate(range.min, range.max, demandScore);

  const pickupAbbr = normalizeStateToAbbr(input?.pickup);
  const deliveryAbbr = normalizeStateToAbbr(input?.delivery);
  const stateMult = Math.max(stateSpecialMultiplier(pickupAbbr), stateSpecialMultiplier(deliveryAbbr));
  const transportMult = transportMultiplier(input?.transportType);

  const ratePerMile = Math.round(rawRate * 100) / 100;
  let totalPrice = Math.round(miles * ratePerMile * stateMult * transportMult);

  const dm = Number(input?.demandMultiplier);
  if (Number.isFinite(dm) && dm > 0) {
    totalPrice = Math.round(totalPrice * dm);
  }

  const svc = String(input?.serviceLevel ?? "").trim();
  if (svc && Object.prototype.hasOwnProperty.call(serviceMultipliers, svc)) {
    totalPrice = Math.round(totalPrice * (serviceMultipliers[svc] ?? 1));
  }

  return { ratePerMile, totalPrice, distanceType, demandScore };
}

/**
 * Quote-level helper (multiple vehicles), to avoid pricing logic duplication in callers.
 * @param {{vehicleTypes: VehicleType[], distance: number, pickup?: string, delivery?: string, transportType?: "open"|"enclosed", serviceLevel?: "Standard"|"Priority"|"Premium"}} input
 * @returns {{ratePerMile:number,totalPrice:number,distanceType:DistanceType,demandScore:number}}
 */
export function calculateQuotePrice(input) {
  const types = Array.isArray(input?.vehicleTypes) ? input.vehicleTypes : [];
  const results = types.length
    ? types.map((t) => calculatePrice({ ...input, vehicleType: t }))
    : [calculatePrice({ ...input, vehicleType: "sedan" })];

  const totalPrice = results.reduce((acc, r) => acc + (Number.isFinite(r.totalPrice) ? r.totalPrice : 0), 0);
  const avgRate = results.reduce((acc, r) => acc + (Number.isFinite(r.ratePerMile) ? r.ratePerMile : 0), 0) / results.length;

  // distanceType/demandScore are the same across vehicles for a fixed lane.
  const { distanceType, demandScore } = results[0];

  return {
    ratePerMile: Math.round(avgRate * 100) / 100,
    totalPrice: Math.round(totalPrice),
    distanceType,
    demandScore,
  };
}

/**
 * Optional extension: plan tiers (kept centralized).
 * @param {{vehicleTypes: VehicleType[], distance: number, pickup?: string, delivery?: string, transportType?: "open"|"enclosed", serviceLevel?: "Standard"|"Priority"|"Premium"}} input
 */
export function calculatePlanPrices(input) {
  const base = calculateQuotePrice({
    vehicleTypes: input?.vehicleTypes,
    distance: input?.distance,
    pickup: input?.pickup,
    delivery: input?.delivery,
    transportType: input?.transportType,
    demandMultiplier: input?.demandMultiplier,
  });
  const standard = base.totalPrice;
  const priority = Math.round(standard * 1.12);
  const expedited = Math.round(standard * 1.28);
  return {
    base,
    plans: {
      standard: { totalPrice: standard },
      priority: { totalPrice: priority },
      expedited: { totalPrice: expedited },
    },
  };
}

import { HEAT_DATA, normalizeStateToAbbr } from "@/lib/pricingEngine";

/** @typedef {"sedan"|"suv"|"pickup"} VehicleType */

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const VEHICLE_RATE_TABLE = Object.freeze({
  sedan: Object.freeze({
    long: Object.freeze({ min: 0.35, max: 0.6 }),
    short: Object.freeze({ min: 0.7, max: 1.5 }),
  }),
  suv: Object.freeze({
    long: Object.freeze({ min: 0.37, max: 0.7 }),
    short: Object.freeze({ min: 0.8, max: 1.5 }),
  }),
  pickup: Object.freeze({
    long: Object.freeze({ min: 0.5, max: 0.9 }),
    short: Object.freeze({ min: 0.8, max: 1.5 }),
  }),
});

function classifyDistance(distanceMiles) {
  const miles = Number.isFinite(distanceMiles) ? Math.max(0, distanceMiles) : 0;
  return miles < 600 ? "short" : "long";
}

function demandScoreFor(pickup, delivery) {
  const fallback = 50;
  const p = normalizeStateToAbbr(pickup);
  const d = normalizeStateToAbbr(delivery);
  const pHeat = p ? (HEAT_DATA[p] ?? fallback) : fallback;
  const dHeat = d ? (HEAT_DATA[d] ?? fallback) : fallback;
  return Math.round((clamp(pHeat, 0, 100) + clamp(dHeat, 0, 100)) / 2);
}

function demandMultiplierFor(score) {
  const s = Number.isFinite(score) ? clamp(score, 0, 100) : 50;
  return clamp(0.9 + 0.3 * (s / 100), 0.9, 1.2);
}

function pickupWindowFor(serviceLevel) {
  if (serviceLevel === "Priority") return "1–3 days";
  if (serviceLevel === "Premium") return "1–2 days";
  return "3–5 days";
}

/**
 * Pricing per prompt spec.
 * Returns a basePrice (midpoint rate) and adjustedPrice (demand multiplier applied within the min/max band).
 *
 * @param {{
 *  pickup: string,
 *  delivery: string,
 *  vehicleType: VehicleType,
 *  distance: number,
 *  serviceLevel?: "Standard"|"Priority"|"Premium"
 * }} input
 */
export function calculateStructuredPrice(input) {
  const vehicleType = String(input?.vehicleType ?? "sedan").toLowerCase();
  const serviceLevel = input?.serviceLevel ?? "Standard";
  const distance = Number(input?.distance);
  const miles = Number.isFinite(distance) ? Math.max(0, distance) : 0;

  const distanceType = classifyDistance(miles);
  const score = demandScoreFor(input?.pickup, input?.delivery);
  const demandMultiplier = demandMultiplierFor(score);

  const table = VEHICLE_RATE_TABLE[vehicleType] ?? VEHICLE_RATE_TABLE.sedan;
  const range = table[distanceType];

  const baseRate = (range.min + range.max) / 2;
  const normalized = (demandMultiplier - 0.9) / 0.3; // 0..1
  const adjustedRate = range.min + (range.max - range.min) * clamp(normalized, 0, 1);

  const basePrice = Math.round(miles * baseRate);
  const adjustedPrice = Math.round(miles * adjustedRate);

  return {
    basePrice,
    adjustedPrice,
    pickupWindow: pickupWindowFor(serviceLevel),
    serviceLevel,
    meta: {
      distanceType,
      demandMultiplier,
      demandScore: score,
      baseRate: Math.round(baseRate * 100) / 100,
      adjustedRate: Math.round(adjustedRate * 100) / 100,
    },
  };
}

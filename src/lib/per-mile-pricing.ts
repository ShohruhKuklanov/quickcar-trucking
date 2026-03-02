export type VehicleType = "sedan" | "suv" | "truck";

export type PerMileRateRange = {
  min: number;
  max: number;
};

export type PriceRange = {
  min: number;
  max: number;
};

function clampMiles(miles: number) {
  if (!Number.isFinite(miles)) return 0;
  return Math.max(0, miles);
}

export function perMileRateFor({
  miles,
  vehicleType,
}: {
  miles: number;
  vehicleType: VehicleType;
}): PerMileRateRange {
  const m = clampMiles(miles);

  if (vehicleType === "truck") {
    // Pickup truck pricing
    // - up to 700 mi: $0.8–$1.2 / mi
    // - above 700 mi: $0.6–$0.9 / mi
    return m > 700 ? { min: 0.6, max: 0.9 } : { min: 0.8, max: 1.2 };
  }

  // Sedan & SUV pricing
  // - up to 900 mi: $0.7–$1.0 / mi
  // - above 900 mi:
  //   - sedan: $0.3–$0.45 / mi
  //   - SUV:   $0.4–$0.55 / mi
  if (m > 900) {
    return vehicleType === "suv" ? { min: 0.4, max: 0.55 } : { min: 0.3, max: 0.45 };
  }
  return { min: 0.7, max: 1.0 };
}

export function totalPriceFor({
  miles,
  vehicleType,
}: {
  miles: number;
  vehicleType: VehicleType;
}): PriceRange {
  const m = clampMiles(miles);
  const rate = perMileRateFor({ miles: m, vehicleType });
  return {
    min: m * rate.min,
    max: m * rate.max,
  };
}

export function sumPriceRanges(ranges: PriceRange[]): PriceRange {
  return ranges.reduce(
    (acc, r) => ({
      min: acc.min + (Number.isFinite(r.min) ? r.min : 0),
      max: acc.max + (Number.isFinite(r.max) ? r.max : 0),
    }),
    { min: 0, max: 0 },
  );
}

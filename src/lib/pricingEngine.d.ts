export type VehicleType = "sedan" | "suv" | "pickup" | "truck";
export type DistanceType = "short" | "long";

export const HEAT_DATA: Readonly<Record<string, number>>;
export const VEHICLE_RATE_TABLE: Readonly<
  Record<VehicleType, Readonly<Record<DistanceType, { min: number; max: number }>>>
>;

export function normalizeStateToAbbr(input: unknown): string;
export function classifyDistance(distanceMiles: number): DistanceType;
export function demandScoreFor(input?: {
  pickup?: string;
  delivery?: string;
  heatData?: Readonly<Record<string, number>>;
}): number;
export function interpolateRate(min: number, max: number, demandScore: number): number;

export function calculatePrice(input: {
  vehicleType: VehicleType;
  distance: number;
  pickup?: string;
  delivery?: string;
  transportType?: "open" | "enclosed";
  serviceLevel?: "Standard" | "Priority" | "Premium";
  demandMultiplier?: number;
}): {
  ratePerMile: number;
  totalPrice: number;
  distanceType: DistanceType;
  demandScore: number;
};

export function calculateQuotePrice(input: {
  vehicleTypes: VehicleType[];
  distance: number;
  pickup?: string;
  delivery?: string;
  transportType?: "open" | "enclosed";
  serviceLevel?: "Standard" | "Priority" | "Premium";
  demandMultiplier?: number;
}): {
  ratePerMile: number;
  totalPrice: number;
  distanceType: DistanceType;
  demandScore: number;
};

export function calculatePlanPrices(input: {
  vehicleTypes: VehicleType[];
  distance: number;
  pickup?: string;
  delivery?: string;
  transportType?: "open" | "enclosed";
  serviceLevel?: "Standard" | "Priority" | "Premium";
  demandMultiplier?: number;
}): {
  base: {
    ratePerMile: number;
    totalPrice: number;
    distanceType: DistanceType;
    demandScore: number;
  };
  plans: {
    standard: { totalPrice: number };
    priority: { totalPrice: number };
    expedited: { totalPrice: number };
  };
};

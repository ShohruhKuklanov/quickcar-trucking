import { NextResponse } from "next/server";

import { calculatePlanPrices, calculatePrice, calculateQuotePrice, normalizeStateToAbbr } from "@/lib/pricingEngine";

export const dynamic = "force-dynamic";

type VehicleType = "sedan" | "suv" | "pickup" | "truck";
type ServiceLevel = "Standard" | "Priority" | "Premium";

type CalculateBody = {
  vehicleType?: VehicleType;
  vehicleTypes?: VehicleType[];
  distance?: number;
  pickup?: string;
  delivery?: string;
  transportType?: "open" | "enclosed";
  serviceLevel?: ServiceLevel | string;
};

function isVehicleType(v: unknown): v is VehicleType {
  return v === "sedan" || v === "suv" || v === "pickup" || v === "truck";
}

function normalizeServiceLevel(value: unknown): ServiceLevel | undefined {
  const v = String(value ?? "").trim().toLowerCase();
  if (!v) return undefined;
  if (v === "standard") return "Standard";
  if (v === "priority") return "Priority";
  if (v === "premium") return "Premium";
  return undefined;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as CalculateBody | null;
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const distance = Number(body.distance);
    if (!Number.isFinite(distance) || distance <= 0) {
      return NextResponse.json({ error: "Invalid distance" }, { status: 400 });
    }

    const pickup = normalizeStateToAbbr(body.pickup);
    const delivery = normalizeStateToAbbr(body.delivery);
    const serviceLevel = normalizeServiceLevel(body.serviceLevel);

    // single vehicle
    if (body.vehicleType && isVehicleType(body.vehicleType)) {
      const result = calculatePrice({
        vehicleType: body.vehicleType,
        distance,
        pickup,
        delivery,
        transportType: body.transportType,
        serviceLevel,
      });
      return NextResponse.json({ ok: true, result }, { status: 200, headers: { "Cache-Control": "no-store" } });
    }

    // multi-vehicle quote
    const vehicleTypes = Array.isArray(body.vehicleTypes) ? body.vehicleTypes.filter(isVehicleType) : [];
    if (!vehicleTypes.length) {
      return NextResponse.json({ error: "Missing vehicleType or vehicleTypes" }, { status: 400 });
    }

    const quote = calculateQuotePrice({
      distance,
      pickup,
      delivery,
      transportType: body.transportType,
      vehicleTypes,
      serviceLevel,
    });
    const tiers = calculatePlanPrices({ distance, pickup, delivery, transportType: body.transportType, vehicleTypes });

    return NextResponse.json(
      {
        ok: true,
        quote,
        plans: tiers.plans,
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

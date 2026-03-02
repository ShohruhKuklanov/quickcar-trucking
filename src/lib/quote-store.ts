export type TransportType = "open" | "enclosed";

export type ServiceLevel = "Standard" | "Priority" | "Premium";

export type VehicleType = "sedan" | "suv" | "truck";

export type Vehicle = {
  id: string;
  vehicleType: VehicleType;
  year: string;
  make: string;
  model: string;
};

export type QuoteFormState = {
  fromLocation: string;
  toLocation: string;
  transportType: TransportType;
  serviceLevel?: ServiceLevel;
  expedited: boolean;
  vehicles: Vehicle[];
  name: string;
  phone: string;
  email: string;
};

type StoredQuote = {
  id: string;
  quote: QuoteFormState;
  createdAt: number;
};

const STORE_MAX = 2000;
const STORE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const store = new Map<string, StoredQuote>();

function prune() {
  const now = Date.now();

  for (const [id, item] of store) {
    if (now - item.createdAt > STORE_TTL_MS) store.delete(id);
  }

  if (store.size <= STORE_MAX) return;

  const items = Array.from(store.values()).sort((a, b) => a.createdAt - b.createdAt);
  const over = store.size - STORE_MAX;
  for (let i = 0; i < over; i++) {
    const id = items[i]?.id;
    if (id) store.delete(id);
  }
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asBool(value: unknown) {
  return value === true || value === "true";
}

function sanitizeVehicle(value: unknown, idx: number): Vehicle {
  const v = (value ?? {}) as Record<string, unknown>;

  const rawType = asString(v.vehicleType).trim().toLowerCase();
  const vehicleType: VehicleType = rawType === "suv" ? "suv" : rawType === "truck" ? "truck" : "sedan";

  return {
    id: asString(v.id) || `v${idx + 1}`,
    vehicleType,
    year: asString(v.year).trim(),
    make: asString(v.make).trim(),
    model: asString(v.model).trim(),
  };
}

export function sanitizeQuote(value: unknown): QuoteFormState | null {
  const obj = (value ?? {}) as Record<string, unknown>;

  const vehiclesRaw = Array.isArray(obj.vehicles) ? obj.vehicles : [];
  const vehicles = vehiclesRaw.slice(0, 8).map(sanitizeVehicle);

  const transportType = asString(obj.transportType) === "enclosed" ? "enclosed" : "open";

  const rawService = asString(obj.serviceLevel).trim().toLowerCase();
  const serviceLevel: ServiceLevel | undefined =
    rawService === "priority" ? "Priority" : rawService === "premium" ? "Premium" : rawService === "standard" ? "Standard" : undefined;

  const quote: QuoteFormState = {
    fromLocation: asString(obj.fromLocation).trim(),
    toLocation: asString(obj.toLocation).trim(),
    transportType,
    serviceLevel,
    expedited: asBool(obj.expedited),
    vehicles: vehicles.length ? vehicles : [{ id: "v1", vehicleType: "sedan", year: "", make: "", model: "" }],
    name: asString(obj.name).trim(),
    phone: asString(obj.phone).trim(),
    email: asString(obj.email).trim(),
  };

  // Basic presence checks; full validation lives in the form.
  if (!quote.fromLocation || !quote.toLocation) return null;
  if (!quote.vehicles.length) return null;

  return quote;
}

export function createQuote(quote: QuoteFormState) {
  prune();
  const id = (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now())) as string;
  const stored: StoredQuote = { id, quote, createdAt: Date.now() };
  store.set(id, stored);
  return stored;
}

export function getQuote(id: string) {
  prune();
  return store.get(id) ?? null;
}

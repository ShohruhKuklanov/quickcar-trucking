"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { type QuoteFormState, type TransportType } from "@/lib/quote-store";
import { getQuotePrefillSnapshot, subscribeQuotePrefill } from "@/lib/quote-prefill-store";
import { calculatePrice, normalizeStateToAbbr } from "@/lib/pricingEngine";
import { distanceBetweenStatesMiles } from "@/lib/route-builder";

type ServiceLevel = "Standard" | "Priority" | "Premium";

type Step = 1 | 2 | 3;

type LocationSuggestion =
  | { kind: "zip"; zip: string; city: string; state: string }
  | { kind: "city"; city: string; state: string; zip?: string };

type ZipSuggestionsResponse = {
  query: string;
  results: LocationSuggestion[];
};

type DatalistOption = { value: string; label?: string };

type VehicleMakesResponse = { makes?: unknown };
type VehicleModelsResponse = { models?: unknown };

const PHONE_HREF = "tel:+16467311022";

function isStateOnlyInput(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return false;

  const abbr = normalizeStateToAbbr(trimmed);
  if (!abbr) return false;

  // ZIPs/addresses: never treat as state-only.
  if (/\d/.test(trimmed)) return false;
  // City, ST
  if (trimmed.includes(",")) return false;
  // City ST (ends with 2-letter state)
  if (new RegExp(`\\b${abbr}\\b\\s*$`, "i").test(trimmed) && trimmed.length > 2) return false;

  return true;
}

export function QuoteForm({
  instanceId,
  anchorId,
  useHeroVars = false,
  variant = "glass",
  pickupState,
  deliveryState,
  serviceLevel,
}: {
  instanceId?: string;
  anchorId?: string;
  useHeroVars?: boolean;
  variant?: "glass" | "enterprise";
  pickupState?: string;
  deliveryState?: string;
  serviceLevel?: ServiceLevel;
}) {
  const router = useRouter();

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear() + 1;
    const min = 1980;
    const years: string[] = [];
    for (let y = current; y >= min; y--) years.push(String(y));
    return years;
  }, []);

  const [step, setStep] = useState<Step>(1);
  const [pickupLocation, setPickupLocation] = useState(pickupState ?? "");
  const [deliveryLocation, setDeliveryLocation] = useState(deliveryState ?? "");
  const pickupLocationRef = useRef(pickupLocation);
  const deliveryLocationRef = useRef(deliveryLocation);

  useEffect(() => {
    pickupLocationRef.current = pickupLocation;
  }, [pickupLocation]);

  useEffect(() => {
    deliveryLocationRef.current = deliveryLocation;
  }, [deliveryLocation]);

  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [transportType, setTransportType] = useState<TransportType>("open");

  const selectedService: ServiceLevel | null = serviceLevel ?? null;

  const serviceMeta = useMemo(() => {
    if (!selectedService) return null;
    if (selectedService === "Standard") return { badge: "Standard Selected", hint: "Flexible Pickup", window: "3–5 day pickup" };
    if (selectedService === "Priority") return { badge: "Priority Selected", hint: "Faster Scheduling", window: "1–3 day pickup" };
    return { badge: "Premium Selected", hint: "Guaranteed Date", window: "Guaranteed pickup date" };
  }, [selectedService]);

  const estimateAbortRef = useRef<AbortController | null>(null);
  const estimateTimerRef = useRef<number | null>(null);
  const [laneEstimate, setLaneEstimate] = useState<{ miles: number; pickup: string; delivery: string } | null>(null);

  useEffect(() => {
    const from = pickupLocation.trim();
    const to = deliveryLocation.trim();

    if (!from || !to) {
      estimateAbortRef.current?.abort();
      estimateAbortRef.current = null;
      if (estimateTimerRef.current) window.clearTimeout(estimateTimerRef.current);
      estimateTimerRef.current = null;
      queueMicrotask(() => setLaneEstimate(null));
      return;
    }

    // If the inputs are *state-only* (common when prefilled from the USA map),
    // we can still compute a reliable approximate lane distance using state centroids.
    if (isStateOnlyInput(from) && isStateOnlyInput(to)) {
      estimateAbortRef.current?.abort();
      estimateAbortRef.current = null;
      if (estimateTimerRef.current) window.clearTimeout(estimateTimerRef.current);
      estimateTimerRef.current = null;

      const pickup = normalizeStateToAbbr(from);
      const delivery = normalizeStateToAbbr(to);
      const milesRaw = pickup && delivery ? distanceBetweenStatesMiles(pickup, delivery) : null;
      const miles = typeof milesRaw === "number" && Number.isFinite(milesRaw) ? milesRaw : NaN;

      if (Number.isFinite(miles) && miles > 0 && pickup && delivery) {
        queueMicrotask(() => setLaneEstimate({ miles: Math.max(1, Math.round(miles)), pickup, delivery }));
      } else {
        queueMicrotask(() => setLaneEstimate(null));
      }
      return;
    }

    if (estimateTimerRef.current) window.clearTimeout(estimateTimerRef.current);
    estimateTimerRef.current = window.setTimeout(async () => {
      const controller = new AbortController();
      estimateAbortRef.current?.abort();
      estimateAbortRef.current = controller;

      try {
        const url = new URL("/api/estimate", window.location.origin);
        url.searchParams.set("from", from);
        url.searchParams.set("to", to);
        url.searchParams.set("transportType", transportType);
        url.searchParams.set("vehicles", "1");

        const res = await fetch(url.toString(), { signal: controller.signal });
        const data = (await res.json().catch(() => ({}))) as {
          miles?: number;
          fromState?: string;
          toState?: string;
        };

        const miles = Number(data?.miles);
        const pickup = String(data?.fromState ?? "").trim();
        const delivery = String(data?.toState ?? "").trim();

        if (!res.ok || !Number.isFinite(miles) || miles <= 0 || !pickup || !delivery) {
          setLaneEstimate(null);
          return;
        }

        setLaneEstimate({ miles: Math.max(1, Math.round(miles)), pickup, delivery });
      } catch {
        setLaneEstimate(null);
      }
    }, 250);

    return () => {
      if (estimateTimerRef.current) window.clearTimeout(estimateTimerRef.current);
    };
  }, [pickupLocation, deliveryLocation, transportType]);

  const computedTotal = useMemo(() => {
    if (!laneEstimate) return null;
    const result = calculatePrice({
      vehicleType: "sedan",
      distance: laneEstimate.miles,
      pickup: laneEstimate.pickup,
      delivery: laneEstimate.delivery,
      transportType,
      serviceLevel: selectedService ?? undefined,
    });
    return Number.isFinite(result.totalPrice) ? result.totalPrice : null;
  }, [laneEstimate, transportType, selectedService]);

  const [displayTotal, setDisplayTotal] = useState<number | null>(null);
  const displayTotalRef = useRef<number>(0);
  useEffect(() => {
    if (!Number.isFinite(computedTotal ?? NaN)) {
      queueMicrotask(() => setDisplayTotal(null));
      return;
    }

    const next = computedTotal as number;
    const start = Number.isFinite(displayTotalRef.current) ? displayTotalRef.current : next;
    const durationMs = 350;
    const startAt = performance.now();

    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startAt) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(start + (next - start) * eased);
      displayTotalRef.current = value;
      setDisplayTotal(value);
      if (t < 1) raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [computedTotal]);

  const formatMoney = useCallback((value: number) => {
    if (!Number.isFinite(value)) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const modelAbortRef = useRef<AbortController | null>(null);
  const modelTimerRef = useRef<number | null>(null);

  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState<LocationSuggestion[]>([]);
  const pickupAbortRef = useRef<AbortController | null>(null);
  const deliveryAbortRef = useRef<AbortController | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [prefillFlash, setPrefillFlash] = useState(false);
  const flashTimerRef = useRef<number | null>(null);

  const pickupId = `${instanceId ?? "qf"}-pickup`;
  const deliveryId = `${instanceId ?? "qf"}-delivery`;
  const yearId = `${instanceId ?? "qf"}-year`;
  const makeId = `${instanceId ?? "qf"}-make`;
  const modelId = `${instanceId ?? "qf"}-model`;
  const nameId = `${instanceId ?? "qf"}-name`;
  const phoneId = `${instanceId ?? "qf"}-phone`;
  const emailId = `${instanceId ?? "qf"}-email`;
  const makesListId = `${instanceId ?? "qf"}-makes`;
  const modelsListId = `${instanceId ?? "qf"}-models`;
  const pickupListId = `${instanceId ?? "qf"}-pickup-suggestions`;
  const deliveryListId = `${instanceId ?? "qf"}-delivery-suggestions`;
  const openId = `${instanceId ?? "qf"}-open`;
  const enclosedId = `${instanceId ?? "qf"}-enclosed`;

  function goBack() {
    setError("");
    setStep((s) => (s === 3 ? 2 : 1));
  }

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  const applyLocationPrefill = useCallback((nextPickupRaw: string, nextDeliveryRaw: string) => {
    const nextPickup = nextPickupRaw.trim();
    const nextDelivery = nextDeliveryRaw.trim();

    let changed = false;

    if (nextPickup && nextPickup !== pickupLocationRef.current) {
      setPickupLocation(nextPickup);
      setPickupSuggestions([]);
      changed = true;
    }

    if (nextDelivery && nextDelivery !== deliveryLocationRef.current) {
      setDeliveryLocation(nextDelivery);
      setDeliverySuggestions([]);
      changed = true;
    }

    if (changed) {
      setError("");
      setStep(1);

      setPrefillFlash(true);
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = window.setTimeout(() => setPrefillFlash(false), 1500);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const applyFromStore = () => {
      const snap = getQuotePrefillSnapshot();
      const nextPickup = (pickupState ?? snap.pickupState).trim();
      const nextDelivery = (deliveryState ?? snap.deliveryState).trim();
      if (!nextPickup && !nextDelivery) return;

      window.setTimeout(() => {
        if (cancelled) return;
        applyLocationPrefill(nextPickup, nextDelivery);
      }, 0);
    };

    applyFromStore();
    const unsub = subscribeQuotePrefill(applyFromStore);

    return () => {
      cancelled = true;
      unsub();
    };
  }, [pickupState, deliveryState, applyLocationPrefill]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/vehicle/makes");
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as VehicleMakesResponse | null;
        if (cancelled) return;
        const list = Array.isArray(data?.makes)
          ? (data?.makes as unknown[]).filter((v): v is string => typeof v === "string")
          : [];
        setMakes(list);
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const q = pickupLocation.trim();
    if (!q) {
      pickupAbortRef.current?.abort();
      pickupAbortRef.current = null;
      return;
    }

    const controller = new AbortController();
    pickupAbortRef.current?.abort();
    pickupAbortRef.current = controller;

    const handle = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/zip?q=${encodeURIComponent(q)}&limit=10`, { signal: controller.signal });
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as ZipSuggestionsResponse | null;
        setPickupSuggestions(Array.isArray(data?.results) ? data.results : []);
      } catch {
        // ignore
      }
    }, 150);

    return () => {
      window.clearTimeout(handle);
      controller.abort();
    };
  }, [pickupLocation]);

  useEffect(() => {
    const q = deliveryLocation.trim();
    if (!q) {
      deliveryAbortRef.current?.abort();
      deliveryAbortRef.current = null;
      return;
    }

    const controller = new AbortController();
    deliveryAbortRef.current?.abort();
    deliveryAbortRef.current = controller;

    const handle = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/zip?q=${encodeURIComponent(q)}&limit=10`, { signal: controller.signal });
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as ZipSuggestionsResponse | null;
        setDeliverySuggestions(Array.isArray(data?.results) ? data.results : []);
      } catch {
        // ignore
      }
    }, 150);

    return () => {
      window.clearTimeout(handle);
      controller.abort();
    };
  }, [deliveryLocation]);

  useEffect(() => {
    const make = vehicleMake.trim();
    if (make.length < 2) {
      modelAbortRef.current?.abort();
      modelAbortRef.current = null;
      if (modelTimerRef.current) window.clearTimeout(modelTimerRef.current);
      modelTimerRef.current = null;
      return;
    }

    if (modelTimerRef.current) window.clearTimeout(modelTimerRef.current);
    modelTimerRef.current = window.setTimeout(async () => {
      const controller = new AbortController();
      modelAbortRef.current?.abort();
      modelAbortRef.current = controller;

      try {
        const url = new URL("/api/vehicle/models", window.location.origin);
        url.searchParams.set("make", make);
        const y = vehicleYear.trim();
        if (/^\d{4}$/.test(y)) url.searchParams.set("year", y);

        const res = await fetch(url.toString(), { signal: controller.signal });
        const data = (await res.json().catch(() => null)) as VehicleModelsResponse | null;
        const list = Array.isArray(data?.models)
          ? (data?.models as unknown[]).filter((v): v is string => typeof v === "string")
          : [];
        setModels(list);
      } catch {
        // ignore
      }
    }, 180);

    return () => {
      if (modelTimerRef.current) window.clearTimeout(modelTimerRef.current);
    };
  }, [vehicleMake, vehicleYear]);

  function validateAndAdvance() {
    const from = pickupLocation.trim();
    const to = deliveryLocation.trim();
    const year = vehicleYear.trim();
    const make = vehicleMake.trim();
    const model = vehicleModel.trim();

    if (step === 1) {
      if (!from || !to) {
        setError("Please enter pickup and delivery ZIP codes or City, ST.");
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!year || !make || !model) {
        setError("Please enter your vehicle year, make, and model.");
        return;
      }
      setError("");
      setStep(3);
      return;
    }

    if (step === 3) {
      const name = customerName.trim();
      const phone = customerPhone.trim();
      const email = customerEmail.trim();

      if (!name || !phone || !email) {
        setError("Please enter your name, phone number, and email.");
        return;
      }
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const from = pickupLocation.trim();
    const to = deliveryLocation.trim();
    const year = vehicleYear.trim();
    const make = vehicleMake.trim();
    const model = vehicleModel.trim();

    if (step !== 3) {
      validateAndAdvance();
      return;
    }

    if (submitting) return;

    if (!from || !to) {
      setStep(1);
      setError("Please enter pickup and delivery ZIP codes or City, ST.");
      return;
    }

    if (!year || !make || !model) {
      setStep(2);
      setError("Please enter your vehicle year, make, and model.");
      return;
    }

    const name = customerName.trim();
    const phone = customerPhone.trim();
    const email = customerEmail.trim();
    if (!name || !phone || !email) {
      setStep(3);
      setError("Please enter your name, phone number, and email.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: QuoteFormState = {
        fromLocation: from,
        toLocation: to,
        transportType,
        serviceLevel: selectedService ?? undefined,
        expedited: false,
        vehicles: [{ id: "v1", vehicleType: "sedan", year, make, model }],
        name,
        phone,
        email,
      };

      // Send email using the Resend-backed endpoint.
      // If the email service is temporarily misconfigured/unavailable (5xx),
      // still allow the user to view their quote result.
      try {
        const res = await fetch("/api/email/quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          keepalive: true,
        });

        if (!res.ok && res.status < 500) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          setError(data?.error || "Could not send email. Please check your details and try again.");
          setSubmitting(false);
          return;
        }
      } catch {
        // Ignore email network errors; still show quote result.
      }

      window.sessionStorage.setItem("qc_quote_result", JSON.stringify(payload));
      router.push("/quote/result");
    } catch {
      setError("Could not start your estimate. Please try again.");
      setSubmitting(false);
    }
  }

  if (variant === "enterprise") {
    const inputClass =
      "h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    return (
      <div
        id={anchorId}
        className={
          "bg-white/55 backdrop-blur-2xl border border-gray-200/60 rounded-2xl shadow-lg p-5 md:p-6 h-full" +
          (prefillFlash ? " ring-2 ring-blue-200 transition duration-500" : "")
        }
        aria-label="Get an instant quote"
      >
        <header>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">Get Your Instant Quote</p>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-blue-300"
            >
              Call
            </a>
          </div>

          {serviceMeta ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {serviceMeta.badge}
              </span>
              <span className="text-xs text-gray-600">{serviceMeta.hint}</span>
              <span className="text-xs text-gray-500">• {serviceMeta.window}</span>
            </div>
          ) : null}

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-gray-500">Estimated total</div>
              <div className="text-3xl font-semibold text-gray-900 leading-none">
                {displayTotal != null ? formatMoney(displayTotal) : "—"}
              </div>
            </div>
            <div className="text-right text-xs text-gray-500">
              {laneEstimate ? (
                <span>
                  {laneEstimate.miles} miles • {laneEstimate.pickup} → {laneEstimate.delivery}
                </span>
              ) : (
                <span>Enter pickup & delivery to estimate.</span>
              )}
            </div>
          </div>
        </header>

        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <StepProgress step={step} compact />

          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700" htmlFor={pickupId}>
                    Pickup ZIP or City
                  </label>
                  <input
                    id={pickupId}
                    className={inputClass}
                    autoComplete="postal-code"
                    placeholder="e.g. 90210 or Austin, TX"
                    value={pickupLocation}
                    onChange={(ev) => {
                      const v = ev.target.value;
                      setPickupLocation(v);
                      if (!v.trim()) setPickupSuggestions([]);
                    }}
                    list={pickupListId}
                    required
                  />
                  {pickupSuggestions.length ? (
                    <datalist id={pickupListId}>
                      {pickupSuggestions
                        .map((s): DatalistOption => {
                          if (s.kind === "zip") return { value: s.zip, label: `${s.city}, ${s.state}` };
                          return { value: `${s.city}, ${s.state}`, label: s.zip ? `ZIP ${s.zip}` : undefined };
                        })
                        .map((opt, idx) => (
                          <option key={`${opt.value}-${idx}`} value={opt.value}>
                            {opt.label ?? ""}
                          </option>
                        ))}
                    </datalist>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700" htmlFor={deliveryId}>
                    Delivery ZIP or City
                  </label>
                  <input
                    id={deliveryId}
                    className={inputClass}
                    autoComplete="postal-code"
                    placeholder="e.g. 10001 or Miami, FL"
                    value={deliveryLocation}
                    onChange={(ev) => {
                      const v = ev.target.value;
                      setDeliveryLocation(v);
                      if (!v.trim()) setDeliverySuggestions([]);
                    }}
                    list={deliveryListId}
                    required
                  />
                  {deliverySuggestions.length ? (
                    <datalist id={deliveryListId}>
                      {deliverySuggestions
                        .map((s): DatalistOption => {
                          if (s.kind === "zip") return { value: s.zip, label: `${s.city}, ${s.state}` };
                          return { value: `${s.city}, ${s.state}`, label: s.zip ? `ZIP ${s.zip}` : undefined };
                        })
                        .map((opt, idx) => (
                          <option key={`${opt.value}-${idx}`} value={opt.value}>
                            {opt.label ?? ""}
                          </option>
                        ))}
                    </datalist>
                  ) : null}
                </div>
              </div>

              <fieldset className="space-y-1.5">
                <legend className="text-sm font-medium text-gray-700">Transport type</legend>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTransportType("open")}
                    aria-pressed={transportType === "open"}
                    className={
                      "h-10 rounded-xl border text-sm font-medium transition " +
                      (transportType === "open"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50")
                    }
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransportType("enclosed")}
                    aria-pressed={transportType === "enclosed"}
                    className={
                      "h-10 rounded-xl border text-sm font-medium transition " +
                      (transportType === "enclosed"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50")
                    }
                  >
                    Enclosed
                  </button>
                </div>
              </fieldset>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700" htmlFor={yearId}>
                  Vehicle Year
                </label>
                <select
                  id={yearId}
                  className={inputClass}
                  value={vehicleYear}
                  onChange={(ev) => {
                    setVehicleYear(ev.target.value);
                    setModels([]);
                    if (vehicleModel) setVehicleModel("");
                  }}
                  required
                >
                  <option value="">Select year</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700" htmlFor={makeId}>
                  Vehicle Make
                </label>
                <input
                  id={makeId}
                  className={inputClass}
                  autoComplete="off"
                  placeholder="e.g. BMW"
                  list={makesListId}
                  value={vehicleMake}
                  onChange={(ev) => {
                    setVehicleMake(ev.target.value);
                    setModels([]);
                    if (vehicleModel) setVehicleModel("");
                  }}
                  required
                />
                <datalist id={makesListId}>
                  {makes.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700" htmlFor={modelId}>
                  Vehicle Model
                </label>
                <input
                  id={modelId}
                  className={inputClass}
                  autoComplete="off"
                  placeholder="e.g. 3 Series"
                  list={modelsListId}
                  value={vehicleModel}
                  onChange={(ev) => setVehicleModel(ev.target.value)}
                  required
                />
                <datalist id={modelsListId}>
                  {models.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700" htmlFor={nameId}>
                    Full name
                  </label>
                  <input
                    id={nameId}
                    className={inputClass}
                    autoComplete="name"
                    placeholder="Your name"
                    value={customerName}
                    onChange={(ev) => setCustomerName(ev.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700" htmlFor={phoneId}>
                    Phone
                  </label>
                  <input
                    id={phoneId}
                    className={inputClass}
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(555) 123-4567"
                    value={customerPhone}
                    onChange={(ev) => setCustomerPhone(ev.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700" htmlFor={emailId}>
                  Email
                </label>
                <input
                  id={emailId}
                  className={inputClass}
                  autoComplete="email"
                  inputMode="email"
                  type="email"
                  placeholder="you@example.com"
                  value={customerEmail}
                  onChange={(ev) => setCustomerEmail(ev.target.value)}
                  required
                />
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex items-center justify-between gap-4">
              {step > 1 ? (
                <button
                  className="text-sm text-gray-600 hover:text-gray-900"
                  type="button"
                  onClick={goBack}
                  disabled={submitting}
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl shadow-md font-semibold disabled:opacity-60 disabled:hover:bg-blue-600"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Preparing…" : step === 3 ? "Get My Quote" : "Continue →"}
              </button>
            </div>

            <p className="text-xs text-gray-500">Secure &amp; Confidential — Your information is never shared.</p>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      id={anchorId}
      className={
        (useHeroVars ? "qh-card" : "qh-card qh-rootVars") +
        (prefillFlash ? " ring-2 ring-blue-500/70 transition duration-500" : "")
      }
      aria-label="Get an instant quote"
    >
      <header className="qh-head flex items-start justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">Get Your Instant Quote</p>
        <a
          href={PHONE_HREF}
          className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-blue-300"
        >
          Call
        </a>
      </header>

      <form className="qh-form" onSubmit={onSubmit}>
        <StepProgress step={step} compact />

        <div className="qh-grid">
          {step === 1 ? (
            <>
              <div className="qh-row2">
                <div className="qh-field">
                  <label className="qh-label" htmlFor={pickupId}>
                    Pickup ZIP or City
                  </label>
                  <input
                    id={pickupId}
                    className="qh-input"
                    autoComplete="postal-code"
                    placeholder="e.g. 90210 or Austin, TX"
                    value={pickupLocation}
                    onChange={(ev) => {
                      const v = ev.target.value;
                      setPickupLocation(v);
                      if (!v.trim()) setPickupSuggestions([]);
                    }}
                    list={pickupListId}
                    required
                  />
                  {pickupSuggestions.length ? (
                    <datalist id={pickupListId}>
                      {pickupSuggestions
                        .map((s): DatalistOption => {
                          if (s.kind === "zip") return { value: s.zip, label: `${s.city}, ${s.state}` };
                          return { value: `${s.city}, ${s.state}`, label: s.zip ? `ZIP ${s.zip}` : undefined };
                        })
                        .map((opt, idx) => (
                          <option key={`${opt.value}-${idx}`} value={opt.value}>
                            {opt.label ?? ""}
                          </option>
                        ))}
                    </datalist>
                  ) : null}
                </div>

                <div className="qh-field">
                  <label className="qh-label" htmlFor={deliveryId}>
                    Delivery ZIP or City
                  </label>
                  <input
                    id={deliveryId}
                    className="qh-input"
                    autoComplete="postal-code"
                    placeholder="e.g. 10001 or Miami, FL"
                    value={deliveryLocation}
                    onChange={(ev) => {
                      const v = ev.target.value;
                      setDeliveryLocation(v);
                      if (!v.trim()) setDeliverySuggestions([]);
                    }}
                    list={deliveryListId}
                    required
                  />
                  {deliverySuggestions.length ? (
                    <datalist id={deliveryListId}>
                      {deliverySuggestions
                        .map((s): DatalistOption => {
                          if (s.kind === "zip") return { value: s.zip, label: `${s.city}, ${s.state}` };
                          return { value: `${s.city}, ${s.state}`, label: s.zip ? `ZIP ${s.zip}` : undefined };
                        })
                        .map((opt, idx) => (
                          <option key={`${opt.value}-${idx}`} value={opt.value}>
                            {opt.label ?? ""}
                          </option>
                        ))}
                    </datalist>
                  ) : null}
                </div>
              </div>

              <fieldset className="qh-toggle">
                <legend className="qh-srOnly">Transport type</legend>

                <input
                  className="qh-toggleInput"
                  type="radio"
                  name={`${instanceId ?? "qf"}-transport`}
                  id={openId}
                  checked={transportType === "open"}
                  onChange={() => setTransportType("open")}
                />
                <label className={"qh-toggleBtn" + (transportType === "open" ? " is-active" : "")} htmlFor={openId}>
                  Open
                </label>

                <input
                  className="qh-toggleInput"
                  type="radio"
                  name={`${instanceId ?? "qf"}-transport`}
                  id={enclosedId}
                  checked={transportType === "enclosed"}
                  onChange={() => setTransportType("enclosed")}
                />
                <label
                  className={"qh-toggleBtn" + (transportType === "enclosed" ? " is-active" : "")}
                  htmlFor={enclosedId}
                >
                  Enclosed
                </label>
              </fieldset>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="qh-field">
                <label className="qh-label" htmlFor={yearId}>
                  Vehicle Year
                </label>
                <select
                  id={yearId}
                  className="qh-input qh-select"
                  value={vehicleYear}
                  onChange={(ev) => {
                    setVehicleYear(ev.target.value);
                    setModels([]);
                    if (vehicleModel) setVehicleModel("");
                  }}
                  required
                >
                  <option value="">Select year</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="qh-field">
                <label className="qh-label" htmlFor={makeId}>
                  Vehicle Make
                </label>
                <input
                  id={makeId}
                  className="qh-input"
                  autoComplete="off"
                  placeholder="e.g. BMW"
                  list={makesListId}
                  value={vehicleMake}
                  onChange={(ev) => {
                    setVehicleMake(ev.target.value);
                    setModels([]);
                    if (vehicleModel) setVehicleModel("");
                  }}
                  required
                />
                <datalist id={makesListId}>
                  {makes.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>

              <div className="qh-field">
                <label className="qh-label" htmlFor={modelId}>
                  Vehicle Model
                </label>
                <input
                  id={modelId}
                  className="qh-input"
                  autoComplete="off"
                  placeholder="e.g. 3 Series"
                  list={modelsListId}
                  value={vehicleModel}
                  onChange={(ev) => setVehicleModel(ev.target.value)}
                  required
                />
                <datalist id={modelsListId}>
                  {models.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div className="qh-field">
                <label className="qh-label" htmlFor={nameId}>
                  Full name
                </label>
                <input
                  id={nameId}
                  className="qh-input"
                  autoComplete="name"
                  placeholder="Your name"
                  value={customerName}
                  onChange={(ev) => setCustomerName(ev.target.value)}
                  required
                />
              </div>

              <div className="qh-field">
                <label className="qh-label" htmlFor={phoneId}>
                  Phone
                </label>
                <input
                  id={phoneId}
                  className="qh-input"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="(555) 123-4567"
                  value={customerPhone}
                  onChange={(ev) => setCustomerPhone(ev.target.value)}
                  required
                />
              </div>

              <div className="qh-field qh-spanFull">
                <label className="qh-label" htmlFor={emailId}>
                  Email
                </label>
                <input
                  id={emailId}
                  className="qh-input"
                  autoComplete="email"
                  inputMode="email"
                  type="email"
                  placeholder="you@example.com"
                  value={customerEmail}
                  onChange={(ev) => setCustomerEmail(ev.target.value)}
                  required
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="qh-actions">
          {error ? (
            <p className="qh-error" role="alert">
              {error}
            </p>
          ) : null}

          {step > 1 ? (
            <button className="qh-back" type="button" onClick={goBack} disabled={submitting}>
              ← Back
            </button>
          ) : null}

          <div className="qh-ctaWrap">
            <button className="qh-cta" type="submit" disabled={submitting}>
              {submitting ? "Preparing…" : step === 3 ? "Get My Quote" : "Continue →"}
            </button>
            <p className="qh-secure">Secure &amp; Confidential — Your information is never shared.</p>
          </div>
        </div>
      </form>
    </div>
  );
}

export function StepProgress({ step, compact = false }: { step: number; compact?: boolean }) {
  const totalSteps = 3;
  const clamped = Math.max(1, Math.min(totalSteps, step));
  const steps = [
    { id: 1, label: "Route" },
    { id: 2, label: "Vehicle" },
    { id: 3, label: "Contact" },
  ] as const;

  return (
    <div
      className={compact ? "relative mb-5" : "relative mb-10"}
      data-step={clamped}
      aria-label={`Step ${clamped} of ${totalSteps}`}
    >
      <div className={compact ? "mb-4 grid gap-2 sm:grid-cols-3" : "mb-5 grid gap-3 sm:grid-cols-3"}>
        {steps.map((item) => (
          <div key={item.id} className={compact ? "space-y-1.5" : "space-y-2"}>
            <div
              className={
                compact
                  ? "flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748b]"
                  : "flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-[#64748b]"
              }
            >
              <span>{`Step ${item.id}`}</span>
              <span>{item.label}</span>
            </div>
            <div className={compact ? "h-1.5 rounded-full bg-[#e2e8f0]" : "h-2 rounded-full bg-[#e2e8f0]"}>
              <div
                className={
                  compact
                    ? `h-1.5 rounded-full bg-primary transition-all duration-300 ${clamped >= item.id ? "w-full" : "w-0"}`
                    : `h-2 rounded-full bg-primary transition-all duration-300 ${clamped >= item.id ? "w-full" : "w-0"}`
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default QuoteForm;

"use client";

import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, PhoneCall } from "lucide-react";

import { calculatePrice, normalizeStateToAbbr, type VehicleType } from "@/lib/pricingEngine";

type Step = 1 | 2 | 3;
type VehicleCondition = "running" | "non-running";
type TransportType = "open" | "enclosed";

const PHONE_HREF = "tel:+16467311022";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[#334155]">{label}</span>
      {children}
    </label>
  );
}

export default function CostsCalculatorClient() {
  const [step, setStep] = useState<Step>(1);
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("sedan");
  const [vehicleCondition, setVehicleCondition] = useState<VehicleCondition>("running");
  const [transportType, setTransportType] = useState<TransportType>("open");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [miles, setMiles] = useState<number | null>(null);
  const [fromState, setFromState] = useState("");
  const [toState, setToState] = useState("");
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const from = pickupLocation.trim();
    const to = deliveryLocation.trim();

    if (!from || !to) {
      setMiles(null);
      setFromState("");
      setToState("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoadingEstimate(true);
      try {
        const url = new URL("/api/estimate", window.location.origin);
        url.searchParams.set("from", from);
        url.searchParams.set("to", to);

        const res = await fetch(url.toString(), { signal: controller.signal });
        const data = (await res.json().catch(() => null)) as
          | { miles?: number; fromState?: string; toState?: string }
          | null;

        if (!res.ok || !data || !Number.isFinite(data.miles)) {
          setMiles(null);
          setFromState(normalizeStateToAbbr(from));
          setToState(normalizeStateToAbbr(to));
          return;
        }

        setMiles(Math.max(1, Math.round(Number(data.miles))));
        setFromState(String(data.fromState ?? "").trim());
        setToState(String(data.toState ?? "").trim());
      } catch {
        setMiles(null);
        setFromState(normalizeStateToAbbr(from));
        setToState(normalizeStateToAbbr(to));
      } finally {
        setLoadingEstimate(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
      setLoadingEstimate(false);
    };
  }, [pickupLocation, deliveryLocation]);

  const estimate = useMemo(() => {
    if (!miles || !fromState || !toState) return null;

    const base = calculatePrice({
      vehicleType,
      distance: miles,
      pickup: fromState,
      delivery: toState,
      transportType,
    }).totalPrice;

    const conditionSurcharge = vehicleCondition === "non-running" ? 175 : 0;
    const total = Math.max(0, base + conditionSurcharge);

    return {
      total,
      low: Math.round(total * 0.92),
      high: Math.round(total * 1.08),
    };
  }, [fromState, miles, toState, transportType, vehicleCondition, vehicleType]);

  function validateStepOne() {
    if (!pickupLocation.trim() || !deliveryLocation.trim()) {
      setError("Please enter pickup and delivery locations.");
      return false;
    }

    setError("");
    return true;
  }

  function validateStepTwo() {
    setError("");
    return true;
  }

  function validateStepThree() {
    if (!firstName.trim() || !phone.trim()) {
      setError("Please enter your first name and phone number.");
      return false;
    }

    setError("");
    return true;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === 1) {
      if (!validateStepOne()) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!validateStepTwo()) return;
      setStep(3);
      return;
    }

    if (!validateStepThree()) return;

    setSubmitting(true);
    try {
      await fetch("/api/save-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickup: normalizeStateToAbbr(fromState || pickupLocation) || pickupLocation,
          delivery: normalizeStateToAbbr(toState || deliveryLocation) || deliveryLocation,
          vehicleType,
          timeline: "Instant estimate request",
          price: estimate?.total ?? null,
          phone,
          conversationTranscript: [
            {
              role: "user",
              content: `Estimate request from ${firstName}. Route: ${pickupLocation} to ${deliveryLocation}. Vehicle: ${vehicleType}. Condition: ${vehicleCondition}. Transport: ${transportType}. Phone: ${phone}.`,
            },
          ],
        }),
      });

      setSubmitted(true);
      setError("");
    } catch {
      setError("Could not submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-4xl border border-white/70 bg-white/92 p-5 shadow-[0_26px_72px_rgba(15,23,42,0.1)] backdrop-blur sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/80">Get Your Instant Quote</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-2xl">
            Calculate your price in a simple three-step flow.
          </h2>
        </div>
        <Link
          href={PHONE_HREF}
          className="hidden items-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-sm font-semibold text-[#0f172a] transition hover:border-primary/30 sm:inline-flex"
        >
          <PhoneCall className="h-4 w-4" />
          Call
        </Link>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
        {[
          { id: 1, label: "Route" },
          { id: 2, label: "Vehicle details" },
          { id: 3, label: "Contact details" },
        ].map((current) => (
          <div key={current.id} className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">
              <span>Step {current.id}</span>
              <span>{current.label}</span>
            </div>
            <div className="h-2 rounded-full bg-[#e2e8f0]">
              <div
                className={`h-2 rounded-full bg-primary transition-all duration-300 ${step >= current.id ? "w-full" : "w-0"}`}
              />
            </div>
          </div>
        ))}
      </div>

      {submitted ? (
        <div className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Check className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-lg font-semibold">Your quote request is in.</h3>
              <p className="mt-2 text-sm leading-6">
                We received your estimate request and will follow up shortly with your personalized price.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          {step === 1 ? (
            <div className="grid gap-3.5">
              <Field label="Pickup Location">
                <input
                  className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  placeholder="City, state or ZIP"
                  value={pickupLocation}
                  onChange={(event) => setPickupLocation(event.target.value)}
                  required
                />
              </Field>

              <Field label="Delivery Location">
                <input
                  className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  placeholder="City, state or ZIP"
                  value={deliveryLocation}
                  onChange={(event) => setDeliveryLocation(event.target.value)}
                  required
                />
              </Field>

              {loadingEstimate ? <p className="text-sm text-[#64748b]">Checking route details...</p> : null}
            </div>
          ) : step === 2 ? (
            <div className="grid gap-3.5">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Vehicle Type">
                  <select
                    aria-label="Vehicle Type"
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    value={vehicleType}
                    onChange={(event) => setVehicleType(event.target.value as VehicleType)}
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="pickup">Truck</option>
                  </select>
                </Field>

                <Field label="Vehicle Condition">
                  <select
                    aria-label="Vehicle Condition"
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    value={vehicleCondition}
                    onChange={(event) => setVehicleCondition(event.target.value as VehicleCondition)}
                  >
                    <option value="running">Running</option>
                    <option value="non-running">Non-running</option>
                  </select>
                </Field>

                <Field label="Transport Type">
                  <select
                    aria-label="Transport Type"
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    value={transportType}
                    onChange={(event) => setTransportType(event.target.value as TransportType)}
                  >
                    <option value="open">Open</option>
                    <option value="enclosed">Enclosed</option>
                  </select>
                </Field>
              </div>

              <div className="rounded-3xl border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-3.5 text-sm leading-6 text-[#475569]">
                {pickupLocation} to {deliveryLocation}
                {estimate ? ` is currently estimating at ${formatMoney(estimate.low)} - ${formatMoney(estimate.high)}.` : "."}
              </div>
            </div>
          ) : (
            <div className="grid gap-3.5">
              <Field label="First Name">
                <input
                  className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </Field>

              <Field label="Phone">
                <input
                  className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              </Field>

              <div className="rounded-3xl border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-3.5 text-sm leading-6 text-[#475569]">
                You are requesting a personalized estimate for {vehicleType === "pickup" ? "a truck" : `a ${vehicleType}`}
                {vehicleCondition === "non-running" ? ", non-running," : ", running,"} on an {transportType} trailer.
                {estimate ? ` Current range: ${formatMoney(estimate.low)} - ${formatMoney(estimate.high)}.` : ""}
              </div>
            </div>
          )}

          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep((step - 1) as Step);
                }}
                className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] transition hover:border-primary/30"
              >
                Back
              </button>
            ) : (
              <Link
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#0f172a] transition hover:border-primary/30 sm:hidden"
              >
                <PhoneCall className="h-4 w-4" />
                Call
              </Link>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(62,106,225,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {step < 3 ? "Continue" : submitting ? "Submitting..." : "Get My Quote"}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
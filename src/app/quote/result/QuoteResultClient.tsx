"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { sanitizeQuote, type QuoteFormState } from "@/lib/quote-store";

const RouteMap = dynamic(() => import("./RouteMap"), { ssr: false });

type EstimateResponse = {
  miles: number;
  fromZip?: string;
  toZip?: string;
  fromState?: string;
  toState?: string;
  fromCoord?: { lat: number; lon: number } | null;
  toCoord?: { lat: number; lon: number } | null;
  error?: string;
};

type PlanPrice = { totalPrice: number };

type CalculateResponse =
  | { ok: true; quote: { ratePerMile: number; totalPrice: number; distanceType: "short" | "long"; demandScore: number }; plans: { standard: PlanPrice; priority: PlanPrice; expedited: PlanPrice } }
  | { ok?: false; error?: string };

function decodeBase64UrlToString(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(padLen);

  const binary = window.atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function QuoteResultClient({ q }: { q?: string }) {
  const [quote, setQuote] = useState<QuoteFormState | null>(null);
  const [miles, setMiles] = useState<number | null>(null);
  const [zips, setZips] = useState<{ fromZip?: string; toZip?: string }>({});
  const [states, setStates] = useState<{ fromState?: string; toState?: string }>({});
  const [coords, setCoords] = useState<{ from: { lat: number; lon: number } | null; to: { lat: number; lon: number } | null }>({
    from: null,
    to: null,
  });
  const [pricing, setPricing] = useState<{ quote: { ratePerMile: number; totalPrice: number; distanceType: "short" | "long"; demandScore: number }; plans: { standard: PlanPrice; priority: PlanPrice; expedited: PlanPrice } } | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let raw = "";
    try {
      if (q && q.trim()) {
        raw = decodeBase64UrlToString(q.trim());
      } else {
        raw = window.sessionStorage.getItem("qc_quote_result") ?? "";
      }

      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      const sanitized = sanitizeQuote(parsed);
      if (!sanitized) {
        queueMicrotask(() => {
          setError("Quote details are missing or invalid.");
          setQuote(null);
        });
        return;
      }

      window.sessionStorage.setItem("qc_quote_result", JSON.stringify(sanitized));
      queueMicrotask(() => {
        setQuote(sanitized);
        setError("");
      });
    } catch {
      queueMicrotask(() => {
        setError("Quote details are missing or invalid.");
        setQuote(null);
      });
    }
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    if (!quote) return;

    (async () => {
      try {
        const url = new URL("/api/estimate", window.location.origin);
        url.searchParams.set("from", quote.fromLocation);
        url.searchParams.set("to", quote.toLocation);
        url.searchParams.set("transportType", quote.transportType);
        url.searchParams.set("vehicles", String(Math.max(1, quote.vehicles.length)));

        const res = await fetch(url.toString());
        const data = (await res.json().catch(() => ({}))) as EstimateResponse;
        if (cancelled) return;

        if (!res.ok || !Number.isFinite(data.miles)) {
          setMiles(null);
          setZips({});
          setStates({});
          setCoords({ from: null, to: null });
          return;
        }

        setMiles(Math.max(1, Math.round(data.miles)));
        setZips({ fromZip: data.fromZip, toZip: data.toZip });
        setStates({ fromState: data.fromState, toState: data.toState });
        setCoords({ from: data.fromCoord ?? null, to: data.toCoord ?? null });
      } catch {
        if (cancelled) return;
        setMiles(null);
        setZips({});
        setStates({});
        setCoords({ from: null, to: null });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [quote]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    if (!quote || !miles) {
      setPricing(null);
      return () => controller.abort();
    }

    const pickup = (states.fromState ?? "").trim();
    const delivery = (states.toState ?? "").trim();
    if (!pickup || !delivery) {
      setPricing(null);
      return () => controller.abort();
    }

    (async () => {
      try {
        const vehicleTypes = quote.vehicles.map((v) => v.vehicleType);
        const res = await fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleTypes,
            distance: miles,
            pickup,
            delivery,
            transportType: quote.transportType,
            serviceLevel: quote.serviceLevel,
          }),
          signal: controller.signal,
        });
        const data = (await res.json().catch(() => ({}))) as CalculateResponse;
        if (cancelled) return;

        if (!res.ok || !data || !("ok" in data) || data.ok !== true) {
          setPricing(null);
          return;
        }

        setPricing({ quote: data.quote, plans: data.plans });
      } catch {
        if (cancelled) return;
        setPricing(null);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [quote, miles, states.fromState, states.toState]);

  const totals = useMemo(() => {
    if (!pricing) return null;
    return {
      quote: pricing.quote,
      tiers: pricing.plans,
    };
  }, [pricing]);

  if (!quote) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 md:py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Quote result</h1>
        <p className="mt-2 text-foreground/70">{error || "Missing quote details."}</p>
        <div className="mt-6">
          <Link
            href="/quote"
            className="qc-btn qc-btn--secondary"
          >
            Back to quote form
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your quote result</h1>
          <p className="mt-2 text-foreground/70">Review your shipping details and estimated pricing.</p>
        </div>
        <Link
          href="/quote"
          className="qc-btn qc-btn--primary"
        >
          Start a new quote
        </Link>
      </div>

      <div className="mt-6 grid gap-6">
        <section className="card relative h-full overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-br from-primary/20 via-background to-background p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-transparent"
          />

          <div className="relative">
            <h2 className="text-lg font-semibold">Speciate Quote</h2>

          <div className="card mt-6 rounded-2xl border border-foreground/10 bg-white/80 p-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="mt-1 text-sm text-foreground/70">Choose the pickup window that fits your timeline.</p>
              </div>
                {totals && miles ? (
                  <p className="text-xs text-foreground/60 text-right">
                    {totals.quote.distanceType.toUpperCase()} • Demand {totals.quote.demandScore}/100 • Rate ${totals.quote.ratePerMile.toFixed(2)}/mi
                  </p>
                ) : null}
            </div>

            <div className="card mt-4 overflow-hidden rounded-2xl border border-foreground/10 bg-white">
              <div className="grid grid-cols-4 gap-0 border-b border-foreground/10 bg-background/60 px-4 py-3 text-xs font-semibold text-foreground/70">
                <div>Plan</div>
                <div>Pickup Window</div>
                <div>Price</div>
                <div>Best For</div>
              </div>

              <PlanRow
                plan="Standard"
                window="5–7 days"
                price={totals?.tiers.standard}
                bestFor="Flexible schedule"
              />
              <PlanRow
                plan="Priority"
                window="2–4 days"
                price={totals?.tiers.priority}
                bestFor="Faster pickup"
              />
              <PlanRow
                plan="Expedited"
                window="24–48 hrs"
                price={totals?.tiers.expedited}
                bestFor="Urgent shipment"
              />
            </div>
          </div>
          </div>
        </section>

        <section className="card relative overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-br from-primary/20 via-background to-background p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-transparent"
          />

          <div className="relative">
            <h2 className="text-lg font-semibold">Route map</h2>
            <p className="mt-1 text-sm text-foreground/70">Animated route based on your pickup and delivery locations.</p>

            <div className="mt-4">
              <RouteMap from={coords.from} to={coords.to} />
            </div>
          </div>
        </section>

        <section className="card relative h-full overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-br from-primary/20 via-background to-background p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-transparent"
          />

          <div className="relative">
            <h2 className="text-lg font-semibold">Shipping details</h2>

            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex items-start justify-between gap-6">
                <dt className="text-foreground/60">From</dt>
                <dd className="text-right font-medium">{quote.fromLocation}</dd>
              </div>
              <div className="flex items-start justify-between gap-6">
                <dt className="text-foreground/60">To</dt>
                <dd className="text-right font-medium">{quote.toLocation}</dd>
              </div>
              <div className="flex items-start justify-between gap-6">
                <dt className="text-foreground/60">Transport</dt>
                <dd className="text-right font-medium">{quote.transportType === "enclosed" ? "Enclosed" : "Open"}</dd>
              </div>
              <div className="flex items-start justify-between gap-6">
                <dt className="text-foreground/60">Expedited</dt>
                <dd className="text-right font-medium">{quote.expedited ? "Yes" : "No"}</dd>
              </div>
              <div className="flex items-start justify-between gap-6">
                <dt className="text-foreground/60">Distance</dt>
                <dd className="text-right font-medium">
                  {miles ? (
                    <span>
                      {miles} miles
                      {zips.fromZip && zips.toZip ? (
                        <span className="ml-2 text-foreground/60">(ZIP {zips.fromZip} → {zips.toZip})</span>
                      ) : null}
                      {states.fromState && states.toState ? (
                        <span className="ml-2 text-foreground/60">({states.fromState} → {states.toState})</span>
                      ) : null}
                    </span>
                  ) : (
                    <span className="font-medium text-foreground">Could not calculate distance from locations.</span>
                  )}
                </dd>
              </div>

              <div className="mt-2 border-t border-foreground/10 pt-4" />

              <div className="flex items-start justify-between gap-6">
                <dt className="text-foreground/60">Name</dt>
                <dd className="text-right font-medium">{quote.name || "—"}</dd>
              </div>
              <div className="flex items-start justify-between gap-6">
                <dt className="text-foreground/60">Phone</dt>
                <dd className="text-right font-medium">{quote.phone || "—"}</dd>
              </div>
              <div className="flex items-start justify-between gap-6">
                <dt className="text-foreground/60">Email</dt>
                <dd className="text-right font-medium">{quote.email || "—"}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  );

function PlanRow({
  plan,
  window,
  price,
  bestFor,
}: {
  plan: string;
  window: string;
  price?: PlanPrice;
  bestFor: string;
}) {
  const priceText = price ? `${formatMoney(price.totalPrice)}` : "—";

  return (
    <div className="grid grid-cols-4 gap-0 px-4 py-3 text-sm border-b border-foreground/10 last:border-b-0">
      <div className="font-semibold">{plan}</div>
      <div className="text-foreground/70">{window}</div>
      <div className="font-semibold">{priceText}</div>
      <div className="text-foreground/70">{bestFor}</div>
    </div>
  );
}
}

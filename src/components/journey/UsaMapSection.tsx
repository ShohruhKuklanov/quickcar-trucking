"use client";

import { geoAlbersUsa, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import { AnimatePresence, animate, motion } from "framer-motion";
import Image from "next/image";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { Truck, X } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { setDeliveryState, setPickupState } from "@/lib/quote-prefill-store";
import { calculatePrice, HEAT_DATA } from "@/lib/pricingEngine";
import { distanceBetweenStatesMiles, estimateTransitDays } from "@/lib/route-builder";

import usStatesTopo from "us-atlas/states-10m.json";

type StateMeta = {
  abbr: string;
  name: string;
};

const FIPS_TO_STATE: Record<number, StateMeta> = {
  1: { abbr: "AL", name: "Alabama" },
  2: { abbr: "AK", name: "Alaska" },
  4: { abbr: "AZ", name: "Arizona" },
  5: { abbr: "AR", name: "Arkansas" },
  6: { abbr: "CA", name: "California" },
  8: { abbr: "CO", name: "Colorado" },
  9: { abbr: "CT", name: "Connecticut" },
  10: { abbr: "DE", name: "Delaware" },
  12: { abbr: "FL", name: "Florida" },
  13: { abbr: "GA", name: "Georgia" },
  15: { abbr: "HI", name: "Hawaii" },
  16: { abbr: "ID", name: "Idaho" },
  17: { abbr: "IL", name: "Illinois" },
  18: { abbr: "IN", name: "Indiana" },
  19: { abbr: "IA", name: "Iowa" },
  20: { abbr: "KS", name: "Kansas" },
  21: { abbr: "KY", name: "Kentucky" },
  22: { abbr: "LA", name: "Louisiana" },
  23: { abbr: "ME", name: "Maine" },
  24: { abbr: "MD", name: "Maryland" },
  25: { abbr: "MA", name: "Massachusetts" },
  26: { abbr: "MI", name: "Michigan" },
  27: { abbr: "MN", name: "Minnesota" },
  28: { abbr: "MS", name: "Mississippi" },
  29: { abbr: "MO", name: "Missouri" },
  30: { abbr: "MT", name: "Montana" },
  31: { abbr: "NE", name: "Nebraska" },
  32: { abbr: "NV", name: "Nevada" },
  33: { abbr: "NH", name: "New Hampshire" },
  34: { abbr: "NJ", name: "New Jersey" },
  35: { abbr: "NM", name: "New Mexico" },
  36: { abbr: "NY", name: "New York" },
  37: { abbr: "NC", name: "North Carolina" },
  38: { abbr: "ND", name: "North Dakota" },
  39: { abbr: "OH", name: "Ohio" },
  40: { abbr: "OK", name: "Oklahoma" },
  41: { abbr: "OR", name: "Oregon" },
  42: { abbr: "PA", name: "Pennsylvania" },
  44: { abbr: "RI", name: "Rhode Island" },
  45: { abbr: "SC", name: "South Carolina" },
  46: { abbr: "SD", name: "South Dakota" },
  47: { abbr: "TN", name: "Tennessee" },
  48: { abbr: "TX", name: "Texas" },
  49: { abbr: "UT", name: "Utah" },
  50: { abbr: "VT", name: "Vermont" },
  51: { abbr: "VA", name: "Virginia" },
  53: { abbr: "WA", name: "Washington" },
  54: { abbr: "WV", name: "West Virginia" },
  55: { abbr: "WI", name: "Wisconsin" },
  56: { abbr: "WY", name: "Wyoming" },
};

type TooltipPosition = {
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTooltipPosition(clientX: number, clientY: number): TooltipPosition {
  const offset = 14;
  const tooltipWidth = 190;
  const tooltipHeight = 56;

  const viewportWidth = typeof window === "undefined" ? 0 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 0 : window.innerHeight;

  const x = clamp(clientX + offset, 10, Math.max(10, viewportWidth - tooltipWidth - 10));
  const y = clamp(clientY + offset, 10, Math.max(10, viewportHeight - tooltipHeight - 10));

  return { x, y };
}

function heatToFill(heatValue: number) {
  const heat = Math.max(0, Math.min(100, heatValue));
  const lightness = 100 - heat * 0.5;
  return `hsl(217, 70%, ${lightness}%)`;
}

type MapState = {
  id: string;
  name: string;
  d: string;
  centroid: [number, number];
};

type AnimatedNumberKind = "miles" | "currency" | "factor";

function formatMiles(value: number) {
  const rounded = Math.max(0, Math.round(value));
  return rounded.toLocaleString();
}

function formatFactor(value: number) {
  const v = Number.isFinite(value) ? value : 1;
  return `${v.toFixed(2)}x`;
}

function formatCurrency(value: number) {
  const v = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
}

const AnimatedNumber = memo(function AnimatedNumber({
  value,
  kind,
  className,
}: {
  value: number;
  kind: AnimatedNumberKind;
  className?: string;
}) {
  const [text, setText] = useState(() => {
    if (kind === "currency") return formatCurrency(value);
    if (kind === "factor") return formatFactor(value);
    return formatMiles(value);
  });

  const lastValueRef = useRef(value);

  useEffect(() => {
    const from = lastValueRef.current;
    lastValueRef.current = value;

    const controls = animate(from, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (kind === "currency") setText(formatCurrency(latest));
        else if (kind === "factor") setText(formatFactor(latest));
        else setText(formatMiles(latest));
      },
    });

    return () => {
      controls.stop();
    };
  }, [value, kind]);

  return (
    <span className={className} aria-label={text}>
      {text}
    </span>
  );
});

function getCurveStrength(distanceMiles: number) {
  if (distanceMiles < 600) return 40;
  if (distanceMiles < 1500) return 90;
  return 160;
}

function buildCurvePath(a: [number, number], b: [number, number], distanceMiles?: number) {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  // Dynamic curvature (enterprise feel): short lanes barely curve, cross‑country arcs more.
  // Curvature here is in SVG pixels, derived from lane distance.
  const miles = Number.isFinite(distanceMiles) ? (distanceMiles as number) : 900;
  const curvature = getCurveStrength(miles);

  // Quadratic control point: shift "up" in SVG space for a consistent arc.
  const cx = mx;
  const cy = my - curvature;

  return {
    d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(
      1
    )} ${y2.toFixed(1)}`,
    dot: {
      cx: [x1, cx, x2],
      cy: [y1, cy, y2],
    },
  };
}

const StatePath = memo(function StatePath(props: {
  state: MapState;
  fill: string;
  isHovered: boolean;
  selection: "pickup" | "delivery" | null;
  onHover: (state: MapState | null) => void;
  onMove: (clientX: number, clientY: number) => void;
  onSelect: (state: MapState) => void;
}) {
  const { state, fill, isHovered, selection, onHover, onMove, onSelect } = props;

  const isActive = Boolean(selection);
  const showOutline = isHovered || isActive;

  const selectionClass =
    selection === "pickup"
      ? "stroke-emerald-400 stroke-[2.2px] drop-shadow-[0_18px_30px_rgba(34,197,94,0.22)]"
      : selection === "delivery"
        ? "stroke-sky-400 stroke-[2.2px] drop-shadow-[0_18px_30px_rgba(56,189,248,0.24)]"
        : "stroke-[rgba(148,163,184,0.45)] stroke-[1px] drop-shadow-[0_0px_0px_rgba(0,0,0,0)]";

  return (
    <g>
      <path
        d={state.d}
        className={
          "qc-usMapStateOutline pointer-events-none transition-opacity duration-300 " +
          (showOutline ? "opacity-100" : "opacity-0")
        }
        fill="none"
      />
      <path
        id={state.id}
        data-name={state.name}
        d={state.d}
        onMouseEnter={(e) => {
          onHover(state);
          onMove(e.clientX, e.clientY);
        }}
        onMouseMove={(e) => {
          onMove(e.clientX, e.clientY);
        }}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect(state)}
        className={
          "qc-usMapState " +
          (isActive ? "qc-usMapStateActive " : "") +
          selectionClass +
          (isHovered ? " qc-usMapStateHover" : "")
        }
        fill={isHovered || isActive ? "#2F6DF6" : fill}
        style={{ pointerEvents: "auto" }}
      />
    </g>
  );
});

export function UsaMapSection() {
  const [mounted, setMounted] = useState(false);
  const [hoveredAbbr, setHoveredAbbr] = useState<string | null>(null);
  const [pickup, setPickup] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<string | null>(null);
  const [validated, setValidated] = useState<
    | { ratePerMile: number; totalPrice: number; distanceType: "short" | "long"; demandScore: number }
    | null
  >(null);
  const [validating, setValidating] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const routePathRef = useRef<SVGPathElement | null>(null);
  const routeTruckRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { states } = useMemo(() => {
    const projection = geoAlbersUsa().translate([487.5, 305]).scale(1280);
    const pathGenerator = geoPath(projection);

    const topology = usStatesTopo as unknown as Topology;
    const statesObject = (topology.objects as unknown as { states: GeometryCollection }).states;
    const collection = feature(topology, statesObject) as unknown as FeatureCollection<
      Geometry,
      Record<string, unknown>
    >;

    type StateFeature = Feature<Geometry, Record<string, unknown>> & { id?: string | number };

    const mapStates = (collection.features as StateFeature[])
      .map((stateFeature) => {
        const fips = Number(stateFeature.id);
        const meta = FIPS_TO_STATE[fips];
        if (!meta) return null;

        const permissible = stateFeature as unknown as GeoPermissibleObjects;
        const d = pathGenerator(permissible);
        if (!d) return null;

        const centroid = pathGenerator.centroid(permissible) as [number, number];

        return {
          id: meta.abbr,
          name: meta.name,
          d,
          centroid,
        };
      })
      .filter(Boolean) as MapState[];

    return { states: mapStates };
  }, []);

  const stateByAbbr = useMemo(() => {
    const map = new Map<string, { name: string }>();
    for (const s of states) map.set(s.id, { name: s.name });
    return map;
  }, [states]);

  const centroidByAbbr = useMemo(() => {
    const map = new Map<string, [number, number]>();
    for (const s of states) map.set(s.id, s.centroid);
    return map;
  }, [states]);

  const fillByAbbr = useMemo(() => {
    const map: Record<string, string> = {};
    for (const state of states) {
      const heat = HEAT_DATA[state.id] ?? 28;
      map[state.id] = heatToFill(heat);
    }
    return map;
  }, [states]);

  const selectedRoute = useMemo(() => {
    if (!pickup || !delivery) return null;
    const a = centroidByAbbr.get(pickup);
    const b = centroidByAbbr.get(delivery);
    if (!a || !b) return null;
    const miles = distanceBetweenStatesMiles(pickup, delivery);
    if (!miles) return buildCurvePath(a, b);
    return buildCurvePath(a, b, miles);
  }, [pickup, delivery, centroidByAbbr]);

  const distanceMiles = useMemo(() => distanceBetweenStatesMiles(pickup, delivery), [pickup, delivery]);

  const transit = useMemo(() => {
    if (!distanceMiles) return null;
    return estimateTransitDays(distanceMiles);
  }, [distanceMiles]);

  const localPrice = useMemo(() => {
    if (!pickup || !delivery || !distanceMiles) return null;
    return calculatePrice({ vehicleType: "sedan", distance: distanceMiles, pickup, delivery });
  }, [pickup, delivery, distanceMiles]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    if (!pickup || !delivery || !distanceMiles) {
      setValidated(null);
      setValidating(false);
      return () => {
        controller.abort();
      };
    }

    (async () => {
      try {
        setValidating(true);
        const res = await fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleType: "sedan",
            distance: distanceMiles,
            pickup,
            delivery,
          }),
          signal: controller.signal,
        });
        const data = (await res.json().catch(() => null)) as { result?: unknown } | null;
        if (cancelled) return;

        if (!res.ok || !data || typeof data.result !== "object" || !data.result) {
          setValidated(null);
          return;
        }

        const r = data.result as {
          ratePerMile?: unknown;
          totalPrice?: unknown;
          distanceType?: unknown;
          demandScore?: unknown;
        };

        if (
          typeof r.ratePerMile === "number" &&
          typeof r.totalPrice === "number" &&
          (r.distanceType === "short" || r.distanceType === "long") &&
          typeof r.demandScore === "number"
        ) {
          setValidated({
            ratePerMile: r.ratePerMile,
            totalPrice: r.totalPrice,
            distanceType: r.distanceType,
            demandScore: r.demandScore,
          });
        } else {
          setValidated(null);
        }
      } catch {
        if (cancelled) return;
        setValidated(null);
      } finally {
        if (cancelled) return;
        setValidating(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [pickup, delivery, distanceMiles]);

  const hoveredName = hoveredAbbr ? stateByAbbr.get(hoveredAbbr)?.name ?? null : null;
  const hoveredHeat = hoveredAbbr ? HEAT_DATA[hoveredAbbr] ?? 28 : null;

  const handleHover = useCallback((s: MapState | null) => {
    setHoveredAbbr(s?.id ?? null);
  }, []);

  const handleStateMove = useCallback((clientX: number, clientY: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setTooltipPosition(getTooltipPosition(clientX, clientY));
    });
  }, []);

  const scrollToQuote = useCallback(() => {
    const quoteEl = document.getElementById("quote-section") ?? document.getElementById("quote-form") ?? document.getElementById("quote");
    quoteEl?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const clearSelection = useCallback(() => {
    setPickup(null);
    setDelivery(null);
    setValidated(null);
    setValidating(false);
    setPickupState("");
    setDeliveryState("");
  }, []);

  const handleSelect = useCallback((s: MapState) => {
    if (!pickup) {
      setPickup(s.id);
      setDelivery(null);
      setPickupState(s.name);
      setDeliveryState("");
      return;
    }

    if (pickup && !delivery && pickup !== s.id) {
      setDelivery(s.id);
      setDeliveryState(s.name);
      return;
    }

    // Reset and start a new route selection
    setPickup(s.id);
    setDelivery(null);
    setPickupState(s.name);
    setDeliveryState("");
  }, [pickup, delivery]);

  const isRouteActive = Boolean(pickup && delivery);
  const SVG_W = 975;
  const SVG_H = 610;

  const focus = useMemo(() => {
    if (!isRouteActive || !pickup || !delivery) return { x: 0, y: 0 };
    const a = centroidByAbbr.get(pickup);
    const b = centroidByAbbr.get(delivery);
    if (!a || !b) return { x: 0, y: 0 };

    const midX = (a[0] + b[0]) / 2;
    const midY = (a[1] + b[1]) / 2;
    const k = 0.15; // matches scale 1.15
    const x = -(midX - SVG_W / 2) * k;
    const y = -(midY - SVG_H / 2) * k;
    return { x, y };
  }, [isRouteActive, pickup, delivery, centroidByAbbr]);

  useEffect(() => {
    if (!selectedRoute || !isRouteActive) return;

    const pathEl = routePathRef.current;
    const truckEl = routeTruckRef.current;
    if (!pathEl || !truckEl) return;

    let raf = 0;
    const start = performance.now();

    const length = pathEl.getTotalLength();
    const durationMs = 3800;
    const iconSize = 28;
    const tangentDelta = 1.25;

    const tick = (now: number) => {
      const t = ((now - start) % durationMs) / durationMs;
      const l = t * length;
      const p = pathEl.getPointAtLength(l);
      const p2 = pathEl.getPointAtLength(Math.min(length, l + tangentDelta));
      const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;

      // Position at p, rotate along tangent, then shift icon to be centered.
      truckEl.setAttribute(
        "transform",
        `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${angle.toFixed(2)}) translate(${(
          -iconSize / 2
        ).toFixed(2)} ${(-iconSize / 2).toFixed(2)})`
      );

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [selectedRoute, isRouteActive]);

  return (
    <section aria-label="USA logistics intelligence" className="py-10 md:py-12 bg-white w-full">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0f172a]/90 backdrop-blur-xl">
          <div className="pointer-events-none absolute right-4 top-4 z-30">
            <span className="logoWrap logoWrap--journey" aria-hidden="true">
              <Image
                src="/Quickcar_Web_Logo_Tight.png"
                alt="QuickCar"
                width={190}
                height={34}
                className="logo logoWhite h-[34px] w-auto"
                unoptimized
                draggable={false}
              />
            </span>
          </div>
          <div className="relative z-10 grid grid-cols-1 items-center gap-5 px-4 py-5 lg:grid-cols-12 md:px-6 md:py-6">
            <div className="relative col-span-12 lg:col-span-8">
          <div className="relative w-full overflow-hidden rounded-[18px] border border-white/10 bg-white/5 p-2.5">
            <div className="h-[360px] w-full md:h-[480px] lg:h-[520px] xl:h-[560px]">
              <svg
                viewBox="0 0 975 610"
                preserveAspectRatio="xMidYMid meet"
                className="h-full w-full origin-center transform md:scale-100 lg:scale-105"
                role="img"
                aria-label="United States heatmap with routes"
              >
              <g transform={`translate(${SVG_W / 2} ${SVG_H / 2})`}>
                <motion.g
                  animate={{
                    scale: isRouteActive ? 1.15 : 1,
                    x: isRouteActive ? focus.x : 0,
                    y: isRouteActive ? focus.y : 0,
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut", delay: isRouteActive ? 0.2 : 0 }}
                >
                  <g transform={`translate(${-SVG_W / 2} ${-SVG_H / 2})`}>
                    <g className="qc-usMapStates">
                      {states.map((state) => (
                        <StatePath
                          key={state.id}
                          state={state}
                          fill={fillByAbbr[state.id]}
                          isHovered={hoveredAbbr === state.id}
                          selection={state.id === pickup ? "pickup" : state.id === delivery ? "delivery" : null}
                          onHover={handleHover}
                          onMove={handleStateMove}
                          onSelect={handleSelect}
                        />
                      ))}
                    </g>

                    <g className="qc-usMapRoutes pointer-events-none" aria-hidden="true">
                      {selectedRoute ? (
                        <g>
                          <motion.path
                            d={selectedRoute.d}
                            fill="none"
                            stroke="#60a5fa"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="12 14"
                            initial={{ strokeDashoffset: 0, opacity: 0.35 }}
                            animate={{ strokeDashoffset: -52, opacity: 1 }}
                            transition={{
                              opacity: { duration: 0.35, ease: "easeOut", delay: isRouteActive ? 0.15 : 0 },
                              strokeDashoffset: { duration: 1.8, ease: "linear", repeat: Infinity },
                            }}
                            ref={routePathRef}
                          />

                          <g ref={routeTruckRef}>
                            <Truck
                              size={28}
                              className="text-sky-200 drop-shadow-[0_10px_18px_rgba(56,189,248,0.28)]"
                              strokeWidth={2.2}
                            />
                          </g>
                        </g>
                      ) : null}
                    </g>
                  </g>
                </motion.g>
              </g>
              </svg>
            </div>
          </div>

          {mounted
            ? createPortal(
                <motion.div
                  className={
                    "fixed left-0 top-0 z-50 pointer-events-none rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 shadow-md ring-1 ring-black/5 transition-opacity duration-200 " +
                    (hoveredName ? "opacity-100" : "opacity-0")
                  }
                  initial={false}
                  animate={{ x: tooltipPosition.x, y: tooltipPosition.y }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  aria-hidden={hoveredName ? "false" : "true"}
                >
                  <div>{hoveredName}</div>
                  <div className="mt-0.5 text-[11px] font-medium text-slate-600">
                    {hoveredHeat ?? 0} Active Routes
                  </div>
                </motion.div>,
                document.body
              )
            : null}
            </div>

            <div className="relative col-span-12 lg:col-span-4 lg:pt-12">

          <AnimatePresence mode="sync">
            {pickup || delivery ? (
              <motion.div
                key={`${pickup ?? ""}-${delivery ?? ""}`}
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.99 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="relative z-10 mx-auto w-full max-w-[420px] overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2.5 shadow-xl backdrop-blur-md"
              >
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label="Reset route selection"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>

                <div className="relative z-10">
                  <p className="text-xs font-semibold tracking-wide text-white/60">Enterprise Route Builder</p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">Real‑Time Lane Estimator</h3>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-[11px] font-semibold tracking-wide text-white/60">Pickup</p>
                      <p className="mt-0.5 text-sm font-semibold text-white">
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                        {pickup ? (stateByAbbr.get(pickup)?.name ?? pickup) : "Select"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-[11px] font-semibold tracking-wide text-white/60">Delivery</p>
                      <p className="mt-0.5 text-sm font-semibold text-white">
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
                        {delivery ? (stateByAbbr.get(delivery)?.name ?? delivery) : "Select"}
                      </p>
                    </div>
                  </div>

                  {pickup && !delivery ? (
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      Pickup locked. Click a second state to set delivery and generate pricing.
                    </p>
                  ) : null}

                  {pickup && delivery && distanceMiles && transit ? (
                    <motion.div
                      key="route-metrics"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, ease: "easeOut", delay: 0.65 }}
                      className="mt-2 space-y-1"
                    >
                      <div className="flex items-start justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                        <p className="text-sm text-white/60">Distance</p>
                        <p className="text-sm font-semibold text-white">
                          <AnimatedNumber value={distanceMiles} kind="miles" className="tabular-nums" /> mi
                        </p>
                      </div>
                      <div className="flex items-start justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                        <p className="text-sm text-white/60">Transit Time</p>
                        <p className="text-sm font-semibold text-white">{transit.label}</p>
                      </div>

                      <div className="flex items-start justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                        <p className="text-sm text-white/60">Demand Score</p>
                        <p className="text-sm font-semibold text-white tabular-nums">
                          {(validated?.demandScore ?? localPrice?.demandScore ?? 0).toFixed(0)}/100
                        </p>
                      </div>

                      <div className="mt-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <p className="text-[11px] font-semibold tracking-wide text-white/60">Estimated Price</p>
                        <p className="mt-0.5 text-3xl font-semibold tracking-tight text-sky-300">
                          <AnimatedNumber
                            value={validated?.totalPrice ?? localPrice?.totalPrice ?? 0}
                            kind="currency"
                            className="tabular-nums"
                          />
                        </p>
                        <div className="mt-1 flex items-center justify-between text-xs text-white/60">
                          <span>
                            Rate: {(validated?.ratePerMile ?? localPrice?.ratePerMile ?? 0).toFixed(2)}/mi
                          </span>
                          <span className="capitalize">{validated?.distanceType ?? localPrice?.distanceType ?? ""}</span>
                        </div>
                        {validating ? <p className="mt-1 text-[11px] text-white/50">Validating…</p> : null}
                      </div>

                      <div className="mt-2">
                        <button type="button" onClick={scrollToQuote} className="qc-btn qc-btn--primary w-full shadow-md">
                          Continue with this Route →
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="relative z-10 mx-auto w-full max-w-[420px] overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2.5 shadow-xl backdrop-blur-md"
              >
                <div className="relative z-10">
                  <p className="text-xs font-semibold tracking-wide text-white/60">Enterprise Route Builder</p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">Select a Pickup State</h3>
                  <p className="mt-1.5 text-sm leading-6 text-white/70">
                    Click once for pickup (green). Click again for delivery (blue). The system draws the lane and generates
                    real‑time distance, transit time, and pricing using demand heat multipliers.
                  </p>
                  <p className="mt-1.5 text-sm text-white/60">Heat intensity indicates recent activity density.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

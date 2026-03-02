"use client";

import { useEffect, useMemo, useRef } from "react";

export function Showcase() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const features = useMemo(
    () => [
      { title: "Door-to-door service", detail: "Coordinated pickup and delivery as close to your door as possible." },
      { title: "Flexible scheduling", detail: "Pickup windows built around availability and route efficiency." },
      { title: "Clear communication", detail: "Human-first updates that keep the process predictable." },
    ],
    [],
  );

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    /**
     * QUANTUM LOGISTICS ENGINE
     * Architecture:
     * - IntersectionObserver: enables/pauses animation work based on in-view state.
     * - requestAnimationFrame loop: drives lightweight SVG particle motion and number tweens.
     * - Phase classes (1–5): scroll storytelling without heavy per-frame layout.
     * - Recalculation events (every 6–10s, desktop/tablet only): crossfade routes + reroute particles + nudge KPIs.
     */
    root.classList.add("niw-enhanced");
    root.style.setProperty("--niw-opt-pct", "0.87");
    // Ensure transitions can run by applying the initial phase after first paint.
    window.requestAnimationFrame(() => {
      root.classList.add("niw-phase-1");
    });

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const isMobile = window.matchMedia?.("(max-width: 639.98px)")?.matches ?? false;

    // Phase system: discrete classes (no inline styles). This keeps motion intentional and cheap.
    let inView = false;
    let rafId = 0;
    let lastPhase = 1;
    let kpisPrimed = false;
    let recalcTimer: number | undefined;
    let recalcActive = false;
    let optimized = false;
    let phase5Entered = false;

    const setPhase = (nextPhase: number) => {
      if (nextPhase === lastPhase) return;
      root.classList.remove("niw-phase-1", "niw-phase-2", "niw-phase-3", "niw-phase-4", "niw-phase-5");
      root.classList.add(`niw-phase-${nextPhase}`);
      lastPhase = nextPhase;
    };

    const computePhase = () => {
      const rect = root.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const total = rect.height + viewportH;

      // Progress = 0 at when section just hits bottom; 1 when section top leaves viewport.
      const progress = Math.min(1, Math.max(0, (viewportH - rect.top) / total));
      if (progress < 0.12) return 1;
      if (progress < 0.3) return 2;
      if (progress < 0.5) return 3;
      if (progress < 0.72) return 4;
      return 5;
    };

    // KPI system: rAF-driven number tweening (count-up + gentle updates).
    type KPIKey = "shipments" | "avgDays" | "onTime" | "efficiency";
    type KPI = {
      key: KPIKey;
      el: HTMLElement;
      unit?: string;
      decimals: number;
      value: number;
      from: number;
      to: number;
      startMs: number;
      durationMs: number;
    };

    const formatKpi = (k: KPIKey, value: number) => {
      if (k === "shipments") return Math.round(value).toLocaleString();
      if (k === "avgDays") return value.toFixed(1);
      if (k === "onTime") return value.toFixed(1);
      return Math.round(value).toString();
    };

    const kpiTargets: Record<KPIKey, number> = {
      shipments: 1248,
      avgDays: 2.9,
      onTime: 98.1,
      efficiency: 87,
    };

    const kpiEls = Array.from(root.querySelectorAll<HTMLElement>("[data-niw-kpi]"));
    const kpis: KPI[] = [];
    for (const el of kpiEls) {
      const key = (el.getAttribute("data-niw-kpi") ?? "") as KPIKey;
      if (!key) continue;
      const decimals = key === "avgDays" || key === "onTime" ? 1 : 0;
      const unit = el.getAttribute("data-niw-unit") ?? "";
      const initial = kpiTargets[key] ?? 0;
      kpis.push({ key, el, unit, decimals, value: 0, from: 0, to: initial, startMs: 0, durationMs: 0 });
    }

    const setKpiText = (kpi: KPI) => {
      const formatted = formatKpi(kpi.key, kpi.value);
      kpi.el.textContent = kpi.unit ? `${formatted}${kpi.unit}` : formatted;
    };

    const animateKpiTo = (kpi: KPI, to: number, nowMs: number, durationMs: number) => {
      kpi.from = kpi.value;
      kpi.to = to;
      kpi.startMs = nowMs;
      kpi.durationMs = durationMs;
    };

    const primeKpis = (nowMs: number) => {
      if (kpisPrimed) return;
      kpisPrimed = true;
      root.classList.add("niw-kpis-live");
      optValue = 0.87;
      setOptimizationPct(0.87);
      for (const kpi of kpis) {
        // Start from a deliberately low baseline for a “systems boot” feel.
        kpi.value = 0;
        setKpiText(kpi);
        animateKpiTo(kpi, kpiTargets[kpi.key], nowMs, 980);
      }
    };

    const pulseKpiTile = (key: KPIKey) => {
      const tile = root.querySelector<HTMLElement>(`[data-niw-kpi-tile="${key}"]`);
      if (!tile) return;
      tile.classList.remove("niw-kpiPulse");
      // Force reflow to restart animation.
      void tile.offsetWidth;
      tile.classList.add("niw-kpiPulse");
    };

    // Optimization score tween (drives ring + label).
    let optValue = 0.87;
    let optFrom = 0.87;
    let optTo = 0.87;
    let optStartMs = 0;
    let optDurationMs = 0;

    const setOptimizationPct = (pct: number) => {
      const clamped = Math.max(0, Math.min(1, pct));
      root.style.setProperty("--niw-opt-pct", clamped.toFixed(4));
      const label = root.querySelector<HTMLElement>("[data-niw-opt-label]");
      if (label) label.textContent = `${Math.round(clamped * 100)}%`;
    };

    const animateOptimizationTo = (pct: number, nowMs: number, durationMs: number) => {
      optFrom = optValue;
      optTo = Math.max(0, Math.min(1, pct));
      optStartMs = nowMs;
      optDurationMs = durationMs;
    };

    const scheduleRecalc = () => {
      if (isMobile || prefersReduced) return;
      if (!inView) return;
      if (lastPhase < 5) return;
      if (recalcTimer) return;
      const next = 6000 + Math.random() * 4000;
      recalcTimer = window.setTimeout(() => {
        recalcTimer = undefined;
        triggerRecalc();
        scheduleRecalc();
      }, next);
    };

    const stopRecalc = () => {
      if (recalcTimer) window.clearTimeout(recalcTimer);
      recalcTimer = undefined;
    };

    const triggerRecalc = () => {
      if (recalcActive) return;
      recalcActive = true;
      optimized = !optimized;

      root.classList.add("niw-recalc");
      root.classList.toggle("niw-optimized", optimized);

      // KPI nudge (small, authoritative). Update target, animate, and pulse.
      const nowMs = performance.now();
      const shipmentsRaw = kpiTargets.shipments + (Math.random() < 0.5 ? -1 : 1) * (18 + Math.random() * 34);
      const avgRaw = kpiTargets.avgDays + (Math.random() < 0.55 ? -1 : 1) * 0.06;
      const onTimeRaw = kpiTargets.onTime + (Math.random() < 0.65 ? 1 : -1) * 0.08;
      const effRaw = optimized ? 92 : 89;

      kpiTargets.shipments = Math.max(980, Math.min(1680, shipmentsRaw));
      kpiTargets.avgDays = Math.max(2.1, Math.min(3.6, avgRaw));
      kpiTargets.onTime = Math.max(96.8, Math.min(99.4, onTimeRaw));
      kpiTargets.efficiency = Math.max(86, Math.min(94, effRaw));

      const nextShipments = kpiTargets.shipments;
      const nextAvg = kpiTargets.avgDays;
      const nextOnTime = kpiTargets.onTime;
      const nextEff = kpiTargets.efficiency;

      const targetByKey: Record<KPIKey, number> = {
        shipments: nextShipments,
        avgDays: nextAvg,
        onTime: nextOnTime,
        efficiency: nextEff,
      };

      for (const kpi of kpis) {
        const nextValue = targetByKey[kpi.key];
        animateKpiTo(kpi, nextValue, nowMs, 860);
        pulseKpiTile(kpi.key);
      }

      // Optimization score: 87% -> 92% during recalculation (smooth).
      animateOptimizationTo((optimized ? 0.92 : 0.89) + (Math.random() * 0.004 - 0.002), nowMs, 920);

      // Particle reroute happens by swapping path references (see tick loop).
      // We keep it subtle: particles dim briefly during recalculation.
      window.setTimeout(() => {
        root.classList.remove("niw-recalc");
        recalcActive = false;
      }, 1200);
    };

    // Particle system: circles follow route paths using SVG path length sampling.
    type Particle = {
      el: SVGCircleElement;
      path: SVGPathElement;
      length: number;
      speed: number;
      offset: number;
      group: "base" | "opt";
    };

    const svg = root.querySelector<SVGSVGElement>("svg[data-niw-map]");
    const pathEls = svg ? Array.from(svg.querySelectorAll<SVGPathElement>("path[data-niw-route]")) : [];
    const basePaths = new Map<string, SVGPathElement>();
    const optPaths = new Map<string, SVGPathElement>();
    for (const p of pathEls) {
      const key = p.getAttribute("data-niw-key") ?? "";
      const group = (p.getAttribute("data-niw-group") ?? "base") as "base" | "opt";
      if (!key) continue;
      if (group === "opt") optPaths.set(key, p);
      else basePaths.set(key, p);
    }

    const particleEls = svg ? Array.from(svg.querySelectorAll<SVGCircleElement>("circle[data-niw-particle]")) : [];
    const particles: Particle[] = [];

    const resolvePath = (key: string, group: "base" | "opt") => {
      if (group === "opt") return optPaths.get(key) ?? basePaths.get(key);
      return basePaths.get(key) ?? optPaths.get(key);
    };

    if (svg && !prefersReduced && !isMobile) {
      for (const el of particleEls) {
        const routeId = el.getAttribute("data-niw-route") ?? "";
        const path = resolvePath(routeId, "base");
        if (!path) continue;
        let length = 0;
        try {
          length = path.getTotalLength();
        } catch {
          length = 0;
        }
        if (!length) continue;

        const speed = Number(el.getAttribute("data-niw-speed") ?? "0.00009");
        const offset = Number(el.getAttribute("data-niw-offset") ?? "0");
        particles.push({ el, path, length, speed, offset, group: "base" });
      }
    }

    const updateParticlePaths = () => {
      const group: "base" | "opt" = optimized ? "opt" : "base";
      for (const p of particles) {
        if (p.group === group) continue;
        const routeId = p.el.getAttribute("data-niw-route") ?? "";
        const nextPath = resolvePath(routeId, group);
        if (!nextPath) continue;
        let nextLength = 0;
        try {
          nextLength = nextPath.getTotalLength();
        } catch {
          nextLength = 0;
        }
        if (!nextLength) continue;
        p.path = nextPath;
        p.length = nextLength;
        p.group = group;
        // Slightly decorrelate motion so rerouting looks “intentional”, not a jump.
        p.offset = (p.offset + 0.17 + Math.random() * 0.22) % 1;
      }
    };

    const tick = (nowMs: number) => {
      if (!inView) return;

      const phase = computePhase();
      setPhase(phase);

      // Phase triggers (one-time): KPI boot sequence + start recalculation loop.
      if (phase >= 4) {
        primeKpis(nowMs);
      }
      if (phase >= 5 && !isMobile && !prefersReduced) {
        if (!phase5Entered) {
          phase5Entered = true;
          window.setTimeout(() => {
            if (inView && lastPhase >= 5) triggerRecalc();
          }, 650);
        }
        scheduleRecalc();
      } else {
        phase5Entered = false;
        stopRecalc();
      }

      if (recalcActive) updateParticlePaths();

      // KPI tweens.
      if (kpisPrimed) {
        for (const kpi of kpis) {
          if (!kpi.durationMs) continue;
          const t = Math.min(1, Math.max(0, (nowMs - kpi.startMs) / kpi.durationMs));
          const eased = 1 - Math.pow(1 - t, 3);
          const next = kpi.from + (kpi.to - kpi.from) * eased;
          kpi.value = kpi.decimals ? Number(next.toFixed(kpi.decimals)) : Math.round(next);
          setKpiText(kpi);
          if (t >= 1) kpi.durationMs = 0;
        }
      }

      // Optimization tween.
      if (optDurationMs) {
        const t = Math.min(1, Math.max(0, (nowMs - optStartMs) / optDurationMs));
        const eased = 1 - Math.pow(1 - t, 3);
        optValue = optFrom + (optTo - optFrom) * eased;
        setOptimizationPct(optValue);
        if (t >= 1) optDurationMs = 0;
      }

      if (!prefersReduced && particles.length) {
        const t = nowMs;
        for (const p of particles) {
          const progress = (t * p.speed + p.offset) % 1;
          const point = p.path.getPointAtLength(progress * p.length);
          p.el.setAttribute("transform", `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    // In-view toggles: run rAF only while the section is on screen.
    if (typeof IntersectionObserver === "undefined") {
      // Fallback: show everything immediately.
      root.classList.add("niw-phase-5");
      root.classList.remove("niw-phase-1", "niw-phase-2", "niw-phase-3", "niw-phase-4");

      // Populate KPIs/optimization without animations.
      kpisPrimed = true;
      root.classList.add("niw-kpis-live");
      for (const kpi of kpis) {
        kpi.value = kpiTargets[kpi.key];
        kpi.durationMs = 0;
        setKpiText(kpi);
      }
      optValue = 0.87;
      setOptimizationPct(0.87);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        inView = entry.isIntersecting;

        if (inView) {
          if (!rafId) rafId = window.requestAnimationFrame(tick);
        } else {
          phase5Entered = false;
          stopRecalc();
          if (rafId) window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      {
        threshold: 0.12,
        rootMargin: "120px 0px 120px 0px",
      },
    );

    observer.observe(root);

    // Hover focus: cards drive route glow emphasis.
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-niw-card]"));
    const onEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement | null;
      const focus = el?.getAttribute("data-niw-card") ?? "";
      if (!focus) return;
      root.setAttribute("data-niw-focus", focus);
    };
    const onLeave = () => {
      root.removeAttribute("data-niw-focus");
    };
    for (const c of cards) {
      c.addEventListener("pointerenter", onEnter);
      c.addEventListener("pointerleave", onLeave);
    }

    return () => {
      observer.disconnect();
      stopRecalc();
      if (rafId) window.cancelAnimationFrame(rafId);

      for (const c of cards) {
        c.removeEventListener("pointerenter", onEnter);
        c.removeEventListener("pointerleave", onLeave);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="niw niw-forceLight qc-section" aria-label="Quantum logistics engine">
      {/* Background: nationwide network engine */}
      <div className="niw-map" aria-hidden="true">
        <svg
          data-niw-map
          className="niw-mapSvg"
          viewBox="0 0 1000 600"
          role="presentation"
          focusable="false"
        >
          <defs>
            <linearGradient id="niw-route-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--primary, #3b82f6)" stopOpacity="0" />
              <stop offset="25%" stopColor="var(--primary, #3b82f6)" stopOpacity="0.35" />
              <stop offset="50%" stopColor="var(--primary, #3b82f6)" stopOpacity="0.75" />
              <stop offset="75%" stopColor="var(--primary, #3b82f6)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--primary, #3b82f6)" stopOpacity="0" />
            </linearGradient>
            <filter id="niw-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.75 0"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Engine wave (during recalculation) */}
          <g className="niw-wave" filter="url(#niw-glow)">
            <circle className="niw-waveRing" cx="520" cy="305" r="22" />
          </g>

          {/* Simplified U.S. outline (stylized) */}
          <path
            className="niw-usOutlineGlow"
            d="M120 170 L170 145 L230 150 L285 132 L350 150 L420 148 L490 140 L555 150 L640 142 L720 168 L790 205 L840 252 L865 315 L852 368 L810 410 L740 435 L655 452 L590 470 L520 488 L455 492 L390 478 L330 458 L290 442 L240 420 L205 392 L172 360 L145 320 L130 280 L118 230 Z"
          />
          <path
            className="niw-usOutline"
            stroke="currentColor"
            d="M120 170 L170 145 L230 150 L285 132 L350 150 L420 148 L490 140 L555 150 L640 142 L720 168 L790 205 L840 252 L865 315 L852 368 L810 410 L740 435 L655 452 L590 470 L520 488 L455 492 L390 478 L330 458 L290 442 L240 420 L205 392 L172 360 L145 320 L130 280 L118 230 Z"
          />

          {/* AI Core Engine (central control node) + optimization ring */}
          <g className="niw-core" filter="url(#niw-glow)" aria-hidden="true">
            <circle className="niw-coreGlow" cx="520" cy="305" r="46" />
            <circle className="niw-coreNode" cx="520" cy="305" r="10" />
            <circle className="niw-coreRingTrack" cx="520" cy="305" r="34" />
            <circle className="niw-coreRing" cx="520" cy="305" r="34" />
            <text className="niw-coreLabel" x="520" y="312" textAnchor="middle" data-niw-opt-label>
              87%
            </text>
          </g>

          {/* Routes: base network */}
          <g className="niw-routes niw-routesBase" aria-hidden="true">
            <path id="niw-base-r1" data-niw-route data-niw-key="r1" data-niw-group="base" className="niw-route niw-route--open" stroke="url(#niw-route-gradient)" d="M205 320 C250 290 305 265 365 245 C430 225 505 220 590 230 C675 240 745 270 810 310" />
            <path id="niw-base-r2" data-niw-route data-niw-key="r2" data-niw-group="base" className="niw-route niw-route--coord" stroke="url(#niw-route-gradient)" d="M170 250 C240 230 305 220 370 220 C465 220 560 255 655 310" />
            <path id="niw-base-r3" data-niw-route data-niw-key="r3" data-niw-group="base" className="niw-route niw-route--enclosed" stroke="url(#niw-route-gradient)" d="M240 420 C330 375 420 350 520 350 C625 350 730 380 840 410" />
            <path id="niw-base-r4" data-niw-route data-niw-key="r4" data-niw-group="base" className="niw-route niw-route--open" stroke="url(#niw-route-gradient)" d="M285 210 C365 190 455 185 545 195 C635 205 720 230 790 260" />
            <path id="niw-base-r5" data-niw-route data-niw-key="r5" data-niw-group="base" className="niw-route niw-route--enclosed" stroke="url(#niw-route-gradient)" d="M330 458 C400 420 470 400 540 396 C640 390 735 420 820 455" />
            <path id="niw-base-r6" data-niw-route data-niw-key="r6" data-niw-group="base" className="niw-route niw-route--coord" stroke="url(#niw-route-gradient)" d="M230 150 C285 200 340 245 390 290 C455 350 520 410 590 470" />
          </g>

          {/* Optimized routes: recalculation crossfade target */}
          <g className="niw-routes niw-routesOpt" aria-hidden="true">
            <path id="niw-opt-r1" data-niw-route data-niw-key="r1" data-niw-group="opt" className="niw-route niw-route--opt niw-route--open" stroke="url(#niw-route-gradient)" d="M205 320 C265 280 330 255 405 240 C485 225 565 230 640 250 C710 270 770 305 810 340" />
            <path id="niw-opt-r2" data-niw-route data-niw-key="r2" data-niw-group="opt" className="niw-route niw-route--opt niw-route--coord" stroke="url(#niw-route-gradient)" d="M170 250 C250 215 335 210 415 220 C505 235 585 270 655 325" />
            <path id="niw-opt-r3" data-niw-route data-niw-key="r3" data-niw-group="opt" className="niw-route niw-route--opt niw-route--enclosed" stroke="url(#niw-route-gradient)" d="M240 420 C340 370 440 342 540 340 C650 336 760 362 840 395" />
            <path id="niw-opt-r4" data-niw-route data-niw-key="r4" data-niw-group="opt" className="niw-route niw-route--opt niw-route--open" stroke="url(#niw-route-gradient)" d="M285 210 C380 176 480 176 570 196 C660 216 740 245 790 278" />
            <path id="niw-opt-r5" data-niw-route data-niw-key="r5" data-niw-group="opt" className="niw-route niw-route--opt niw-route--enclosed" stroke="url(#niw-route-gradient)" d="M330 458 C420 410 505 390 590 398 C680 406 755 432 820 470" />
            <path id="niw-opt-r6" data-niw-route data-niw-key="r6" data-niw-group="opt" className="niw-route niw-route--opt niw-route--coord" stroke="url(#niw-route-gradient)" d="M230 150 C300 230 370 290 450 340 C520 385 575 425 590 470" />
          </g>

          {/* Nodes (major cities) */}
          <g className="niw-nodes" filter="url(#niw-glow)">
            <circle className="niw-node" cx="170" cy="250" r="3.4" />
            <circle className="niw-node" cx="205" cy="320" r="3.4" />
            <circle className="niw-node" cx="285" cy="210" r="3.2" />
            <circle className="niw-node" cx="365" cy="245" r="3.4" />
            <circle className="niw-node" cx="420" cy="148" r="3.2" />
            <circle className="niw-node" cx="520" cy="350" r="3.6" />
            <circle className="niw-node" cx="590" cy="230" r="3.4" />
            <circle className="niw-node" cx="655" cy="310" r="3.4" />
            <circle className="niw-node" cx="740" cy="435" r="3.2" />
            <circle className="niw-node" cx="810" cy="310" r="3.6" />
            <circle className="niw-node" cx="840" cy="410" r="3.4" />
            <circle className="niw-node niw-node--secondary" cx="330" cy="458" r="3.0" />
            <circle className="niw-node niw-node--secondary" cx="655" cy="452" r="3.0" />
            <circle className="niw-node niw-node--secondary" cx="590" cy="470" r="3.0" />
          </g>

          {/* Data particles (animated via rAF; transform only) */}
          <g className="niw-particles" filter="url(#niw-glow)">
            <circle data-niw-particle className="niw-particle" data-niw-route="r1" data-niw-speed="0.00008" data-niw-offset="0.12" r="2.2" />
            <circle data-niw-particle className="niw-particle" data-niw-route="r2" data-niw-speed="0.000095" data-niw-offset="0.42" r="2.0" />
            <circle data-niw-particle className="niw-particle" data-niw-route="r3" data-niw-speed="0.000075" data-niw-offset="0.68" r="2.2" />
            <circle data-niw-particle className="niw-particle" data-niw-route="r4" data-niw-speed="0.000088" data-niw-offset="0.27" r="2.1" />
            <circle data-niw-particle className="niw-particle" data-niw-route="r5" data-niw-speed="0.000078" data-niw-offset="0.51" r="2.0" />
          </g>
        </svg>
      </div>

      {/* Foreground layout */}
      <div className="niw-shell mx-auto max-w-6xl px-4 py-12">
        <div className="niw-grid">
          <div className="niw-left">
            <div className="niw-head">
              <h2 className="niw-title">Nationwide coverage</h2>
              <p className="niw-subtitle">
                A coordinated network across the U.S. — open or enclosed transport, flexible windows, and real-time routing discipline.
              </p>
            </div>

            <ul className="niw-featureList" aria-label="Coverage features">
              {features.map((f) => (
                <li key={f.title} className="niw-feature">
                  <p className="niw-featureTitle">{f.title}</p>
                  <p className="niw-featureDetail">{f.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="niw-right" aria-label="Service types">
            <div className="niw-cards">
              <article className="niw-card" data-niw-card="open">
                <p className="niw-cardKicker">Service type</p>
                <h3 className="niw-cardTitle">Open transport</h3>
                <p className="niw-cardBody">Cost-effective coverage for most vehicles — optimized routing with consistent coordination.</p>
              </article>
              <article className="niw-card" data-niw-card="enclosed">
                <p className="niw-cardKicker">Service type</p>
                <h3 className="niw-cardTitle">Enclosed transport</h3>
                <p className="niw-cardBody">Added protection for classic or luxury cars — the premium lane with higher control.</p>
              </article>
              <article className="niw-card" data-niw-card="coord">
                <p className="niw-cardKicker">Coordination</p>
                <h3 className="niw-cardTitle">Human-first control</h3>
                <p className="niw-cardBody">A single point of contact across booking, pickup, and delivery — with clarity at every handoff.</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

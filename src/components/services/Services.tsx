"use client";

import Image from "next/image";
import Link from "next/link";
import { animate, motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

type Slide = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  learnMoreHref: string;
};

const DRAG_THRESHOLD_PX = 100;
const GAP_PX = 32;
const TRANSITION_S = 0.6;

const SLIDES: Slide[] = [
  {
    title: "Open Transport",
    imageSrc: "/hero/open transport2.webp",
    imageAlt: "Open car carrier transporting vehicles",
    learnMoreHref: "/learn/open-car-transport",
  },
  {
    title: "Enclosed Transport",
    imageSrc: "/hero/enclosed.jpg",
    imageAlt: "Enclosed vehicle transport",
    learnMoreHref: "/learn/enclosed-auto-transport",
  },
  {
    title: "Flatbed Transportation",
    imageSrc: "/hero/slide-3.jpg",
    imageAlt: "Flatbed vehicle transport",
    learnMoreHref: "/learn/open-car-transport",
  },
];

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => setWidth(el.getBoundingClientRect().width);
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, width };
}

export function Services() {
  const slides = useMemo(() => SLIDES, []);
  const n = slides.length;

  const extendedSlides = useMemo(() => {
    if (n === 0) return [] as Slide[];
    return [slides[n - 1], ...slides, slides[0]];
  }, [n, slides]);

  const extendedLen = extendedSlides.length;
  const [trackIndex, setTrackIndex] = useState(1); // 1..n are real slides

  const { ref: viewportRef, width: viewportW } = useElementWidth<HTMLDivElement>();
  const { ref: measureSlideRef, width: slideW } = useElementWidth<HTMLDivElement>();

  const trackX = useMotionValue(0);
  const ready = viewportW > 0 && slideW > 0;

  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  const calcX = useCallback(
    (idx: number) => {
      if (!viewportW || !slideW) return 0;
      const centerOffset = (viewportW - slideW) / 2;
      return centerOffset - idx * (slideW + GAP_PX);
    },
    [slideW, viewportW]
  );

  const animateTo = useCallback(
    (idx: number, opts?: { immediate?: boolean }) => {
      const target = calcX(idx);
      if (opts?.immediate) {
        animRef.current?.stop();
        trackX.set(target);
        return;
      }
      animRef.current?.stop();
      animRef.current = animate(trackX, target, { duration: TRANSITION_S, ease: "easeInOut" });
    },
    [calcX, trackX]
  );

  const jumpTimerRef = useRef<number | null>(null);
  const navTokenRef = useRef(0);

  const goTo = useCallback(
    (nextIdx: number) => {
      if (extendedLen <= 1) return;
      const clamped = Math.max(0, Math.min(extendedLen - 1, nextIdx));

      navTokenRef.current += 1;
      const token = navTokenRef.current;
      if (jumpTimerRef.current) window.clearTimeout(jumpTimerRef.current);

      setTrackIndex(clamped);
      animateTo(clamped);

      // Infinite loop: when we animate to a clone, jump to the matching real slide.
      if (clamped === 0 || clamped === extendedLen - 1) {
        const real = clamped === 0 ? extendedLen - 2 : 1;
        jumpTimerRef.current = window.setTimeout(() => {
          if (navTokenRef.current !== token) return;
          setTrackIndex(real);
          animateTo(real, { immediate: true });
        }, Math.round(TRANSITION_S * 1000));
      }
    },
    [animateTo, extendedLen]
  );

  const goNext = useCallback(() => {
    if (extendedLen <= 1) return;
    goTo(trackIndex === extendedLen - 1 ? 1 : trackIndex + 1);
  }, [extendedLen, goTo, trackIndex]);

  const goPrev = useCallback(() => {
    if (extendedLen <= 1) return;
    goTo(trackIndex === 0 ? extendedLen - 2 : trackIndex - 1);
  }, [extendedLen, goTo, trackIndex]);

  // Keep track aligned on first measure + resize (no animation).
  const lastMeasureRef = useRef({ viewportW: 0, slideW: 0 });
  useLayoutEffect(() => {
    if (!viewportW || !slideW) return;
    const last = lastMeasureRef.current;
    const changed = last.viewportW !== viewportW || last.slideW !== slideW;
    lastMeasureRef.current = { viewportW, slideW };
    if (!changed) return;
    animateTo(trackIndex, { immediate: true });
  }, [animateTo, slideW, trackIndex, viewportW]);

  useLayoutEffect(() => {
    return () => {
      if (jumpTimerRef.current) window.clearTimeout(jumpTimerRef.current);
    };
  }, []);

  return (
    <section id="services" aria-label="Services" className="py-12 bg-white w-full overflow-hidden">
      <div
        ref={viewportRef}
        className="max-w-[1400px] mx-auto px-6 relative"
        role="region"
        aria-roledescription="carousel"
        aria-label="Service carousel"
      >
        {/* Hidden measurement element: stable slide width (w-full on mobile, 75% on md+) */}
        <div className="pointer-events-none absolute left-0 top-0 w-full opacity-0" aria-hidden="true">
          <div className="flex gap-8">
            <div ref={measureSlideRef} className="shrink-0 w-full md:w-[75%]" />
          </div>
        </div>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="absolute left-10 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-md transition hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="absolute right-10 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-md transition hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative">
          <motion.div
            className={
              "flex items-center gap-8 will-change-transform cursor-grab active:cursor-grabbing " +
              (ready ? "opacity-100" : "opacity-0 pointer-events-none")
            }
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            dragMomentum={false}
            onDragStart={() => {
              animRef.current?.stop();
            }}
            onDragEnd={(_, info) => {
              const dx = info.offset.x;
              if (dx > DRAG_THRESHOLD_PX) goPrev();
              else if (dx < -DRAG_THRESHOLD_PX) goNext();
              else animateTo(trackIndex);
            }}
            style={{ x: trackX }}
          >
            {extendedSlides.map((slide, i) => {
              const isActive = i === trackIndex;
              const slideFx = isActive ? "scale-100 opacity-100 z-20 shadow-xl" : "scale-[0.88] opacity-60 z-10";

              return (
                <div
                  key={`${slide.title}-${i}`}
                  className={
                    "relative w-full md:w-[75%] flex-shrink-0 h-[45vh] sm:h-[55vh] md:h-[65vh] rounded-[28px] overflow-hidden transition-all duration-500 " +
                    slideFx
                  }
                  aria-hidden={!isActive}
                >
                  <div className="absolute inset-0" aria-hidden="true">
                    <Image
                      src={slide.imageSrc}
                      alt={slide.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 1400px"
                      className={
                        "absolute inset-0 h-full w-full object-cover will-change-transform transition-transform duration-700 " +
                        (isActive ? "scale-[1.03]" : "scale-100")
                      }
                      draggable={false}
                      priority={slide.title === "Open Transport"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
                  </div>

                  <div className="absolute left-6 top-6 z-20">
                    <span className="logoWrap logoWrap--compact" aria-hidden="true">
                      <Image
                        src="/Quickcar_Web_Logo_Tight.png"
                        alt="QuickCar"
                        width={154}
                        height={28}
                        className="logo logoWhite"
                        style={{ height: 28, width: "auto" }}
                        unoptimized
                        draggable={false}
                      />
                    </span>
                  </div>

                  {isActive ? (
                    <div className="absolute bottom-20 left-20 z-20 text-white max-md:left-1/2 max-md:-translate-x-1/2 max-md:text-center">
                      <h2 className="text-5xl md:text-6xl font-semibold">{slide.title}</h2>
                      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
                        <Link
                          href="/quote"
                          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
                        >
                          Get a Quote
                        </Link>
                        <Link
                          href={slide.learnMoreHref}
                          className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-100"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BadgeCheck, Building2, Clock, ShieldCheck, Truck, Users } from "lucide-react";

type Review = {
  id: string;
  quote: string;
  name: string;
  location: string;
  verified?: boolean;
};

const BASE_REVIEWS: Review[] = [
  {
    id: "m1",
    quote:
      "The entire process was clearly organized from the beginning. Pickup happened exactly within the promised window, and delivery was smooth without any surprises. The communication made me feel comfortable the whole time.",
    name: "J. Martinez",
    location: "Dallas, TX",
    verified: true,
  },
  {
    id: "m2",
    quote:
      "I’ve shipped vehicles before and usually something changes at the last minute. This time the pricing stayed exactly as quoted, and the driver was professional and on schedule. That alone made a big difference.",
    name: "L. Thompson",
    location: "Miami, FL",
    verified: true,
  },
  {
    id: "m3",
    quote:
      "The guaranteed rate option gave me peace of mind. I didn’t want to deal with price changes or delays, and everything went according to plan. The car arrived exactly as it left.",
    name: "R. Nguyen",
    location: "Seattle, WA",
    verified: true,
  },
  {
    id: "m4",
    quote:
      "The coordination between dispatch and the carrier was impressive. I received updates throughout the process and never had to chase anyone for information. Very smooth experience overall.",
    name: "K. Johnson",
    location: "Denver, CO",
    verified: true,
  },
  {
    id: "m5",
    quote:
      "Clear pricing, no hidden fees, and a straightforward booking process. Pickup and delivery were both handled professionally. I would absolutely use them again.",
    name: "S. Patel",
    location: "Chicago, IL",
    verified: true,
  },
  {
    id: "m6",
    quote:
      "I chose the priority dispatch option because timing was important, and it was worth it. The vehicle was scheduled quickly and delivered without any delays. Everything felt structured and reliable.",
    name: "A. Rivera",
    location: "Austin, TX",
    verified: true,
  },
  {
    id: "m7",
    quote:
      "From the first call to final delivery, everything was handled professionally. I appreciated the transparency and how easy it was to get answers when I had questions.",
    name: "M. Chen",
    location: "San Diego, CA",
    verified: true,
  },
  {
    id: "m8",
    quote:
      "The driver arrived within the expected pickup window and kept communication open. Delivery was just as smooth. No stress, no confusion — exactly what I was hoping for.",
    name: "D. Clark",
    location: "Atlanta, GA",
    verified: true,
  },
  {
    id: "m9",
    quote:
      "My biggest concern was delays or last-minute price increases. Neither happened. The rate stayed locked in, and the vehicle arrived on time.",
    name: "T. Williams",
    location: "Phoenix, AZ",
    verified: true,
  },
  {
    id: "m10",
    quote:
      "Everything felt organized and professional. I liked knowing there was active oversight during the shipment instead of just hoping for the best.",
    name: "B. Lewis",
    location: "Charlotte, NC",
    verified: true,
  },
  {
    id: "m11",
    quote:
      "The booking process was simple, and the support team was responsive throughout. The vehicle was delivered in the same condition it was picked up.",
    name: "P. Anderson",
    location: "Portland, OR",
    verified: true,
  },
  {
    id: "m12",
    quote:
      "I’ve dealt with other companies before and had mixed results. This experience was different — no surprises, no unexpected changes, just a clean execution.",
    name: "H. Kim",
    location: "Los Angeles, CA",
    verified: true,
  },
  {
    id: "m13",
    quote:
      "I wasn’t looking for the cheapest option — I wanted reliability. That’s exactly what I received. Pickup and delivery both happened within the estimated timeframe.",
    name: "C. White",
    location: "Nashville, TN",
    verified: true,
  },
  {
    id: "m14",
    quote:
      "The communication stood out to me. I always knew what was happening and when. That level of clarity made the entire process stress-free.",
    name: "E. Brown",
    location: "Orlando, FL",
    verified: true,
  },
  {
    id: "m15",
    quote:
      "Fast scheduling, professional carrier, and on-time delivery. The experience felt secure from start to finish. I would confidently recommend them.",
    name: "G. Davis",
    location: "Houston, TX",
    verified: true,
  },
];

const TRUST_BLOCKS = [
  { icon: ShieldCheck, label: "Fully Insured Carriers" },
  { icon: Building2, label: "Licensed & Bonded" },
  { icon: Truck, label: "FMCSA Compliant" },
  { icon: Clock, label: "$0 Upfront Until Scheduled" },
  { icon: Users, label: "Dedicated Logistics Advisors" },
];

function formatCompactNumber(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function Reviews() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined"
        ? window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
        : false,
    [],
  );

  const base = BASE_REVIEWS;
  const extended = useMemo(() => [...base, ...base, ...base], [base]);
  const baseLen = base.length;
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(baseLen);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDx, setDragDx] = useState(0);
  const [stepPx, setStepPx] = useState(0);
  const [offsetPx, setOffsetPx] = useState(0);
  const [instant, setInstant] = useState(false);
  const [seenStars, setSeenStars] = useState<Set<string>>(() => new Set());

  const [metricDelivered, setMetricDelivered] = useState(0);
  const [metricOnTime, setMetricOnTime] = useState(0);
  const [metricRating, setMetricRating] = useState(0);
  const [metricCoverage, setMetricCoverage] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const t = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(t);
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "160px 0px 160px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Measure carousel geometry.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const measure = () => {
      const card = viewport.querySelector<HTMLElement>("[data-qt-card]");
      const rect = card?.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      const w = rect?.width ?? 360;
      const gap = 16;
      setStepPx(w + gap);
      setOffsetPx((viewportRect.width - w) / 2);
    };

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(viewport);
    return () => ro.disconnect();
  }, []);

  // Avoid a large first-load slide animation when measurements arrive.
  useEffect(() => {
    if (!stepPx) return;
    const t = window.setTimeout(() => {
      setInstant(true);
      window.requestAnimationFrame(() => setInstant(false));
    }, 0);
    return () => window.clearTimeout(t);
  }, [stepPx, offsetPx]);

  // Autoplay.
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) return;
    if (isHovering) return;
    if (isDragging) return;
    const t = window.setInterval(() => {
      setActiveIndex((i) => i + 1);
    }, 7000);
    return () => window.clearInterval(t);
  }, [inView, prefersReducedMotion, isHovering, isDragging]);

  // Star reveal (once) when a review becomes active.
  useEffect(() => {
    const baseIndex = ((activeIndex % baseLen) + baseLen) % baseLen;
    const id = base[baseIndex]?.id;
    if (!id) return;
    if (seenStars.has(id)) return;

    // Let the shimmer animation play before freezing into the "seen" state.
    const t = window.setTimeout(() => {
      setSeenStars((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }, 650);
    return () => window.clearTimeout(t);
  }, [activeIndex, base, baseLen, seenStars]);

  // Infinite loop correction.
  const shouldJump = activeIndex >= baseLen * 2 || activeIndex < baseLen;
  const onTransitionEnd = () => {
    if (!shouldJump) return;
    setInstant(true);
    setActiveIndex((i) => {
      if (i >= baseLen * 2) return i - baseLen;
      if (i < baseLen) return i + baseLen;
      return i;
    });
    window.requestAnimationFrame(() => setInstant(false));
  };

  // Animated metrics (once).
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      const t = window.setTimeout(() => {
        setMetricDelivered(20000);
        setMetricOnTime(98);
        setMetricRating(5);
        setMetricCoverage(50);
      }, 0);
      return () => window.clearTimeout(t);
    }

    const start = performance.now();
    const duration = 980;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setMetricDelivered(Math.round(20000 * eased));
      setMetricOnTime(Math.round(98 * eased));
      setMetricRating(Number((5 * eased).toFixed(1)));
      setMetricCoverage(Math.round(50 * eased));
      if (t < 1) requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [inView, prefersReducedMotion]);

  const translateX = stepPx ? offsetPx - activeIndex * stepPx + (isDragging ? dragDx : 0) : 0;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${translateX.toFixed(2)}px, 0, 0)`;
    el.style.transition =
      stepPx === 0 || instant || isDragging
        ? "none"
        : "transform 620ms cubic-bezier(0.2, 0.8, 0.2, 1)";
  }, [translateX, stepPx, instant, isDragging]);

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="qt qt-forceLight py-10 md:py-12 bg-white relative overflow-hidden"
      aria-label="Testimonials and trust"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="qt-title">Testimonials</h2>
        </header>

        <div className="qt-metrics" aria-label="Service metrics">
          <div className="qt-metric">
            <div className="qt-metricValue tabular-nums">{formatCompactNumber(metricDelivered)}+</div>
            <div className="qt-metricLabel">Vehicles Delivered</div>
          </div>
          <div className="qt-metric">
            <div className="qt-metricValue tabular-nums">{metricOnTime}%</div>
            <div className="qt-metricLabel">On-Time Delivery</div>
          </div>
          <div className="qt-metric">
            <div className="qt-metricValue tabular-nums">{metricRating.toFixed(1)}</div>
            <div className="qt-metricLabel">5-Star Rated Service</div>
          </div>
          <div className="qt-metric">
            <div className="qt-metricValue tabular-nums">{metricCoverage}+</div>
            <div className="qt-metricLabel">Nationwide Coverage</div>
          </div>
        </div>

        <div className="qt-carousel" aria-label="Customer reviews carousel">
          <div className="qt-carouselHead">
            <div className="qt-carouselHint" aria-hidden="true" />
            <div aria-hidden="true" />
          </div>

          <div
            ref={viewportRef}
            className="qt-viewport"
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonials"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onPointerDown={(e) => {
              if (prefersReducedMotion) return;
              const target = e.target;
              if (target instanceof Element && target.closest(".qt-arrow")) return;
              setIsDragging(true);
              setDragDx(0);
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              (e.currentTarget as HTMLElement).dataset.qtStartX = String(e.clientX);
            }}
            onPointerMove={(e) => {
              if (!isDragging) return;
              const startX = Number((e.currentTarget as HTMLElement).dataset.qtStartX ?? e.clientX);
              const dx = e.clientX - startX;
              setDragDx(Math.max(-220, Math.min(220, dx)));
            }}
            onPointerUp={(e) => {
              if (!isDragging) return;
              const dx = dragDx;
              setIsDragging(false);
              setDragDx(0);
              try {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              } catch {
                // ignore
              }
              if (Math.abs(dx) > 70) {
                setActiveIndex((i) => i + (dx < 0 ? 1 : -1));
              }
            }}
            onPointerCancel={() => {
              setIsDragging(false);
              setDragDx(0);
            }}
            onLostPointerCapture={() => {
              setIsDragging(false);
              setDragDx(0);
            }}
          >
            {prefersReducedMotion ? (
              <div className="qt-sideArrows" aria-hidden="true">
                <button
                  type="button"
                  className="qt-arrow qt-arrowSide qt-arrowLeft"
                  aria-label="Previous testimonial"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    setIsDragging(false);
                    setDragDx(0);
                    setActiveIndex((i) => i - 1);
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="qt-arrow qt-arrowSide qt-arrowRight"
                  aria-label="Next testimonial"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    setIsDragging(false);
                    setDragDx(0);
                    setActiveIndex((i) => i + 1);
                  }}
                >
                  ›
                </button>
              </div>
            ) : (
              <div className="qt-sideArrows">
                <button
                  type="button"
                  className="qt-arrow qt-arrowSide qt-arrowLeft"
                  aria-label="Previous testimonial"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    setIsDragging(false);
                    setDragDx(0);
                    setActiveIndex((i) => i - 1);
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="qt-arrow qt-arrowSide qt-arrowRight"
                  aria-label="Next testimonial"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    setIsDragging(false);
                    setDragDx(0);
                    setActiveIndex((i) => i + 1);
                  }}
                >
                  ›
                </button>
              </div>
            )}

            <div
              ref={trackRef}
              className="qt-track"
              onTransitionEnd={onTransitionEnd}
            >
              {extended.map((review, i) => {
                const baseIndex = ((i % baseLen) + baseLen) % baseLen;
                const isActive = i === activeIndex;
                const isNear = Math.abs(i - activeIndex) <= 2;
                const seen = seenStars.has(review.id);
                return (
                  <article
                    key={`${review.id}-${i}`}
                    className={"qt-slide" + (isActive ? " is-active" : "") + (isNear ? " is-near" : "")}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${baseIndex + 1} of ${baseLen}`}
                  >
                    <div className="qt-card" data-qt-card>
                      <div
                        className={
                          "qt-rating" +
                          (isActive && !seen ? " is-anim" : "") +
                          (seen ? " is-seen" : "")
                        }
                        aria-label="5-star rating"
                      >
                        <div className="qt-stars" aria-hidden="true">
                          <span className="qt-star">★</span>
                          <span className="qt-star">★</span>
                          <span className="qt-star">★</span>
                          <span className="qt-star">★</span>
                          <span className="qt-star">★</span>
                          <span className="qt-shimmer" />
                        </div>
                        <div className="qt-ratingMeta">
                          <span className="qt-ratingValue">5.0</span>
                          <span className="qt-ratingLabel">Verified Customer</span>
                          {review.verified ? (
                            <span className="qt-verified" aria-label="Verified">
                              <BadgeCheck size={14} aria-hidden="true" />
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <blockquote className="qt-quote">“{review.quote}”</blockquote>
                      <div className="qt-footer">
                        <div className="qt-name">{review.name}</div>
                        <div className="qt-loc">{review.location}</div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="qt-trust" aria-label="Trust and compliance">
          <div className="qt-divider" aria-hidden="true" />
          <div className="qt-trustRow">
            {TRUST_BLOCKS.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="qt-trustItem">
                  <Icon size={18} aria-hidden="true" className="qt-trustIcon" />
                  <span className="qt-trustText">{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="qt-cta" aria-label="Get started">
          <h3 className="qt-ctaTitle">Ship With Confidence.</h3>
          <div className="qt-ctaBtns">
            <Link href="/quote" className="qt-btnPrimary">
              Get Your Guaranteed Quote
            </Link>
            <Link href="/quote" className="qt-btnSecondary">
              Speak With a Transport Advisor
            </Link>
          </div>
          <p className="qt-ctaMicro">Priority dispatch slots fill first during peak demand.</p>
        </div>
      </div>
    </section>
  );
}

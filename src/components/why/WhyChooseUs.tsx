"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    number: "01",
    title: "Elite Transport Professionals",
    description:
      "We manage every shipment with precision logistics planning and expert coordination from dispatch to delivery.",
  },
  {
    number: "02",
    title: "Transparent Tier-Based Pricing",
    description:
      "Clear pricing options. No hidden fees. No last-minute changes. You choose the service level — we execute.",
  },
  {
    number: "03",
    title: "Vetted & Insured Carrier Network",
    description:
      "Every carrier is fully insured, background-verified, and performance-reviewed before joining our network.",
  },
  {
    number: "04",
    title: "Real-Time Shipment Support",
    description:
      "Dedicated logistics advisors monitor your transport and keep you informed every step of the way.",
  },
  {
    number: "05",
    title: "$0 Upfront Until Dispatch",
    description: "Secure your booking today. Pay only after your vehicle is officially scheduled.",
  },
  {
    number: "06",
    title: "Insurance Protection Included",
    description: "All shipments are covered under active cargo insurance for complete peace of mind.",
  },
  {
    number: "07",
    title: "Nationwide Coverage",
    description: "We operate across all 50 states with optimized route matching and fast dispatch capability.",
  },
  {
    number: "08",
    title: "Priority & Expedited Options",
    description:
      "Need it moved faster? Premium tier ensures priority pickup and high-priority carrier assignment.",
  },
];

export function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

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
      { threshold: 0.12, rootMargin: "140px 0px 140px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Motion UX: split into two rows and duplicate each row so the marquee can loop seamlessly.
  const topRow = features.slice(0, 4);
  const bottomRow = features.slice(4, 8);

  const renderCard = (feature: (typeof features)[number], idx: number, isDuplicate: boolean) => {
    const className =
      "why-card card group relative overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-br from-primary/10 via-background to-background p-3 hover-lift transition-[transform,border-color,box-shadow] duration-200 motion-reduce:transition-none " +
      (inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3");

    const content = (
      <>
        <div
          className="pointer-events-none absolute right-4 top-3 select-none text-6xl font-semibold tabular-nums text-foreground/5"
          aria-hidden="true"
        >
          {feature.number}
        </div>

        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden="true"
          data-why-glow
        />

        <div className="relative text-center">
          <h3 className="text-base font-semibold tracking-tight text-foreground md:text-[15px]">{feature.title}</h3>
          <p className="mt-2 text-sm leading-6 text-foreground/70">{feature.description}</p>
        </div>

        <div
          className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-primary/0 transition-[ring-color] duration-200 group-hover:ring-primary/45"
          aria-hidden="true"
        />
      </>
    );

    if (isDuplicate) {
      return (
        <li
          key={`${feature.number}-dup`}
          className={className}
          data-why-idx={idx}
          aria-hidden="true"
        >
          {content}
        </li>
      );
    }

    return (
      <li key={`${feature.number}-base`} className={className} data-why-idx={idx}>
        {content}
      </li>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="why"
      className={
        "py-10 md:py-12 bg-white relative min-h-[540px] overflow-hidden" +
        (inView ? " why-inView" : "")
      }
      aria-labelledby="why-book-quickcar"
    >
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center px-6 text-center">
        <header className="mx-auto max-w-3xl text-center">
          <h2
            id="why-book-quickcar"
            className="text-balance text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Why You Should Book With Quickcar Trucking
          </h2>
          <p className="mt-1 text-pretty text-base text-foreground/70 md:text-lg">
            Premium logistics execution, clear pricing, and accountable support — start to finish.
          </p>
        </header>

        {/*
          Continuous horizontal motion system (CSS-only marquee):
          - Top row moves right → left
          - Bottom row moves left → right
          - Content duplicated per row for a seamless infinite loop
          - Hovering a row pauses that row
        */}
        <div className="why-marquee mt-2 w-full" aria-label="Reasons to book">
          <div className="why-marqueeRow" aria-label="Reasons to book (row 1)">
            <div className="why-marqueeTrack">
              <ul className="why-marqueeSet" aria-label="Reasons to book (row 1 items)">
                {topRow.map((feature, i) => renderCard(feature, i + 1, false))}
              </ul>
              <ul className="why-marqueeSet" aria-hidden="true">
                {topRow.map((feature, i) => renderCard(feature, i + 1, true))}
              </ul>
            </div>
          </div>

          <div className="why-marqueeRow" aria-label="Reasons to book (row 2)">
            <div className="why-marqueeTrack why-marqueeTrack--reverse">
              <ul className="why-marqueeSet" aria-label="Reasons to book (row 2 items)">
                {bottomRow.map((feature, i) => renderCard(feature, i + 5, false))}
              </ul>
              <ul className="why-marqueeSet" aria-hidden="true">
                {bottomRow.map((feature, i) => renderCard(feature, i + 5, true))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/quote"
            className="qc-btn qc-btn--primary"
          >
            Get Your Instant Quote
          </Link>
          <Link
            href="/quote"
            className="qc-btn qc-btn--secondary"
          >
            Speak With a Transport Advisor
          </Link>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarRange,
  MapPinned,
  PhoneCall,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { QuoteForm } from "@/components/quote/QuoteForm";

const CANONICAL = "https://quickcartrucking.com/car-shipping-costs";
const PHONE_HREF = "tel:+16467311022";

export const metadata: Metadata = {
  title: "Car Shipping Costs | Calculate Your Auto Transport Estimate",
  description:
    "Calculate your car shipping cost instantly. Get a fast, accurate auto transport quote with no hidden fees.",
  keywords: ["car shipping cost", "auto transport price", "car shipping calculator"],
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "Car Shipping Costs | Calculate Your Auto Transport Estimate",
    description:
      "Calculate your car shipping cost instantly. Get a fast, accurate auto transport quote with no hidden fees.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Shipping Costs | Calculate Your Auto Transport Estimate",
    description:
      "Calculate your car shipping cost instantly. Get a fast, accurate auto transport quote with no hidden fees.",
  },
};

const pricingFactors: Array<{ title: string; body: string; icon: LucideIcon }> = [
  {
    title: "Distance",
    body: "Longer distances increase total cost, but reduce the price per mile on most lanes.",
    icon: MapPinned,
  },
  {
    title: "Vehicle Type",
    body: "Larger or heavier vehicles cost more to transport because they take more trailer space.",
    icon: Truck,
  },
  {
    title: "Location",
    body: "Major cities are usually easier and cheaper. Remote areas may require extra coordination.",
    icon: BadgeCheck,
  },
  {
    title: "Transport Type",
    body: "Open transport is more affordable. Enclosed transport is premium and priced higher.",
    icon: ShieldCheck,
  },
  {
    title: "Season & Demand",
    body: "Rates move with market demand, weather, and seasonal shipping volume.",
    icon: CalendarRange,
  },
];

const priceExamples = [
  { title: "Short Distance", miles: "0-500 miles", range: "$300 - $700" },
  { title: "Medium Distance", miles: "500-1500 miles", range: "$700 - $1200" },
  { title: "Long Distance", miles: "1500+ miles", range: "$1200 - $2000+" },
] as const;

const transportOptions = [
  {
    title: "Open Transport",
    items: ["Most affordable", "Widely available", "Suitable for most vehicles"],
  },
  {
    title: "Enclosed Transport",
    items: ["Maximum protection", "Ideal for luxury & classic cars", "Higher cost"],
  },
] as const;

const savingsTips = [
  "Be flexible with pickup dates",
  "Choose open transport",
  "Ship during off-peak seasons",
  "Book in advance",
] as const;

const whyChooseUs = [
  "Transparent pricing",
  "No hidden fees",
  "Reliable carriers",
  "Fast quotes",
  "Nationwide service",
] as const;

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">{children}</p>;
}

export default function CarShippingCostsPage() {
  return (
    <main className="bg-white text-[#0f172a]">
      <section className="relative overflow-hidden border-b border-black/5 bg-[#f8fbff]">
        <div className="absolute inset-0 bg-[url('/hero/herobg.avif')] bg-cover bg-center opacity-[0.18]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_8%,rgba(255,255,255,0.88)_46%,rgba(248,250,252,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(62,106,225,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(15,23,42,0.08),transparent_28%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-3 py-1 backdrop-blur">
                <SectionEyebrow>Calculate Your Estimate</SectionEyebrow>
              </div>

              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-[#0f172a] sm:text-6xl lg:text-7xl">
                Car Shipping Costs
                <span className="mt-2 block text-[clamp(1.7rem,3.2vw,3rem)] font-medium tracking-[-0.04em] text-[#334155]">
                  Calculate Your Estimate
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#475569] sm:text-xl">
                Get a fast and accurate estimate for your vehicle transport. Transparent pricing with no hidden fees.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#instant-estimate"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(62,106,225,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_24px_56px_rgba(62,106,225,0.3)]"
                >
                  Calculate Your Quote
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
                <Link
                  href={PHONE_HREF}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#0f172a] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3 text-sm text-[#475569]">
                {["Fast estimates", "No hidden fees", "Nationwide coverage"].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/78 px-4 py-2 backdrop-blur"
                  >
                    <BadgeCheck className="h-4 w-4 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <QuoteForm instanceId="car-shipping-costs-hero" anchorId="instant-estimate" />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <SectionEyebrow>How Car Shipping Costs Are Calculated</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
              Understand what moves your quote up or down.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#475569]">
              Car shipping costs depend on several key factors. Understanding these will help you get the most accurate estimate.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {pricingFactors.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-[28px] border border-black/6 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_28px_80px_rgba(62,106,225,0.1)]"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#0f172a]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#475569]">{item.body}</p>
                </article>
              );
            })}
          </div>

          <InlineCTA />
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div>
              <SectionEyebrow>Estimated Price Ranges</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                Typical price bands by shipping distance.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#475569]">
                These examples help set expectations before you request an exact quote. Prices vary based on vehicle and conditions.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {priceExamples.map((example) => (
                <article
                  key={example.title}
                  className="rounded-[28px] border border-black/6 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)]"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">{example.miles}</div>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0f172a]">{example.title}</h3>
                  <div className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#0f172a]">{example.range}</div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {transportOptions.map((option, index) => (
              <article
                key={option.title}
                className={`rounded-4xl border p-8 shadow-[0_18px_48px_rgba(15,23,42,0.06)] ${
                  index === 0
                    ? "border-primary/18 bg-white"
                    : "border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]"
                }`}
              >
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#0f172a]">{option.title}</h2>
                <div className="mt-6 space-y-3">
                  {option.items.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-black/6 bg-white/72 px-4 py-3 text-sm text-[#334155]">
                      <BadgeCheck className="h-4 w-4 flex-none text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <InlineCTA />
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <SectionEyebrow>How to Lower Your Shipping Cost</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                A few simple choices can improve your final rate.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#475569]">
                The best pricing usually comes from flexibility, timing, and choosing the transport option that matches your actual vehicle needs.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {savingsTips.map((tip) => (
                <div
                  key={tip}
                  className="rounded-3xl border border-black/6 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_26px_72px_rgba(62,106,225,0.1)]"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#0f172a]">{tip}</h3>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-[36px] border border-black/6 bg-[#0f172a] p-8 text-white shadow-[0_34px_100px_rgba(15,23,42,0.2)] sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div>
                <SectionEyebrow>Why Choose Quickcar Trucking?</SectionEyebrow>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                  Reliable pricing, responsive support, and nationwide coverage.
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {whyChooseUs.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm text-white/82">
                    <div className="flex items-start gap-3">
                      <BadgeCheck className="mt-0.5 h-4 w-4 flex-none text-primary" />
                      <span>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-[36px] border border-black/6 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#3e6ae1_140%)] p-8 text-white shadow-[0_34px_100px_rgba(15,23,42,0.2)] sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <SectionEyebrow>Ready to Get Your Exact Price?</SectionEyebrow>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                  Ready to Get Your Exact Price?
                </h2>
                <p className="mt-4 text-lg leading-8 text-white/78">Request your personalized quote in seconds.</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <a
                  href="#instant-estimate"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#0f172a] transition duration-300 hover:-translate-y-0.5 hover:bg-white/94 hover:shadow-[0_18px_40px_rgba(255,255,255,0.16)]"
                >
                  Get a Quote Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
                <Link
                  href={PHONE_HREF}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/16 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/12"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InlineCTA() {
  return (
    <div className="mt-14 flex flex-col gap-3 rounded-[28px] border border-black/6 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-lg font-semibold text-[#0f172a]">Need a fast number for your route?</div>
        <div className="mt-1 text-sm text-[#475569]">Use the instant calculator above or talk to our team now.</div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="#instant-estimate"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Get My Quote
        </a>
        <Link
          href={PHONE_HREF}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#0f172a] transition hover:border-primary/30"
        >
          <PhoneCall className="h-4 w-4" />
          Call
        </Link>
      </div>
    </div>
  );
}

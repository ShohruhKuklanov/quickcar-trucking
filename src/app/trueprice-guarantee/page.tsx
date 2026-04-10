import type { Metadata } from "next";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarRange,
  CircleDollarSign,
  Clock3,
  Lock,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

const CANONICAL = "https://quickcartrucking.com/trueprice-guarantee";
const PHONE_HREF = "tel:+16467311022";

export const metadata: Metadata = {
  title: "TruePrice Guarantee | Locked Auto Transport Pricing",
  description:
    "Get a locked auto transport rate with Quickcar Trucking LLC. No hidden fees, no last-minute price changes, and a 30-day price lock you can trust.",
  keywords: [
    "trueprice guarantee",
    "price lock auto transport",
    "locked car shipping quote",
    "transparent auto transport pricing",
  ],
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "TruePrice Guarantee | Locked Auto Transport Pricing",
    description:
      "What you're quoted is what you pay. Lock your price for 30 days with Quickcar Trucking LLC.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TruePrice Guarantee | Locked Auto Transport Pricing",
    description:
      "Transparent pricing, no hidden fees, and a 30-day price lock for your shipment.",
  },
};

const trustBadges = ["30-Day Price Lock", "Transparent Pricing", "Trusted Nationwide"] as const;

const lockBenefits = [
  "Your price will not change within 30 days",
  "No unexpected increases due to market shifts",
  "Full control over your schedule",
] as const;

const includedItems = [
  "Carrier transportation cost",
  "Full dispatch coordination",
  "Standard insurance coverage",
  "Customer support throughout the process",
] as const;

const noSurprisesItems = [
  "No last-minute price increases",
  "No hidden broker fees",
  "No misleading low quotes",
] as const;

const trustReasons = [
  "Honest and transparent pricing",
  "Strong carrier network",
  "Fast and accurate quotes",
  "Reliable communication",
  "Experience since 2019",
] as const;

const processSteps: Array<{ step: string; title: string; icon: LucideIcon }> = [
  { step: "Step 1", title: "Request your quote", icon: CircleDollarSign },
  { step: "Step 2", title: "Receive your locked price", icon: Lock },
  { step: "Step 3", title: "Schedule your shipment", icon: CalendarRange },
  { step: "Step 4", title: "We handle the rest", icon: ShieldCheck },
];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">{children}</p>;
}

function CTAButtons({ quoteLabel = "Get Your Locked Price" }: { quoteLabel?: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href="/quote"
        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(62,106,225,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_24px_56px_rgba(62,106,225,0.3)]"
      >
        {quoteLabel}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>
      <Link
        href={PHONE_HREF}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/85 px-6 py-3.5 text-sm font-semibold text-[#0f172a] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]"
      >
        <PhoneCall className="h-4 w-4" />
        Call Now
      </Link>
    </div>
  );
}

export default function TruePriceGuaranteePage() {
  return (
    <main className="bg-white pb-24 text-[#0f172a] md:pb-0">
      <section className="relative overflow-hidden border-b border-black/5 bg-[#f8fbff]">
        <div className="absolute inset-0 bg-[url('/hero/herobg.avif')] bg-cover bg-center opacity-[0.1]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_8%,rgba(255,255,255,0.88)_46%,rgba(248,250,252,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(62,106,225,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(15,23,42,0.08),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6 py-18 sm:py-22 lg:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-3 py-1 backdrop-blur">
              <SectionEyebrow>Quickcar Trucking LLC</SectionEyebrow>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/16 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary">
              <Lock className="h-4 w-4" />
              Price Locked for 30 Days
            </div>

            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-[#0f172a] sm:text-6xl lg:text-7xl">
              TruePrice Guarantee
              <span className="mt-2 block text-[clamp(1.7rem,3.1vw,3rem)] font-medium tracking-[-0.04em] text-[#334155]">
                No Surprises. No Hidden Fees.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#475569] sm:text-xl">
              What you&apos;re quoted is what you pay. With Quickcar Trucking LLC, your price is locked and fully transparent from start to finish.
            </p>

            <div className="mt-8">
              <CTAButtons />
            </div>

            <div className="mt-10 flex flex-wrap gap-3 text-sm text-[#475569]">
              {trustBadges.map((item) => (
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
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div className="max-w-3xl">
              <SectionEyebrow>What Is Our TruePrice Guarantee?</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                Pricing should be simple, honest, and predictable.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#475569]">
                At Quickcar Trucking LLC, we believe pricing should be simple, honest, and predictable. Our TruePrice Guarantee means the quote you receive is the final price — no last-minute changes, no hidden charges, and no surprises.
              </p>
              <p className="mt-4 text-lg leading-8 text-[#475569]">
                Unlike many companies that adjust pricing after booking, we commit to full transparency from the beginning.
              </p>
            </div>

            <div className="rounded-4xl border border-black/6 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#3e6ae1_140%)] p-8 text-white shadow-[0_34px_100px_rgba(15,23,42,0.18)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-sm font-semibold text-white/90">
                <Sparkles className="h-4 w-4 text-primary" />
                Conversion Advantage
              </div>
              <div className="mt-6 space-y-4">
                {[
                  "Builds immediate trust",
                  "Removes pricing anxiety",
                  "Improves conversion confidence",
                  "Differentiates Quickcar from competitors",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm text-white/82">
                    <BadgeCheck className="mt-0.5 h-4 w-4 flex-none text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="rounded-[36px] border border-primary/14 bg-white p-8 shadow-[0_24px_64px_rgba(62,106,225,0.12)] sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div className="max-w-2xl">
                <SectionEyebrow>30-Day Price Lock</SectionEyebrow>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                  30-Day Price Lock — Your Rate, Secured
                </h2>
                <p className="mt-5 text-lg leading-8 text-[#475569]">
                  Once you receive your quote, your price is locked for 30 days. This gives you the flexibility to plan your shipment without worrying about sudden price increases.
                </p>
              </div>

              <div className="grid gap-4">
                {lockBenefits.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-black/6 bg-[#f8fbff] px-4 py-4 text-sm text-[#334155]">
                    <Lock className="mt-0.5 h-4 w-4 flex-none text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-4xl border border-black/6 bg-white p-8 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
              <SectionEyebrow>Why Pricing Transparency Matters</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a]">Eliminate uncertainty before your vehicle moves.</h2>
              <p className="mt-5 text-lg leading-8 text-[#475569]">
                Many customers experience frustration when shipping a vehicle due to unexpected price changes or unclear fees.
              </p>
              <p className="mt-4 text-lg leading-8 text-[#475569]">
                With Quickcar Trucking, we eliminate that uncertainty by offering clear, upfront pricing you can trust.
              </p>
            </article>

            <article className="rounded-4xl border border-black/6 bg-white p-8 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
              <SectionEyebrow>What&apos;s Included in Your Quote?</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a]">Everything essential is stated up front.</h2>
              <div className="mt-6 grid gap-3">
                {includedItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-black/6 bg-[#f8fbff] px-4 py-4 text-sm text-[#334155]">
                    <BadgeCheck className="mt-0.5 h-4 w-4 flex-none text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#0f172a]">No hidden fees. No surprise charges.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="max-w-2xl">
              <SectionEyebrow>No Surprises — Guaranteed</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                What you won&apos;t experience with Quickcar.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#475569]">
                We do not use low teaser pricing to get your attention and then raise the cost later. The whole point of TruePrice is to protect your trust.
              </p>
            </div>

            <div className="grid gap-4">
              {noSurprisesItems.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-rose-200/80 bg-rose-50 px-4 py-4 text-sm text-rose-950">
                  <TriangleAlert className="mt-0.5 h-4 w-4 flex-none text-rose-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <SectionEyebrow>Why Customers Trust Quickcar Trucking</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
              Confidence built on transparency, communication, and execution.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {trustReasons.map((item, index) => {
              const icons: LucideIcon[] = [CircleDollarSign, ShieldCheck, Clock3, BadgeCheck, CalendarRange];
              const Icon = icons[index] ?? BadgeCheck;
              return (
                <article
                  key={item}
                  className="rounded-[28px] border border-black/6 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_28px_80px_rgba(62,106,225,0.1)]"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 text-base font-semibold leading-7 text-[#0f172a]">{item}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_50%,#f8fafc_100%)]">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_center,rgba(62,106,225,0.08),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <SectionEyebrow>Simple &amp; Transparent Process</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
              The process is as clear as the pricing.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.step}
                  className="rounded-[28px] border border-black/6 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">{item.step}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#0f172a]">{item.title}</h3>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="rounded-[36px] border border-black/6 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#3e6ae1_140%)] p-8 text-white shadow-[0_34px_100px_rgba(15,23,42,0.2)] sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <SectionEyebrow>Final CTA</SectionEyebrow>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                  Lock Your Price Today — Ship with Confidence
                </h2>
                <p className="mt-4 text-lg leading-8 text-white/78">Get a guaranteed rate with no surprises.</p>
              </div>

              <CTAButtons quoteLabel="Get Your Quote Now" />
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/8 bg-white/95 p-3 shadow-[0_-12px_40px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <Link
          href="/quote"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Get Your Locked Price
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}

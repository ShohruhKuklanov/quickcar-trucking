import type { Metadata } from "next";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarRange,
  CircleDollarSign,
  Clock3,
  MapPinned,
  PhoneCall,
  ShieldCheck,
  Truck,
} from "lucide-react";

import FAQSection from "@/components/FAQSection";

const CANONICAL = "https://quickcartrucking.com/how-to-ship-a-car";
const PHONE_HREF = "tel:+16467311022";

export const metadata: Metadata = {
  title: "How to Ship a Car | Quickcar Trucking Guide",
  description:
    "Learn how to ship a car safely and easily with our step-by-step auto transport guide. Fast quotes and reliable service.",
  keywords: ["how to ship a car", "auto transport guide", "car shipping process"],
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "How to Ship a Car | Quickcar Trucking Guide",
    description:
      "Learn how to ship a car safely and easily with our step-by-step auto transport guide. Fast quotes and reliable service.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Ship a Car | Quickcar Trucking Guide",
    description:
      "Learn how to ship a car safely and easily with our step-by-step auto transport guide. Fast quotes and reliable service.",
  },
};

const processSteps: Array<{
  step: string;
  title: string;
  body: string;
  icon: LucideIcon;
}> = [
  {
    step: "Step 1",
    title: "Request a Quote",
    body:
      "Provide pickup and delivery locations, vehicle details, and your preferred timeline. We will give you a fast and accurate quote.",
    icon: MapPinned,
  },
  {
    step: "Step 2",
    title: "Book Your Shipment",
    body:
      "Once you confirm, we schedule your shipment and assign a reliable carrier from our network.",
    icon: CalendarRange,
  },
  {
    step: "Step 3",
    title: "Vehicle Pickup",
    body:
      "The driver inspects your vehicle and prepares it for transport. You will receive all necessary details before pickup.",
    icon: BadgeCheck,
  },
  {
    step: "Step 4",
    title: "Transportation",
    body:
      "Your vehicle is safely transported while we keep you updated throughout the journey.",
    icon: Truck,
  },
  {
    step: "Step 5",
    title: "Delivery",
    body:
      "The vehicle is delivered to your location and inspected again to ensure everything is in perfect condition.",
    icon: ShieldCheck,
  },
];

const transportOptions = [
  {
    title: "Open Transport",
    body: "Cost-effective and the most common method for standard vehicles.",
    accent: "Most popular",
  },
  {
    title: "Enclosed Transport",
    body: "Premium protection for luxury, classic, or high-value cars.",
    accent: "Extra protection",
  },
] as const;

const costFactors = [
  "Distance",
  "Vehicle size and weight",
  "Transport type: open vs enclosed",
  "Seasonal demand",
  "Pickup and delivery locations",
] as const;

const prepTips = [
  "Clean your car for inspection",
  "Remove personal belongings",
  "Check for existing damage",
  "Keep fuel level low, around one-quarter tank",
  "Disable alarms",
] as const;

const reasonsToChoose = [
  "Trusted carrier network",
  "Fast and transparent quotes",
  "Reliable delivery times",
  "Professional customer support",
] as const;

const faqItems = [
  {
    question: "How long does shipping take?",
    answer: "Shipping time depends on distance, but most deliveries take between 1 and 7 days.",
  },
  {
    question: "Is my vehicle insured?",
    answer: "Yes. All shipments are covered by carrier insurance while your vehicle is in transit.",
  },
  {
    question: "Can I ship personal items?",
    answer: "It is not recommended because personal items are typically restricted and not covered by carrier insurance.",
  },
];

function SectionEyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">{children}</p>;
}

export default function HowToShipACarPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Ship a Car — Simple, Safe & Stress-Free",
    description:
      "Learn how auto transport works and how Quickcar Trucking makes the process fast, reliable, and hassle-free.",
    keywords: ["how to ship a car", "auto transport guide", "car shipping process"],
    mainEntityOfPage: CANONICAL,
    publisher: {
      "@type": "Organization",
      name: "Quickcar Trucking",
      url: "https://quickcartrucking.com",
    },
  };

  return (
    <main className="bg-white text-[#0f172a]">
      <section className="relative overflow-hidden border-b border-black/5 bg-[#f8fbff]">
        <div className="absolute inset-0 bg-[url('/hero/herobg.avif')] bg-cover bg-center opacity-[0.1]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_8%,rgba(255,255,255,0.86)_44%,rgba(248,250,252,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(62,106,225,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(15,23,42,0.08),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6 py-18 sm:py-22 lg:py-28">
          <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-3 py-1 backdrop-blur">
                <SectionEyebrow>Auto Transport Guide</SectionEyebrow>
              </div>

              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-[#0f172a] sm:text-6xl lg:text-7xl">
                How to Ship a Car
                <span className="block text-[clamp(1.7rem,3.2vw,3rem)] font-medium tracking-[-0.04em] text-[#334155] sm:mt-3">
                  Simple, Safe &amp; Stress-Free
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#475569] sm:text-xl">
                Learn how auto transport works and how Quickcar Trucking makes the process fast,
                reliable, and hassle-free.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/quote"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(62,106,225,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_24px_56px_rgba(62,106,225,0.3)]"
                >
                  Get a Free Quote
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={PHONE_HREF}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/80 px-6 py-3.5 text-sm font-semibold text-[#0f172a] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call Now
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3 text-sm text-[#475569]">
                {[
                  "Fast quotes",
                  "Reliable carrier network",
                  "Door-to-door coordination",
                ].map((item) => (
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

      <section className="relative -mt-8 z-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -right-6 top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative rounded-4xl border border-white/70 bg-white/84 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.1)] backdrop-blur sm:p-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                    A Complete Guide to Auto Transport
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0f172a]">
                    Know the process before your vehicle moves.
                  </h2>
                </div>
                <span className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:inline-flex">
                  <SparkleBadge />
                </span>
              </div>

              <p className="mt-6 text-base leading-7 text-[#475569] sm:text-lg">
                Shipping a car may seem complicated, but with the right process and a trusted partner,
                it becomes simple and efficient. At Quickcar Trucking LLC, we handle every step from
                scheduling to delivery so you do not have to worry.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <InfoStat
                  icon={Clock3}
                  title="Clear timeline"
                  body="From booking through delivery, every stage is coordinated and explained."
                />
                <InfoStat
                  icon={ShieldCheck}
                  title="Protected shipment"
                  body="Vehicles move with insured carriers and documented inspections."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <SectionEyebrow>How It Works</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
              A step-by-step car shipping process you can actually follow.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#475569]">
              The process is straightforward when each stage is handled correctly. Here is what to expect
              from quote request to final delivery.
            </p>
          </div>

          <div className="relative mt-14 grid gap-6 lg:grid-cols-5">
            {processSteps.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group relative rounded-[28px] border border-black/6 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_28px_80px_rgba(62,106,225,0.1)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#94a3b8]">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-[#0f172a]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#475569]">{item.body}</p>
                  {index < processSteps.length - 1 ? (
                    <div className="mt-6 h-px bg-linear-to-r from-primary/20 via-primary/10 to-transparent lg:hidden" />
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div>
              <SectionEyebrow>Choose the Right Shipping Option</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                Match the transport method to your vehicle and priorities.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#475569]">
                Most customers choose open transport for value and availability. Enclosed transport is the
                better fit when protection is the top priority.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {transportOptions.map((option, index) => (
                <article
                  key={option.title}
                  className={`rounded-[28px] border p-7 shadow-[0_18px_48px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 ${
                    index === 0
                      ? "border-primary/18 bg-white"
                      : "border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]"
                  }`}
                >
                  <span className="inline-flex rounded-full border border-primary/16 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {option.accent}
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[#0f172a]">
                    {option.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-[#475569]">{option.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-[28px] border border-black/6 bg-[#0f172a] p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:p-10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <CircleDollarSign className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white">What Affects the Cost?</h2>
              <p className="mt-4 text-base leading-7 text-white/75">
                Final pricing depends on the route, your vehicle, the level of protection you choose, and
                market demand at the time of booking.
              </p>
              <div className="mt-8 space-y-3">
                {costFactors.map((factor) => (
                  <div
                    key={factor}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/86"
                  >
                    <BadgeCheck className="h-4 w-4 flex-none text-primary" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[28px] border border-black/6 bg-white p-8 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:p-10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a]">
                Tips to Prepare Your Vehicle
              </h2>
              <p className="mt-4 text-base leading-7 text-[#475569]">
                A few simple steps before pickup make inspection easier, reduce delays, and keep the process
                clean from start to finish.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {prepTips.map((tip) => (
                  <div
                    key={tip}
                    className="rounded-2xl border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-4 text-sm leading-6 text-[#334155]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                        <BadgeCheck className="h-3.5 w-3.5" />
                      </span>
                      <span>{tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
            <div className="max-w-2xl">
              <SectionEyebrow>Why Choose Quickcar Trucking?</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                The process works better when the coordination is better.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#475569]">
                Quickcar Trucking combines a trusted carrier network with responsive communication, clear
                pricing, and delivery coordination built to remove friction.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {reasonsToChoose.map((reason) => (
                <div
                  key={reason}
                  className="rounded-3xl border border-black/6 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_26px_72px_rgba(62,106,225,0.1)]"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#0f172a]">{reason}</h3>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <FAQSection title="Frequently Asked Questions" items={faqItems} />
          </div>

          <div className="rounded-[36px] border border-black/6 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#3e6ae1_140%)] p-8 text-white shadow-[0_34px_100px_rgba(15,23,42,0.2)] sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <SectionEyebrow>Ready to Ship Your Car?</SectionEyebrow>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                  Ready to Ship Your Car?
                </h2>
                <p className="mt-4 text-lg leading-8 text-white/78">
                  Get a fast quote and let professionals handle the rest.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/quote"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#0f172a] transition duration-300 hover:-translate-y-0.5 hover:bg-white/94 hover:shadow-[0_18px_40px_rgba(255,255,255,0.16)]"
                >
                  Get a Quote Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={PHONE_HREF}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/16 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/12"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd),
          }}
        />
      </section>
    </main>
  );
}

function InfoStat({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-[#0f172a]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#475569]">{body}</p>
    </div>
  );
}

function SparkleBadge() {
  return <BadgeCheck className="h-6 w-6" />;
}

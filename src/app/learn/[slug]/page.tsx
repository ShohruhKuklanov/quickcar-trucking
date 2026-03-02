import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HowItWorks } from "@/components/how/HowItWorks";
import { PricingSection } from "@/components/pricing/PricingSection";
import { Reviews } from "@/components/reviews/Reviews";
import { UsaMapSection } from "@/components/journey/UsaMapSection";
import { Services } from "@/components/services/Services";

type LearnSlug =
  | "how-to-ship-a-car"
  | "car-shipping-costs"
  | "cross-country-car-shipping"
  | "trueprice-guarantee"
  | "door-to-door-transport"
  | "open-car-transport"
  | "enclosed-auto-transport"
  | "expedited-auto-transport"
  | "who-we-are"
  | "vision-and-mission"
  | "our-reputation"
  | "reviews"
  | "contact-us"
  | "resources"
  | "help-center";

const LEARN_PAGES: Record<LearnSlug, { title: string; desc: string }> = {
  "how-to-ship-a-car": {
    title: "How to ship a car",
    desc: "A simple, proven process for door-to-door auto transport.",
  },
  "car-shipping-costs": {
    title: "Car shipping costs",
    desc: "How pricing is estimated and how to get a locked-in quote.",
  },
  "cross-country-car-shipping": {
    title: "Cross country car shipping",
    desc: "Long-distance routes, timing expectations, and what affects availability.",
  },
  "trueprice-guarantee": {
    title: "TruePrice Guarantee",
    desc: "Locked-in pricing with no hidden fees.",
  },
  "door-to-door-transport": {
    title: "Door-to-door transport",
    desc: "Pickup and delivery coordinated as close to your address as possible.",
  },
  "open-car-transport": {
    title: "Open car transport",
    desc: "The most common option — fast and cost-effective.",
  },
  "enclosed-auto-transport": {
    title: "Enclosed auto transport",
    desc: "Extra protection for higher-value or specialty vehicles.",
  },
  "expedited-auto-transport": {
    title: "Expedited auto transport",
    desc: "Priority dispatch when you need faster pickup.",
  },
  "who-we-are": {
    title: "Who we are",
    desc: "Experience, standards, and what you can expect when you ship with us.",
  },
  "vision-and-mission": {
    title: "Vision and mission",
    desc: "What we optimize for: clarity, reliability, and great service.",
  },
  "our-reputation": {
    title: "Our reputation",
    desc: "What shippers value: consistency, communication, and verified carriers.",
  },
  reviews: {
    title: "Reviews",
    desc: "Real feedback from customers who shipped with Quickcar.",
  },
  "contact-us": {
    title: "Contact us",
    desc: "Reach a dispatcher and get help fast.",
  },
  resources: {
    title: "Resources",
    desc: "Helpful guides and common answers for car shipping.",
  },
  "help-center": {
    title: "Help center",
    desc: "Support topics and next steps for existing and new shipments.",
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LEARN_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = LEARN_PAGES[slug as LearnSlug];
  if (!page) return { title: "Learn" };
  return {
    title: `${page.title} | Quickcar` ,
    description: page.desc,
  };
}

function PageShell({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <main className="bg-white">
      <section className="relative bg-[url('/hero/herobg.avif')] bg-cover bg-center py-28">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        <div className="relative max-w-6xl mx-auto px-6">
          <p className="text-sm uppercase tracking-wide text-blue-600 mb-4">Quickcar Resources</p>

          <h1 className="text-4xl sm:text-5xl font-semibold mb-6 leading-tight text-gray-900">{title}</h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mb-8 leading-relaxed">{desc}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/quote"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition text-center"
            >
              Get a Quote
            </Link>

            <Link
              href="/#services"
              className="border border-gray-300 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition text-center"
            >
              View Services
            </Link>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-500">
            <span>✔ Fully Insured</span>
            <span>✔ FMCSA Compliant</span>
            <span>✔ Door-to-Door Service</span>
          </div>
        </div>
      </section>

      {children}

      <section className="py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="rounded-2xl border border-black/5 bg-white p-6 md:p-8">
            <h2 className="text-lg font-semibold text-[#111827]">Ready to ship?</h2>
            <p className="mt-2 text-[#111827]/70">
              Get a price estimate and lock in your dispatch window.
            </p>
            <div className="mt-5">
              <Link href="/quote" className="qc-btn qc-btn--primary">
                Start Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function LearnSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug as LearnSlug;
  const page = LEARN_PAGES[slug];
  if (!page) notFound();

  if (slug === "how-to-ship-a-car") {
    return (
      <PageShell title={page.title} desc={page.desc}>
        <HowItWorks />
      </PageShell>
    );
  }

  if (slug === "car-shipping-costs") {
    return (
      <PageShell title={page.title} desc={page.desc}>
        <PricingSection scrollTargetId="quote" />
      </PageShell>
    );
  }

  if (slug === "cross-country-car-shipping") {
    return (
      <PageShell title={page.title} desc={page.desc}>
        <UsaMapSection />
      </PageShell>
    );
  }

  if (
    slug === "door-to-door-transport" ||
    slug === "open-car-transport" ||
    slug === "enclosed-auto-transport" ||
    slug === "expedited-auto-transport"
  ) {
    return (
      <PageShell title={page.title} desc={page.desc}>
        <Services />
      </PageShell>
    );
  }

  if (slug === "reviews") {
    return (
      <PageShell title={page.title} desc={page.desc}>
        <Reviews />
      </PageShell>
    );
  }

  // Minimal informational pages (kept intentionally lean).
  return (
    <PageShell title={page.title} desc={page.desc}>
      <section className="py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="rounded-2xl border border-black/5 bg-white p-6 md:p-8 text-[#111827]">
            <p className="text-[#111827]/70">
              This page is available for quick reference. For the fastest pricing and dispatch options, start a quote.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

import type { Metadata } from "next";

import Link from "next/link";

import ContentSection from "@/components/ContentSection";
import PageCTA from "@/components/PageCTA";
import SEOLayout from "@/components/SEOLayout";
import { states } from "@/lib/states";

const CANONICAL = "https://quickcartrucking.com/auto-transport";

export const metadata: Metadata = {
  title: "Auto Transport by State | Quickcar Trucking",
  description:
    "Browse auto transport pages by state. Licensed and insured car shipping with open and enclosed options from Quickcar Trucking.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Auto Transport by State | Quickcar Trucking",
    description: "Browse car shipping services by state.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
};

export default function AutoTransportIndexPage() {
  return (
    <SEOLayout
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auto Transport" }]}
      title="Auto Transport by State"
      subtitle="Select your state to explore car shipping details, city pages, FAQs, and a fast path to pricing."
    >
      <ContentSection title="Browse states">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {states.map((s) => (
            <Link
              key={s.slug}
              href={`/auto-transport/${s.slug}`}
              className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
            >
              <div className="font-semibold text-gray-900">{s.name}</div>
              <div className="text-sm text-gray-600 mt-1">Car shipping services in {s.name}</div>
            </Link>
          ))}
        </div>
      </ContentSection>

      <ContentSection title="Specialized programs">
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/dealer-auto-transport"
            className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
          >
            <div className="font-semibold text-gray-900">Dealer transport</div>
            <div className="text-sm text-gray-600 mt-1">Volume moves, auctions, dedicated dispatch.</div>
          </Link>
          <Link
            href="/military-pcs-car-shipping"
            className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
          >
            <div className="font-semibold text-gray-900">Military PCS</div>
            <div className="text-sm text-gray-600 mt-1">Professional support for PCS timelines.</div>
          </Link>
          <Link
            href="/snowbird-car-shipping"
            className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
          >
            <div className="font-semibold text-gray-900">Snowbird seasonal</div>
            <div className="text-sm text-gray-600 mt-1">Florida/Arizona routes and peak-season planning.</div>
          </Link>
        </div>
      </ContentSection>

      <PageCTA />
    </SEOLayout>
  );
}

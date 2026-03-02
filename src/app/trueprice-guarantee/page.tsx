import type { Metadata } from "next";

import Link from "next/link";

import ContentSection from "@/components/ContentSection";
import FAQSection from "@/components/FAQSection";
import PageCTA from "@/components/PageCTA";

const CANONICAL = "https://quickcartrucking.com/trueprice-guarantee";

export const metadata: Metadata = {
  title: "TruePrice Guarantee | Quickcar Trucking",
  description:
    "Quickcar Trucking’s TruePrice Guarantee provides transparent, locked-in pricing with clear service terms—no surprises, no hidden fees.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "TruePrice Guarantee | Quickcar Trucking",
    description: "Locked-in pricing with clear terms for your auto shipment.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
};

export default function TruePriceGuaranteePage() {
  return (
    <main>
      <section className="relative bg-[url('/hero/herobg.avif')] bg-cover bg-center py-28">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        <div className="relative max-w-6xl mx-auto px-6">
          <p className="text-sm uppercase tracking-wide text-blue-600 mb-4">Quickcar Auto Transport Guide</p>

          <h1 className="text-4xl sm:text-5xl font-semibold mb-6 leading-tight text-gray-900">
            TruePrice Guarantee
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mb-8 leading-relaxed">
            Premium service should feel predictable. TruePrice is our commitment to clarity—pricing and
            expectations you can understand before you schedule.
          </p>

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

      <section className="max-w-6xl mx-auto px-6 py-24">
        <section className="grid md:grid-cols-2 gap-16">
          <div className="bg-gray-50 p-10 rounded-2xl">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">What it means</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Your quote is built from your route, vehicle details, and timeline. We confirm the service
              level and expectations up front, so you know what you’re paying for and why.
            </p>
          </div>
          <div className="bg-gray-50 p-10 rounded-2xl">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">What it avoids</h2>
            <ul className="text-gray-600 space-y-2 leading-relaxed text-lg">
              <li>• Unclear add-ons at the last minute</li>
              <li>• Confusing pickup window expectations</li>
              <li>• Vague communication during dispatch</li>
              <li>• Hidden broker fees</li>
            </ul>
          </div>
        </section>

        <div className="h-px bg-gray-200 my-20" />

      <ContentSection title="Key benefits">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Transparent inputs</div>
            <p className="mt-2">
              Route, vehicle, and timeline are the levers. You can see what changes pricing.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Clear service levels</div>
            <p className="mt-2">
              Standard, Priority, and Premium Guaranteed are designed around scheduling certainty.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Simple coordination</div>
            <p className="mt-2">
              Dedicated coordination to keep pickup, transit, and delivery aligned.
            </p>
          </div>
        </div>
      </ContentSection>

      <FAQSection
        items={[
          {
            question: "Is TruePrice a guarantee that the quote never changes?",
            answer: "It’s a guarantee of transparency and clarity around the confirmed service terms. Pricing depends on accurate vehicle details, route, and scheduling requirements. If those details change, the quote may change accordingly.",
          },
          {
            question: "What can cause a quote to change?",
            answer: "Common causes include changes to vehicle operability, larger vehicle size than provided, updated pickup/delivery locations, or a significantly different timeline.",
          },
          {
            question: "How do service levels affect pricing?",
            answer: "Tighter pickup windows and guaranteed pickup dates typically cost more because they require higher dispatch priority and reduced scheduling flexibility.",
          },
          {
            question: "Do you charge hidden broker fees?",
            answer: "No. Pricing is presented clearly and we aim to keep costs understandable from the start.",
          },
        ]}
      />

      <ContentSection title="Related guides">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/how-to-ship-a-car"
            className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
          >
            <div className="font-semibold text-gray-900">How to ship a car</div>
            <div className="text-sm text-gray-600 mt-1">Understand the full process.</div>
          </Link>
          <Link
            href="/car-shipping-costs"
            className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
          >
            <div className="font-semibold text-gray-900">Car shipping costs</div>
            <div className="text-sm text-gray-600 mt-1">See how quotes are calculated.</div>
          </Link>
          <Link
            href="/cross-country-car-shipping"
            className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
          >
            <div className="font-semibold text-gray-900">Cross-country car shipping</div>
            <div className="text-sm text-gray-600 mt-1">Plan a long-distance shipment.</div>
          </Link>
        </div>
      </ContentSection>

      <PageCTA />
      </section>
    </main>
  );
}

import type { Metadata } from "next";

import Link from "next/link";

import FAQSection from "@/components/FAQSection";
import PageCTA from "@/components/PageCTA";

const CANONICAL = "https://quickcartrucking.com/how-to-ship-a-car";

export const metadata: Metadata = {
  title: "How to Ship a Car | Quickcar Trucking",
  description:
    "Learn how to ship your car safely and efficiently with Quickcar Trucking. A step-by-step guide to door-to-door auto transport.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "How to Ship a Car | Quickcar Trucking",
    description: "Step-by-step guide to auto transport and safe car shipping.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
};

export default function HowToShipACarPage() {
  return (
    <main>
      <section className="relative bg-[url('/hero/herobg.avif')] bg-cover bg-center py-28">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        <div className="relative max-w-6xl mx-auto px-6">
          <p className="text-sm uppercase tracking-wide text-blue-600 mb-4">Quickcar Auto Transport Guide</p>

          <h1 className="text-4xl sm:text-5xl font-semibold mb-6 leading-tight text-gray-900">
            How to Ship a Car Safely &amp; Efficiently
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mb-8 leading-relaxed">
            A step-by-step breakdown of how professional auto transport works — from quote to delivery —
            with licensed and insured carriers nationwide.
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
        <section className="grid md:grid-cols-2 gap-16 mt-16">
          <div className="bg-gray-50 p-10 rounded-2xl">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">Step-by-step process</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Request a quote, confirm scheduling, assign a carrier, complete a vehicle inspection at pickup,
              then confirm delivery. Throughout the shipment, you’ll have a dedicated coordinator.
            </p>
          </div>

          <div className="bg-gray-50 p-10 rounded-2xl">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">What you’ll need</h2>
            <ul className="text-gray-600 space-y-2 leading-relaxed text-lg">
              <li>• Pickup and delivery ZIPs (or city/state)</li>
              <li>• Vehicle year, make, and model</li>
              <li>• Transport type: open or enclosed</li>
              <li>• Your preferred pickup timeline</li>
            </ul>
          </div>
        </section>

        <div className="h-px bg-gray-200 my-20" />

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900">Key benefits of working with Quickcar</h2>
          <div className="grid md:grid-cols-2 gap-10 text-gray-600 leading-relaxed text-lg">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Door-to-door convenience</h3>
              <p>
                Pickup and delivery are coordinated as close to your address as safely possible, so you don’t
                waste time driving to terminals.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Carrier-vetted and insured</h3>
              <p>
                Ship with confidence—carriers are licensed and insured, and vehicles are inspected at pickup
                and delivery.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear timelines</h3>
              <p>
                Choose a service level that fits your schedule, from flexible pickup windows to premium
                guaranteed options.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Simple communication</h3>
              <p>
                Get a single point of contact for scheduling updates, coordination, and delivery confirmation.
              </p>
            </div>
          </div>
        </section>

        <FAQSection
          items={[
            {
              question: "How long does car shipping take?",
              answer:
                "Transit times depend on distance and lane, typically 3–7 days for most routes. Pickup scheduling can add 1–5 days depending on availability and your service level.",
            },
            {
              question: "What’s the difference between open and enclosed transport?",
              answer:
                "Open transport is the most common and cost-effective option. Enclosed transport adds protection from the elements and is often chosen for high-value, classic, or specialty vehicles.",
            },
            {
              question: "Do I need to be present at pickup and delivery?",
              answer:
                "It’s best if you or a designated representative can be present to release/receive the vehicle and review the inspection report.",
            },
            {
              question: "Can I ship personal items in my car?",
              answer:
                "Many carriers allow limited items, but policies vary and items are typically not covered by carrier cargo insurance. Ask your coordinator for the lane-specific guidance.",
            },
          ]}
        />

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900">Related guides</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/car-shipping-costs"
              className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
            >
              <div className="font-semibold text-gray-900">Car shipping costs</div>
              <div className="text-sm text-gray-600 mt-1">What impacts price and how estimates work.</div>
            </Link>
            <Link
              href="/cross-country-car-shipping"
              className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
            >
              <div className="font-semibold text-gray-900">Cross-country car shipping</div>
              <div className="text-sm text-gray-600 mt-1">Timelines, planning, and best practices.</div>
            </Link>
            <Link
              href="/trueprice-guarantee"
              className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
            >
              <div className="font-semibold text-gray-900">TruePrice Guarantee</div>
              <div className="text-sm text-gray-600 mt-1">Locked-in pricing with clear terms.</div>
            </Link>
          </div>
        </section>

        <PageCTA />
      </section>
    </main>
  );
}

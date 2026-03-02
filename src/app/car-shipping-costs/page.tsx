import type { Metadata } from "next";

import Link from "next/link";

import ContentSection from "@/components/ContentSection";
import FAQSection from "@/components/FAQSection";
import PageCTA from "@/components/PageCTA";

const CANONICAL = "https://quickcartrucking.com/car-shipping-costs";

export const metadata: Metadata = {
  title: "Car Shipping Costs | Quickcar Trucking",
  description:
    "Understand how car shipping costs are calculated—distance, vehicle type, transport method, and seasonality. Get a transparent quote from Quickcar Trucking.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "Car Shipping Costs | Quickcar Trucking",
    description: "What impacts your quote and how to estimate car shipping cost.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
};

export default function CarShippingCostsPage() {
  return (
    <main>
      <section className="relative bg-[url('/hero/herobg.avif')] bg-cover bg-center py-28">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        <div className="relative max-w-6xl mx-auto px-6">
          <p className="text-sm uppercase tracking-wide text-blue-600 mb-4">Quickcar Auto Transport Guide</p>

          <h1 className="text-4xl sm:text-5xl font-semibold mb-6 leading-tight text-gray-900">Car Shipping Costs</h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mb-8 leading-relaxed">
            Car shipping pricing is based on route demand and logistics—not guesswork. Here’s what actually
            affects your quote and how to get the best value without sacrificing reliability.
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
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">What impacts price</h2>
            <ul className="text-gray-600 space-y-2 leading-relaxed text-lg">
              <li>• Distance and lane demand</li>
              <li>• Vehicle size, weight, and operability</li>
              <li>• Open vs enclosed transport</li>
              <li>• Pickup window (flexible vs priority)</li>
              <li>• Seasonality and fuel costs</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-10 rounded-2xl">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">How to reduce cost</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              The best savings usually come from being flexible on pickup timing and choosing open transport.
              If you’re shipping a specialty vehicle or want guaranteed pickup, enclosed/premium options can
              provide better protection and certainty.
            </p>
          </div>
        </section>

        <div className="h-px bg-gray-200 my-20" />

      <ContentSection title="Pricing transparency">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Clear inputs</div>
            <p className="mt-2">
              Quotes reflect your route, vehicle details, and timeline. No confusing add-ons.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Lane-aware</div>
            <p className="mt-2">
              Pricing adjusts based on current carrier availability and route demand.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Service levels</div>
            <p className="mt-2">
              Choose Standard, Priority, or Premium Guaranteed depending on how tight your schedule is.
            </p>
          </div>
        </div>
      </ContentSection>

      <FAQSection
        items={[
          {
            question: "Is enclosed transport worth it?",
            answer: "Enclosed shipping costs more, but it’s often worth it for high-value, classic, exotic, or low-clearance vehicles where extra protection and handling are important.",
          },
          {
            question: "Why do prices change seasonally?",
            answer: "Demand fluctuates throughout the year—moving seasons and weather can affect carrier availability, route congestion, and pricing.",
          },
          {
            question: "How accurate is an online estimate?",
            answer: "Estimates are a strong starting point, but final pricing can depend on real-time lane availability, your vehicle details, and pickup window. A confirmed quote locks in the details.",
          },
          {
            question: "Do non-running vehicles cost more to ship?",
            answer: "Often, yes. Inoperable vehicles may require winching or special equipment, which can increase carrier cost and limit available trucks.",
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
            <div className="text-sm text-gray-600 mt-1">A step-by-step overview of the process.</div>
          </Link>
          <Link
            href="/cross-country-car-shipping"
            className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
          >
            <div className="font-semibold text-gray-900">Cross-country car shipping</div>
            <div className="text-sm text-gray-600 mt-1">Planning for long-distance routes.</div>
          </Link>
          <Link
            href="/trueprice-guarantee"
            className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
          >
            <div className="font-semibold text-gray-900">TruePrice Guarantee</div>
            <div className="text-sm text-gray-600 mt-1">What “locked-in” pricing means.</div>
          </Link>
        </div>
      </ContentSection>

      <PageCTA />
      </section>
    </main>
  );
}

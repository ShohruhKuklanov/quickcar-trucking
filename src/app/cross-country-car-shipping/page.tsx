import type { Metadata } from "next";

import Link from "next/link";

import ContentSection from "@/components/ContentSection";
import FAQSection from "@/components/FAQSection";
import PageCTA from "@/components/PageCTA";

const CANONICAL = "https://quickcartrucking.com/cross-country-car-shipping";

export const metadata: Metadata = {
  title: "Cross Country Car Shipping | Quickcar Trucking",
  description:
    "Cross-country car shipping made simple. Learn timelines, pickup windows, open vs enclosed options, and how to prepare your vehicle with Quickcar Trucking.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "Cross Country Car Shipping | Quickcar Trucking",
    description: "Long-distance auto transport planning, timelines, and tips.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
};

export default function CrossCountryCarShippingPage() {
  return (
    <main>
      <section className="relative bg-[url('/hero/herobg.avif')] bg-cover bg-center py-28">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        <div className="relative max-w-6xl mx-auto px-6">
          <p className="text-sm uppercase tracking-wide text-blue-600 mb-4">Quickcar Auto Transport Guide</p>

          <h1 className="text-4xl sm:text-5xl font-semibold mb-6 leading-tight text-gray-900">
            Cross Country Car Shipping
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mb-8 leading-relaxed">
            For long routes, the details matter—pickup windows, lane demand, and carrier scheduling. Here’s
            what to expect and how to plan for a smooth coast-to-coast shipment.
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
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">Typical timeline</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Cross-country transit commonly takes 5–10 days depending on the lane and weather. Pickup
              scheduling can add 1–5 days based on your service level and availability.
            </p>
          </div>

          <div className="bg-gray-50 p-10 rounded-2xl">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">Best options for long distance</h2>
            <ul className="text-gray-600 space-y-2 leading-relaxed text-lg">
              <li>• Open transport for best value</li>
              <li>• Enclosed transport for premium protection</li>
              <li>• Priority for tighter scheduling</li>
              <li>• Premium Guaranteed for locked-in pickup dates</li>
            </ul>
          </div>
        </section>

        <div className="h-px bg-gray-200 my-20" />

      <ContentSection title="How to prepare for cross-country transport">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Before pickup</h3>
            <ul className="space-y-2">
              <li>• Remove loose personal items</li>
              <li>• Ensure tires are inflated and battery is charged</li>
              <li>• Document existing condition with photos</li>
              <li>• Provide working keys and contact info</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">At delivery</h3>
            <ul className="space-y-2">
              <li>• Review the delivery inspection</li>
              <li>• Confirm vehicle condition matches pickup notes</li>
              <li>• Ask your coordinator any final questions</li>
            </ul>
          </div>
        </div>
      </ContentSection>

      <FAQSection
        items={[
          {
            question: "How far in advance should I book cross-country shipping?",
            answer: "For the best pricing and scheduling, booking 1–2 weeks ahead is ideal. During peak season, earlier is better.",
          },
          {
            question: "Is door-to-door available for cross-country routes?",
            answer: "Yes. Door-to-door is standard when the route is safe and accessible for the truck. In some neighborhoods, a nearby meeting point may be required.",
          },
          {
            question: "What happens if weather impacts the schedule?",
            answer: "Weather can affect carrier routes and safety. If conditions change, your coordinator will provide updates and adjust scheduling to keep the shipment safe and compliant.",
          },
          {
            question: "Does enclosed transport reduce risk for long trips?",
            answer: "Enclosed transport adds protection from road debris and the elements, which many customers prefer for long-distance shipments of high-value vehicles.",
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
            <div className="text-sm text-gray-600 mt-1">The full process, step by step.</div>
          </Link>
          <Link
            href="/car-shipping-costs"
            className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
          >
            <div className="font-semibold text-gray-900">Car shipping costs</div>
            <div className="text-sm text-gray-600 mt-1">Pricing factors and estimate basics.</div>
          </Link>
          <Link
            href="/trueprice-guarantee"
            className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
          >
            <div className="font-semibold text-gray-900">TruePrice Guarantee</div>
            <div className="text-sm text-gray-600 mt-1">Understand locked-in pricing.</div>
          </Link>
        </div>
      </ContentSection>

      <PageCTA />
      </section>
    </main>
  );
}

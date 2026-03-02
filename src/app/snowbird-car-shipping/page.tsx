import type { Metadata } from "next";

import ContentSection from "@/components/ContentSection";
import FAQSection from "@/components/FAQSection";
import PageCTA from "@/components/PageCTA";
import SEOLayout from "@/components/SEOLayout";

const CANONICAL = "https://quickcartrucking.com/snowbird-car-shipping";

export const metadata: Metadata = {
  title: "Snowbird Car Shipping Services | Quickcar Trucking",
  description:
    "Seasonal snowbird car shipping to Florida and Arizona. Plan early, understand seasonal demand pricing, and ship door-to-door with Quickcar Trucking.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Snowbird Car Shipping Services | Quickcar Trucking",
    description: "Seasonal routes, early booking, and transparent snowbird pricing.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
};

export default function SnowbirdCarShippingPage() {
  return (
    <SEOLayout
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Snowbird Car Shipping" }]}
      title="Snowbird Car Shipping Services"
      subtitle="Seasonal routes to Florida and Arizona can book quickly. Plan early, choose the right pickup window, and ship door-to-door with clear expectations."
    >
      <ContentSection title="Seasonal routes">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">NY → FL</div>
            <p className="mt-2 text-gray-600 leading-relaxed">A classic fall migration lane with high demand.</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">IL → AZ</div>
            <p className="mt-2 text-gray-600 leading-relaxed">Common winter relocation route—book early for best options.</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">MI → FL</div>
            <p className="mt-2 text-gray-600 leading-relaxed">Weather and timing influence scheduling in peak season.</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Early booking recommendations">
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          For peak snowbird months, booking 1–3 weeks in advance helps secure availability and smoother
          pickup timing. If your schedule is tight, consider Priority or Premium Guaranteed service.
        </p>
      </ContentSection>

      <ContentSection title="Seasonal demand pricing explained">
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          Seasonal demand changes carrier availability and route congestion. Quotes reflect lane demand at
          the time you book, plus your vehicle details and pickup window.
        </p>
      </ContentSection>

      <FAQSection
        items={[
          {
            question: "When is the best time to book snowbird car shipping?",
            answer:
              "Booking 1–3 weeks ahead is ideal during peak season. Earlier booking typically provides more scheduling options.",
          },
          {
            question: "Do you ship door-to-door for snowbird routes?",
            answer:
              "Yes. Door-to-door is standard when access is safe for the carrier’s truck. If needed, we’ll coordinate a nearby meeting point.",
          },
          {
            question: "Is enclosed transport available for snowbird moves?",
            answer:
              "Yes. Many customers choose enclosed shipping for higher-value vehicles or extra protection during long-distance seasonal moves.",
          },
        ]}
      />

      <PageCTA title="Get a snowbird quote" subtitle="Reserve your seasonal route with a clear pickup plan." />
    </SEOLayout>
  );
}

import type { Metadata } from "next";

import ContentSection from "@/components/ContentSection";
import FAQSection from "@/components/FAQSection";
import PageCTA from "@/components/PageCTA";
import SEOLayout from "@/components/SEOLayout";

const CANONICAL = "https://quickcartrucking.com/military-pcs-car-shipping";

export const metadata: Metadata = {
  title: "Military PCS Car Shipping | Quickcar Trucking",
  description:
    "Professional PCS car shipping support for military moves. Flexible pickup windows, base-to-base coordination, and expedited options with Quickcar Trucking.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Military PCS Car Shipping | Quickcar Trucking",
    description: "Respectful, reliable car shipping support for PCS moves.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Military PCS Car Shipping",
  serviceType: "Vehicle transport support for military PCS moves",
  provider: {
    "@type": "Organization",
    name: "Quickcar Trucking",
    url: "https://quickcartrucking.com",
  },
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
};

export default function MilitaryPCSCarShippingPage() {
  return (
    <SEOLayout
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Military PCS Car Shipping" }]}
      title="Military PCS Car Shipping"
      subtitle="PCS timelines can move fast. We provide professional coordination, flexible pickup options, and clear communication to support your move."
    >
      <ContentSection title="PCS move support">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Base-to-base coordination</h3>
            <p className="text-gray-600 leading-relaxed">
              If access is restricted, we can coordinate a safe nearby meeting point and align pickup/drop-off
              details with your schedule.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible pickup</h3>
            <p className="text-gray-600 leading-relaxed">
              Choose a flexible window for value, or upgrade service level for tighter scheduling when orders
              require it.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Military discounts and expedited options">
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          Ask about military-friendly pricing and expedited scheduling options. We’ll help match service level
          to your reporting date and lane availability.
        </p>
      </ContentSection>

      <FAQSection
        items={[
          {
            question: "How far in advance should I book PCS car shipping?",
            answer:
              "If possible, book 1–2 weeks ahead for the best scheduling flexibility. If orders are short-notice, Priority or Premium options can help reduce uncertainty.",
          },
          {
            question: "Can you pick up on or near a military base?",
            answer:
              "Often yes. If base access restrictions apply, we can coordinate a nearby meeting point that works for both the carrier and your schedule.",
          },
          {
            question: "Do you offer enclosed transport for PCS moves?",
            answer:
              "Yes. Enclosed shipping is available and is often chosen for specialty or high-value vehicles.",
          },
        ]}
      />

      <PageCTA title="Get a PCS quote" subtitle="Get a fast quote and a pickup plan that fits your orders." />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
    </SEOLayout>
  );
}

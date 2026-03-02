import type { Metadata } from "next";

import ContentSection from "@/components/ContentSection";
import FAQSection from "@/components/FAQSection";
import PageCTA from "@/components/PageCTA";
import SEOLayout from "@/components/SEOLayout";

const CANONICAL = "https://quickcartrucking.com/dealer-auto-transport";

export const metadata: Metadata = {
  title: "Dealer Auto Transport Services | Quickcar Trucking",
  description:
    "Dealer auto transport for inventory moves, auction pickups, and bulk logistics. Dedicated dispatch support and volume pricing with Quickcar Trucking.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Dealer Auto Transport Services | Quickcar Trucking",
    description: "Bulk transport solutions, auction pickups, and dedicated dispatch.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Dealer Auto Transport Services",
  serviceType: "Auto transport for dealerships and fleets",
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

export default function DealerAutoTransportPage() {
  return (
    <SEOLayout
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dealer Auto Transport" }]}
      title="Dealer Auto Transport Services"
      subtitle="Move inventory with a dispatch process built for dealers—clear communication, scalable coordination, and routes that match your buying and selling cycles."
    >
      <ContentSection title="Bulk transport solutions">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Inventory moves</div>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Ship single units or multi-vehicle loads between locations with consistent coordination.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Fleet & wholesale</div>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Support for wholesale lanes and reconditioning workflows when timing matters.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Consistent dispatch</div>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Dedicated coordination to keep pickups, ETAs, and delivery confirmations aligned.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Auction pickups">
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          Coordinate pickups from major auctions including Manheim and Copart. We’ll align scheduling,
          carrier assignment, and delivery to your receiving process.
        </p>
      </ContentSection>

      <ContentSection title="Volume pricing">
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          Volume pricing is available based on shipment frequency, lane consistency, and operational needs.
          Get a dedicated setup for repeat routes.
        </p>
      </ContentSection>

      <FAQSection
        items={[
          {
            question: "Can you support recurring dealer lanes?",
            answer:
              "Yes. If you have repeat routes or regular auction pickups, we can align a consistent process and communication workflow.",
          },
          {
            question: "Do you handle enclosed transport for specialty inventory?",
            answer:
              "Yes. Enclosed transport is available for higher-value, classic, or specialty units.",
          },
        ]}
      />

      <PageCTA title="Set up a dealer account" subtitle="Talk to dispatch about volume lanes and dealer workflows." />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
    </SEOLayout>
  );
}

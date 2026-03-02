import type { Metadata } from "next";
import Link from "next/link";

import ContentSection from "@/components/ContentSection";
import PageCTA from "@/components/PageCTA";
import SEOLayout from "@/components/SEOLayout";
import { priorityRoutes, toTitleCaseFromSlug } from "@/lib/routes";

const CANONICAL = "https://quickcartrucking.com/routes";

export const metadata: Metadata = {
  title: "Popular Car Shipping Routes | Quickcar Trucking",
  description: "Explore popular auto transport lanes with estimated distance, timing, and price range.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Popular Car Shipping Routes | Quickcar Trucking",
    description: "Explore popular auto transport lanes with estimated pricing.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
};

export default function RoutesIndexPage() {
  return (
    <SEOLayout
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Routes" }]}
      title="Popular Car Shipping Routes"
      subtitle="Programmatic lane pages with region-adjusted pricing injection."
    >
      <ContentSection title="Priority routes">
        <div className="grid md:grid-cols-2 gap-3">
          {priorityRoutes.map((r) => {
            const originLabel = toTitleCaseFromSlug(r.origin);
            const destLabel = toTitleCaseFromSlug(r.destination);
            const href = `/routes/${r.origin}/${r.destination}`;
            return (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
              >
                <div className="font-semibold text-gray-900">
                  {originLabel} → {destLabel}
                </div>
                <div className="text-sm text-gray-600 mt-1">Estimate pricing and transit time</div>
              </Link>
            );
          })}
        </div>
      </ContentSection>

      <PageCTA />
    </SEOLayout>
  );
}

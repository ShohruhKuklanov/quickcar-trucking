import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ContentSection from "@/components/ContentSection";
import PageCTA from "@/components/PageCTA";
import SEOLayout from "@/components/SEOLayout";
import { distanceBetweenStatesMiles, estimateTransitDays } from "@/lib/route-builder";
import { calculatePrice } from "@/lib/pricingEngine";
import { laneDemandMultiplier } from "@/lib/regionalPricing";
import { getStateBySlug } from "@/lib/states";
import { priorityRoutes, toTitleCaseFromSlug } from "@/lib/routes";

export const dynamicParams = false;

export async function generateStaticParams() {
  return priorityRoutes.map((r) => ({ origin: r.origin, destination: r.destination }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ origin: string; destination: string }>;
}): Promise<Metadata> {
  const { origin, destination } = await params;
  const originLabel = toTitleCaseFromSlug(origin);
  const destLabel = toTitleCaseFromSlug(destination);

  const canonical = `https://quickcartrucking.com/routes/${origin}/${destination}`;
  const title = `Car Shipping from ${originLabel} to ${destLabel} | Quickcar Trucking`;
  const description = `Get an estimated price and transit time for car shipping from ${originLabel} to ${destLabel}. Door-to-door auto transport with open and enclosed options.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Quickcar Trucking",
      type: "website",
    },
  };
}

export default async function RoutePage({
  params,
}: {
  params: Promise<{ origin: string; destination: string }>;
}) {
  const { origin, destination } = await params;
  const originState = getStateBySlug(origin);
  const destinationState = getStateBySlug(destination);
  if (!originState || !destinationState) notFound();

  const miles = distanceBetweenStatesMiles(originState.abbr, destinationState.abbr);
  if (!miles) notFound();

  const demandMultiplier = laneDemandMultiplier(originState, destinationState);

  const { totalPrice, ratePerMile } = calculatePrice({
    distance: miles,
    vehicleType: "sedan",
    pickup: originState.abbr,
    delivery: destinationState.abbr,
    demandMultiplier,
  });

  const estimateLow = Math.round(totalPrice * 0.9);
  const estimateHigh = Math.round(totalPrice * 1.1);
  const transit = estimateTransitDays(miles);

  const originLabel = originState.name;
  const destLabel = destinationState.name;

  return (
    <SEOLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Routes" },
        { label: originLabel },
        { label: destLabel },
      ]}
      title={`Car Shipping from ${originLabel} to ${destLabel}`}
      subtitle={`Estimated distance: ${Math.round(miles)} miles. Typical transit: ${transit.label}.`}
    >
      <ContentSection title="Instant estimate">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="text-sm text-gray-500">Estimated price range</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">
              ${estimateLow.toLocaleString()} – ${estimateHigh.toLocaleString()}
            </div>
            <div className="mt-1 text-sm text-gray-600">Based on a sedan, open transport</div>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="text-sm text-gray-500">Rate per mile</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">${ratePerMile.toFixed(2)}</div>
            <div className="mt-1 text-sm text-gray-600">Includes regional lane demand</div>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="text-sm text-gray-500">Transit time</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">{transit.label}</div>
            <div className="mt-1 text-sm text-gray-600">Scheduling varies by availability</div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="What affects the price on this lane">
        <ul className="text-gray-600 space-y-2 leading-relaxed">
          <li>• Distance and route demand</li>
          <li>• Vehicle type and operability</li>
          <li>• Open vs enclosed transport</li>
          <li>• Pickup window flexibility</li>
          <li>• Seasonal capacity (snowbird periods, holidays)</li>
        </ul>
        <div className="mt-6 text-sm text-gray-600">
          Want a live quote? <Link href="/quote" className="text-[rgb(var(--primary-rgb))] hover:underline">Get a quote</Link>.
        </div>
      </ContentSection>

      <PageCTA />
    </SEOLayout>
  );
}

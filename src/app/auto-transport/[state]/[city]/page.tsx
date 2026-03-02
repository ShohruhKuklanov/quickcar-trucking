import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CityContent from "@/components/CityContent";
import SEOLayout from "@/components/SEOLayout";
import { cityNameToSlug, getStateBySlug, states } from "@/lib/states";

function toTitleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return {};

  const city = toTitleCaseFromSlug(citySlug);
  const canonical = `https://quickcartrucking.com/auto-transport/${state.slug}/${citySlug}`;

  const title = `Car Shipping from ${city}, ${state.abbr} | Quickcar Trucking`;
  const description = `Reliable auto transport services from ${city}, ${state.abbr}. Door-to-door shipping nationwide.`;

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

export async function generateStaticParams() {
  return states.flatMap((state) =>
    state.exampleCities.map((cityName) => ({
      state: state.slug,
      city: cityNameToSlug(cityName),
    }))
  );
}

export default async function CityAutoTransportPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();

  const city = toTitleCaseFromSlug(citySlug);

  const relatedCities = state.exampleCities
    .filter((c) => cityNameToSlug(c) !== citySlug)
    .slice(0, 4)
    .map((c) => ({
      label: `${c}, ${state.abbr}`,
      href: `/auto-transport/${state.slug}/${cityNameToSlug(c)}`,
    }));

  return (
    <SEOLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Auto Transport", href: "/auto-transport" },
        { label: state.name, href: `/auto-transport/${state.slug}` },
        { label: city },
      ]}
      title={`Ship a Car from ${city}, ${state.name}`}
      subtitle={`Door-to-door auto transport from ${city}, ${state.abbr}. Get a fast quote for open or enclosed shipping with clear scheduling options.`}
    >
      <CityContent state={state} city={city} relatedCities={relatedCities} />
    </SEOLayout>
  );
}

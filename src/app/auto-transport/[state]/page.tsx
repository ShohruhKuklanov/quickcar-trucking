import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SEOLayout from "@/components/SEOLayout";
import StateContent from "@/components/StateContent";
import { getStateContentCached } from "@/lib/aiContent";
import { getStateBySlug, states } from "@/lib/states";

export const dynamicParams = false;

export async function generateStaticParams() {
  return states.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return {};

  const canonical = `https://quickcartrucking.com/auto-transport/${state.slug}`;
  const title = `Car Shipping in ${state.name} | Quickcar Trucking`;
  const description = `Licensed and insured car shipping services in ${state.name}. Get a fast and reliable auto transport quote today.`;

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

export default async function StateAutoTransportPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();

  const aiContent = await getStateContentCached(state.name);

  return (
    <SEOLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Auto Transport", href: "/auto-transport" },
        { label: state.name },
      ]}
      title={`Car Shipping Services in ${state.name}`}
      subtitle={`Door-to-door auto transport across ${state.name}. Choose open or enclosed shipping and get a transparent quote in minutes.`}
    >
      <StateContent state={state} aiContent={aiContent} />
    </SEOLayout>
  );
}

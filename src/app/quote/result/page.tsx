import QuoteResultClient from "./QuoteResultClient";

export const dynamic = "force-dynamic";

export default async function QuoteResultPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <QuoteResultClient q={q} />;
}

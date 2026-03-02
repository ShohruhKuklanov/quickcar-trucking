import type { Metadata } from "next";
import Link from "next/link";

import ContentSection from "@/components/ContentSection";
import PageCTA from "@/components/PageCTA";
import SEOLayout from "@/components/SEOLayout";
import { getClusterTopics, slugifyTopic } from "@/lib/blogGenerator";

const CANONICAL = "https://quickcartrucking.com/blog";

export const metadata: Metadata = {
  title: "Car Shipping Blog | Quickcar Trucking",
  description: "AI-assisted guides about car shipping routes, pricing factors, and transport options.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Car Shipping Blog | Quickcar Trucking",
    description: "Guides about car shipping routes, pricing, and timing.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const topics = getClusterTopics();

  return (
    <SEOLayout
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      title="Car Shipping Blog"
      subtitle="Programmatic cluster content to build topical authority across routes and pricing questions."
    >
      <ContentSection title="Topics">
        <div className="grid md:grid-cols-2 gap-3">
          {topics.map((topic) => (
            <Link
              key={topic}
              href={`/blog/${slugifyTopic(topic)}`}
              className="rounded-2xl border border-black/5 bg-white p-5 hover:border-black/10 transition"
            >
              <div className="font-semibold text-gray-900">{topic}</div>
              <div className="text-sm text-gray-600 mt-1">AI-generated SEO article</div>
            </Link>
          ))}
        </div>
      </ContentSection>

      <PageCTA />
    </SEOLayout>
  );
}

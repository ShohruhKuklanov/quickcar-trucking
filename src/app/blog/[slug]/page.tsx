import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ContentSection from "@/components/ContentSection";
import PageCTA from "@/components/PageCTA";
import SEOLayout from "@/components/SEOLayout";
import { getBlogPostCached, getClusterTopics, getTopicBySlug, slugifyTopic } from "@/lib/blogGenerator";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getClusterTopics().map((topic) => ({ slug: slugifyTopic(topic) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};

  const canonical = `https://quickcartrucking.com/blog/${slug}`;
  const title = `${topic} | Quickcar Trucking`;
  const description = `SEO guide: ${topic}. Learn pricing factors, timing tips, and how to ship a car reliably.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Quickcar Trucking",
      type: "article",
    },
  };
}

function renderMarkdownAsText(markdown: string) {
  // Minimal safe rendering without extra dependencies: keep formatting readable.
  // (If you want full Markdown rendering later, we can add react-markdown.)
  return (
    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{markdown}</div>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const content = await getBlogPostCached(topic);

  return (
    <SEOLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: topic },
      ]}
      title={topic}
      subtitle="AI-generated guide tailored to auto transport lanes and pricing factors."
    >
      <ContentSection title="Article">
        {renderMarkdownAsText(content)}
        <div className="mt-8 text-sm text-gray-600">
          Ready to ship? <Link href="/quote" className="text-[rgb(var(--primary-rgb))] hover:underline">Get a quote</Link>.
        </div>
      </ContentSection>

      <PageCTA />
    </SEOLayout>
  );
}

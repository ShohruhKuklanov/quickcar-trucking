import "server-only";

import { unstable_cache } from "next/cache";

import { priorityRoutes } from "@/lib/routes";

function parseOpenAIResponsesText(data: unknown): string {
  if (!data || typeof data !== "object") return "";

  const output = "output" in data ? (data as { output?: unknown }).output : undefined;
  if (!Array.isArray(output) || output.length === 0) return "";

  const first = output[0];
  if (!first || typeof first !== "object") return "";

  const content = "content" in first ? (first as { content?: unknown }).content : undefined;
  if (!Array.isArray(content) || content.length === 0) return "";

  const firstContent = content[0];
  if (!firstContent || typeof firstContent !== "object") return "";

  const text = "text" in firstContent ? (firstContent as { text?: unknown }).text : undefined;
  return typeof text === "string" ? text.trim() : "";
}

export function slugifyTopic(topic: string) {
  return topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getClusterTopics() {
  const routeTopics = priorityRoutes.map(
    (r) => `How much does it cost to ship a car from ${r.origin.replace(/-/g, " ")} to ${r.destination.replace(/-/g, " ")}?`
  );

  return [
    ...routeTopics,
    "Best time to ship a car to Florida",
    "Enclosed vs open car transport in Texas",
    "Seasonal car shipping tips for snowbirds",
  ];
}

export function getTopicBySlug(slug: string) {
  return getClusterTopics().find((t) => slugifyTopic(t) === slug) ?? null;
}

function fallbackBlogPost(topic: string) {
  return `# ${topic}\n\nThis article is being generated. Check back soon, or request an instant quote at /quote.`;
}

export async function generateBlogPost(topic: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackBlogPost(topic);

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: `Write a ~1500-word SEO blog post about: ${topic}\n\nRequirements:\n- Use Markdown\n- Use clear H2 headings (##)\n- Include a short FAQ section\n- Include internal linking suggestions (as plain URLs)\n- Keep it specific to auto transport / car shipping\n- Avoid fluff and repetition`,
    }),
    cache: "no-store",
  });

  if (!res.ok) return fallbackBlogPost(topic);

  const data = (await res.json()) as unknown;
  const text = parseOpenAIResponsesText(data);
  return text || fallbackBlogPost(topic);
}

export async function getBlogPostCached(topic: string) {
  return unstable_cache(() => generateBlogPost(topic), ["ai-blog-post", slugifyTopic(topic)], {
    revalidate: false,
  })();
}

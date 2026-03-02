import "server-only";

import { unstable_cache } from "next/cache";

import { getStateBySlug } from "@/lib/states";

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

function fallbackStateContent(stateSlugOrName: string): string {
  const state = getStateBySlug(stateSlugOrName);
  const label = state?.name ?? stateSlugOrName;
  const cities = state?.exampleCities?.length ? state.exampleCities.join(", ") : "major metros";

  return [
    `Quickcar Trucking provides door-to-door car shipping across ${label} with open and enclosed options.`,
    "",
    `Local market context: pricing and scheduling vary by lane demand, seasonality, and how flexible your pickup window is.`,
    "",
    `Major cities we frequently coordinate pickups near: ${cities}.`,
    "",
    "Popular routes: regional moves to nearby states and long-haul cross-country lanes depending on demand.",
    "",
    "Pricing factors: distance, vehicle type/operability, transport type (open vs enclosed), and lane demand.",
    "",
    "Why choose Quickcar: licensed and insured carriers, inspection at pickup/delivery, and a single point of contact for scheduling and updates.",
  ].join("\n");
}

export async function generateStateContent(state: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackStateContent(state);

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: `Generate unique SEO-optimized content for car shipping services in ${state}.
Include:
- Local market context
- Major cities
- Popular routes
- Pricing factors
- Why choose Quickcar
Avoid generic repetitive content.
Output plain text (no markdown).`,
    }),
    cache: "no-store",
  });

  if (!res.ok) return fallbackStateContent(state);

  const data = (await res.json()) as unknown;
  const text = parseOpenAIResponsesText(data);
  return text || fallbackStateContent(state);
}

export async function getStateContentCached(state: string) {
  // Build-time caching when used from SSG routes; also avoids duplicate calls in worker contexts.
  return unstable_cache(() => generateStateContent(state), ["ai-state-content", state], {
    revalidate: false,
  })();
}

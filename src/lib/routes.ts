export const priorityRoutes = [
  { origin: "new-york", destination: "florida" },
  { origin: "california", destination: "texas" },
  { origin: "illinois", destination: "arizona" },
] as const;

export type PriorityRoute = (typeof priorityRoutes)[number];

export function toTitleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

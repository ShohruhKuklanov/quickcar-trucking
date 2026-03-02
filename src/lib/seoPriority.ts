import type { StateEntry } from "@/lib/states";

export type StateSEOMetrics = {
  quoteVolume: number; // e.g., monthly quote requests
  conversionRate: number; // 0..1
  revenue: number; // e.g., monthly revenue
};

export type StatePriorityScore = StateSEOMetrics & {
  stateSlug: string;
  priorityScore: number;
};

export function computePriorityScore(metrics: StateSEOMetrics) {
  const quoteVolume = Number.isFinite(metrics.quoteVolume) ? metrics.quoteVolume : 0;
  const conversionRate = Number.isFinite(metrics.conversionRate) ? metrics.conversionRate : 0;
  const revenue = Number.isFinite(metrics.revenue) ? metrics.revenue : 0;

  return quoteVolume * 0.4 + conversionRate * 0.3 + revenue * 0.3;
}

export function scoreStatesByPriority(
  states: StateEntry[],
  metricsByState: Record<string, StateSEOMetrics>
): StatePriorityScore[] {
  return states
    .map((s) => {
      const metrics = metricsByState[s.slug] ?? { quoteVolume: 0, conversionRate: 0, revenue: 0 };
      return {
        stateSlug: s.slug,
        ...metrics,
        priorityScore: computePriorityScore(metrics),
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

// Placeholder metrics (wire to your DB/analytics later).
export const exampleMetricsByState: Record<string, StateSEOMetrics> = {
  florida: { quoteVolume: 1200, conversionRate: 0.065, revenue: 180000 },
  california: { quoteVolume: 1500, conversionRate: 0.055, revenue: 230000 },
  texas: { quoteVolume: 1100, conversionRate: 0.06, revenue: 170000 },
  "new-york": { quoteVolume: 900, conversionRate: 0.05, revenue: 160000 },
};

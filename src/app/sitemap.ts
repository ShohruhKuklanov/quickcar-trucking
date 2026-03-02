import type { MetadataRoute } from "next";

import { getClusterTopics, slugifyTopic } from "@/lib/blogGenerator";
import { priorityRoutes } from "@/lib/routes";
import { cityNameToSlug, states } from "@/lib/states";

const siteUrl = "https://quickcartrucking.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/quote`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/how-to-ship-a-car`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/car-shipping-costs`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/cross-country-car-shipping`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/trueprice-guarantee`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${siteUrl}/auto-transport`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/routes`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/dealer-auto-transport`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${siteUrl}/military-pcs-car-shipping`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${siteUrl}/snowbird-car-shipping`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
  ];

  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${siteUrl}/auto-transport/${s.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const cityPages: MetadataRoute.Sitemap = states.flatMap((s) =>
    s.exampleCities.map((cityName) => ({
      url: `${siteUrl}/auto-transport/${s.slug}/${cityNameToSlug(cityName)}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.55,
    }))
  );

  const routePages: MetadataRoute.Sitemap = priorityRoutes.map((r) => ({
    url: `${siteUrl}/routes/${r.origin}/${r.destination}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = getClusterTopics().map((topic) => ({
    url: `${siteUrl}/blog/${slugifyTopic(topic)}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...statePages, ...cityPages, ...routePages, ...blogPages];
}

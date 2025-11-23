import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://dripdrops.app/",
      priority: 1,
      changeFrequency: "daily",
    },
    {
      url: "https://dripdrops.app/drops",
      priority: 0.8,
      changeFrequency: "hourly",
    },
  ];
}

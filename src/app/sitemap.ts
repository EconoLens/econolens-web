import { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity";

// Refresh hourly so newly published articles show up in the sitemap without
// waiting for a full redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.econolens.co.in";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/articles`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/indicators`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/study`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // GEO/SEO fix (2026-07-11): this sitemap previously listed only the 10 static
  // routes above and never included individual articles, so every /news/{slug}
  // page was discoverable only by crawling on-site links, not via the sitemap
  // that search + AI crawlers actually read first. Pull every published
  // (qaStatus === "passed") article in directly.
  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const articles: { slug: string; publishedAt?: string }[] = await sanityClient.fetch(
      `*[_type == "article" && qaStatus == "passed" && defined(slug.current)]{ "slug": slug.current, publishedAt }`
    );
    articleEntries = articles
      .filter((a) => a.slug)
      .map((a) => ({
        url: `${baseUrl}/news/${a.slug}`,
        lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
  } catch {
    // If Sanity is unreachable at build time, fail soft to the static routes
    // rather than breaking sitemap.xml entirely.
  }

  return [...staticEntries, ...articleEntries];
}

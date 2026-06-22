import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.econolens.co.in";
  const now = new Date();
  return [
    { url: baseUrl,                           lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${baseUrl}/articles`,             lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${baseUrl}/news`,                 lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${baseUrl}/indicators`,           lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${baseUrl}/study`,                lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${baseUrl}/about`,                lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/pricing`,              lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`,              lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/terms`,                lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/disclaimer`,           lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];
}

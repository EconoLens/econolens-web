mport { NextResponse } from 'next/server'
import { getLatestArticles } from '@/lib/sanity'
 
// RSS/Atom feed for readers, aggregators, and AI/news crawlers. Reuses the
// same Sanity query pattern as sitemap.ts. Added 2026-09-03 — EconoLens
// previously had no outbound feed of its own (only ingested official RSS
// from the Fed/IMF/RBI for content ideation via /api/news).
export const revalidate = 3600
 
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
 
export async function GET() {
  const baseUrl = 'https://www.econolens.co.in'
 
  let articles: any[] = []
  try {
    articles = await getLatestArticles(30)
  } catch {
    articles = []
  }
 
  const items = articles
    .filter((a) => a?.slug?.current)
    .map((a) => {
      const link = `${baseUrl}/news/${a.slug.current}`
      const title = escapeXml(a.title || 'EconoLens')
      const rawSummary = Array.isArray(a.summary) ? a.summary[0] : a.summary
      const description = escapeXml(rawSummary || '')
      const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : new Date().toUTCString()
      const category = a.category?.title ? `\n      <category>${escapeXml(a.category.title)}</category>` : ''
      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>${category}
    </item>`
    })
    .join('\n')
 
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EconoLens — World Economics Intelligence</title>
    <link>${baseUrl}</link>
    <description>Economics news, research, and macro indicators grounded in official sources — RBI, IMF, World Bank, Fed, and top research institutions.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`
 
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}

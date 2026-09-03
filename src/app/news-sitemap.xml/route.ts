import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'
 
// Google News sitemap. Separate from the general sitemap.ts on purpose:
// Google's News program requires a distinct format (news: namespace,
// news:publication/news:publication_date/news:title) and, per Google's own
// spec, only articles published in the last 48 hours should be listed here.
// Added 2026-09-03.
export const revalidate = 900
 
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
 
type NewsArticleRow = { slug: string; title: string; publishedAt?: string }
 
export async function GET() {
  const baseUrl = 'https://www.econolens.co.in'
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
 
  let articles: NewsArticleRow[] = []
  try {
    articles = await sanityClient.fetch(
      `*[_type == "article" && qaStatus == "passed" && defined(slug.current) && publishedAt > $since]{ "slug": slug.current, title, publishedAt }`,
      { since }
    )
  } catch {
    articles = []
  }
 
  const urls = articles
    .filter((a) => a.slug)
    .map((a) => {
      const loc = `${baseUrl}/news/${a.slug}`
      const pubDate = a.publishedAt || new Date().toISOString()
      const title = escapeXml(a.title || 'EconoLens')
      return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>EconoLens</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`
    })
    .join('\n')
 
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`
 
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
 

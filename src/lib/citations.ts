/**
 * Citation string builders for the "Cite This Article" tool on /news/[slug].
 * Uses the real article fields from src/lib/sanity.ts's ARTICLE_FULL_PROJECTION
 * (author.name, author.credentials, publishedAt) — no invented field shapes.
 */

interface CitableArticle {
  title: string
  slug: string
  publishedAt: string
  authorName: string
}

const SITE_URL = 'https://econolens.co.in'

function formatDate(iso: string, style: 'apa' | 'harvard' | 'chicago'): string {
  const d = new Date(iso)
  const year = d.getUTCFullYear()
  const month = d.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' })
  const day = d.getUTCDate()

  if (style === 'apa') return `(${year}, ${month} ${day})`
  if (style === 'harvard') return `${year}`
  return `${month} ${day}, ${year}`
}

export function buildCitations(article: CitableArticle) {
  const url = `${SITE_URL}/news/${article.slug}`
  const author = article.authorName || 'EconoLens Editorial Team'
  const accessDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return {
    apa: `${author}. ${formatDate(article.publishedAt, 'apa')}. ${article.title}. EconoLens. ${url}`,
    harvard: `${author} (${formatDate(article.publishedAt, 'harvard')}) '${article.title}', EconoLens. Available at: ${url} (Accessed: ${accessDate}).`,
    chicago: `${author}. "${article.title}." EconoLens. Published ${formatDate(article.publishedAt, 'chicago')}. ${url}.`,
  }
}

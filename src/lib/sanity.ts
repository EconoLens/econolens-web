/**
 * EconoLens — Sanity Client + GROQ Queries
 * All data fetching from Sanity CMS goes through this file.
 * ISR is configured per-fetch (revalidate: 900 for articles).
 */

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// ─── CLIENT ───────────────────────────────────────────────────────────────────

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rvv43603',  // rvv43603
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',        // production
  apiVersion: '2026-05-31',
  useCdn: true,  // CDN for reads (fast + cached). Use token for writes.
})

// Write client — server-side only (uses secret token)
export const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rvv43603',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-05-31',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,  // Editor token — server only
})

// ─── IMAGE URL BUILDER ────────────────────────────────────────────────────────

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ─── GROQ QUERIES ─────────────────────────────────────────────────────────────

// Article projection — reused across queries
const ARTICLE_PROJECTION = `{
  _id,
  title,
  slug,
  articleType,
  summary,
  publishedAt,
  coverImage,
  accessLevel,
  ga4Views,
  featured,
  focusKeyword,
  metaDescription,
  metaTitle,
  "category": category->{ title, slug, icon, color },
  "author": author->{ name, slug, photo, credentials, badgeLevel },
  isAiGenerated,
  aiLabel,
  qaStatus,
  copyscapeScore,
  indiaContext,
  audioUrl,
  paperAuthors,
  paperSource,
  paperUrl,
  paperPublishedDate,
  noindex
}`

// Live charts (chartEmbed blocks) reference economicIndicator documents; expand
// those references so ChartEmbed.tsx receives the series config and any
// manually maintained observations. All other blocks pass through unchanged.
const BODY_BLOCK_PROJECTION = `{
  ...,
  _type == "chartEmbed" => {
    "indicators": indicators[]->{ name, "slug": slug.current, unit, country, indicatorType, frequency, fredSeriesId, fredUnits, fredFrequency, sourceUrl, observations }
  }
}`

const ARTICLE_FULL_PROJECTION = `{
  ...,
  "layerOne": layerOne[]${BODY_BLOCK_PROJECTION},
  "layerTwo": layerTwo[]${BODY_BLOCK_PROJECTION},
  "layerThree": layerThree[]${BODY_BLOCK_PROJECTION},
  "category": category->{ title, slug, icon, color },
  "author": author->{ name, slug, photo, bio, credentials, badgeLevel, socialLinks },
  "relatedArticles": relatedArticles[]->{ title, slug, coverImage, articleType, publishedAt }
}`

// ── Article Queries ───────────────────────────────────────────────────────────

/** Latest articles for homepage — ISR 15 min */
export async function getLatestArticles(limit = 10) {
  return sanityClient.fetch(
    `*[_type == "article" && qaStatus == "passed"] | order(publishedAt desc) [0...$limit] ${ARTICLE_PROJECTION}`,
    { limit: limit - 1 },
    { next: { revalidate: 900 } }
  )
}

/** News feed (homepage + /articles) — every published article except Study
 *  guides, which live in the /study library instead. ISR 15 min */
export async function getLatestNews(limit = 10) {
  return sanityClient.fetch(
    `*[_type == "article" && qaStatus == "passed" && category->slug.current != "study"] | order(publishedAt desc) [0...$limit] ${ARTICLE_PROJECTION}`,
    { limit: limit - 1 },
    { next: { revalidate: 900 } }
  )
}

/** Single article by slug — ISR 15 min */
export async function getArticleBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug][0] ${ARTICLE_FULL_PROJECTION}`,
    { slug },
    { next: { revalidate: 900 } }
  )
}

/** Articles by type (for section pages) */
export async function getArticlesByType(articleType: string, limit = 20) {
  return sanityClient.fetch(
    `*[_type == "article" && articleType == $articleType && qaStatus == "passed"] | order(publishedAt desc) [0...$limit] ${ARTICLE_PROJECTION}`,
    { articleType, limit: limit - 1 },
    { next: { revalidate: 900 } }
  )
}

/** Study guides for the /study library. Text spans come back so the page can
 *  compute a reading time; no GROQ string functions, which keeps the query
 *  plain and identical on the CDN and the live API. */
export async function getStudyGuides() {
  return sanityClient.fetch(
    `*[_type == "article" && category->slug.current == "study" && qaStatus == "passed"] | order(publishedAt desc) {
      _id, title, "slug": slug.current, summary, publishedAt,
      "t1": layerOne[].children[].text,
      "t2": layerTwo[].children[].text,
      "t3": layerThree[].children[].text
    }`,
    {},
    { next: { revalidate: 300 } }
  )
}

/** Articles by category slug */
export async function getArticlesByCategory(categorySlug: string, limit = 20) {
  return sanityClient.fetch(
    `*[_type == "article" && category->slug.current == $categorySlug && qaStatus == "passed"] | order(publishedAt desc) [0...$limit] ${ARTICLE_PROJECTION}`,
    { categorySlug, limit: limit - 1 },
    { next: { revalidate: 900 } }
  )
}

/** Top articles by GA4 views — for newsletter curation */
export async function getTopArticlesByViews(limit = 5, daysBack = 7) {
  const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString()
  return sanityClient.fetch(
    `*[_type == "article" && qaStatus == "passed" && publishedAt > $since] | order(ga4Views desc) [0...$limit] ${ARTICLE_PROJECTION}`,
    { since, limit: limit - 1 },
    { next: { revalidate: 3600 } }
  )
}

/** Contributor profile for /authors/[slug] (2026-10-14). */
export async function getContributorBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "contributor" && slug.current == $slug][0]{
      _id, name, "slug": slug.current, credentials, institution, photo, bio, socialLinks
    }`,
    { slug },
    { next: { revalidate: 900 } }
  )
}

/** Published articles by one contributor, newest first. */
export async function getArticlesByAuthor(authorId: string, limit = 60) {
  return sanityClient.fetch(
    `*[_type == "article" && qaStatus == "passed" && author._ref == $authorId] | order(publishedAt desc) [0...$limit] ${ARTICLE_PROJECTION}`,
    { authorId, limit },
    { next: { revalidate: 900 } }
  )
}

/** Contributors with at least one published article — for /authors. */
export async function getContributorsWithArticles() {
  return sanityClient.fetch(
    `*[_type == "contributor" && defined(slug.current)]{
      name, "slug": slug.current, credentials,
      "count": count(*[_type == "article" && qaStatus == "passed" && references(^._id)])
    }[count > 0] | order(count desc)`,
    {},
    { next: { revalidate: 900 } }
  )
}

/** Every logged correction across published articles — for /corrections. */
export async function getCorrections() {
  return sanityClient.fetch(
    `*[_type == "article" && qaStatus == "passed" && count(corrections) > 0]{
      title, "slug": slug.current,
      "items": corrections[]{ date, note }
    }`,
    {},
    { next: { revalidate: 900 } }
  )
}

/** All slugs — for generateStaticParams */
export async function getAllArticleSlugs() {
  return sanityClient.fetch(
    `*[_type == "article" && qaStatus == "passed"]{ "slug": slug.current }`,
    {},
    { next: { revalidate: 900 } }
  )
}

/** Featured articles for homepage hero */
export async function getFeaturedArticles() {
  return sanityClient.fetch(
    `*[_type == "siteSettings"][0].homepageFeaturedArticles[]-> ${ARTICLE_PROJECTION}`,
    {},
    { next: { revalidate: 900 } }
  )
}

// ── Count (for CCO daily check) ───────────────────────────────────────────────

/** Count articles published today — used by T-16 site health check */
export async function countArticlesToday(): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const result = await sanityClient.fetch(
    `count(*[_type == "article" && publishedAt >= $today])`,
    { today: today.toISOString() }
  )
  return result
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getAllCategories() {
  return sanityClient.fetch(
    `*[_type == "category"] | order(order asc) { title, slug, icon, color, description }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ── Economic Indicators ───────────────────────────────────────────────────────

export async function getFeaturedIndicators() {
  return sanityClient.fetch(
    `*[_type == "economicIndicator" && featured == true] | order(order asc)`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ── Site Settings ─────────────────────────────────────────────────────────────

export async function getSiteSettings() {
  return sanityClient.fetch(
    `*[_type == "siteSettings"][0]`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ── Write: Update GA4 views (called by Make.com flow) ────────────────────────

export async function updateArticleGa4Views(sanityId: string, views: number) {
  return sanityWriteClient.patch(sanityId).set({ ga4Views: views }).commit()
}

/** Update QA status from Make.com or Cowork QA check */
export async function updateArticleQaStatus(
  sanityId: string,
  qaStatus: 'passed' | 'failed' | 'regenerated',
  copyscapeScore?: number
) {
  const patch = sanityWriteClient.patch(sanityId).set({ qaStatus })
  if (copyscapeScore !== undefined) {
    patch.set({ copyscapeScore })
  }
  return patch.commit()
}

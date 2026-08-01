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
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,  // rvv43603
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,        // production
  apiVersion: '2026-05-31',
  useCdn: true,  // CDN for reads (fast + cached). Use token for writes.
})

// Write client — server-side only (uses secret token)
export const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
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
  "category": category->{ title, slug, icon, color },
  "author": author->{ name, slug, photo, credentials, badgeLevel },
  isAiGenerated,
  aiLabel,
  qaStatus,
  copyscoreScore,
  indiaContext,
  audioUrl,
  paperAuthors,
  paperSource,
  paperUrl,
  paperPublishedDate
}`

const ARTICLE_FULL_PROJECTION = `{
  ...,
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

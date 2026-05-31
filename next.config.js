/** @type {import('next').NextConfig} */

/**
 * EconoLens — Next.js Configuration
 * Cache strategy (T-12 mandate: PageSpeed ≥ 90 ALL pages):
 *
 *  Route type          ISR revalidate   HTTP cache
 *  ─────────────────── ──────────────── ──────────────────────────────
 *  /news/[slug]        900s (15 min)    s-maxage=900, stale-while-revalidate=3600
 *  /dashboard/*        3600s (1 hr)     s-maxage=3600, stale-while-revalidate=86400
 *  /api/fred/*         3600s            s-maxage=3600, stale-while-revalidate=86400
 *  /api/ai-query       no cache         no-store (personalised + rate-limited)
 *  /api/webhooks/*     no cache         no-store (payment/event webhooks)
 *  Static pages        false            immutable (Next.js handles)
 */

const nextConfig = {
  // ── TypeScript + ESLint (hard errors in CI) ──────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // ── Image optimization ───────────────────────────────────────────────────
  images: {
    formats: ['image/webp', 'image/avif'],
    // Add Sanity CDN so next/image can optimise Sanity images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  // ── HTTP cache headers ───────────────────────────────────────────────────
  async headers() {
    return [
      // News articles — 15 min fresh, 1 hr stale-while-revalidate
      {
        source: '/news/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=900, stale-while-revalidate=3600',
          },
        ],
      },
      // Dashboards and data pages — 1 hr fresh, 24 hr stale
      {
        source: '/dashboard/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      // FRED data API — 1 hr (data doesn't change more often)
      {
        source: '/api/fred/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      // AI query — never cache (personalised, rate-limited)
      {
        source: '/api/ai-query',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
      // Webhooks — never cache
      {
        source: '/api/webhooks/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
      // Static assets — immutable (Next.js adds content hash to filenames)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // ── Experimental: faster builds ──────────────────────────────────────────
  experimental: {
    // Parallel route processing (App Router)
    serverActions: {
      allowedOrigins: ['econolens.co.in', 'localhost:3000'],
    },
  },
}

module.exports = nextConfig

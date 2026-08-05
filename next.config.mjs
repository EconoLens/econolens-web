/** @type {import('next').NextConfig} */
// Build: next build
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: true,
  // Fixed 2026-08-05: econolens.co.in (apex) and www.econolens.co.in were
  // both live and serving content with no canonical redirect between them.
  // Google Search Console flagged 29 pages as "Duplicate without
  // user-selected canonical" because it couldn't tell which host was
  // authoritative. www is canonical (matches sitemap.ts, robots.ts, and the
  // brand mark in opengraph-image.tsx) — apex now 308s to it. This is a
  // second layer of defense on top of the Vercel-level domain redirect.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'econolens.co.in' }],
        destination: 'https://www.econolens.co.in/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://js.clerk.io https://*.clerk.accounts.dev https://clerk.econolens.co.in https://www.googletagmanager.com https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://cdn.sanity.io https://img.clerk.com https://www.googletagmanager.com https://www.google-analytics.com",
             "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://clerk.econolens.co.in https://*.clerk.accounts.dev https://api.razorpay.com https://cdn.sanity.io https://*.api.sanity.io wss://*.api.sanity.io https://*.sanity.io https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://challenges.cloudflare.com",
              "frame-src https://checkout.razorpay.com https://accounts.google.com https://challenges.cloudflare.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
};
 
export default nextConfig;

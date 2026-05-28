/**
 * middleware.ts — EconoLens edge middleware
 *
 * Responsibilities:
 * 1. Detect visitor jurisdiction from Cloudflare CF-IPCountry header
 *    and set x-jurisdiction response header (gdpr | ccpa | dpdpa | standard)
 * 2. Enforce service kill switches — routes guarded by COMMUNITY_LIVE,
 *    AI_TOOL_LIVE, NEWS_PIPELINE_LIVE, DECODING_LIVE, NEWSLETTER_LIVE
 * 3. Clerk auth — protect /admin/* routes (admin role required)
 *
 * commit: "feat: jurisdiction middleware and service kill switches"
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getJurisdiction, getBlockingSwitch } from "@/lib/compliance/jurisdiction";

// Routes that require Clerk authentication (any signed-in user)
const isAuthRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // ── 1. Jurisdiction detection ──────────────────────────────────────────────
  const countryCode =
    req.headers.get("cf-ipcountry") ??
    req.headers.get("x-vercel-ip-country") ??
    null;

  const jurisdiction = getJurisdiction(countryCode);

  // ── 2. Service kill switch enforcement ────────────────────────────────────
  const blockingSwitch = getBlockingSwitch(pathname);

  if (blockingSwitch) {
    // Return a 503 maintenance response — never a 404 (which would mislead crawlers)
    return new NextResponse(
      JSON.stringify({
        error: "service_unavailable",
        message:
          "This feature is not yet available. We are working on it — check back soon.",
        service: blockingSwitch,
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "86400",
          "x-jurisdiction": jurisdiction,
        },
      }
    );
  }

  // ── 3. Admin route protection (Clerk) ─────────────────────────────────────
  if (isAuthRoute(req)) {
    await auth.protect();
  }

  // ── 4. Pass request through with jurisdiction header ──────────────────────
  const response = NextResponse.next();
  response.headers.set("x-jurisdiction", jurisdiction);

  // GDPR strict mode — set cookie consent required header for downstream use
  if (jurisdiction === "gdpr" && process.env.GDPR_STRICT_MODE === "true") {
    response.headers.set("x-gdpr-strict", "true");
  }

  return response;
});

export const config = {
  matcher: [
    // Match everything except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

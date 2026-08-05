import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/articles(.*)',
  '/news(.*)',
  '/about(.*)',
  '/pricing(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/disclaimer(.*)',
  '/research(.*)',
  '/papers(.*)',
  '/indicators(.*)',
  '/study(.*)',
  '/studio(.*)',
  '/dashboard(.*)',
  '/subscribe(.*)',
  '/api/webhooks(.*)',
  '/api/indicators(.*)',
  '/api/newsletter(.*)',
  // Fixed 2026-07-12: sitemap.xml, robots.txt, and llms.txt are Next.js
  // metadata routes, not pages — they were falling through to
  // auth.protect() because they weren't in this allowlist AND the matcher
  // below didn't exclude .xml/.txt extensions, so Clerk's middleware was
  // invoking auth.protect() on a non-page route and throwing
  // MIDDLEWARE_INVOCATION_FAILED (confirmed live: /sitemap.xml, /robots.txt
  // were both returning 500 in production). Listed explicitly here as a
  // second layer of defense on top of the matcher fix below.
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  // Fixed 2026-08-05: /contact is not a real route (Contact is a mailto:
  // link in the footer) but Google had crawled it, presumably from an old
  // link or bookmark. Because it wasn't in this allowlist, auth.protect()
  // was invoked on a non-existent route and threw MIDDLEWARE_INVOCATION_FAILED
  // (confirmed live 500, GSC flagged it as a Server error (5xx)). Adding it
  // here lets the request fall through to Next.js's normal 404 handling.
  '/contact',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Fixed 2026-07-12: added xml|txt to the excluded-extensions list.
    // Metadata files (sitemap.xml, robots.txt, llms.txt, RSS feeds, etc.)
    // should never go through auth middleware at all — this is the primary
    // fix; the isPublicRoute entries above are belt-and-suspenders.
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    "/(api|trpc)(.*)",
  ],
};

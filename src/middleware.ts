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
  '/shop(.*)',
  '/refund-policy',
  '/delivery-policy',
  '/indicators(.*)',
  '/study(.*)',
  '/studio(.*)',
  '/dashboard(.*)',
  '/subscribe(.*)',
  '/api/webhooks(.*)',
  '/api/indicators(.*)',
  '/api/newsletter(.*)',
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/contact(.*)',
  '/editorial-policy(.*)',
  '/connect(.*)',
  '/authors(.*)',
  '/corrections(.*)',
  '/fact-checking-methodology(.*)',
  ]);

// Only API routes are protected here. Pages have no sign-in requirement (accounts
// were removed 2026-10-10), and protecting unlisted page paths made every unknown
// URL, and the root /opengraph-image, return a 500 instead of the 404 page.
const isApiRoute = createRouteMatcher(['/api(.*)', '/trpc(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (isApiRoute(request) && !isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    "/(api|trpc)(.*)",
    ],
};

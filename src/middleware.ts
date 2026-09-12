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
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/contact(.*)',
  '/editorial-policy(.*)',
  ]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    "/(api|trpc)(.*)",
    ],
};

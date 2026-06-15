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
  '/indicators(.*)',
  '/study(.*)',
  '/studio(.*)',
  '/dashboard(.*)',
  '/subscribe(.*)',
  '/api/webhooks(.*)',
  '/api/indicators(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

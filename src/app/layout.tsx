import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const BASE_URL = "https://www.econolens.co.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "EconoLens | India Economics News & AI Research",
    template: "%s | EconoLens",
  },
  description:
    "India-focused economics news and AI-powered research. Monetary policy, fiscal data, market analysis, and global economic events — all in one lens.",
  keywords: [
    "India economy",
    "RBI monetary policy",
    "economic indicators",
    "GDP growth",
    "inflation India",
    "AI economics research",
    "fiscal policy",
    "stock market India",
  ],
  authors: [{ name: "EconoLens" }],
  creator: "EconoLens",
  publisher: "EconoLens",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "EconoLens",
    title: "EconoLens | India Economics News & AI Research",
    description:
      "India-focused economics news and AI-powered research. Monetary policy, fiscal data, market analysis, and global economic events.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EconoLens — India Economics Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EconoLens | India Economics News & AI Research",
    description:
      "AI-powered economics news and research for India. Monetary policy, markets, trade, and more.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <head>
          <meta name="theme-color" content="#2563eb" />
        </head>
        <body className="min-h-screen bg-white text-neutral-900 antialiased">
          {children}
      <footer className="border-t border-neutral-100 py-8 mt-16">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} EconoLens. All rights reserved.</p>
          <nav className="flex gap-6">
            <a href="/about" className="hover:text-neutral-900 transition-colors">About</a>
            <a href="/pricing" className="hover:text-neutral-900 transition-colors">Pricing</a>
            <a href="/contact" className="hover:text-neutral-900 transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-neutral-900 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-neutral-900 transition-colors">Terms</a>
          </nav>
        </div>
      </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}

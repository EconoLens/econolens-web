import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "EconoLens — Economics News & Analysis",
  description:
    "Independent economics journalism for India. Policy, markets, and monetary economics explained clearly.",
  metadataBase: new URL("https://econolens.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Load Google Fonts at runtime in browser */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap"
          />
        </head>
        <body className="bg-white text-gray-900 font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

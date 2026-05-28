import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

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
      <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
        <body className="bg-white text-gray-900 font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

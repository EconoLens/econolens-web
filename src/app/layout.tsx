import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EconoLens - Global Economics Intelligence",
  description: "AI-assisted analysis of monetary policy, fiscal data, and global economic events.",
  metadataBase: new URL("https://econolens.co.in"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "EconoLens",
  description:
    "India-focused economics news and research. AI-assisted analysis of monetary policy, fiscal data, and global economic events.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className="min-h-screen bg-white text-neutral-900 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Karla, Space_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-karla",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EconoLens — Global Economics Intelligence",
  description: "Official press releases and data from central banks, IMF, World Bank, and governments worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${cormorant.variable} ${karla.variable} ${spaceMono.variable}`}>
        <body>
          {/* Gold ticker bar */}
          <div className="ticker-bar">
            <span>Official Sources Only</span>
            <span className="ticker-dot">·</span>
            <span>Central Banks</span>
            <span className="ticker-dot">·</span>
            <span>IMF</span>
            <span className="ticker-dot">·</span>
            <span>World Bank</span>
            <span className="ticker-dot">·</span>
            <span>Governments</span>
            <span className="ticker-dot">·</span>
            <span>No Newspapers. No Wire Copy.</span>
          </div>

          {/* Navigation */}
          <nav className="site-nav">
            <div className="nav-inner">
              <a href="/" className="site-wordmark">
                Econo<em>Lens</em>
              </a>
              <div className="nav-links">
                <a href="/articles" className="nav-link">Articles</a>
                <a href="/indicators" className="nav-link">Indicators</a>
                <a href="/research" className="nav-link">Research</a>
                <a href="/about" className="nav-link">About</a>
              </div>
              <div className="nav-actions">
                <a href="/sign-in" className="btn-outline btn-sm">Sign In</a>
                <a href="/sign-up" className="btn-primary btn-sm">Subscribe</a>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main>{children}</main>

          <SpeedInsights />

          {/* Footer */}
          <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-top">
                <div className="footer-brand">
                  <span className="footer-wordmark">Econo<em>Lens</em></span>
                  <p className="footer-tagline">Global economics intelligence from official sources only.</p>
                </div>
                <div className="footer-cols">
                  <div className="footer-col">
                    <h4>Sources</h4>
                    <a href="https://www.federalreserve.gov" target="_blank" rel="noreferrer">US Federal Reserve</a>
                    <a href="https://www.ecb.europa.eu" target="_blank" rel="noreferrer">European Central Bank</a>
                    <a href="https://www.imf.org" target="_blank" rel="noreferrer">IMF</a>
                    <a href="https://www.worldbank.org" target="_blank" rel="noreferrer">World Bank</a>
                    <a href="https://www.rbi.org.in" target="_blank" rel="noreferrer">Reserve Bank of India</a>
                  </div>
                  <div className="footer-col">
                    <h4>Platform</h4>
                    <a href="/articles">Articles</a>
                    <a href="/indicators">Indicators</a>
                    <a href="/research">Research</a>
                    <a href="/about">About</a>
                  </div>
                  <div className="footer-col">
                    <h4>Account</h4>
                    <a href="/sign-in">Sign In</a>
                    <a href="/sign-up">Subscribe</a>
                  </div>
                </div>
              </div>
              <div className="footer-bottom">
                <span>© 2025 EconoLens. All rights reserved.</span>
                <span>Data sourced exclusively from official government and institutional publications.</span>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}

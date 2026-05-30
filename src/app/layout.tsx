import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "EconoLens — Global Economics Intelligence",
  description: "Authoritative economics news sourced exclusively from governments, central banks, and international institutions.",
  metadataBase: new URL("https://econolens.co.in"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Karla:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Gold ticker bar */}
        <div className="ticker-bar">
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", gap: 32, alignItems: "center" }}>
            <span>Official Sources Only</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>Central Banks · IMF · World Bank · Governments</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>No newspapers. No wire copy.</span>
          </div>
        </div>

        {/* Main nav */}
        <nav className="site-nav">
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
            <Link href="/" className="site-wordmark">
              Econo<span>Lens</span>
            </Link>
            <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
              <Link href="/articles">Articles</Link>
              <Link href="/indicators">Indicators</Link>
              <Link href="/research">Research</Link>
              <Link href="/about">About</Link>
              <Link href="/subscribe" style={{
                background: "var(--accent)",
                color: "var(--ink)",
                padding: "7px 18px",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
                Subscribe
              </Link>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        {/* Footer */}
        <footer className="site-footer">
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
              <div>
                <div className="site-wordmark" style={{ fontSize: 28, display: "inline-block", marginBottom: 12 }}>
                  Econo<span>Lens</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 8, maxWidth: 280 }}>
                  Authoritative economics news sourced exclusively from governments, central banks, and international institutions.
                </p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14 }}>Coverage</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link href="/articles">Latest Articles</Link>
                  <Link href="/indicators">Economic Indicators</Link>
                  <Link href="/research">AI Research</Link>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14 }}>Sources</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <a href="https://www.rbi.org.in" target="_blank" rel="noopener">RBI</a>
                  <a href="https://www.federalreserve.gov" target="_blank" rel="noopener">US Federal Reserve</a>
                  <a href="https://www.imf.org" target="_blank" rel="noopener">IMF</a>
                  <a href="https://www.worldbank.org" target="_blank" rel="noopener">World Bank</a>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14 }}>Company</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link href="/about">About</Link>
                  <Link href="/pricing">Pricing</Link>
                  <Link href="/privacy">Privacy</Link>
                  <Link href="/terms">Terms</Link>
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
              <span>© 2026 EconoLens. All rights reserved.</span>
              <span>All content sourced from official government and institutional press releases.</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import './globals.css'
import Script from 'next/script'
import FollowLinks from '@/components/FollowLinks'
import CookieConsent from '@/components/CookieConsent'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'EconoLens — World Economics Intelligence',
    template: '%s | EconoLens',
  },
  description:
    'Economics news, research, and macro indicators grounded in official sources — RBI, IMF, World Bank, Fed, and top research institutions.',
  metadataBase: new URL('https://www.econolens.co.in'),
  openGraph: {
    siteName: 'EconoLens',
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', site: '@EconoLens' },
  robots: { index: true, follow: true },
}

// NOTE (2026-07-08): the old hardcoded TICKER_ITEMS array + <Ticker /> component
// was removed here. It rendered fixed, never-changing numbers (SENSEX, NIFTY, GOLD,
// etc.) on every single page under an aria-label of "Live market data" — none of it
// was real. Real live figures now live only on /indicators, which is backed by
// src/app/api/indicators/route.ts (FRED for global series; India series are static
// and clearly labeled as manually maintained there, not faked as live).
//
// If a real site-wide ticker is wanted again, it needs an actual market-data feed
// (e.g. NSE/BSE index API) — do not restore this with placeholder numbers.

// GEO fix (2026-07-11): site-wide Organization structured data. Without this,
// AI engines (ChatGPT, Perplexity, Google AI Overviews) and search crawlers have
// no machine-readable signal for what EconoLens is, who publishes it, or which
// social profiles are authoritative — they're left guessing from prose alone.
const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EconoLens',
  legalName: 'Econolens Media and Technology',
  url: 'https://www.econolens.co.in',
  description:
    'Economics news, research, and macro indicators grounded in official sources — RBI, IMF, World Bank, Fed, and top research institutions.',
  sameAs: [
    'https://www.linkedin.com/company/econolens',
    'https://www.instagram.com/econolens.sm',
    'https://whatsapp.com/channel/0029Vb7hxHZK5cDCOXI4ff1p',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@econolens.co.in',
    contactType: 'editorial',
  },
}

const NAV_LINKS = [
  { href: '/articles', label: 'News' },
  { href: '/indicators', label: 'Indicators' },
  { href: '/study', label: 'Study' },
  { href: '/papers', label: 'Research' },
  { href: '/about', label: 'About' },
]

function Navbar() {
  return (
    <nav className="nav-bar" role="navigation" aria-label="Main navigation">
      <div className="nav-inner">
        <a href="/" className="nav-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
            <polyline points="4,26 14,18 22,24 36,8" stroke="#C4902A" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="4" cy="26" r="3.2" fill="none" stroke="#C4902A" strokeWidth="2.6" />
            <circle cx="14" cy="18" r="3.2" fill="none" stroke="#C4902A" strokeWidth="2.6" />
            <circle cx="22" cy="24" r="3.2" fill="none" stroke="#C4902A" strokeWidth="2.6" />
            <circle cx="36" cy="8" r="3.2" fill="none" stroke="#C4902A" strokeWidth="2.6" />
          </svg>
          <span>Econo<span>Lens</span><sup style={{ fontSize: '0.55em', marginLeft: '1px' }}>&trade;</sup></span>
        </a>
        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav-link">{link.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <SignedOut>
            <a href="/sign-in" className="nav-signin">Sign in</a>
            <a href="/sign-up" className="btn-subscribe">Sign up</a>
          </SignedOut>
          <SignedIn>
            <a href="/dashboard" className="nav-signin">Dashboard</a>
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}

function DatelineBar() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase()
  return (
    <div className="dateline-bar">
      <span className="dateline-text">{dateStr}</span>
      <span className="dateline-edition">GLOBAL ECONOMICS INTELLIGENCE</span>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' }}>
          <div>
            <div className="footer-logo">Econo<span>Lens</span></div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '10px', lineHeight: '1.6', maxWidth: '260px' }}>
              World economics intelligence. Original analysis grounded in official sources — RBI, IMF, World Bank, Fed, and NBER.
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginTop: '16px', textTransform: 'uppercase' }}>
              Econolens Media and Technology · Sole Proprietorship
            </p>
            <div style={{ marginTop: '18px' }}>
              <FollowLinks placement="footer" variant="compact" />
              <a href="/connect" className="footer-link" style={{ marginTop: '10px' }}>All channels →</a>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '14px' }}>Platform</p>
            <a href="/articles" className="footer-link">News</a>
            <a href="/indicators" className="footer-link">Indicators</a>
            <a href="/study" className="footer-link">Study</a>
            <a href="/papers" className="footer-link">Research</a>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '14px' }}>Company</p>
            <a href="/about" className="footer-link">About</a>
            <a href="/about#founders" className="footer-link">Founders</a>
            <a href="/about#mission" className="footer-link">Mission</a>
            <a href="/contact" className="footer-link">Contact</a>
            <a href="/editorial-policy" className="footer-link">Editorial Policy</a>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '14px' }}>Legal</p>
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/disclaimer" className="footer-link">Disclaimer</a>
            <a href="/privacy#cookies" className="footer-link">Cookie Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-legal">© 2026 ECONOLENS MEDIA AND TECHNOLOGY. ALL RIGHTS RESERVED.</span>
          <span className="footer-legal">SOURCES: RBI · IMF · WORLD BANK · NBER · ECB · FED</span>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=IBM+Plex+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
          {/*
            Google Consent Mode default — MUST run before the gtag.js loader and
            before the gtag('config', ...) call below, so analytics/ad storage
            start out denied until CookieConsent.tsx calls gtag('consent','update').
            Added 2026-07-08 alongside the consent banner; previously there was no
            consent infrastructure at all despite linking to a Cookie Policy page.
          */}
          <Script id="consent-default" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});" }} />
          {/* GEO fix (2026-07-11): site-wide Organization JSON-LD — see ORGANIZATION_JSON_LD above */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
          />
          {/* AdSense fix (2026-09-07): Auto ads was already ON in the AdSense dashboard,
              but the actual serving script was never added to the site — so no ads could
              show even after Google approves the site. Added to enable ad serving once approved. */}
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1336796462553106"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        </head>
        <body style={{ background: 'var(--ink)', color: 'var(--text-primary)' }}>
          <Navbar />
          <DatelineBar />
          <main>{children}</main>
          <Footer />
          <CookieConsent />
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-JKGQJFE2X0" strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-JKGQJFE2X0');" }} />
        </body>
      </html>
    </ClerkProvider>
  )
}

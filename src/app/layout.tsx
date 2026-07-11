import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import './globals.css'
import Script from 'next/script'
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
  metadataBase: new URL('https://econolens.co.in'),
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
  url: 'https://econolens.co.in',
  description:
    'Economics news, research, and macro indicators grounded in official sources — RBI, IMF, World Bank, Fed, and top research institutions.',
  sameAs: [
    'https://x.com/EconoLens',
    'https://linkedin.com/company/econolens',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'khagankp@gmail.com',
    contactType: 'editorial',
  },
}

const NAV_LINKS = [
  { href: '/articles', label: 'News' },
  { href: '/indicators', label: 'Indicators' },
  { href: '/study', label: 'Study' },
  { href: '/pricing', label: 'Pricing' },
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
            <a href="/pricing" className="btn-subscribe">Subscribe</a>
          </SignedOut>
          <SignedIn>
            <a href="/dashboard" className="nav-signin">Dashboard</a>
            <a href="/pricing" className="btn-subscribe">Upgrade</a>
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

const SOCIAL_LINKS = [
  {
    href: 'https://x.com/EconoLens',
    label: 'X',
    icon: (<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>),
  },
  {
    href: 'https://linkedin.com/company/econolens',
    label: 'LinkedIn',
    icon: (<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>),
  },
]

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
            <div style={{ display: 'flex', gap: '8px', marginTop: '18px', flexWrap: 'wrap' }}>
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: '0.5px solid var(--ink-border)', padding: '5px 10px' }}>
                  {s.icon}{s.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '14px' }}>Platform</p>
            <a href="/articles" className="footer-link">News</a>
            <a href="/indicators" className="footer-link">Indicators</a>
            <a href="/study" className="footer-link">Study</a>
            <a href="/pricing" className="footer-link">Pricing</a>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '14px' }}>Company</p>
            <a href="/about" className="footer-link">About</a>
            <a href="/about#founders" className="footer-link">Founders</a>
            <a href="/about#mission" className="footer-link">Mission</a>
            <a href="mailto:khagankp@gmail.com" className="footer-link">Contact</a>
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

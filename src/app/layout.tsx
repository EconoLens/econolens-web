import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import './globals.css'

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
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

/* ── Ticker items — static; replace with real API data when live ── */
const TICKER_ITEMS = [
  { label: 'SENSEX', value: '82,453', change: '+0.34%', pos: true },
  { label: 'NIFTY 50', value: '25,102', change: '+0.21%', pos: true },
  { label: 'USD/INR', value: '₹83.42', change: '−0.08%', pos: false },
  { label: 'RBI REPO', value: '6.50%', change: 'HOLD', neutral: true },
  { label: 'CPI', value: '4.1%', change: '▼0.3', pos: true },
  { label: 'GDP', value: '6.4%', change: '▲0.2', pos: true },
  { label: 'WTI OIL', value: '$78.20', change: '+1.2%', pos: true },
  { label: 'GOLD', value: '$2,380', change: '+0.6%', pos: true },
  { label: 'US 10Y', value: '4.42%', change: '−0.04', pos: true },
  { label: 'BSE SMALL', value: '47,210', change: '+0.58%', pos: true },
]

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="ticker-wrap" aria-label="Live market data">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-label">{item.label}</span>
            <span className="ticker-value">{item.value}</span>
            <span
              className={`ticker-change ${
                item.neutral ? 'delta-neu' : item.pos ? 'delta-pos' : 'delta-neg'
              }`}
            >
              {item.change}
            </span>
            {i < doubled.length - 1 && <span className="ticker-sep" aria-hidden />}
          </span>
        ))}
      </div>
    </div>
  )
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
        <a href="/" className="nav-logo">
          Econo<span>Lens</span>
        </a>
        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <SignedOut>
            <a href="/sign-in" className="nav-signin">Sign in</a>
            <a href="/pricing" className="btn-subscribe">Subscribe ₹199</a>
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
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
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
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '14px' }}>Platform</p>
            <a href="/articles" className="footer-link">News</a>
            <a href="/indicators" className="footer-link">Indicators</a>
            <a href="/study" className="footer-link">Study</a>
            <a href="/pricing" className="footer-link">Pricing</a>
            <a href="/articles?type=paper" className="footer-link">Research</a>
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
          <link
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=IBM+Plex+Mono:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body style={{ background: 'var(--ink)', color: 'var(--text-primary)' }}>
          <Ticker />
          <Navbar />
          <DatelineBar />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}

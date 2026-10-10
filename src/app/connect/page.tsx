import type { Metadata } from 'next'
import FollowLinks from '@/components/FollowLinks'

export const metadata: Metadata = {
  title: 'Stay Connected',
  description:
    'Follow EconoLens on WhatsApp, LinkedIn and Instagram for economist-explained analysis of the global economy, built on data.',
  alternates: { canonical: 'https://www.econolens.co.in/connect' },
}

// One hub page for every follow channel. The QR code (public/connect-qr.svg)
// points here, the Instagram bio links here, and printed material can use it too.
export default function ConnectPage() {
  return (
    <section style={{ padding: '56px 0 80px' }}>
      <div className="container-narrow" style={{ maxWidth: '760px', margin: '0 auto' }}>
        <header style={{ marginBottom: '28px' }}>
          <p className="label-mono" style={{ marginBottom: '12px' }}>Stay connected</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 600, lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Economics, explained with data — <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>wherever you read.</em>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            Pick the channel you already use. Every new Study guide, research explainer and analysis piece is shared there as soon as it is published.
          </p>
        </header>

        <FollowLinks placement="connect_page" />

        {/* QR only helps on a large screen: a phone cannot scan its own display. */}
        <div className="connect-qr" style={{ marginTop: '40px', display: 'flex', gap: '24px', alignItems: 'center', borderTop: '0.5px solid var(--ink-border)', paddingTop: '32px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/connect-qr.svg" alt="QR code linking to econolens.co.in/connect" width={148} height={148} style={{ background: '#fff', padding: '6px' }} />
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Reading on a computer?</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '380px' }}>
              Scan this with your phone camera to open this page there, then tap the channel you want to follow.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

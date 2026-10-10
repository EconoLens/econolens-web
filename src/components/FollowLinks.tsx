'use client'

import { CHANNELS, channelUrl, type ChannelId } from '@/lib/social'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

const ICONS: Record<ChannelId, JSX.Element> = {
  whatsapp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 01-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 01-1.44-5c0-5.19 4.23-9.42 9.43-9.42a9.36 9.36 0 016.66 2.76 9.36 9.36 0 012.76 6.67c0 5.2-4.23 9.42-9.43 9.42zm8.02-17.44A11.28 11.28 0 0012.05.75C5.8.75.7 5.84.7 12.1c0 2 .52 3.95 1.52 5.67L.6 23.25l5.6-1.47a11.3 11.3 0 005.84 1.49h.01c6.25 0 11.34-5.09 11.35-11.35a11.28 11.28 0 00-3.33-8.03z" />
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 01-1.38-.9 3.72 3.72 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 00-2.13 1.38A5.88 5.88 0 00.63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.88 5.88 0 002.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 002.13-1.38 5.88 5.88 0 001.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 00-1.38-2.13A5.88 5.88 0 0019.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
    </svg>
  ),
}

function trackFollow(channel: ChannelId, placement: string) {
  // Recorded as a GA4 event so follows can be marked as a key event and
  // compared by placement (footer / article / homepage / connect page).
  window.gtag?.('event', 'follow_click', { channel, placement })
}

interface Props {
  /** Where on the site this row sits — becomes the UTM campaign and GA4 placement. */
  placement: string
  /** compact = small pill row (footer); full = large buttons with a short blurb. */
  variant?: 'compact' | 'full'
}

export default function FollowLinks({ placement, variant = 'full' }: Props) {
  if (variant === 'compact') {
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {CHANNELS.map((c) => (
          <a
            key={c.id}
            href={channelUrl(c, placement)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c.cta}
            onClick={() => trackFollow(c.id, placement)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: '0.5px solid var(--ink-border)', padding: '5px 10px' }}
          >
            {ICONS[c.id]}
            {c.label}
          </a>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
      {CHANNELS.map((c) => (
        <a
          key={c.id}
          href={channelUrl(c, placement)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackFollow(c.id, placement)}
          style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '18px 20px', border: '0.5px solid var(--ink-border)', background: 'var(--ink-mid)', textDecoration: 'none', color: 'var(--text-primary)', minHeight: '44px' }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--gold)' }}>
            {ICONS[c.id]}
            {c.cta} →
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.blurb}</span>
        </a>
      ))}
    </div>
  )
}

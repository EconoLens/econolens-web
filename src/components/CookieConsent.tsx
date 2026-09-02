'use client'

import { useEffect, useState } from 'react'

// Real consent gate, not a decorative banner. Google Consent Mode defaults to
// "denied" for analytics/ad storage (see the inline gtag snippet added in
// layout.tsx, which must run BEFORE the gtag config script). This component:
//   1. Shows a banner on first visit if no choice has been recorded yet.
//   2. On Accept, calls gtag('consent','update', {...granted}) so GA4 actually
//      starts sending storage-backed hits from that point on.
//   3. On Decline, leaves consent denied (GA4 still receives cookieless pings
//      under Google's Basic Consent Mode, but no storage/personalisation).
//   4. Remembers the choice in localStorage so the banner doesn't reappear.
//
// This addresses "you have a Cookie Policy link but no consent infrastructure"
// — flagged 2026-07-08 ahead of an AdSense submission. If you plan to run
// AdSense/personalised ads specifically, revisit whether Basic vs Advanced
// consent mode and the exact wording here meet Google's EU User Consent Policy
// for your actual traffic mix at that time — this is a solid baseline, not a
// substitute for reading that policy yourself before submitting.
//
// Updated 2026-09-02: banner copy now names advertising cookies (not just
// analytics) to match the Cookie Policy's AdSense disclosure — see
// src/app/privacy/page.tsx commit 4efc1a0.

const STORAGE_KEY = 'econolens_cookie_consent'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(STORAGE_KEY)
      if (!existing) setVisible(true)
    } catch {
      // localStorage unavailable (e.g. blocked) — don't block rendering on it
      setVisible(true)
    }
  }, [])

  function updateConsent(granted: boolean) {
    const value = granted ? 'granted' : 'denied'
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: value,
        ad_storage: value,
        ad_user_data: value,
        ad_personalization: value,
      })
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied')
    } catch {
      // ignore storage failures — consent choice still applies for this session
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: 'var(--ink)',
        borderTop: '1px solid var(--ink-border)',
        padding: '16px 20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '640px', lineHeight: 1.5 }}>
        We use cookies for analytics, and — where enabled — advertising (including Google AdSense),
        to understand how EconoLens is used and to support the site. See our{' '}
        <a href="/privacy#cookies" style={{ color: 'var(--gold)' }}>Cookie Policy</a> for details. You can accept or decline non-essential cookies below.
      </p>
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <button
          onClick={() => updateConsent(false)}
          className="btn-outline"
          style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          Decline
        </button>
        <button
          onClick={() => updateConsent(true)}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer', border: 'none' }}
        >
          Accept
        </button>
      </div>
    </div>
  )
}

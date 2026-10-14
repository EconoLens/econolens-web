import type { ReactNode } from 'react'

// Shared layout for the trust pages (fact-checking methodology, corrections,
// authors). Same look as /editorial-policy. Added 2026-10-14.

export function PolicyHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: ReactNode }) {
  return (
    <section style={{ padding: '56px 0 48px', borderBottom: '0.5px solid var(--ink-border)', background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)' }}>
      <div className="container">
        <div style={{ maxWidth: '680px' }}>
          <p className="label-mono" style={{ marginBottom: '14px' }}>{eyebrow}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '16px' }}>
            {title}
          </h1>
          <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>{intro}</div>
        </div>
      </div>
    </section>
  )
}

export function PolicyBody({ children }: { children: ReactNode }) {
  return (
    <section style={{ padding: '48px 0 64px' }}>
      <div className="container">
        <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '40px' }}>{children}</div>
      </div>
    </section>
  )
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>{title}</h2>
      <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: '10px' }}>{children}</div>
    </div>
  )
}

export const linkStyle = { color: 'var(--accent)' } as const
export const listStyle = { margin: 0, paddingLeft: '20px', lineHeight: 1.9 } as const

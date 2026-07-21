'use client'

import { useId, useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

// Fast client-side sanity check only — real validation/dedup happens in
// /api/newsletter server-side.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Inserted after paragraph 4 of Layer 1 (Overview) content only — see
 * RenderBlocksWithInsert in src/app/news/[slug]/page.tsx. Layers 2/3 don't
 * get it since the article's tabbed-layer UI means only one layer is on
 * screen at a time, and Layer 1 is the default/most-read one.
 */
export default function NewsletterInline() {
  const inputId = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setStatus('error')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'news-inline' }),
      })
      if (!res.ok) throw new Error('subscribe failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        style={{
          border: '0.5px solid var(--ink-border-2)',
          background: 'var(--ink-mid)',
          padding: '18px 20px',
          margin: '1.5rem 0',
          fontSize: '0.9375rem',
          color: 'var(--text-primary)',
        }}
      >
        You&apos;re on the list — thanks for subscribing to EconoLens Intel.
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: '0.5px solid var(--ink-border-2)',
        background: 'var(--ink-mid)',
        padding: '20px',
        margin: '1.5rem 0',
      }}
    >
      <label
        htmlFor={inputId}
        style={{
          display: 'block',
          fontFamily: 'var(--font-display)',
          fontSize: '1.0625rem',
          color: 'var(--text-primary)',
          marginBottom: '10px',
        }}
      >
        Get EconoLens Intel in your inbox
      </label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          id={inputId}
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          aria-invalid={status === 'error'}
          style={{
            flex: '1 1 220px',
            padding: '10px 12px',
            background: 'var(--ink)',
            border: '0.5px solid var(--ink-border-2)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
          }}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ink)',
            background: 'var(--gold)',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          {status === 'submitting' ? 'Joining…' : 'Join free'}
        </button>
      </div>
      {status === 'error' && (
        <p role="alert" style={{ marginTop: '8px', fontSize: '0.8125rem', color: 'var(--negative)' }}>
          Enter a valid email address.
        </p>
      )}
    </form>
  )
}

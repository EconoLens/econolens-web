'use client'

import { useState } from 'react'
import { buildCitations } from '@/lib/citations'

interface CiteThisArticleProps {
  title: string
  slug: string
  publishedAt: string
  authorName: string
}

type Style = 'apa' | 'harvard' | 'chicago'
const STYLES: { key: Style; label: string }[] = [
  { key: 'apa', label: 'APA' },
  { key: 'harvard', label: 'Harvard' },
  { key: 'chicago', label: 'Chicago' },
]

export default function CiteThisArticle(props: CiteThisArticleProps) {
  const citations = buildCitations(props)
  const [active, setActive] = useState<Style>('apa')
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(citations[active])
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section style={{ borderTop: '0.5px solid var(--ink-border)', padding: '24px 0' }} aria-label="Cite this article">
      <div className="container-narrow">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              marginBottom: '12px',
            }}
          >
            Cite This Article
          </p>
          <div role="tablist" aria-label="Citation style" style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {STYLES.map((s) => (
              <button
                key={s.key}
                role="tab"
                aria-selected={active === s.key}
                onClick={() => setActive(s.key)}
                type="button"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '5px 12px',
                  background: active === s.key ? 'var(--gold)' : 'transparent',
                  color: active === s.key ? 'var(--ink)' : 'var(--text-secondary)',
                  border: '0.5px solid var(--ink-border-2)',
                  cursor: 'pointer',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p
            role="tabpanel"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              background: 'var(--ink-mid)',
              border: '0.5px solid var(--ink-border)',
              padding: '12px 14px',
              marginBottom: '10px',
            }}
          >
            {citations[active]}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              background: 'transparent',
              border: '0.5px solid var(--ink-border-2)',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            {copied ? 'Copied!' : 'Copy citation'}
          </button>
        </div>
      </div>
    </section>
  )
}

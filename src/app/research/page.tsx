'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'

const SUGGESTED_QUERIES = [
  'How does RBI repo rate affect home loan EMIs?',
  'Explain India\'s current account deficit in simple terms',
  'What happens to the rupee when the Fed raises rates?',
  'How does inflation target 4% affect India\'s poor?',
  'Compare India and China GDP growth trends 2020–2026',
  'What is quantitative easing and does India do it?',
]

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ResearchPage() {
  const { isSignedIn } = useAuth()
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [queriesUsed, setQueriesUsed] = useState(0)
  const FREE_LIMIT = 5

  async function handleQuery(q?: string) {
    const text = (q || query).trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: text, timestamp: new Date() }])
    setQuery('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      })
      const data = await res.json()

      if (res.status === 402) {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: '**Query limit reached.** You\'ve used your 5 free daily queries. Upgrade to EconoLens Pro for unlimited access at ₹199/month.',
          timestamp: new Date(),
        }])
      } else {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: data.response || data.error || 'Unable to generate response.',
          timestamp: new Date(),
        }])
        setQueriesUsed((n) => n + 1)
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Connection error. Please try again.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <section style={{ padding: '40px 0 32px', borderBottom: '0.5px solid var(--ink-border)', background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', alignItems: 'start' }}>
            <div>
              <p className="label-mono" style={{ marginBottom: '12px' }}>AI Research Tool</p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.1 }}>
                Economics Research<br />
                <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>At Your Fingertips</em>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '480px', lineHeight: 1.6 }}>
                Ask any economics question. Get cited, sourced answers grounded in RBI data, FRED indicators, IMF reports, and academic research.
              </p>
            </div>
            <div style={{ background: 'var(--ink-mid)', border: '0.5px solid var(--ink-border)', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
                Your Usage
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 500, color: queriesUsed >= FREE_LIMIT ? 'var(--negative)' : 'var(--text-primary)' }}>
                  {queriesUsed}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  / {FREE_LIMIT} free queries today
                </span>
              </div>
              <div style={{ height: '3px', background: 'var(--ink-border)', borderRadius: '1px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ height: '100%', width: `${(queriesUsed / FREE_LIMIT) * 100}%`, background: queriesUsed >= FREE_LIMIT ? 'var(--negative)' : 'var(--gold)', borderRadius: '1px', transition: 'width 0.3s' }} />
              </div>
              {queriesUsed >= FREE_LIMIT ? (
                <a href="/pricing" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.625rem' }}>
                  Upgrade to Pro ₹199/mo →
                </a>
              ) : (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                  {FREE_LIMIT - queriesUsed} queries remaining. <a href="/pricing" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Upgrade for unlimited →</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main interface */}
      <section style={{ padding: '40px 0 64px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

            {/* Chat area */}
            <div>
              {messages.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', border: '0.5px solid var(--ink-border)', background: 'var(--ink-mid)', marginBottom: '16px' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Ask your first economics question
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>
                    POWERED BY CLAUDE · GROUNDED IN RBI · IMF · FRED DATA
                  </p>
                </div>
              )}

              {messages.length > 0 && (
                <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ink-border)' }}>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        background: msg.role === 'user' ? 'var(--ink-light)' : 'var(--ink-mid)',
                        padding: '20px 24px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em',
                          textTransform: 'uppercase', color: msg.role === 'user' ? 'var(--gold)' : 'var(--neutral)',
                          border: `0.5px solid ${msg.role === 'user' ? 'rgba(196,144,42,0.4)' : 'rgba(96,165,250,0.3)'}`,
                          padding: '2px 6px', flexShrink: 0, marginTop: '2px'
                        }}>
                          {msg.role === 'user' ? 'You' : 'EconoLens AI'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                            {msg.content}
                          </p>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-tertiary)', marginTop: '8px', letterSpacing: '0.06em' }}>
                            {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            {msg.role === 'assistant' && ' · AI-assisted · Verify with official sources'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div style={{ background: 'var(--ink-mid)', padding: '20px 24px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--neutral)', border: '0.5px solid rgba(96,165,250,0.3)', padding: '2px 6px' }}>
                          EconoLens AI
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          Researching...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Input */}
              <div style={{ border: '0.5px solid var(--ink-border)', background: 'var(--ink-mid)' }}>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleQuery() } }}
                  placeholder="Ask an economics question... (Enter to send, Shift+Enter for new line)"
                  disabled={queriesUsed >= FREE_LIMIT}
                  style={{
                    width: '100%', background: 'none', border: 'none', outline: 'none',
                    color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
                    padding: '16px 20px', resize: 'none', minHeight: '80px', lineHeight: 1.6,
                    opacity: queriesUsed >= FREE_LIMIT ? 0.4 : 1,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderTop: '0.5px solid var(--ink-border)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Enter to send · Grounded in FRED · RBI · IMF data
                  </span>
                  <button
                    onClick={() => handleQuery()}
                    disabled={!query.trim() || loading || queriesUsed >= FREE_LIMIT}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.5625rem', opacity: (!query.trim() || loading || queriesUsed >= FREE_LIMIT) ? 0.4 : 1 }}
                  >
                    Send →
                  </button>
                </div>
              </div>

              {queriesUsed >= FREE_LIMIT && (
                <div className="paywall-notice" style={{ marginTop: '12px' }}>
                  <p className="paywall-text">
                    <strong>Daily limit reached.</strong> Upgrade to Pro for unlimited AI research queries.
                  </p>
                  <a href="/pricing" className="btn-primary" style={{ flexShrink: 0, padding: '8px 16px', fontSize: '0.5625rem' }}>
                    Upgrade ₹199/mo →
                  </a>
                </div>
              )}
            </div>

            {/* Sidebar: suggested queries */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '0.5px solid var(--ink-border)' }}>
                Suggested Queries
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ink-border)' }}>
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setQuery(q); handleQuery(q) }}
                    disabled={queriesUsed >= FREE_LIMIT || loading}
                    style={{
                      background: 'var(--ink-mid)', border: 'none', padding: '12px 14px',
                      textAlign: 'left', cursor: 'pointer', color: 'var(--text-secondary)',
                      fontSize: '0.8125rem', lineHeight: 1.4, transition: 'background 0.15s',
                      opacity: queriesUsed >= FREE_LIMIT ? 0.4 : 1,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ink-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--ink-mid)')}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '20px', padding: '14px', border: '0.5px solid var(--ink-border)', background: 'var(--ink-mid)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                  Data Sources
                </div>
                {['RBI · Reserve Bank of India', 'FRED · St. Louis Fed', 'IMF · World Economic Outlook', 'NBER · Working Papers', 'World Bank Open Data', 'MOSPI · India Statistics'].map((src) => (
                  <p key={src} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)', marginBottom: '4px', letterSpacing: '0.04em' }}>
                    {src}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

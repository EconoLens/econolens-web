'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Indicator {
  id: string
  name: string
  unit: string
  description: string
  category: string
  value: number | null
  previous: number | null
  date: string | null
  source: string
  country: string
}

const CATEGORIES = ['All', 'India', 'Growth', 'Inflation', 'Monetary Policy', 'Labour', 'Currency', 'Fixed Income', 'Commodities', 'Trade', 'External']

function formatValue(value: number | null, unit: string): string {
  if (value === null) return '—'
  if (unit === '%') return `${value.toFixed(2)}%`
  if (unit === '$/bbl' || unit === '$/oz') return `$${value.toFixed(2)}`
  if (unit === '₹') return `₹${value.toFixed(2)}`
  if (unit === '$Bn') return `$${Math.abs(value).toFixed(1)}Bn`
  if (unit === 'Bil. $') return `$${(value / 1000).toFixed(1)}T`
  return value.toFixed(2)
}

function getDelta(value: number | null, previous: number | null): { text: string; pos: boolean; neutral: boolean } {
  if (value === null || previous === null) return { text: '—', pos: true, neutral: true }
  const diff = value - previous
  if (Math.abs(diff) < 0.001) return { text: 'Unchanged', pos: true, neutral: true }
  const sign = diff > 0 ? '▲' : '▼'
  return { text: `${sign} ${Math.abs(diff).toFixed(2)}`, pos: diff > 0, neutral: false }
}

function IndicatorCard({ ind }: { ind: Indicator }) {
  const delta = getDelta(ind.value, ind.previous)
  const barPct = ind.value !== null ? Math.min(Math.abs(ind.value) / 10 * 100, 100) : 0

  return (
    <div className="indicator-card" style={{ cursor: 'default' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <div className="indicator-name">{ind.name}</div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: ind.country === 'India' ? 'var(--gold)' : 'var(--text-tertiary)',
          border: `0.5px solid ${ind.country === 'India' ? 'rgba(196,144,42,0.4)' : 'var(--ink-border)'}`,
          padding: '1px 5px'
        }}>
          {ind.country === 'India' ? '🇮🇳 IND' : 'US/GLB'}
        </span>
      </div>
      <div className="indicator-value">{formatValue(ind.value, ind.unit)}</div>
      <div className="indicator-bar">
        <div
          className="indicator-bar-fill"
          style={{
            width: `${barPct}%`,
            background: delta.neutral ? 'var(--neutral)' : delta.pos ? 'var(--positive)' : 'var(--negative)',
          }}
        />
      </div>
      <div className="indicator-meta">
        <span className={delta.neutral ? 'delta-neu' : delta.pos ? 'delta-pos' : 'delta-neg'}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem' }}>
          {delta.text}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)' }}>
          {ind.date ? new Date(ind.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
        </span>
      </div>
      <div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}>
        SRC: {ind.source}
      </div>
    </div>
  )
}

export default function IndicatorsPage() {
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/indicators')
      .then((r) => r.json())
      .then((data) => {
        setIndicators(data.indicators || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load indicators')
        setLoading(false)
      })
  }, [])

  const filtered = indicators.filter((ind) => {
    const matchCat =
      activeCategory === 'All' ? true :
      activeCategory === 'India' ? ind.country === 'India' :
      ind.category === activeCategory
    const matchSearch = search === '' || ind.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      {/* Page header */}
      <section style={{ padding: '40px 0 32px', borderBottom: '0.5px solid var(--ink-border)', background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)' }}>
        <div className="container">
          <p className="label-mono" style={{ marginBottom: '12px' }}>Live Macro Dashboard</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.1 }}>
            Economic Indicators
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '560px', lineHeight: 1.6 }}>
            Live macro data for India and global markets. GDP, inflation, monetary policy, currency, commodities — all in one dashboard.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div style={{ borderBottom: '0.5px solid var(--ink-border)', background: 'var(--ink-mid)', position: 'sticky', top: 'calc(var(--nav-h) + var(--ticker-h) + 28px)', zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto', padding: '0 24px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeCategory === cat ? 'var(--gold)' : 'transparent'}`,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '12px 16px',
                cursor: 'pointer',
                color: activeCategory === cat ? 'var(--gold)' : 'var(--text-tertiary)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search indicator..."
              className="query-input"
              style={{ width: '180px', padding: '8px 12px', fontSize: '0.75rem' }}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <section style={{ padding: '32px 0 64px' }}>
        <div className="container">
          {loading && (
            <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-tertiary)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Loading indicators from FRED · RBI · MOSPI...
              </p>
            </div>
          )}
          {error && (
            <div style={{ padding: '20px', border: '0.5px solid var(--negative)', background: 'rgba(248,113,113,0.05)', color: 'var(--negative)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              {error} — Showing cached data
            </div>
          )}
          {!loading && (
            <>
              <div style={{ marginBottom: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.08em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                {filtered.length} indicators · Data: FRED, RBI, MOSPI, CMIE · Refreshed hourly
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1px', background: 'var(--ink-border)' }}>
                {filtered.map((ind) => (
                  <IndicatorCard key={ind.id} ind={ind} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Attribution */}
      <div style={{ padding: '20px 0', borderTop: '0.5px solid var(--ink-border)' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em', color: 'var(--text-tertiary)', textTransform: 'uppercase', lineHeight: 1.8 }}>
            Data sources: Federal Reserve Economic Data (FRED) · St. Louis Fed · Reserve Bank of India (RBI) ·
            Ministry of Statistics & Programme Implementation (MOSPI) · Centre for Monitoring Indian Economy (CMIE) ·
            Updated hourly via ISR. Not financial advice. Verify before use.
          </p>
        </div>
      </div>
    </>
  )
}

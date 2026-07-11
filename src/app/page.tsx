import Link from 'next/link'
import { getLatestArticles } from '@/lib/sanity'
import { getIndicators, INDICATOR_COUNT, INDICATOR_REGION_LABEL } from '@/lib/indicators'

export const revalidate = 900

const SERVICES = [
  { num: '01', title: 'Economics News',   desc: 'Economics news from RBI, IMF, World Bank, NBER, Fed, and ECB. Global developments analysed at every level of depth.', href: '/articles',  tag: 'LIVE' },
  { num: '02', title: 'Macro Indicators', desc: `${INDICATOR_COUNT} live economic indicators across ${INDICATOR_REGION_LABEL}. GDP, inflation, monetary policy, trade balances — all in one dashboard.`, href: '/indicators', tag: 'LIVE' },
  { num: '03', title: 'Study Economics',  desc: 'Rigorous explanations of every major economics and econometrics concept — written for curious minds. From GDP to GARCH.', href: '/study',      tag: 'FREE' },
  { num: '04', title: 'Academic Papers',  desc: 'NBER and SSRN research translated into plain English. No PhD required to understand cutting-edge economics.', href: '/articles',  tag: 'COMING SOON' },
]

function getSummary(s: any): string {
  if (!s) return ''
  if (Array.isArray(s)) return s[0] || ''
  return String(s)
}

// NOTE (2026-07-08 ops audit, fixed 2026-07-11): this homepage sidebar used to
// carry its own third hardcoded copy of GDP/CPI/Repo/USD-INR — a separate,
// never-changing set of numbers from what /indicators actually showed. It now
// calls the same getIndicators() function the API route uses, so there's one
// source of truth. `bar` stays a fixed illustrative width (it's a decorative
// bar-chart fill, not derived from the value) rather than invented "real" data.
async function getFeaturedIndicators() {
  let all: any[] = []
  try {
    all = await getIndicators()
  } catch {
    return []
  }
  const byId = (id: string) => all.find((i: any) => i.id === id)
  const gdp = byId('IN_GDP')
  const cpi = byId('IN_CPI')
  const repo = byId('IN_REPO')
  const fx = byId('DEXINUS')

  const rows = [
    gdp && {
      name: 'GDP Growth', value: `${gdp.value}%`,
      change: `${gdp.change >= 0 ? '+' : ''}${gdp.change}pp`, pos: gdp.trend !== 'down', bar: 64,
      date: gdp.isStatic ? gdp.date : 'Live',
    },
    cpi && {
      name: 'CPI Inflation', value: `${cpi.value}%`,
      change: `${cpi.trend === 'down' ? '▼' : '▲'}${Math.abs(cpi.change)}pp`, pos: cpi.trend === 'down', bar: 41,
      date: cpi.isStatic ? cpi.date : 'Live',
    },
    repo && {
      name: 'RBI Repo Rate', value: `${repo.value}%`,
      change: repo.trend === 'stable' ? 'UNCHANGED' : `${repo.change >= 0 ? '+' : ''}${repo.change}`, neutral: repo.trend === 'stable', bar: 65,
      date: repo.isStatic ? repo.date : 'Live',
    },
    fx && {
      name: 'USD / INR', value: `₹${fx.value}`,
      change: `${fx.trend === 'up' ? '▲' : '▼'}${Math.abs(fx.change)}`, pos: fx.trend !== 'up', bar: 55,
      date: fx.isStatic ? fx.date : 'Live',
    },
  ].filter(Boolean) as any[]

  return rows
}

export default async function HomePage() {
  let articles: any[] = []
  try { articles = (await getLatestArticles(9)) || [] } catch { articles = [] }
  const featuredIndicators = await getFeaturedIndicators()

  const lead = articles[0]
  const sub  = articles.slice(1, 4)
  const rest = articles.slice(4, 9)

  return (
    <>
      {/* ── Masthead strip ── */}
      <section style={{ background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)', borderBottom: '0.5px solid var(--ink-border)', padding: '40px 0 32px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '10px' }}>
                The World Economy, <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Made Clear.</em>
              </h1>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: 1.6 }}>
                Economics news, live macro indicators, and deep analysis — grounded in official sources from central banks, multilateral institutions, and top research bodies.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
              <Link href="/articles" className="btn-primary">Read Today&apos;s Analysis →</Link>
              <Link href="/indicators" className="btn-outline">Live Indicators</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Front page: lead article + indicators ── */}
      <section style={{ borderBottom: '0.5px solid var(--ink-border)', background: 'var(--ink)' }}>
        <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1px', background: 'var(--ink-border)' }}>

            {/* Left column: lead + sub-articles */}
            <div>
              {/* Lead article */}
              {lead ? (
                <Link href={'/news/' + (lead.slug?.current || '')} style={{ display: 'block', padding: '32px 28px 28px', background: 'var(--ink-light)', textDecoration: 'none', borderBottom: '0.5px solid var(--ink-border)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>
                    {lead.category?.title || 'Economics'} · Lead Analysis
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', fontWeight: 600, lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '-0.01em' }}>
                    {lead.title}
                  </h2>
                  {getSummary(lead.summary) && (
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '16px', maxWidth: '600px' }}>
                      {getSummary(lead.summary)}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    <span>{new Date(lead.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>·</span>
                    <span style={{ color: 'var(--gold)' }}>Read analysis →</span>
                  </div>
                </Link>
              ) : null}

              {/* Sub-articles row */}
              {sub.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--ink-border)' }}>
                  {sub.map((a: any) => (
                    <Link key={a._id} href={'/news/' + (a.slug?.current || '')} className="article-card" style={{ background: 'var(--ink-mid)', padding: '20px' }}>
                      <div className="category">{a.category?.title || 'Economics'}</div>
                      <div className="title" style={{ fontSize: '0.9375rem' }}>{a.title}</div>
                      <div className="meta">
                        <span>{new Date(a.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right: live indicator sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ink-border)' }}>
              <div style={{ padding: '10px 14px', background: '#071320', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                Live Macro
              </div>
              {featuredIndicators.map((ind) => (
                <div key={ind.name} style={{ background: 'var(--ink-mid)', padding: '14px 16px' }}>
                  <div className="indicator-name">{ind.name}</div>
                  <div className="indicator-value">{ind.value}</div>
                  <div className="indicator-bar">
                    <div className="indicator-bar-fill" style={{ width: ind.bar + '%', background: ind.neutral ? 'var(--neutral)' : ind.pos ? 'var(--positive)' : 'var(--negative)' }} />
                  </div>
                  <div className="indicator-meta">
                    <span className={ind.neutral ? 'delta-neu' : ind.pos ? 'delta-pos' : 'delta-neg'} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem' }}>{ind.change}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)' }}>{ind.date}</span>
                  </div>
                </div>
              ))}
              <Link href="/indicators" style={{ padding: '10px 14px', background: '#071320', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none', display: 'block', textAlign: 'center', borderTop: '0.5px solid var(--ink-border)' }}>
                All indicators →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── More articles ── */}
      {rest.length > 0 && (
        <section style={{ padding: '40px 0', borderBottom: '0.5px solid var(--ink-border)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-title-gold">More Intelligence</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--ink-border)' }}>
              {rest.map((a: any) => (
                <Link key={a._id} href={'/news/' + (a.slug?.current || '')} className="article-card">
                  <div className="category">{a.category?.title || 'Economics'}</div>
                  <div className="title">{a.title}</div>
                  {getSummary(a.summary) && <div className="summary">{getSummary(a.summary)}</div>}
                  <div className="meta">
                    <span>{new Date(a.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    <span style={{ width: 2, height: 2, background: 'var(--ink-border-2)', borderRadius: '50%', display: 'inline-block' }} />
                    <span>3 layers</span>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link href="/articles" className="btn-outline">Browse all articles →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Services Grid ── */}
      <section style={{ padding: '0 0 64px', borderTop: '0.5px solid var(--ink-border)' }}>
        <div className="container" style={{ paddingTop: '56px' }}>
          <div className="section-header">
            <span className="section-title">Platform Services</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'var(--ink-border)' }}>
            {SERVICES.map((svc) => (
              <Link key={svc.num} href={svc.href} style={{ background: 'var(--ink-mid)', padding: '28px', textDecoration: 'none', display: 'block' }} className="article-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>{svc.num}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: svc.tag === 'LIVE' ? 'var(--positive)' : svc.tag === 'FREE' ? 'var(--gold)' : 'var(--text-tertiary)', border: '0.5px solid ' + (svc.tag === 'LIVE' ? 'var(--positive)' : svc.tag === 'FREE' ? 'var(--gold)' : 'var(--ink-border-2)'), padding: '2px 7px' }}>{svc.tag}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.2 }}>{svc.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{svc.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section style={{ padding: '48px 0', background: '#071320', borderTop: '0.5px solid var(--ink-border)', borderBottom: '0.5px solid var(--ink-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="label-mono" style={{ marginBottom: '16px' }}>Start for free today</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.15 }}>
            Economics made clear. The world made legible.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            Join economists, students, and investors who read EconoLens to understand the global economy.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sign-up" className="btn-primary">Get started — it&apos;s free</Link>
            <Link href="/pricing" className="btn-outline">View pricing</Link>
          </div>
        </div>
      </section>
    </>
  )
}

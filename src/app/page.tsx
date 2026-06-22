import Link from 'next/link'
import { getLatestArticles } from '@/lib/sanity'

export const revalidate = 900

const FEATURED_INDICATORS = [
  { name: 'GDP Growth', value: '6.4%', change: '+0.2pp', pos: true, bar: 64, date: 'Q1 2026' },
  { name: 'CPI Inflation', value: '4.1%', change: '▼0.3pp', pos: true, bar: 41, date: 'May 2026' },
  { name: 'RBI Repo Rate', value: '6.50%', change: 'UNCHANGED', neutral: true, bar: 65, date: 'June 2026' },
  { name: 'USD / INR', value: '₹83.42', change: '▲0.17', pos: false, bar: 55, date: 'Today' },
  ]

const SERVICES = [
  {
        num: '01',
        title: 'Economics News',
        desc: 'Economics news from RBI, IMF, World Bank, NBER, Fed, and ECB. Global developments analysed at every level of depth.',
        href: '/articles',
        tag: 'LIVE',
  },
  {
        num: '02',
        title: 'Macro Indicators',
        desc: '200+ live economic indicators across 50 countries. GDP, inflation, monetary policy, trade balances — all in one dashboard.',
        href: '/indicators',
        tag: 'LIVE',
  },
  {
        num: '03',
        title: 'Study Economics',
        desc: 'Rigorous explanations of every major economics and econometrics concept — written for curious minds. From GDP to GARCH.',
        href: '/study',
        tag: 'FREE',
  },
  {
        num: '04',
        title: 'Academic Papers',
        desc: 'NBER and SSRN research translated into plain English. No PhD required to understand cutting-edge economics.',
        href: '/articles?type=paper',
        tag: 'COMING SOON',
  },
  ]

export default async function HomePage() {
    let articles: any[] = []
        try {
              articles = (await getLatestArticles(9)) || []
        } catch {
              articles = []
        }

  return (
        <>
          {/* ── Hero ── */}
              <section
                        style={{
                                    background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)',
                                    borderBottom: '0.5px solid var(--ink-border)',
                                    padding: '64px 0 56px',
                        }}
                      >
                      <div className="container">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '48px', alignItems: 'start' }}>
                                  {/* Lead */}
                                            <div>
                                                          <h1
                                                                            className="animate-fade-up delay-100"
                                                                            style={{
                                                                                                fontFamily: 'var(--font-display)',
                                                                                                fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
                                                                                                fontWeight: 600,
                                                                                                lineHeight: 1.08,
                                                                                                letterSpacing: '-0.02em',
                                                                                                color: 'var(--text-primary)',
                                                                                                marginBottom: '20px',
                                                                            }}
                                                                          >
                                                                          The World Economy,<br />
                                                                          <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Made Clear.</em>
                                                          </h1>
                                                          <p
                                                                            className="animate-fade-up delay-200"
                                                                            style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.7, marginBottom: '32px' }}
                                                                          >
                                                                          Economics news, live macro indicators, and deep analysis — grounded in official sources from central banks, multilateral institutions, and top research bodies.
                                                          </p>
                                                          <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                                          <Link href="/articles" className="btn-primary">
                                                                                            Read Today&apos;s Analysis →
                                                                          </Link>
                                                                          <Link href="/indicators" className="btn-outline">
                                                                                            Live Indicators
                                                                          </Link>
                                                          </div>
                                            </div>
                                
                                  {/* Live indicator sidebar */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ink-border)' }}>
                                                          <div style={{ padding: '10px 14px', background: '#071320', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                                                                          Live Macro Indicators
                                                          </div>
                                              {FEATURED_INDICATORS.map((ind) => (
                                        <div key={ind.name} style={{ background: 'var(--ink-mid)', padding: '14px 16px' }}>
                                                          <div className="indicator-name">{ind.name}</div>
                                                          <div className="indicator-value">{ind.value}</div>
                                                          <div className="indicator-bar">
                                                                              <div
                                                                                                      className="indicator-bar-fill"
                                                                                                      style={{
                                                                                                                                width: `${ind.bar}%`,
                                                                                                                                background: ind.neutral ? 'var(--neutral)' : ind.pos ? 'var(--positive)' : 'var(--negative)',
                                                                                                        }}
                                                                                                    />
                                                          </div>
                                                          <div className="indicator-meta">
                                                                              <span
                                                                                                      className={ind.neutral ? 'delta-neu' : ind.pos ? 'delta-pos' : 'delta-neg'}
                                                                                                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem' }}
                                                                                                    >
                                                                                {ind.change}
                                                                              </span>
                                                                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)' }}>
                                                                                {ind.date}
                                                                              </span>
                                                          </div>
                                        </div>
                                      ))}
                                                          <Link
                                                                            href="/indicators"
                                                                            style={{ padding: '10px 14px', background: '#071320', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none', display: 'block', textAlign: 'center', borderTop: '0.5px solid var(--ink-border)' }}
                                                                          >
                                                                          View all 200+ indicators →
                                                          </Link>
                                            </div>
                                </div>
                      </div>
              </section>
        
          {/* ── Latest Articles ── */}
              <section style={{ padding: '56px 0' }}>
                      <div className="container">
                                <div className="section-header">
                                            <span className="section-title-gold">Today&apos;s Intelligence</span>
                                </div>
                      
                        {articles.length === 0 ? (
                      <div style={{ padding: '48px', textAlign: 'center', border: '0.5px solid var(--ink-border)', background: 'var(--ink-mid)' }}>
                                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                                    Articles coming soon
                                    </p>
                                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>
                                                    ECONOMICS INTELLIGENCE · GROUNDED IN OFFICIAL SOURCES
                                    </p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--ink-border)' }}>
                        {articles.map((article: any, i: number) => (
                                        <Link
                                                            key={article._id}
                                                            href={`/news/${article.slug?.current}`}
                                                            className="article-card"
                                                            style={{ background: i === 0 ? 'var(--ink-light)' : undefined }}
                                                          >
                                                          <div className="category">{article.category?.title || 'Economics'}</div>
                                                          <div className="title" style={{ fontSize: i === 0 ? '1.25rem' : undefined }}>
                                                            {article.title}
                                                          </div>
                                          {article.summary && (
                                                                                <div className="summary">{article.summary}</div>
                                                          )}
                                                          <div className="meta">
                                                                              <span>
                                                                                {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                                                                                    day: 'numeric', month: 'short',
                                                          })}
                                                                              </span>
                                                                              <span style={{ width: 2, height: 2, background: 'var(--ink-border-2)', borderRadius: '50%', display: 'inline-block' }} />
                                                                              <span>3 layers</span>
                                                          </div>
                                        </Link>
                                      ))}
                      </div>
                                )}
                      
                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                            <Link href="/articles" className="btn-outline">
                                                          Browse all articles →
                                            </Link>
                                </div>
                      </div>
              </section>
        
          {/* ── Services Grid ── */}
              <section style={{ padding: '0 0 64px', borderTop: '0.5px solid var(--ink-border)' }}>
                      <div className="container" style={{ paddingTop: '56px' }}>
                                <div className="section-header">
                                            <span className="section-title">Platform Services</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'var(--ink-border)' }}>
                                  {SERVICES.map((svc) => (
                        <Link
                                          key={svc.num}
                                          href={svc.href}
                                          style={{ background: 'var(--ink-mid)', padding: '28px', textDecoration: 'none', display: 'block', transition: 'background 0.15s', borderBottom: 'none' }}
                                          className="article-card"
                                        >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>
                                                            {svc.num}
                                                          </span>
                                                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: svc.tag === 'LIVE' ? 'var(--positive)' : svc.tag === 'FREE' ? 'var(--gold)' : 'var(--text-tertiary)', border: `0.5px solid ${svc.tag === 'LIVE' ? 'var(--positive)' : svc.tag === 'FREE' ? 'var(--gold)' : 'var(--ink-border-2)'}`, padding: '2px 7px' }}>
                                                            {svc.tag}
                                                          </span>
                                        </div>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.2 }}>
                                          {svc.title}
                                        </h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                          {svc.desc}
                                        </p>
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
                                            <Link href="/sign-up" className="btn-primary">
                                                          Get started — it&apos;s free
                                            </Link>
                                            <Link href="/pricing" className="btn-outline">
                                                          View pricing
                                            </Link>
                                </div>
                      </div>
              </section>
        </>
      )
}

import Link from 'next/link'
import { getLatestArticles, getArticlesByCategory } from '@/lib/sanity'

export const revalidate = 900

export const metadata = {
  title: 'Study Economics — EconoLens',
  description: 'Learn economics and econometrics from first principles. Clear, rigorous explanations of every major concept — from GDP to GARCH models.',
}

const SUBJECTS = [
  {
    section: 'Macroeconomics',
    topics: [
      { label: 'GDP & National Accounts', icon: '📊', slug: 'study-understanding-gdp-explained' },
      { label: 'Inflation & Price Theory', icon: '📈', slug: null },
      { label: 'Business Cycles', icon: '🔄', slug: null },
      { label: 'Monetary Policy', icon: '🏦', slug: null },
      { label: 'Fiscal Policy & Multipliers', icon: '🏛️', slug: null },
      { label: 'Exchange Rates & Open Economy', icon: '🌐', slug: null },
    ],
  },
  {
    section: 'Microeconomics',
    topics: [
      { label: 'Supply, Demand & Markets', icon: '⚖️', slug: null },
      { label: 'Elasticity', icon: '📉', slug: null },
      { label: 'Market Structures', icon: '🏭', slug: null },
      { label: 'Game Theory', icon: '♟️', slug: null },
      { label: 'Information Economics', icon: '💡', slug: null },
      { label: 'Welfare Economics', icon: '🌱', slug: null },
    ],
  },
  {
    section: 'Econometrics',
    topics: [
      { label: 'OLS Regression', icon: '📐', slug: null },
      { label: 'Time Series Analysis', icon: '⏱️', slug: null },
      { label: 'Panel Data Methods', icon: '🗂️', slug: null },
      { label: 'Instrumental Variables', icon: '🔧', slug: null },
      { label: 'Difference-in-Differences', icon: '📋', slug: null },
      { label: 'ARIMA & GARCH', icon: '📡', slug: null },
    ],
  },
  {
    section: 'International Economics',
    topics: [
      { label: 'Comparative Advantage', icon: '🌍', slug: null },
      { label: 'Balance of Payments', icon: '💱', slug: null },
      { label: 'Trade Policy & Tariffs', icon: '🛃', slug: null },
      { label: 'Capital Flows & FDI', icon: '💰', slug: null },
      { label: 'Purchasing Power Parity', icon: '🔄', slug: null },
      { label: 'Development Finance', icon: '🏗️', slug: null },
    ],
  },
]

export default async function StudyPage() {
  let studyArticles: any[] = []
  try {
    studyArticles = (await getArticlesByCategory('study', 20)) || []
  } catch {
    studyArticles = []
  }

  let explainers: any[] = []
  try {
    explainers = (await getArticlesByCategory('econometrics', 6)) || []
  } catch {
    explainers = []
  }

  return (
    <>
      {/* ── Page Header ── */}
      <section style={{
        padding: '48px 0 40px',
        borderBottom: '0.5px solid var(--ink-border)',
        background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)',
      }}>
        <div className="container">
          <p className="label-mono" style={{ marginBottom: '12px' }}>Study Series</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3vw, 3rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '14px',
          }}>
            Economics from First Principles
          </h1>
          <p style={{
            fontSize: '1.0625rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '600px',
            marginBottom: '24px',
          }}>
            Rigorous explanations of every major economics and econometrics concept — written for curious minds, not textbooks. From GDP to GARCH, from multipliers to moral hazard.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Macro', 'Micro', 'Econometrics', 'International', 'Finance'].map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                border: '0.5px solid var(--ink-border)',
                padding: '4px 10px',
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Published Study Articles ── */}
      {studyArticles.length > 0 && (
        <section style={{ padding: '40px 0', borderBottom: '0.5px solid var(--ink-border)' }}>
          <div className="container">
            <p className="label-mono" style={{ marginBottom: '20px' }}>Latest Study Posts</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1px', background: 'var(--ink-border)' }}>
              {studyArticles.map((article: any) => (
                <Link key={article._id} href={`/news/${article.slug?.current}`} className="article-card">
                  <div className="category">Study</div>
                  <div className="title">{article.title}</div>
                  {Array.isArray(article.summary) && article.summary[0] && (
                    <div className="summary" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {article.summary[0]}
                    </div>
                  )}
                  <div className="meta">
                    <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    <span style={{ width: 2, height: 2, background: 'var(--ink-border-2)', borderRadius: '50%', display: 'inline-block' }} />
                    <span>{article.author?.name || 'EconoLens'}</span>
                    <span style={{ width: 2, height: 2, background: 'var(--ink-border-2)', borderRadius: '50%', display: 'inline-block' }} />
                    <span>3 layers</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Curriculum Map ── */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px', flexWrap: 'wrap', gap: '8px' }}>
            <p className="label-mono">Full Curriculum</p>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.06em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              New topics added every week
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {SUBJECTS.map((subject) => (
              <div key={subject.section} style={{
                background: 'var(--ink-mid)',
                border: '0.5px solid var(--ink-border)',
                padding: '0',
              }}>
                {/* Section header */}
                <div style={{
                  padding: '14px 18px',
                  borderBottom: '0.5px solid var(--ink-border)',
                  background: 'rgba(196,144,42,0.04)',
                }}>
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>{subject.section}</h2>
                </div>

                {/* Topics */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {subject.topics.map((topic, i) => (
                    <li key={topic.label} style={{
                      borderBottom: i < subject.topics.length - 1 ? '0.5px solid var(--ink-border)' : 'none',
                    }}>
                      {topic.slug ? (
                        <Link href={`/news/${topic.slug}`} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '11px 18px',
                          textDecoration: 'none',
                          transition: 'background 0.15s',
                        }}
                        className="study-topic-link"
                        >
                          <span style={{ fontSize: '0.875rem', flexShrink: 0 }}>{topic.icon}</span>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{topic.label}</span>
                          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Read →</span>
                        </Link>
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '11px 18px',
                        }}>
                          <span style={{ fontSize: '0.875rem', flexShrink: 0, opacity: 0.5 }}>{topic.icon}</span>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', lineHeight: 1.3 }}>{topic.label}</span>
                          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--ink-border-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Soon</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Econometrics articles ── */}
      {explainers.length > 0 && (
        <section style={{ padding: '0 0 56px', borderTop: '0.5px solid var(--ink-border)' }}>
          <div className="container" style={{ paddingTop: '40px' }}>
            <p className="label-mono" style={{ marginBottom: '20px' }}>Econometrics</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--ink-border)' }}>
              {explainers.map((article: any) => (
                <Link key={article._id} href={`/news/${article.slug?.current}`} className="article-card">
                  <div className="category">Econometrics</div>
                  <div className="title">{article.title}</div>
                  <div className="meta">
                    <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    <span style={{ width: 2, height: 2, background: 'var(--ink-border-2)', borderRadius: '50%', display: 'inline-block' }} />
                    <span>{article.author?.name || 'EconoLens'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA: Request a topic ── */}
      <section style={{
        borderTop: '0.5px solid var(--ink-border)',
        background: 'var(--ink-mid)',
        padding: '40px 0',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.125rem, 1.5vw, 1.5rem)',
            color: 'var(--text-primary)',
            marginBottom: '10px',
          }}>
            Don&apos;t see a topic you need?
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            We&apos;re building the complete economics curriculum — one rigorous, accessible explainer at a time.
          </p>
          <Link href="/research" style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--ink)',
            background: 'var(--gold)',
            padding: '10px 20px',
            textDecoration: 'none',
            border: '1px solid var(--gold)',
            transition: 'all 0.15s',
          }}>
            Explore Research →
          </Link>
        </div>
      </section>
    </>
  )
}

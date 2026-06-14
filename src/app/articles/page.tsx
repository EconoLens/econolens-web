import Link from 'next/link'
import { getLatestArticles } from '@/lib/sanity'

export const revalidate = 900

const CATEGORIES = ['All', 'Monetary Policy', 'Fiscal Policy', 'Trade', 'Inflation', 'Markets', 'Research', 'Global Economy']

export default async function ArticlesPage({ searchParams }: { searchParams: { category?: string } }) {
  let articles: any[] = []
  try {
    articles = (await getLatestArticles(30)) || []
  } catch {
    articles = []
  }

  const activeCategory = searchParams?.category || 'All'
  const filtered =
    activeCategory === 'All'
      ? articles
      : articles.filter((a: any) => a.category?.title === activeCategory)

  return (
    <>
      {/* Header */}
      <section style={{ padding: '40px 0 32px', borderBottom: '0.5px solid var(--ink-border)', background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)' }}>
        <div className="container">
          <p className="label-mono" style={{ marginBottom: '12px' }}>
            {articles.length} articles · updated every 15 min
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.1 }}>
            Economics Intelligence
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '560px', lineHeight: 1.6 }}>
            AI-synthesised economics news from RBI, IMF, World Bank, NBER, Fed, ECB — every development filtered through India&apos;s economic lens.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <div style={{ borderBottom: '0.5px solid var(--ink-border)', background: 'var(--ink-mid)', position: 'sticky', top: 'calc(var(--nav-h) + var(--ticker-h) + 28px)', zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', overflowX: 'auto', padding: '0 24px' }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === 'All' ? '/articles' : `/articles?category=${encodeURIComponent(cat)}`}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '12px 16px',
                color: activeCategory === cat ? 'var(--gold)' : 'var(--text-tertiary)',
                textDecoration: 'none',
                borderBottom: `2px solid ${activeCategory === cat ? 'var(--gold)' : 'transparent'}`,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                display: 'block',
              }}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      <section style={{ padding: '32px 0 64px' }}>
        <div className="container">
          {filtered.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center', border: '0.5px solid var(--ink-border)', background: 'var(--ink-mid)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {articles.length === 0 ? 'News pipeline initialising — first articles arriving soon' : 'No articles in this category yet'}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                MAKE.COM → CLAUDE API → SANITY CMS · EVERY 15 MINUTES
              </p>
              {articles.length === 0 && (
                <div style={{ marginTop: '24px', padding: '14px 20px', background: 'var(--ink-light)', border: '0.5px solid var(--ink-border)', display: 'inline-block' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}>
                    ACTIVE SOURCES: RBI · IMF · (More coming with Make.com Core plan)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Lead article (full width) */}
              {filtered[0] && (
                <Link href={`/news/${filtered[0].slug?.current}`} className="article-card" style={{ marginBottom: '1px', display: 'grid', gridTemplateColumns: '1fr auto' }}>
                  <div>
                    <div className="category">{filtered[0].category?.title || 'Economics'}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.375rem, 2.5vw, 2rem)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '10px' }}>
                      {filtered[0].title}
                    </div>
                    {filtered[0].summary && (
                      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px', maxWidth: '640px' }}>
                        {filtered[0].summary}
                      </p>
                    )}
                    <div className="meta">
                      <span>
                        {new Date(filtered[0].publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span style={{ width: 2, height: 2, background: 'var(--ink-border-2)', borderRadius: '50%', display: 'inline-block' }} />
                      <span>3 reading layers</span>
                      <span style={{ width: 2, height: 2, background: 'var(--ink-border-2)', borderRadius: '50%', display: 'inline-block' }} />
                      <span>AI-assisted · Source attributed</span>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'var(--gold)', textTransform: 'uppercase', padding: '0 0 0 20px', alignSelf: 'start', marginTop: '4px' }}>
                    Lead →
                  </div>
                </Link>
              )}

              {/* Grid for rest */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--ink-border)' }}>
                {filtered.slice(1).map((article: any) => (
                  <Link key={article._id} href={`/news/${article.slug?.current}`} className="article-card">
                    <div className="category">{article.category?.title || 'Economics'}</div>
                    <div className="title">{article.title}</div>
                    {article.summary && <div className="summary" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.summary}</div>}
                    <div className="meta">
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      <span style={{ width: 2, height: 2, background: 'var(--ink-border-2)', borderRadius: '50%', display: 'inline-block' }} />
                      <span>3 layers</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

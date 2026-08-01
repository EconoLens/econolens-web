import Link from 'next/link'

import { getArticlesByType } from '@/lib/sanity'

export const revalidate = 900

export const metadata = {
  title: 'Research — Academic Papers, Explained | EconoLens',
  description:
    'Working papers and theses from NBER, SSRN, and academic journals, translated into plain economic language — methodology, results, and what they mean, without the jargon.',
}

export default async function ResearchPapersPage() {
  let papers: any[] = []
  try {
    papers = (await getArticlesByType('research-guide', 30)) || []
  } catch {
    papers = []
  }

  return (
    <>
      {/* ── Page Header ── */}
      <section
        style={{
          padding: '48px 0 40px',
          borderBottom: '0.5px solid var(--ink-border)',
          background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)',
        }}
      >
        <div className="container">
          <p className="label-mono" style={{ marginBottom: '12px' }}>Research, Translated</p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3vw, 3rem)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '14px',
            }}
          >
            Academic Papers, In Plain Economic Language
          </h1>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '640px',
              marginBottom: '24px',
            }}
          >
            We take working papers, journal articles, and theses from economists and
            researchers — the kind full of regressions and jargon — and translate the
            methodology and results into language anyone with an interest in economics
            can follow. Same three-layer structure as every EconoLens piece: a plain-English
            overview, the context and implications, and a full technical layer for readers who
            want the actual methodology.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['NBER', 'SSRN', 'Journal Articles', 'Theses', 'Working Papers'].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  border: '0.5px solid var(--ink-border)',
                  padding: '4px 10px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Papers list ── */}
      <section style={{ padding: '40px 0 64px' }}>
        <div className="container">
          <p className="label-mono" style={{ marginBottom: '20px' }}>
            {papers.length > 0 ? 'Latest Papers, Explained' : 'Coming Soon'}
          </p>

          {papers.length === 0 && (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                border: '0.5px solid var(--ink-border)',
                background: 'var(--ink-mid)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
                Our first translated papers are in progress — check back soon.
              </p>
            </div>
          )}

          {papers.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1px',
                background: 'var(--ink-border)',
              }}
            >
              {papers.map((article: any) => (
                <Link
                  key={article._id}
                  href={'/news/' + (article.slug?.current || '')}
                  className="article-card"
                >
                  <div className="category">
                    {article.paperSource || 'Research Paper'}
                  </div>
                  <div className="title">{article.title}</div>
                  {Array.isArray(article.summary) && article.summary[0] && (
                    <div
                      className="summary"
                      style={{
                        WebkitLineClamp: 2,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {article.summary[0]}
                    </div>
                  )}
                  <div className="meta">
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    {Array.isArray(article.paperAuthors) && article.paperAuthors.length > 0 && (
                      <>
                        <span
                          style={{
                            width: 2,
                            height: 2,
                            background: 'var(--ink-border-2)',
                            borderRadius: '50%',
                            display: 'inline-block',
                          }}
                        />
                        <span>{article.paperAuthors.slice(0, 2).join(', ')}</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

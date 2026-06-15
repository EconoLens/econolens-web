import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/sanity'

export const revalidate = 900

export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs()
    return slugs.map((s: any) => ({ slug: s.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const article = await getArticleBySlug(params.slug)
    if (!article) return {}
    return {
      title: article.title,
      description: article.metaDescription || (Array.isArray(article.summary) ? article.summary[0] : article.summary),
    }
  } catch {
    return {}
  }
}

// Renders our Portable Text block array to JSX
function RenderBlocks({ blocks }: { blocks: any[] }) {
  if (!blocks?.length) return <p style={{ color: 'var(--text-tertiary)' }}>Content unavailable.</p>
  return (
    <>
      {blocks.map((block, i) => {
        const text = block.children?.map((c: any) => c.text).join('') || ''
        const key = block._key || i

        if (block.style === 'h2') {
          return (
            <h2 key={key} style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 1.8vw, 1.625rem)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '2.25rem 0 0.875rem',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              borderLeft: '2px solid var(--gold)',
              paddingLeft: '14px',
            }}>{text}</h2>
          )
        }
        if (block.style === 'h3') {
          return (
            <h3 key={key} style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              margin: '1.75rem 0 0.625rem',
            }}>{text}</h3>
          )
        }
        return (
          <p key={key} style={{
            fontSize: '1.0625rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            marginBottom: '1.25rem',
          }}>{text}</p>
        )
      })}
    </>
  )
}

const LAYER_META = [
  { id: '1', label: 'Overview',  sub: 'Plain English · 3 min read' },
  { id: '2', label: 'Analysis',  sub: 'Deep Context · 8 min read' },
  { id: '3', label: 'Technical', sub: 'Full Depth · 15 min read' },
]

const TYPE_LABELS: Record<string, string> = {
  news: 'News',
  explainer: 'Explainer',
  'research-guide': 'Journal Review',
  'data-story': 'Data Story',
  opinion: 'Opinion',
  econometrics: 'Econometrics',
  'math-economics': 'Math & Econ',
  'fun-sports': 'Sports Economics',
  'fun-tech': 'Tech Economics',
  'fun-entertainment': 'Entertainment',
}

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { layer?: string }
}) {
  let article: any = null
  try {
    article = await getArticleBySlug(params.slug)
  } catch {
    notFound()
  }

  if (!article || article.qaStatus !== 'passed') notFound()

  const activeLayer = ['1', '2', '3'].includes(searchParams?.layer || '') ? (searchParams.layer || '1') : '1'

  const layerContent: Record<string, any[]> = {
    '1': article.layerOne || [],
    '2': article.layerTwo || [],
    '3': article.layerThree || [],
  }

  const pubDate = new Date(article.publishedAt)
  const formattedDate = pubDate.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const categoryTitle = article.category?.title || TYPE_LABELS[article.articleType] || 'Economics'
  const authorName = article.author?.name || 'EconoLens Editorial Team'
  const authorCreds = article.author?.credentials || ''
  const summaryItems: string[] = Array.isArray(article.summary) ? article.summary : []

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div style={{ background: 'var(--ink)', borderBottom: '0.5px solid var(--ink-border)', padding: '10px 0' }}>
        <div className="container" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link href="/articles" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', textDecoration: 'none' }}>
            ← Articles
          </Link>
          <span style={{ color: 'var(--ink-border-2)', fontSize: '0.5625rem' }}>/</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
            {categoryTitle}
          </span>
        </div>
      </div>

      {/* ── Article header ── */}
      <header style={{
        background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)',
        borderBottom: '0.5px solid var(--ink-border)',
        padding: '40px 0 36px',
      }}>
        <div className="container-narrow">
          {/* Category + Type pills */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}>{categoryTitle}</span>
            <span style={{ width: 3, height: 3, background: 'var(--ink-border-2)', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              border: '0.5px solid var(--ink-border-2)',
              padding: '2px 7px',
            }}>{TYPE_LABELS[article.articleType] || 'Article'}</span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.625rem, 3vw, 2.5rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
          }}>
            {article.title}
          </h1>

          {/* Summary bullets */}
          {summaryItems.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', borderLeft: '2px solid var(--ink-border-2)', paddingLeft: '16px' }}>
              {summaryItems.map((item, i) => (
                <li key={i} style={{
                  fontSize: '0.9375rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: i < summaryItems.length - 1 ? '8px' : 0,
                  paddingLeft: '4px',
                }}>
                  <span style={{ color: 'var(--gold)', marginRight: '8px' }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* Meta row: author · date · AI label */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Author */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{
                width: 30,
                height: 30,
                background: 'var(--ink-light)',
                border: '0.5px solid var(--ink-border-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '0.875rem',
                color: 'var(--gold)',
                flexShrink: 0,
              }}>
                {authorName.charAt(0)}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.08em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  {authorName}
                </div>
                {authorCreds && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    {authorCreds}
                  </div>
                )}
              </div>
            </div>

            <span style={{ width: 1, height: 24, background: 'var(--ink-border)', display: 'inline-block' }} />

            {/* Date */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.06em', color: 'var(--text-tertiary)' }}>
              {formattedDate}
            </span>

            {/* AI label */}
            {article.aiLabel && (
              <>
                <span style={{ width: 1, height: 24, background: 'var(--ink-border)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  {article.aiLabel}
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Layer tabs ── */}
      <div style={{
        background: 'var(--ink-mid)',
        borderBottom: '0.5px solid var(--ink-border)',
        position: 'sticky',
        top: 'calc(var(--nav-h) + var(--ticker-h))',
        zIndex: 50,
      }}>
        <div className="container-narrow" style={{ display: 'flex' }}>
          {LAYER_META.map((layer) => {
            const isActive = activeLayer === layer.id
            return (
              <Link
                key={layer.id}
                href={`/news/${params.slug}?layer=${layer.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px 20px',
                  textDecoration: 'none',
                  borderBottom: `2px solid ${isActive ? 'var(--gold)' : 'transparent'}`,
                  background: isActive ? 'rgba(196,144,42,0.06)' : 'transparent',
                  transition: 'all 0.15s',
                  minWidth: 0,
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--gold)' : 'var(--text-tertiary)',
                  fontWeight: isActive ? 500 : 400,
                }}>
                  Layer {layer.id} — {layer.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.06em',
                  color: 'var(--text-tertiary)',
                  marginTop: '2px',
                  opacity: 0.7,
                }}>
                  {layer.sub}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Article content ── */}
      <main style={{ padding: '40px 0 80px' }}>
        <div className="container-narrow">
          <div style={{
            maxWidth: '720px',
            margin: '0 auto',
          }}>
            <RenderBlocks blocks={layerContent[activeLayer]} />
          </div>
        </div>
      </main>

      {/* ── India / Global Context ── */}
      {article.indiaContext && (
        <section style={{ borderTop: '0.5px solid var(--ink-border)', background: 'var(--ink-mid)', padding: '32px 0' }}>
          <div className="container-narrow">
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  whiteSpace: 'nowrap',
                  paddingTop: '3px',
                }}>
                  Global Context
                </div>
                <div style={{ width: '0.5px', background: 'var(--ink-border-2)', alignSelf: 'stretch', flexShrink: 0 }} />
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
                  {article.indiaContext}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Source attribution ── */}
      {article.sourceAttribution?.length > 0 && (
        <section style={{ borderTop: '0.5px solid var(--ink-border)', padding: '24px 0' }}>
          <div className="container-narrow">
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
                Primary Sources
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {article.sourceAttribution.map((src: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--gold)', letterSpacing: '0.06em' }}>
                      {src.institution}
                    </span>
                    {src.title && (
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {src.url ? (
                          <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', borderBottom: '0.5px solid var(--ink-border-2)' }}>
                            {src.title}
                          </a>
                        ) : src.title}
                      </span>
                    )}
                    {src.publishedDate && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-tertiary)' }}>
                        {src.publishedDate}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Author card ── */}
      <section style={{ borderTop: '0.5px solid var(--ink-border)', background: 'var(--ink-mid)', padding: '28px 0' }}>
        <div className="container-narrow">
          <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              width: 44,
              height: 44,
              background: 'var(--ink-light)',
              border: '0.5px solid var(--ink-border-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              color: 'var(--gold)',
              flexShrink: 0,
            }}>
              {authorName.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '3px' }}>
                {authorName}
              </div>
              {authorCreds && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                  {authorCreds}
                </div>
              )}
              {article.author?.bio && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {article.author.bio}
                </p>
              )}
            </div>
            {article.author?.badgeLevel && article.author.badgeLevel !== 'none' && (
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                border: '0.5px solid var(--ink-border)',
                padding: '4px 8px',
                alignSelf: 'flex-start',
              }}>
                {article.author.badgeLevel === 'gold' ? '🥇 Gold' : article.author.badgeLevel === 'silver' ? '🥈 Silver' : '🥉 Bronze'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Back nav ── */}
      <div style={{ borderTop: '0.5px solid var(--ink-border)', padding: '20px 0' }}>
        <div className="container-narrow">
          <Link href="/articles" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
            textDecoration: 'none',
          }}>
            ← Back to all articles
          </Link>
        </div>
      </div>
    </>
  )
}

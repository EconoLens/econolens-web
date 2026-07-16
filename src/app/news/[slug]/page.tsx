import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getAllArticleSlugs, urlFor } from '@/lib/sanity'
import CiteThisArticle from '@/components/article/CiteThisArticle'
import NewsletterInline from '@/components/article/NewsletterInline'

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
    const description =
      article.metaDescription ||
      (Array.isArray(article.summary) ? article.summary[0] : article.summary) ||
      ''
    const canonicalUrl = `https://econolens.co.in/news/${params.slug}`
    const ogImage = article.coverImage?.url
    return {
      title: article.title,
      description,
      openGraph: {
        type: 'article',
        title: article.title,
        description,
        url: canonicalUrl,
        siteName: 'EconoLens',
        ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        site: '@EconoLens',
        title: article.title,
        description,
        ...(ogImage ? { images: [ogImage] } : {}),
      },
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

/**
 * Same rendering as RenderBlocks, but drops `insert` (the inline
 * newsletter form) in right after the 4th paragraph-style block — only
 * counts normal-style blocks toward that position, so headings/images
 * don't throw off the count. Used for Layer 1 only (see call site below):
 * layers render as tabs, so "after paragraph 4 of every article" means
 * Layer 1, the default/most-read tab, not all three layers at once.
 */
function RenderBlocksWithInsert({ blocks, insert, afterParagraph = 4 }: { blocks: any[]; insert: React.ReactNode; afterParagraph?: number }) {
  if (!blocks?.length) return <p style={{ color: 'var(--text-tertiary)' }}>Content unavailable.</p>
  let seen = 0
  let insertedAlready = false
  const nodes: React.ReactNode[] = []

  blocks.forEach((block, i) => {
    const text = block.children?.map((c: any) => c.text).join('') || ''
    const key = block._key || i

    if (block.style === 'h2') {
      nodes.push(
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
    } else if (block.style === 'h3') {
      nodes.push(
        <h3 key={key} style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.125rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          margin: '1.75rem 0 0.625rem',
        }}>{text}</h3>
      )
    } else {
      seen += 1
      nodes.push(
        <p key={key} style={{
          fontSize: '1.0625rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.8,
          marginBottom: '1.25rem',
        }}>{text}</p>
      )
      if (seen === afterParagraph && !insertedAlready) {
        nodes.push(<div key={`${key}-insert`}>{insert}</div>)
        insertedAlready = true
      }
    }
  })

  if (!insertedAlready) nodes.push(<div key="insert-fallback">{insert}</div>)

  return <>{nodes}</>
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

// Share platform definitions — URL-based, no API keys needed
const SHARE_PLATFORMS = [
  {
    label: 'X',
    buildUrl: (pageUrl: string, title: string) =>
      `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}&via=EconoLens`,
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.631 5.906-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    buildUrl: (pageUrl: string, _title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    buildUrl: (pageUrl: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(title + '\n' + pageUrl)}`,
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    label: 'Telegram',
    buildUrl: (pageUrl: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`,
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
]

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
  const articleUrl = `https://econolens.co.in/news/${params.slug}`

  // GEO fix (2026-07-11): NewsArticle structured data. This is what lets AI
  // engines (ChatGPT, Perplexity, Google AI Overviews) and search crawlers
  // confidently attribute this analysis to EconoLens with a named, credentialed
  // reviewer, a publish date, and the actual primary sources — rather than
  // treating it as anonymous, undated prose.
  let coverImageUrl: string | undefined
  try {
    coverImageUrl = article.coverImage ? urlFor(article.coverImage).width(1200).height(630).url() : undefined
  } catch {
    coverImageUrl = undefined
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.metaDescription || summaryItems[0] || '',
    ...(coverImageUrl ? { image: [coverImageUrl] } : {}),
    datePublished: article.publishedAt,
    dateModified: article._updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorCreds ? { jobTitle: authorCreds } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: 'EconoLens',
      url: 'https://econolens.co.in',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    ...(article.sourceAttribution?.length
      ? {
          citation: article.sourceAttribution.map((s: any) => ({
            '@type': 'CreativeWork',
            name: s.title || s.institution,
            ...(s.url ? { url: s.url } : {}),
            ...(s.publishedDate ? { datePublished: s.publishedDate } : {}),
          })),
        }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

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
            {activeLayer === '1' ? (
              <RenderBlocksWithInsert blocks={layerContent[activeLayer]} insert={<NewsletterInline />} />
            ) : (
              <RenderBlocks blocks={layerContent[activeLayer]} />
            )}
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

      {/* ── Cite This Article ── */}
      <CiteThisArticle
        title={article.title}
        slug={params.slug}
        publishedAt={article.publishedAt}
        authorName={authorName}
      />

      {/* ── Share ── */}
      <section style={{ borderTop: '0.5px solid var(--ink-border)', padding: '24px 0' }}>
        <div className="container-narrow">
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              marginBottom: '12px',
            }}>
              Share this analysis
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SHARE_PLATFORMS.map((p) => (
                <a
                  key={p.label}
                  href={p.buildUrl(articleUrl, article.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${p.label}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-tertiary)',
                    textDecoration: 'none',
                    border: '0.5px solid var(--ink-border)',
                    padding: '5px 10px',
                  }}
                >
                  {p.icon}
                  {p.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

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

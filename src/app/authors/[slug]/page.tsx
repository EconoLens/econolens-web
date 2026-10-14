import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticlesByAuthor, getContributorBySlug, urlFor } from '@/lib/sanity'

// Author / byline profile (Restructuring Plan Phase 2, 2026-10-14). Every
// article byline links here; the article JSON-LD points its author.url here.
export const revalidate = 900

const SITE = 'https://www.econolens.co.in'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const c = await getContributorBySlug(params.slug)
    if (!c) return {}
    const description = [c.credentials, c.institution].filter(Boolean).join(' · ') || `Articles by ${c.name} on EconoLens.`
    return {
      title: `${c.name} — EconoLens`,
      description: description.slice(0, 160),
      alternates: { canonical: `${SITE}/authors/${params.slug}` },
    }
  } catch {
    return {}
  }
}

function formatDate(d?: string) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  let contributor: any = null
  try {
    contributor = await getContributorBySlug(params.slug)
  } catch {
    contributor = null
  }
  if (!contributor) notFound()

  let articles: any[] = []
  try {
    articles = (await getArticlesByAuthor(contributor._id)) || []
  } catch {
    articles = []
  }

  let photoUrl: string | undefined
  try {
    photoUrl = contributor.photo?.asset ? urlFor(contributor.photo).width(160).height(160).fit('crop').url() : undefined
  } catch {
    photoUrl = undefined
  }

  const links = contributor.socialLinks || {}
  const sameAs = [links.linkedin, links.twitter, links.website, links.googleScholar].filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: contributor.name,
      url: `${SITE}/authors/${params.slug}`,
      ...(contributor.credentials ? { jobTitle: contributor.credentials } : {}),
      ...(contributor.institution ? { affiliation: { '@type': 'Organization', name: contributor.institution } } : {}),
      ...(contributor.bio ? { description: contributor.bio } : {}),
      ...(sameAs.length ? { sameAs } : {}),
      ...(photoUrl ? { image: photoUrl } : {}),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section style={{ padding: '56px 0 40px', borderBottom: '0.5px solid var(--ink-border)', background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '720px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt={contributor.name} width={80} height={80} style={{ borderRadius: '50%', flexShrink: 0 }} />
            ) : (
              <div aria-hidden style={{ width: 64, height: 64, flexShrink: 0, border: '0.5px solid var(--ink-border-2)', background: 'var(--ink-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)' }}>
                {contributor.name?.charAt(0)}
              </div>
            )}
            <div>
              <p className="label-mono" style={{ marginBottom: '10px' }}>
                <Link href="/authors" style={{ color: 'inherit', textDecoration: 'none' }}>Authors</Link>
              </p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.625rem, 3vw, 2.25rem)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.15, margin: '0 0 10px' }}>
                {contributor.name}
              </h1>
              {contributor.credentials && <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>{contributor.credentials}</p>}
              {contributor.institution && <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>{contributor.institution}</p>}
              {contributor.bio && <p style={{ margin: '14px 0 0', fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{contributor.bio}</p>}
              {sameAs.length > 0 && (
                <p style={{ margin: '12px 0 0', display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '0.8125rem' }}>
                  {links.linkedin && <a href={links.linkedin} target="_blank" rel="noopener noreferrer me" style={{ color: 'var(--accent)' }}>LinkedIn</a>}
                  {links.googleScholar && <a href={links.googleScholar} target="_blank" rel="noopener noreferrer me" style={{ color: 'var(--accent)' }}>Google Scholar</a>}
                  {links.twitter && <a href={links.twitter} target="_blank" rel="noopener noreferrer me" style={{ color: 'var(--accent)' }}>X</a>}
                  {links.website && <a href={links.website} target="_blank" rel="noopener noreferrer me" style={{ color: 'var(--accent)' }}>Website</a>}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0 64px' }}>
        <div className="container">
          <div style={{ maxWidth: '720px' }}>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 400, margin: '0 0 18px' }}>
              {articles.length} published {articles.length === 1 ? 'article' : 'articles'}
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {articles.map((a) => (
                <li key={a._id} style={{ borderBottom: '0.5px solid var(--ink-border)', paddingBottom: '14px' }}>
                  <Link href={`/news/${a.slug?.current}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 }}>
                    {a.title}
                  </Link>
                  <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.06em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    {[a.category?.title, a.publishedAt ? formatDate(a.publishedAt) : ''].filter(Boolean).join(' · ')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

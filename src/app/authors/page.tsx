import Link from 'next/link'
import { getContributorsWithArticles } from '@/lib/sanity'
import { PolicyBody, PolicyHeader, linkStyle } from '@/components/PolicyPage'

export const revalidate = 900

export const metadata = {
  title: 'Authors — EconoLens',
  description: 'The economists and desks behind EconoLens articles, with their credentials and published work.',
  alternates: { canonical: 'https://www.econolens.co.in/authors' },
}

type Row = { name: string; slug: string; credentials?: string; count: number }

export default async function AuthorsPage() {
  let authors: Row[] = []
  try {
    authors = (await getContributorsWithArticles()) || []
  } catch {
    authors = []
  }

  return (
    <>
      <PolicyHeader
        eyebrow="Company"
        title="Authors"
        intro={
          <p style={{ margin: 0 }}>
            Every EconoLens article carries a named byline. These are the people and desks who write and review our work. How we
            check it is set out in our <Link href="/fact-checking-methodology" style={linkStyle}>Fact-Checking Methodology</Link>.
          </p>
        }
      />
      <PolicyBody>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {authors.map((a) => (
            <li key={a.slug} style={{ borderBottom: '0.5px solid var(--ink-border)', paddingBottom: '18px' }}>
              <Link href={`/authors/${a.slug}`} style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                {a.name}
              </Link>
              {a.credentials && <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{a.credentials}</p>}
              <p style={{ margin: '6px 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.06em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                {a.count} {a.count === 1 ? 'article' : 'articles'}
              </p>
            </li>
          ))}
        </ul>
      </PolicyBody>
    </>
  )
}

import Link from 'next/link'
import { getCorrections } from '@/lib/sanity'
import { PolicyBody, PolicyHeader, PolicySection, linkStyle } from '@/components/PolicyPage'

export const revalidate = 900

export const metadata = {
  title: 'Corrections — EconoLens',
  description:
    'Every material correction to EconoLens articles, with the date and what changed, plus how to report an error.',
  alternates: { canonical: 'https://www.econolens.co.in/corrections' },
}

type Row = { title: string; slug: string; items: { date?: string; note?: string }[] }

export default async function CorrectionsPage() {
  let rows: Row[] = []
  try {
    rows = (await getCorrections()) || []
  } catch {
    rows = []
  }

  // Flatten to one entry per correction, newest first.
  const entries = rows
    .flatMap((r) => (r.items || []).map((c) => ({ ...c, title: r.title, slug: r.slug })))
    .filter((e) => e.note)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  return (
    <>
      <PolicyHeader
        eyebrow="Standards"
        title="Corrections"
        intro={
          <p style={{ margin: 0 }}>
            When we get something wrong, we fix it and say so. This page lists every correction that changed the meaning of an
            article, with the date and what was corrected.
          </p>
        }
      />
      <PolicyBody>
        <PolicySection title="Our policy">
          <p>
            Errors of fact that change the meaning of an article are corrected in the text, and a dated correction note is added at
            the end of the article and listed below. Minor fixes such as typos or formatting are made without a note. How we check
            articles before publication is set out in our{' '}
            <Link href="/fact-checking-methodology" style={linkStyle}>Fact-Checking Methodology</Link>.
          </p>
        </PolicySection>

        <PolicySection title="Report an error">
          <p>
            Use the <Link href="/contact" style={linkStyle}>Contact</Link> page and include the article link and the specific issue.
            We aim to acknowledge reports within two business days.
          </p>
        </PolicySection>

        <PolicySection title="Corrections log">
          {entries.length === 0 ? (
            <p>No corrections have been logged since this log began on 14 October 2026.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {entries.map((e, i) => (
                <li key={i} style={{ borderLeft: '2px solid var(--ink-border-2)', paddingLeft: '14px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                    {e.date ? <time dateTime={e.date}>{e.date}</time> : null}
                  </div>
                  <Link href={`/news/${e.slug}#corrections`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    {e.title}
                  </Link>
                  <p style={{ margin: '4px 0 0' }}>{e.note}</p>
                </li>
              ))}
            </ul>
          )}
        </PolicySection>
      </PolicyBody>
    </>
  )
}

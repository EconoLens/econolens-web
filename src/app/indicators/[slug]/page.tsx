import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getIndicatorBySlug, getAllIndicatorSlugs } from '@/lib/indicators'
import MacroChart from '@/components/indicators/MacroChart'

// FRED-backed series are quoted at most daily and India series are manually
// maintained (see src/lib/indicators.ts) — an hourly revalidate matches
// /indicators (the listing page) without pretending this is tick-by-tick data.
export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAllIndicatorSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const indicator = await getIndicatorBySlug(params.slug)
  if (!indicator) return {}

  const valueText = indicator.latestValue != null ? `${indicator.latestValue} ${indicator.unit}` : 'data unavailable'
  const description = `${indicator.name} — currently ${valueText}${
    indicator.latestDate ? `, as of ${indicator.latestDate}` : ''
  }. Sourced from ${indicator.source}.`

  return {
    title: `${indicator.name} — Live Data & Chart | EconoLens`,
    description,
    alternates: { canonical: `https://econolens.co.in/indicators/${indicator.slug}` },
    openGraph: { title: indicator.name, description, type: 'website' },
  }
}

function formatValue(value: number | null, unit: string): string {
  if (value == null || Number.isNaN(value)) return '—'
  if (unit === 'Billions USD' && Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(2)}T`
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (Math.abs(value) >= 1_000) return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
  return value.toFixed(2)
}

function formatChange(change: number, trend: string) {
  if (!change || trend === 'stable') return { text: '—', color: 'var(--text-tertiary)' }
  const sign = change > 0 ? '▲' : '▼'
  return {
    text: `${sign} ${Math.abs(change).toFixed(2)}`,
    color: change > 0 ? 'var(--positive)' : 'var(--negative)',
  }
}

export default async function IndicatorDetailPage({ params }: { params: { slug: string } }) {
  const indicator = await getIndicatorBySlug(params.slug)
  if (!indicator) notFound()

  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: indicator.name,
    description: `${indicator.name} (${indicator.unit}). Sourced from ${indicator.source}.`,
    url: `https://econolens.co.in/indicators/${indicator.slug}`,
    license: 'https://econolens.co.in/terms',
    isAccessibleForFree: true,
    creator: { '@type': 'Organization', name: 'EconoLens', url: 'https://econolens.co.in' },
    ...(indicator.points.length > 1
      ? {
          distribution: [
            {
              '@type': 'DataDownload',
              encodingFormat: 'text/csv',
              contentUrl: `https://econolens.co.in/api/indicators/${indicator.slug}/csv`,
            },
          ],
          temporalCoverage: `${indicator.points[0].date}/${indicator.points[indicator.points.length - 1].date}`,
        }
      : {}),
    variableMeasured: indicator.name,
    ...(indicator.latestValue != null
      ? {
          additionalProperty: [
            { '@type': 'PropertyValue', name: 'latestValue', value: indicator.latestValue, unitText: indicator.unit },
            { '@type': 'PropertyValue', name: 'asOf', value: indicator.latestDate },
          ],
        }
      : {}),
  }

  const change = formatChange(indicator.change, indicator.trend)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />

      <div style={{ background: 'var(--ink)', borderBottom: '3px solid var(--gold)', padding: '40px 0 36px' }}>
        <div className="container">
          <Link
            href="/indicators"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', textDecoration: 'none' }}
          >
            ← All Indicators
          </Link>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', margin: '16px 0 12px' }}>
            {indicator.category} · {indicator.country}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 16 }}>
            {indicator.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', color: 'var(--text-primary)' }}>
              {formatValue(indicator.latestValue, indicator.unit)}
            </span>
            <span style={{ fontSize: '0.9375rem', color: 'var(--text-tertiary)' }}>{indicator.unit}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', color: change.color }}>{change.text}</span>
          </div>
          {indicator.latestDate && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: 8 }}>
              As of {indicator.latestDate}
            </p>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <MacroChart points={indicator.points} unit={indicator.unit} name={indicator.name} />

        {indicator.points.length > 1 && (
          <div style={{ marginTop: 20 }}>
            <a
              href={`/api/indicators/${indicator.slug}/csv`}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
                background: 'var(--gold)',
                padding: '10px 18px',
                textDecoration: 'none',
              }}
            >
              Export Chart Data (.CSV)
            </a>
          </div>
        )}

        {indicator.isStatic && (
          <p style={{ marginTop: 24, fontSize: '0.8125rem', color: 'var(--text-tertiary)', maxWidth: 640 }}>
            This figure is manually compiled and updated periodically — India-specific series don't yet have a
            free, live data API the way US/global FRED series do. It is not a real-time feed.
          </p>
        )}

        <footer style={{ marginTop: 32, borderTop: '0.5px solid var(--ink-border)', paddingTop: 20 }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Source:{' '}
            <a href={indicator.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>
              {indicator.source}
            </a>
          </p>
          <p style={{ marginTop: 16, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            Data provided as-is for informational purposes only.
          </p>
        </footer>
      </div>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SHOP_SECTIONS, actionFor, formatPrice, getProduct } from '@/lib/shop'

export const revalidate = 600

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProduct(params.slug)
  if (!p) return { title: 'Shop | EconoLens' }
  return {
    title: `${p.title} | EconoLens Shop`,
    description: p.tagline,
    alternates: { canonical: `https://www.econolens.co.in/shop/${p.slug}` },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug)
  if (!p) notFound()
  const action = actionFor(p)
  const section = SHOP_SECTIONS.find((s) => s.id === p.section)

  const jsonLd =
    typeof p.price === 'number' && p.buyUrl
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.title,
          description: p.tagline,
          brand: { '@type': 'Brand', name: 'EconoLens' },
          offers: { '@type': 'Offer', price: p.price, priceCurrency: 'INR', url: p.buyUrl, availability: 'https://schema.org/InStock' },
        }
      : null

  return (
    <article className="container-narrow" style={{ padding: '40px 24px 72px' }}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '20px', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
        <Link href="/shop" style={{ color: 'var(--text-secondary)' }}>Shop</Link>
        {section && (
          <>
            {' / '}
            <Link href={`/shop#${section.id}`} style={{ color: 'var(--text-secondary)' }}>{section.title}</Link>
          </>
        )}
      </nav>
      {p.format && <p className="label-mono" style={{ marginBottom: '10px' }}>{p.format}</p>}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 2.75rem)', lineHeight: 1.1, color: 'var(--text-primary)', fontWeight: 600, marginBottom: '14px' }}>
        {p.title}
      </h1>
      <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>{p.tagline}</p>

      {p.coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.coverUrl} alt={p.coverAlt || p.title} style={{ width: '100%', marginBottom: '24px' }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', padding: '18px 0', borderTop: '0.5px solid var(--ink-border)', borderBottom: '0.5px solid var(--ink-border)', marginBottom: '28px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--gold-light)', fontWeight: 600 }}>{formatPrice(p)}</span>
        {typeof p.price === 'number' && p.priceNote && <span className="label-mono">{p.priceNote}</span>}
        {action.href ? (
          <a href={action.href} className="btn-subscribe" {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {action.label}
          </a>
        ) : (
          <span className="label-mono" style={{ border: '0.5px solid var(--ink-border)', padding: '6px 12px' }}>Coming soon</span>
        )}
      </div>

      {p.description && (
        <p style={{ color: 'var(--text-primary)', lineHeight: 1.75, fontSize: '1.0625rem', marginBottom: '24px' }}>{p.description}</p>
      )}

      {p.includes && p.includes.length > 0 && (
        <>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '10px' }}>What’s included</h2>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px', marginBottom: '24px' }}>
            {p.includes.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </>
      )}

      {p.audience && (
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Who it is for:</strong> {p.audience}
        </p>
      )}

      <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
        For education and personal planning only; not financial, investment, tax or legal advice. Questions:{' '}
        <a href="mailto:contact@econolens.co.in" style={{ color: 'var(--accent)' }}>contact@econolens.co.in</a>.
      </p>
    </article>
  )
}

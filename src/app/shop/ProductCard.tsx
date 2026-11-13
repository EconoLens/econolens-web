import Link from 'next/link'
import { actionFor, formatPrice, type Product } from '@/lib/shop'

export default function ProductCard({ product }: { product: Product }) {
  const action = actionFor(product)
  return (
    <article
      style={{
        background: 'var(--ink-mid)',
        border: '0.5px solid var(--ink-border)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {product.coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.coverUrl} alt={product.coverAlt || product.title} style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }} />
      )}
      {product.format && <p className="label-mono">{product.format}</p>}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', lineHeight: 1.2, color: 'var(--text-primary)', fontWeight: 600 }}>
        <Link href={`/shop/${product.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {product.title}
        </Link>
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.55 }}>{product.tagline}</p>
      {product.includes && product.includes.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
          {product.includes.slice(0, 4).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', color: 'var(--gold-light)', fontWeight: 600 }}>
          {formatPrice(product)}
        </span>
        <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href={`/shop/${product.slug}`} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Details
          </Link>
          {action.href ? (
            <a
              href={action.href}
              className="btn-subscribe"
              {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {action.label}
            </a>
          ) : (
            <span className="label-mono" style={{ border: '0.5px solid var(--ink-border)', padding: '6px 12px' }}>
              Coming soon
            </span>
          )}
        </span>
      </div>
    </article>
  )
}

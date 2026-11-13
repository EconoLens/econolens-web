import type { Metadata } from 'next'
import { SHOP_SECTIONS, getProducts } from '@/lib/shop'
import ProductCard from './ProductCard'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Shop — Exam Notes, Excel Templates and Project Reports',
  description:
    'Economics exam notes for UGC-NET, RBI Grade B and IES, ready-to-use Excel planners and DPR financial models, plus project-report and thesis data-analysis services from EconoLens.',
  alternates: { canonical: 'https://www.econolens.co.in/shop' },
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <>
      <section
        style={{
          padding: '48px 0 40px',
          borderBottom: '0.5px solid var(--ink-border)',
          background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)',
        }}
      >
        <div className="container">
          <p className="label-mono" style={{ marginBottom: '12px' }}>EconoLens Shop</p>
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
            Notes, Templates and Reports Built by Economists
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '680px', marginBottom: '20px' }}>
            The same care we put into every EconoLens article, packaged for your exam preparation, your money
            decisions and your business plans.
          </p>
          <nav aria-label="Shop sections" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SHOP_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  border: '0.5px solid var(--ink-border)',
                  padding: '6px 12px',
                  textDecoration: 'none',
                }}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {SHOP_SECTIONS.map((section) => {
        const items = products.filter((p) => p.section === section.id)
        return (
          <section key={section.id} id={section.id} style={{ padding: '44px 0 8px', scrollMarginTop: '80px' }}>
            <div className="container">
              <p className="label-mono" style={{ marginBottom: '8px' }}>{section.kicker}</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px' }}>
                {section.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', lineHeight: 1.6, marginBottom: '22px' }}>{section.blurb}</p>
              {items.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', border: '0.5px solid var(--ink-border)', padding: '24px' }}>
                  New titles in this section are on the way.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {items.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )
      })}

      <section style={{ padding: '40px 0 64px' }}>
        <div className="container">
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem', lineHeight: 1.6, maxWidth: '760px' }}>
            Templates and notes are for education and personal planning. They are not financial, investment, tax or
            legal advice. See our <a href="/refund-policy" style={{ color: 'var(--accent)' }}>Refund &amp; Cancellation Policy</a> and{' '}
            <a href="/delivery-policy" style={{ color: 'var(--accent)' }}>Delivery Policy</a>. Questions about an order: <a href="mailto:contact@econolens.co.in" style={{ color: 'var(--accent)' }}>contact@econolens.co.in</a>.
          </p>
        </div>
      </section>
    </>
  )
}

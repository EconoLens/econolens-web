import Link from 'next/link'

const FREE_FEATURES = [
  'Three-layer reading (Overview · Explainer · Technical)',
  'Live macro indicators dashboard',
  'Global coverage: central banks, multilateral institutions, research bodies',
  'Original analysis grounded in official sources',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Full article archive access',
  'Institutional research reports',
  'Cancel anytime',
]

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section style={{ padding: '56px 0 48px', borderBottom: '0.5px solid var(--ink-border)', background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)', textAlign: 'center' }}>
        <div className="container">
          <p className="label-mono" style={{ marginBottom: '14px' }}>Simple Pricing</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', lineHeight: 1.1 }}>
            Intelligence that pays for itself
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Start free. Upgrade when you want full access to our economics intelligence platform.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: '56px 0 64px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--ink-border)', maxWidth: '800px', margin: '0 auto' }}>

            {/* Free */}
            <div style={{ background: 'var(--ink-mid)', padding: '36px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
                Free Plan
              </div>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>&#x20B9;0</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '8px' }}>forever</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.5 }}>
                Full access to articles and live indicators. No credit card required.
              </p>
              <div style={{ height: '0.5px', background: 'var(--ink-border)', marginBottom: '24px' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {FREE_FEATURES.map((f) => (
                  <li key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--positive)', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', marginTop: '3px', flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                Start free →
              </Link>
            </div>

            {/* Pro */}
            <div style={{ background: 'var(--ink-light)', padding: '36px', position: 'relative', border: '0.5px solid rgba(196,144,42,0.3)' }}>
              <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)' }}>
                <span style={{ background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 12px', fontWeight: 700 }}>
                  Most Popular
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px', marginTop: '8px' }}>
                Pro Plan
              </div>
              <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>&#x20B9;199</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>/month</span>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)', letterSpacing: '0.06em', marginBottom: '4px' }}>
                OR &#x20B9;1,799/year (save 25%)
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.5 }}>
                Full archive. Priority data. No limits.
              </p>
              <div style={{ height: '0.5px', background: 'rgba(196,144,42,0.3)', marginBottom: '24px' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {PRO_FEATURES.map((f) => (
                  <li key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', marginTop: '3px', flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '0.875rem', color: f === 'Everything in Free' ? 'var(--text-tertiary)' : 'var(--text-secondary)', lineHeight: 1.4 }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/sign-up?plan=pro" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Subscribe &#x20B9;199/month →
              </Link>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.06em', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '12px' }}>
                SECURED VIA RAZORPAY · CANCEL ANYTIME · GST INCLUSIVE
              </p>
            </div>
          </div>

          {/* Institutional */}
          <div style={{ maxWidth: '800px', margin: '1px auto 0', background: 'var(--ink-mid)', border: '0.5px solid var(--ink-border)', borderTop: '0.5px solid var(--ink-border)', padding: '28px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
                Institutional Access
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                For universities, research institutes, and think tanks
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Bulk licences · SSO · White-label reports · Custom data feeds
              </p>
            </div>
            <a href="mailto:khagankp@gmail.com?subject=EconoLens Institutional Access" className="btn-outline" style={{ flexShrink: 0 }}>
              Contact us →
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 0 64px', borderTop: '0.5px solid var(--ink-border)' }}>
        <div className="container" style={{ paddingTop: '48px' }}>
          <div className="section-header">
            <span className="section-title">Frequently Asked Questions</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '800px' }}>
            {[
              { q: 'Is the free plan really free?', a: 'Yes, forever. Full access to articles and live indicators. No credit card required.' },
              { q: 'What payment methods are accepted?', a: 'UPI, credit/debit cards, net banking, and wallets via Razorpay. Secure and instant.' },
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your dashboard and your Pro access continues until the billing cycle ends.' },
              { q: 'Is this SEBI compliant?', a: 'EconoLens is an information platform, not a financial advisor. All content carries appropriate disclaimers.' },
            ].map((faq) => (
              <div key={faq.q} style={{ padding: '20px', border: '0.5px solid var(--ink-border)', background: 'var(--ink-mid)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 500 }}>{faq.q}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
                                  }

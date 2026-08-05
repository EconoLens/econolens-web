import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | EconoLens',
  description: 'Terms of service for EconoLens.',
}

export default function TermsPage() {
  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px 80px' }}>
      <header style={{ borderBottom: '0.5px solid var(--ink-border)', paddingBottom: '32px', marginBottom: '40px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '12px' }}>Legal</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Terms of Service
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)', marginTop: '8px' }}>Last updated: June 2026</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Acceptance of terms</h2>
          <p>
            By accessing or using EconoLens (&quot;the Service&quot;), you agree to be bound by
            these Terms of Service. If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Use of the Service</h2>
          <p>
            EconoLens provides original economics news, analysis, macro indicators, and educational
            content for informational purposes only. You must not use the Service for any unlawful
            purpose or in a way that violates these terms.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Free and paid tiers</h2>
          <p>
            Free accounts have access to all published articles, macro indicators, and study content.
            Paid subscriptions unlock premium features as described on the Pricing page. We reserve
            the right to change pricing and tier benefits with reasonable notice.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Disclaimer</h2>
          <p>
            Content on EconoLens is for informational and educational purposes only and does not
            constitute financial, investment, or legal advice. We make no warranties about the
            accuracy or completeness of any content on the platform.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Intellectual property</h2>
          <p>
            All original articles, analysis, and content on EconoLens are the property of
            Econolens Media and Technology. You may not reproduce or republish content without
            written permission. Source data is attributed to the respective institutions.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, EconoLens shall not be liable for any indirect,
            incidental, or consequential damages arising from your use of the Service.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Changes to terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the Service after changes
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Contact</h2>
          <p>
            Questions about these terms? Email{' '}
            <a href="mailto:contact@econolens.co.in" style={{ color: 'var(--gold)', textDecoration: 'none', borderBottom: '0.5px solid var(--gold)' }}>
              contact@econolens.co.in
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}

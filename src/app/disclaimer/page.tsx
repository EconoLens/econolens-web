import Link from 'next/link'

export const metadata = {
  title: 'Disclaimer — EconoLens',
  description: 'Legal disclaimer for EconoLens. Not financial advice. For educational purposes only.',
}

export default function DisclaimerPage() {
  return (
    <>
      <section style={{ padding: '56px 0 48px', borderBottom: '0.5px solid var(--ink-border)', background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '680px' }}>
            <p className="label-mono" style={{ marginBottom: '14px' }}>Legal</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '16px' }}>
              Disclaimer
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Please read this disclaimer carefully before using EconoLens.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 0 64px' }}>
        <div className="container">
          <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Not Financial Advice
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                EconoLens is an economics information and educational platform. Nothing on this website constitutes financial, investment, legal, or tax advice. All content is for informational and educational purposes only. EconoLens is not a SEBI-registered investment advisor, research analyst, or financial planner.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                No Investment Recommendations
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                Any mention of specific securities, indices, funds, companies, or economic policies is for illustrative or educational purposes only. It does not constitute a recommendation to buy, sell, or hold any financial instrument. Past performance is not indicative of future results.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Accuracy of Information
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                While we strive to ensure that all information is accurate and up to date, EconoLens makes no warranties about the completeness, reliability, or accuracy of any content. Economic data and market conditions can change rapidly. Always verify information with primary sources before making any decisions.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Third-Party Sources
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                EconoLens references and synthesises data from official institutions including central banks, multilateral organisations, and government bodies. We are not affiliated with any of these institutions. Links to external websites are provided for reference only — we are not responsible for the content of external sites.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Limitation of Liability
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                EconoLens and Econolens Media and Technology shall not be liable for any financial loss, indirect, incidental, or consequential damages arising from the use of, or inability to use, any content on this platform.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Contact
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                For questions about this disclaimer, please contact us at{' '}
                <a href="mailto:khagankp@gmail.com" style={{ color: 'var(--gold)' }}>khagankp@gmail.com</a>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '0.5px solid var(--ink-border)' }}>
              <Link href="/privacy" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.5625rem' }}>Privacy Policy</Link>
              <Link href="/terms" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.5625rem' }}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
              }

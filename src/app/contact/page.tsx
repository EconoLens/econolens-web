export const metadata = {
  title: 'Contact — EconoLens',
  description: 'How to reach the EconoLens editorial and operations team — corrections, tips, partnerships, and general enquiries.',
}

export default function ContactPage() {
  return (
    <>
      <section style={{ padding: '56px 0 48px', borderBottom: '0.5px solid var(--ink-border)', background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '680px' }}>
            <p className="label-mono" style={{ marginBottom: '14px' }}>Company</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '16px' }}>
              Contact
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Our editorial and operations team is here to help with coverage questions, corrections, and enquiries. Here is how to reach us.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 0 64px' }}>
        <div className="container">
          <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                General &amp; Editorial Enquiries
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                For questions about our coverage, story tips, partnership or contributor enquiries, or anything else, write to{' '}
                <a href="mailto:contact@econolens.co.in" style={{ color: 'var(--accent)' }}>contact@econolens.co.in</a>. We read every message and aim to reply within two business days.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Report a Correction
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                If you believe something we published is inaccurate, please email{' '}
                <a href="mailto:contact@econolens.co.in" style={{ color: 'var(--accent)' }}>contact@econolens.co.in</a> with the article link and a description of the issue. See our{' '}
                <a href="/editorial-policy" style={{ color: 'var(--accent)' }}>Editorial Policy</a> for how we handle corrections.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Registered Entity
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                EconoLens is published by Econolens Media and Technology, a sole proprietorship based in India. Read more about our team and mission on the{' '}
                <a href="/about" style={{ color: 'var(--accent)' }}>About</a> page.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

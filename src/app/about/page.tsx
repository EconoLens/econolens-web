import Link from 'next/link'

const LAYERS = [
  { num: '01', title: 'Overview', desc: '200-word plain English summary. Every article starts here — no jargon, no prerequisites.' },
  { num: '02', title: 'Explainer', desc: 'Economic context, historical precedents, and policy implications explained clearly.' },
  { num: '03', title: 'Technical', desc: 'Full academic depth. Econometric data. Policy frameworks. For professionals and researchers.' },
]

const SOURCES = [
  'Reserve Bank of India (RBI)',
  'International Monetary Fund (IMF)',
  'World Bank',
  'US Federal Reserve (FRED)',
  'European Central Bank (ECB)',
  'National Bureau of Economic Research (NBER)',
  'PIIE · Peterson Institute',
  'Brookings Institution',
  'VoxEU · CEPR',
  'SSRN · Social Science Research Network',
  'Ministry of Finance, India',
  'NITI Aayog',
]

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section id="mission" style={{ padding: '64px 0 56px', borderBottom: '0.5px solid var(--ink-border)', background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '680px' }}>
            <p className="label-mono" style={{ marginBottom: '16px' }}>Our Mission</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.02em' }}>
              Economics made clear.<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>The world made legible.</em>
            </h1>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '14px' }}>
              EconoLens was built on a simple observation: the world&apos;s best economics intelligence is scattered across expensive terminals, paywalled journals, and English-first platforms designed for narrow audiences.
            </p>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Students, investors, journalists, and policymakers deserve the same quality of insight — written at every level of depth and grounded in official sources.
            </p>
          </div>
        </div>
      </section>

      {/* Three-layer architecture */}
      <section style={{ padding: '56px 0', borderBottom: '0.5px solid var(--ink-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-title-gold">The Three-Layer Method</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '560px', lineHeight: 1.7, marginBottom: '32px' }}>
            Every EconoLens article has three reading layers — choose your depth. The same story, three levels of complexity.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--ink-border)' }}>
            {LAYERS.map((layer) => (
              <div key={layer.num} style={{ background: 'var(--ink-mid)', padding: '28px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  Layer {layer.num}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 500, color: 'var(--gold)', marginBottom: '12px' }}>
                  {layer.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {layer.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial process */}
      <section style={{ padding: '56px 0', borderBottom: '0.5px solid var(--ink-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
            <div>
              <div className="section-header" style={{ marginBottom: '20px' }}>
                <span className="section-title">How It Works</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.75, marginBottom: '16px' }}>
                Our editorial team monitors official sources — central banks, multilateral institutions, and leading research bodies — and synthesises developments into structured, original articles.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.75, marginBottom: '24px' }}>
                Every article undergoes: plagiarism check, three-layer structure verification, and SEBI disclaimer compliance for any price mentions.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '16px', paddingBottom: '8px', borderBottom: '0.5px solid var(--ink-border)' }}>
                Primary Sources
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--ink-border)' }}>
                {SOURCES.map((src) => (
                  <div key={src} style={{ background: 'var(--ink-mid)', padding: '10px 12px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {src}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section id="founders" style={{ padding: '56px 0', borderBottom: '0.5px solid var(--ink-border)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <span className="section-title-gold">Who We Are</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '48px', alignItems: 'start' }}>
            <div style={{ background: 'var(--ink-mid)', border: '0.5px solid var(--ink-border)', padding: '28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>Founder</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Khagan Rao</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-tertiary)', letterSpacing: '0.06em', marginBottom: '20px' }}>PhD Researcher · Econometrics</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                {['Econometrics', 'Panel Data', 'VAR · ARDL', 'Quantitative Research'].map(tag => (
                  <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)', border: '0.5px solid var(--ink-border-2)', padding: '3px 8px', display: 'inline-block', width: 'fit-content' }}>{tag}</span>
                ))}
              </div>
              <a href="https://www.linkedin.com/in/khagan-raoab5a40183" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--gold)', letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}>LinkedIn →</a>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.75, marginBottom: '20px' }}>
                EconoLens was founded by Khagan Rao, a PhD researcher in Econometrics at SV University with an MA in Econometrics and Quantitative Economics. With over four years of specialised experience in statistical modelling, panel data analysis, and academic research, Khagan built EconoLens to close the gap between high-quality economics research and the people who need it most.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.75, marginBottom: '24px' }}>
                The insight was clear: the world&apos;s best economics intelligence sits behind expensive terminals and paywalled journals. Students, journalists, investors, and policymakers deserve rigorous analysis — written at every level of depth and grounded in official sources.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--ink-border)' }}>
                {[
                  { label: 'Specialisation', value: 'Econometrics & Quantitative Economics' },
                  { label: 'Education', value: 'MA · SV University · 2019–2021' },
                  { label: 'Research Tools', value: 'Stata · R · EViews · Python' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--ink-mid)', padding: '16px 18px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>{item.label}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Legal entity */}
      <section style={{ padding: '48px 0 64px' }}>
        <div className="container">
          <div style={{ maxWidth: '560px' }}>
            <div className="section-header" style={{ marginBottom: '20px' }}>
              <span className="section-title">Legal &amp; Compliance</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '12px' }}>
              EconoLens is operated by <strong style={{ color: 'var(--text-primary)' }}>Econolens Media and Technology</strong>, a sole proprietorship registered in India. We are an information platform — not a SEBI-registered investment advisor. All content is for educational purposes only.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '24px' }}>
              All articles carry source attribution. No content is reproduced verbatim — all articles are original syntheses grounded in official sources.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/privacy" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.5625rem' }}>Privacy Policy</Link>
              <Link href="/terms" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.5625rem' }}>Terms of Service</Link>
              <Link href="/disclaimer" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.5625rem' }}>Disclaimer</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
                             }

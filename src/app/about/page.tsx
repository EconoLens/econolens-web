import Link from 'next/link'

const LAYERS = [
  { num: '01', title: 'Overview', desc: '200-word plain English summary. Every article starts here — no jargon, no prerequisites.' },
  { num: '02', title: 'Explainer', desc: '600-word context layer. What it means for India. Historical precedents. Policy implications.' },
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
      <section style={{ padding: '64px 0 56px', borderBottom: '0.5px solid var(--ink-border)', background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '680px' }}>
            <p className="label-mono" style={{ marginBottom: '16px' }}>Our Mission</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.02em' }}>
              Economics made clear.<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>India made central.</em>
            </h1>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '14px' }}>
              EconoLens was built on a simple observation: the world&apos;s best economics intelligence is scattered across expensive terminals, paywalled journals, and English-first platforms designed for Western audiences.
            </p>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Indian students, investors, journalists, and policymakers deserve the same quality of insight — filtered through India&apos;s economic context, written at every level of depth, and priced for India.
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

      {/* AI-assisted process */}
      <section style={{ padding: '56px 0', borderBottom: '0.5px solid var(--ink-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
            <div>
              <div className="section-header" style={{ marginBottom: '20px' }}>
                <span className="section-title">How It Works</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.75, marginBottom: '16px' }}>
                Every 15 minutes, our AI pipeline monitors 50+ official sources — central banks, multilateral institutions, and top research bodies. When new content is published, it&apos;s synthesised (never copied), checked for originality, and published within minutes.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.75, marginBottom: '24px' }}>
                Every article undergoes: plagiarism check (Copyscape &lt;10%), India context review, three-layer structure verification, and SEBI disclaimer compliance for any price mentions.
              </p>
              <div style={{ padding: '16px', background: 'var(--ink-mid)', border: '0.5px solid var(--ink-border)', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)', letterSpacing: '0.06em', lineHeight: 1.8 }}>
                RSS FEED → MAKE.COM → CLAUDE API (CACHED) → COPYSCAPE → SANITY CMS → BUFFER → BEEHIIV
              </div>
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

      {/* Legal entity */}
      <section style={{ padding: '48px 0 64px' }}>
        <div className="container">
          <div style={{ maxWidth: '560px' }}>
            <div className="section-header" style={{ marginBottom: '20px' }}>
              <span className="section-title">Legal & Compliance</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '12px' }}>
              EconoLens is operated by <strong style={{ color: 'var(--text-primary)' }}>Econolens Media and Technology</strong>, a sole proprietorship registered in India. We are an information platform — not a SEBI-registered investment advisor. All content is for educational purposes only.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '24px' }}>
              AI-generated content is clearly labelled. All articles carry source attribution. No content is reproduced verbatim — all articles are original syntheses grounded in official sources.
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

export const metadata = {
  title: 'Editorial Policy — EconoLens',
  description: 'How EconoLens sources, fact-checks, and corrects its economics coverage — our editorial standards in full.',
}

export default function EditorialPolicyPage() {
  return (
    <>
      <section style={{ padding: '56px 0 48px', borderBottom: '0.5px solid var(--ink-border)', background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '680px' }}>
            <p className="label-mono" style={{ marginBottom: '14px' }}>Company</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '16px' }}>
              Editorial Policy
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              How EconoLens decides what to cover, where our facts come from, how we check them, and what happens when we get something wrong.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 0 64px' }}>
        <div className="container">
          <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Who We Are
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                EconoLens is an independent economics intelligence platform published by Econolens Media and Technology, a sole proprietorship based in India. We are not affiliated with, funded by, or beholden to any government body, central bank, political party, or financial institution we cover. Our team's backgrounds and credentials are described on the{' '}
                <a href="/about" style={{ color: 'var(--accent)' }}>About</a> page.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Sourcing Standards
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '10px' }}>
                Every data-driven article on EconoLens is built on official, primary-source releases — central bank statements, statistical-office bulletins, and international-institution reports. Our primary source hierarchy, from highest to lowest confidence, is:
              </p>
              <ul style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.9, paddingLeft: '20px', margin: 0 }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Primary, zero-risk sources:</strong> RBI, SEBI, Ministry of Finance, MOSPI, IMF, World Bank, US Federal Reserve, ECB, Bank of England, Bank of Japan.</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>Academic and research sources:</strong> NBER, SSRN, REPEC working papers — cited and paraphrased, never presented as settled fact where a paper's findings are preliminary.</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>Secondary reporting</strong> (wire services, other outlets) is used only to confirm a fact is publicly known, never quoted, and never our sole source for a claim.</li>
              </ul>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginTop: '10px' }}>
                Every article names its source institution and links to the original release wherever one is publicly available. We do not reproduce sentences from copyrighted news reporting; we synthesise official data into our own original analysis.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                How Articles Are Made
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                News-desk articles are drafted with AI assistance from official releases and are always labelled "AI-assisted" with the source institution named. No article is published automatically: every draft is reviewed by a member of our editorial team before it goes live, and every draft is required to include original analysis — an interpretation, comparison, or implication that goes beyond restating the source release — plus a chart or data table drawn from the underlying dataset. Longer-form Study and Research pieces are written and reviewed the same way, with a human author on every byline.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Fact-Checking
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                Before publication, every article is checked against its cited source for numerical accuracy (figures, dates, units, percentage changes) and run through an originality check to confirm it is not duplicating another publication's language. A sample of published articles is re-reviewed by a second team member on an ongoing basis. Where a claim cannot be verified against a primary source, it is either removed or explicitly attributed and caveated.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Corrections
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                We correct errors as soon as we confirm them. A factual error that changes the meaning of an article is corrected in the text and noted with a dated correction line at the bottom of the article stating what was changed and why. Minor errors (typos, formatting) are fixed without a formal note. If you spot something that looks wrong, please tell us — see{' '}
                <a href="/contact" style={{ color: 'var(--accent)' }}>Contact</a> — and include the article link and the specific issue. We aim to acknowledge correction reports within two business days.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                What EconoLens Is Not
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                EconoLens is an economics news and education platform, not a SEBI-registered investment advisor or research analyst. Nothing we publish is financial, investment, legal, or tax advice — see our{' '}
                <a href="/disclaimer" style={{ color: 'var(--accent)' }}>Disclaimer</a> for full detail.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

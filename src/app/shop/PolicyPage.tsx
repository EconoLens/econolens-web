export default function PolicyPage({ kicker, title, updated, children }: { kicker: string; title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <section style={{ padding: '56px 0 40px', borderBottom: '0.5px solid var(--ink-border)', background: 'linear-gradient(180deg, #071320 0%, var(--ink) 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '720px' }}>
            <p className="label-mono" style={{ marginBottom: '14px' }}>{kicker}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '12px' }}>{title}</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Last updated: {updated}</p>
          </div>
        </div>
      </section>
      <section style={{ padding: '40px 0 64px' }}>
        <div className="container">
          <div className="policy-body" style={{ maxWidth: '720px', color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.9688rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {children}
          </div>
        </div>
      </section>
    </>
  )
}

export function H({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '14px' }}>{children}</h2>
}

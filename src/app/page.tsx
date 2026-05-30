import Link from "next/link";

const mockArticles = [
  {
    slug: "rbi-mpc-april-2026",
    category: "Central Bank",
    source: "Reserve Bank of India",
    title: "RBI holds repo rate at 6.25% as inflation pressures ease",
    excerpt: "The Monetary Policy Committee voted 5-1 to maintain the status quo, citing softer food inflation and global crude weakness.",
    date: "May 20, 2026",
    featured: true,
  },
  {
    slug: "imf-world-economic-outlook-2026",
    category: "International Institution",
    source: "IMF",
    title: "IMF upgrades global growth forecast to 3.3% for 2026",
    excerpt: "Resilient labour markets in advanced economies and easing financial conditions underpin the revision.",
    date: "May 18, 2026",
    featured: false,
  },
  {
    slug: "fed-dot-plot-2026",
    category: "Central Bank",
    source: "US Federal Reserve",
    title: "Fed dot plot signals two more cuts in 2026",
    excerpt: "A dovish FOMC opens room for the RBI to ease, but capital flows and oil remain swing factors for the rupee.",
    date: "May 15, 2026",
    featured: false,
  },
  {
    slug: "india-q4-gdp-fy26",
    category: "Government",
    source: "PIB India",
    title: "India Q4 GDP growth surprises at 7.4% on services and capex push",
    excerpt: "Private investment and government capex lift the full-year print above consensus estimates.",
    date: "May 12, 2026",
    featured: false,
  },
];

export default function HomePage() {
  const [featured, ...rest] = mockArticles;
  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 64, alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20 }}>
                Global Economics Intelligence
              </p>
              <h1 className="hero-headline" style={{ fontSize: "clamp(42px, 6vw, 68px)", color: "#fff", marginBottom: 24 }}>
                The world's economics,<br />
                <span style={{ color: "var(--accent)" }}>straight from the source.</span>
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,255,255,0.65)", maxWidth: 520, marginBottom: 36 }}>
                Every story traced to an official press release — no newspaper rewrites, no wire copy. Central banks, governments, and international institutions only.
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                <Link href="/articles" className="btn-primary">Read latest</Link>
                <Link href="/subscribe" className="btn-outline">Get the weekly brief</Link>
              </div>
            </div>
            {/* Featured article */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", padding: 32 }}>
              <p className="category-badge" style={{ marginBottom: 14 }}>{featured.category} · {featured.source}</p>
              <h2 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 16 }}>
                <Link href={`/articles/${featured.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {featured.title}
                </Link>
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, marginBottom: 20 }}>
                {featured.excerpt}
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.04em" }}>{featured.date}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0 }}>
          {[
            { label: "Official Sources", value: "14" },
            { label: "Countries Covered", value: "25+" },
            { label: "Updated", value: "Live" },
            { label: "Newspapers Used", value: "0" },
          ].map((s) => (
            <div key={s.label} style={{ padding: "16px 40px 16px 0", marginRight: 40, borderRight: "1px solid var(--border)" }}>
              <p className="font-mono-data" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Latest articles */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <p className="section-title">Latest from official sources</p>
          </div>
          <Link href="/articles" style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", textDecoration: "none", letterSpacing: "0.04em" }}>
            View all articles →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--border)" }}>
          {rest.map((article) => (
            <div key={article.slug} className="article-card">
              <p className="category-badge">{article.category}</p>
              <h3 className="font-display" style={{ fontSize: 20, marginTop: 10, marginBottom: 12 }}>
                <Link href={`/articles/${article.slug}`} style={{ color: "var(--ink)", textDecoration: "none" }}>
                  {article.title}
                </Link>
              </h3>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65, marginBottom: 20 }}>{article.excerpt}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{article.date}</span>
                <span className="source-badge">{article.source}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Source legitimacy strip */}
      <section style={{ background: "var(--ink)", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p className="section-title" style={{ color: "var(--accent)", borderBottomColor: "var(--accent)", marginBottom: 32 }}>Our sources</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {["US Federal Reserve", "European Central Bank", "Bank of England", "Reserve Bank of India", "RBA", "IMF", "World Bank", "United Nations", "WTO", "OECD", "BIS", "UK Government", "White House", "PIB India"].map((s) => (
              <span key={s} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", padding: "8px 16px", textTransform: "uppercase" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section style={{ background: "var(--accent-light)", borderTop: "3px solid var(--accent)", padding: "56px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>The weekly EconoLens</p>
          <h2 className="font-display" style={{ fontSize: 36, fontWeight: 700, color: "var(--ink)", marginBottom: 14, lineHeight: 1.1 }}>One email every Sunday.</h2>
          <p style={{ fontSize: 16, color: "var(--muted)", marginBottom: 28 }}>The week in global economics, distilled from official sources. Free. Unsubscribe anytime.</p>
          <Link href="/subscribe" className="btn-primary" style={{ fontSize: 13 }}>Subscribe free</Link>
        </div>
      </section>
    </>
  );
}

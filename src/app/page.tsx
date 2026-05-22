import Link from "next/link";

const mockArticles = [
  {
    slug: "rbi-mpc-april-2026",
    category: "Monetary Policy",
    title: "RBI holds repo rate at 6.25% as inflation pressures ease",
    excerpt:
      "The Monetary Policy Committee voted 5-1 to maintain the status quo, citing softer food inflation and global crude weakness.",
    date: "May 20, 2026",
  },
  {
    slug: "india-q4-gdp-fy26",
    category: "Fiscal Data",
    title: "India Q4 GDP growth surprises at 7.4% on services and capex push",
    excerpt:
      "Manufacturing lags but private investment and government capex lift the full-year print above consensus estimates.",
    date: "May 18, 2026",
  },
  {
    slug: "fed-dot-plot-2026",
    category: "Global",
    title: "Fed dot plot signals two more cuts in 2026 — implications for the rupee",
    excerpt:
      "A dovish FOMC opens room for the RBI to ease, but capital flows and oil remain the swing factors for INR.",
    date: "May 15, 2026",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-neutral-200 bg-gradient-to-b from-neutral-50 to-white">
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
            India · Economics · Research
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
            Economics, decoded for India.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-neutral-600">
            AI-assisted analysis of monetary policy, fiscal data, and global economic
            events — written for Indian students and professionals.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center rounded-md bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Start reading
            </Link>
            <Link
              href="#latest"
              className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
            >
              Latest articles
            </Link>
          </div>
        </div>
      </section>

      <section id="latest" className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Latest</h2>
          <Link href="/articles" className="text-sm text-neutral-600 hover:text-neutral-900">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockArticles.map((article) => (
            <article
              key={article.slug}
              className="group flex flex-col rounded-lg border border-neutral-200 bg-white p-6 transition hover:border-neutral-300 hover:shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                {article.category}
              </p>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-neutral-900 group-hover:text-neutral-700">
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </h3>
              <p className="mt-3 flex-1 text-sm text-neutral-600">{article.excerpt}</p>
              <p className="mt-6 text-xs text-neutral-500">{article.date}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            The weekly EconoLens
          </h2>
          <p className="mt-3 text-neutral-600">
            One email every Sunday. The week in Indian and global economics, distilled.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            <button
              type="submit"
              className="rounded-md bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-neutral-500">Free. Unsubscribe anytime.</p>
        </div>
      </section>
    </main>
  );
}

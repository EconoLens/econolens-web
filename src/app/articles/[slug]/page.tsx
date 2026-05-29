export const dynamic = 'force-dynamic';

import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchArticles, formatDate, slugify, stripHtml } from "@/lib/articles";

export const dynamic = "force-dynamic";

const WORD_LIMIT = 200;

function buildBody(description: string): string {
  const base = stripHtml(description);
  const filler = [
    "India-specific context: this development matters for households and firms in the near term. Inflation expectations, the policy rate stance, and the currency channel each translate global shocks into local outcomes.",
    "Markets read the data through three lenses â fiscal balance, monetary stance, and external sector resilience. The RBI's reaction function weighs growth-inflation trade-offs while watching crude, the rupee, and global capital flows.",
    "What to watch next: high-frequency indicators including GST collections, e-way bills, manufacturing PMI, and credit growth often signal direction ahead of the next official release. The bond market typically prices in expectations several weeks before policy meetings.",
    "Implications for investors and policymakers depend on the persistence of the trend. A single print rarely changes the trajectory, but a confluence of signals across CPI, IIP, and external accounts can shift the consensus call.",
  ];
  return [base, ...filler].join("\n\n");
}

function splitAtWordLimit(text: string, limit: number): { visible: string; locked: string } {
  const words = text.split(/\s+/);
  if (words.length <= limit) return { visible: text, locked: "" };
  return {
    visible: words.slice(0, limit).join(" "),
    locked: words.slice(limit).join(" "),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const articles = await fetchArticles();
  const article = articles.find((a) => slugify(a.title) === params.slug);

  if (!article) {
    notFound();
  }

  const title = stripHtml(article.title);
  const body = buildBody(article.description);
  const { visible, locked } = splitAtWordLimit(body, WORD_LIMIT);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/articles" className="text-sm text-neutral-600 hover:text-neutral-900">
        â All articles
      </Link>

      <header className="mt-6 border-b border-neutral-200 pb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          AI-assisted Â· Source: Economic Times
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="mt-4 text-sm text-neutral-500">{formatDate(article.pubDate)}</p>
      </header>

      <article className="mt-10 space-y-6 text-base leading-relaxed text-neutral-800">
        {visible.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>

      {locked && (
        <div className="relative mt-8">
          <div
            aria-hidden
            className="pointer-events-none space-y-6 text-base leading-relaxed text-neutral-800 blur-sm select-none"
          >
            {locked.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-b from-white/10 via-white/70 to-white">
            <div className="mb-4 max-w-md rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">
                Continue reading
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Sign in to unlock the full analysis and India-specific context.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
        Source:{" "}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-900"
        >
          Economic Times
        </a>
      </footer>
    </main>
  );
}

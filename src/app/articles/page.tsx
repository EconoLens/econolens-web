export const dynamic = 'force-dynamic';

import Link from "next/link";
import { fetchArticles, formatDate, slugify, stripHtml } from "@/lib/articles";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Articles â EconoLens",
};

export default async function ArticlesPage() {
  const articles = await fetchArticles();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="border-b border-neutral-200 pb-8">
        <h1 className="text-4xl font-semibold tracking-tight">Latest articles</h1>
        <p className="mt-3 text-neutral-600">
          Top economics and markets stories, refreshed from the wire.
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="mt-12 text-neutral-500">
          No articles available right now. Please try again shortly.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const slug = slugify(article.title);
            const excerpt = stripHtml(article.description);
            return (
              <article
                key={slug}
                className="group flex flex-col rounded-lg border border-neutral-200 bg-white p-6 transition hover:border-neutral-300 hover:shadow-sm"
              >
                <h2 className="text-lg font-semibold leading-snug text-neutral-900 group-hover:text-neutral-700">
                  <Link href={`/articles/${slug}`}>{stripHtml(article.title)}</Link>
                </h2>
                <p className="mt-3 line-clamp-4 flex-1 text-sm text-neutral-600">
                  {excerpt}
                </p>
                <p className="mt-6 text-xs text-neutral-500">
                  {formatDate(article.pubDate)}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

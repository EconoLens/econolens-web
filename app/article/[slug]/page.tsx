/**
 * /article/[slug] — Article page
 *
 * Automatically appends FinancialDisclaimer when article tags include
 * any financial topic. Cannot be suppressed via CMS — hardcoded safety net.
 */
import { notFound } from "next/navigation";
import FinancialDisclaimer from "@/components/article/FinancialDisclaimer";

// Type for article data from Sanity/CMS
type Article = {
  id: string;
  slug: string;
  title: string;
  body: string; // HTML string from CMS
  tags: string[];
  author: string;
  publishedAt: string;
  content_status: "live" | "suspended" | "removed";
};

// Placeholder — replace with actual Sanity fetch in implementation
async function getArticle(slug: string): Promise<Article | null> {
  // TODO: Replace with Sanity GROQ query:
  // const query = `*[_type == "post" && slug.current == $slug][0]{
  //   id, slug, title, body, tags, author, publishedAt, content_status
  // }`;
  // return sanityClient.fetch(query, { slug });
  return null;
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  // Level 1 kill switch: suspended or removed content returns 410
  if (article.content_status === "suspended" || article.content_status === "removed") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Content Unavailable
          </h1>
          <p className="text-gray-600">
            This article is no longer available on EconoLens.
          </p>
        </div>
      </div>
    );
    // Note: Return HTTP 410 via next.config.ts headers or middleware
    // for SEO-correct signaling to crawlers
  }

  return (
    <article className="max-w-2xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight mb-3">
          {article.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{article.author}</span>
          <span>·</span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </div>
        {/* Article tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Article body */}
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      {/*
        Financial disclaimer — auto-appended when financial tags present.
        CANNOT be removed via CMS. This is a hardcoded legal requirement.
      */}
      <FinancialDisclaimer tags={article.tags} />
    </article>
  );
}

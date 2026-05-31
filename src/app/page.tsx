import { getLatestArticles, getFeaturedIndicators } from '@/lib/sanity'

export const revalidate = 900 // 15 min ISR

export default async function HomePage() {
  const [articles, indicators] = await Promise.all([
    getLatestArticles(10),
    getFeaturedIndicators(),
  ])

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#1e3a5f] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold font-serif mb-4">
            India&apos;s AI Economics Intelligence Platform
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            30 articles daily from RBI, IMF, World Bank, and top research institutions.
            Three layers of depth — from plain English to academic.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold font-serif mb-6">Latest Economics News</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {articles?.map((article: any) => (
            <a
              key={article._id}
              href={`/news/${article.slug?.current}`}
              className="border rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                {article.category?.title}
              </span>
              <h3 className="font-semibold mt-1 mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}

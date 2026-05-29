import Link from 'next/link'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rvv43603',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

async function getArticles() {
  try {
    return await client.fetch(
      `*[_type == "article"] | order(publishedAt desc)[0...8] {
        _id, title, slug, excerpt, publishedAt, category, paywalled
      }`
    )
  } catch {
    return []
  }
}

export default async function Home() {
  const articles = await getArticles()
  const featured = articles[0]
  const recent = articles.slice(1, 4)

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-serif font-bold tracking-tight">EconoLens</span>
          <div className="hidden md:flex gap-6 text-sm text-gray-600">
            <Link href="/articles" className="hover:text-black transition-colors">Articles</Link>
            <Link href="/research" className="hover:text-black transition-colors">Research</Link>
            <Link href="/indicators" className="hover:text-black transition-colors">Indicators</Link>
            <Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link>
          </div>
          <Link href="/sign-in" className="text-sm font-medium bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-gray-200 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-5 font-medium">Global Economics Intelligence</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-tight mb-6">
            Every economy.<br />One lens.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mb-8 leading-relaxed">
            AI-assisted analysis of monetary policy, fiscal data, and global economic events - written for investors, researchers, and professionals worldwide.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/articles" className="bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-gray-800 transition-colors">
              Start reading
            </Link>
            <Link href="/research" className="border border-gray-300 px-6 py-3 text-sm font-semibold hover:border-gray-600 transition-colors">
              Research reports
            </Link>
          </div>
        </div>
      </section>

      {/* Featured + Articles */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          {featured ? (
            <div className="mb-14 pb-14 border-b border-gray-200">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Featured Analysis</p>
              <Link href={`/articles/${featured.slug?.current}`} className="group block">
                <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">
                  {featured.category || 'Economics'}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 group-hover:text-gray-600 transition-colors mb-4 leading-snug max-w-3xl">
                  {featured.title}
                </h2>
                <p className="text-gray-500 text-lg mb-4 max-w-3xl leading-relaxed">{featured.excerpt}</p>
                <p className="text-sm text-gray-400">
                  {featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                  {featured.paywalled && <span className="ml-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">Premium</span>}
                </p>
              </Link>
            </div>
          ) : (
            <div className="mb-14 p-10 bg-gray-50 border border-gray-200 text-center rounded">
              <p className="text-gray-400 text-lg">Articles publishing soon.</p>
            </div>
          )}
          {recent.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Latest Analysis</h3>
                <Link href="/articles" className="text-sm text-gray-500 hover:text-black">View all -&gt;</Link>
              </div>
              <div className="grid md:grid-cols-3 gap-10">
                {recent.map((article: any) => (
                  <Link key={article._id} href={`/articles/${article.slug?.current}`} className="group">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {article.category || 'Economics'}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-gray-600 mt-2 mb-3 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{article.excerpt}</p>
                    <p className="text-xs text-gray-400 mt-3">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      {article.paywalled && <span className="ml-2 text-amber-600">Premium</span>}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 py-10 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><p className="text-3xl font-serif font-bold">50+</p><p className="text-sm text-gray-500 mt-1">Economies covered</p></div>
          <div><p className="text-3xl font-serif font-bold">Weekly</p><p className="text-sm text-gray-500 mt-1">Research reports</p></div>
          <div><p className="text-3xl font-serif font-bold">AI+</p><p className="text-sm text-gray-500 mt-1">Human-edited</p></div>
          <div><p className="text-3xl font-serif font-bold">Free</p><p className="text-sm text-gray-500 mt-1">to start</p></div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-3">The weekly EconoLens</h2>
          <p className="text-gray-500 mb-8">One email every Sunday. The week in global economics, distilled.</p>
          <form className="flex gap-2 max-w-md mx-auto">
            <input type="email" placeholder="you@example.com" className="flex-1 border border-gray-300 px-4 py-3 text-sm focus:outline-none" />
            <button type="submit" className="bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-gray-800">Subscribe</button>
          </form>
          <p className="text-xs text-gray-400 mt-3">Free. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© 2026 EconoLens. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/about" className="hover:text-black">About</Link>
            <Link href="/pricing" className="hover:text-black">Pricing</Link>
            <Link href="/grievance" className="hover:text-black">Contact</Link>
            <Link href="/privacy" className="hover:text-black">Privacy</Link>
            <Link href="/terms" className="hover:text-black">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

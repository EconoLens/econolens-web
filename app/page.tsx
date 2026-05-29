import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-serif font-bold tracking-tight">EconoLens</span>
          <div className="hidden md:flex gap-6 text-sm text-gray-600">
            <Link href="/articles" className="hover:text-black">Articles</Link>
            <Link href="/research" className="hover:text-black">Research</Link>
            <Link href="/indicators" className="hover:text-black">Indicators</Link>
            <Link href="/pricing" className="hover:text-black">Pricing</Link>
          </div>
          <Link href="/sign-in" className="text-sm font-medium bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Sign in
          </Link>
        </div>
      </nav>

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
            <Link href="/articles" className="bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-gray-800">
              Start reading
            </Link>
            <Link href="/research" className="border border-gray-300 px-6 py-3 text-sm font-semibold hover:border-gray-600">
              Research reports
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-serif font-bold text-gray-900">50+</p>
            <p className="text-sm text-gray-500 mt-1">Economies covered</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-gray-900">Weekly</p>
            <p className="text-sm text-gray-500 mt-1">Research reports</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-gray-900">AI+</p>
            <p className="text-sm text-gray-500 mt-1">Human-edited analysis</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-gray-900">Free</p>
            <p className="text-sm text-gray-500 mt-1">to start reading</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">The weekly EconoLens</h2>
          <p className="text-gray-500 mb-8">One email every Sunday. The week in global economics, distilled.</p>
          <form className="flex gap-2 max-w-md mx-auto">
            <input type="email" placeholder="you@example.com" className="flex-1 border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-500" />
            <button type="submit" className="bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-gray-800">Subscribe</button>
          </form>
          <p className="text-xs text-gray-400 mt-3">Free. Unsubscribe anytime.</p>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">2026 EconoLens. All rights reserved.</p>
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

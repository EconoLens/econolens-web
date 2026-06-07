import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
})

export const metadata: Metadata = {
  title: {
    default: 'EconoLens — India\'s AI Economics Intelligence Platform',
    template: '%s | EconoLens',
  },
  description: 'AI-powered economics news, research, and analysis with India context. 30 articles daily from RBI, IMF, World Bank, and top research institutions.',
  metadataBase: new URL('https://econolens.co.in'),
  openGraph: {
    siteName: 'EconoLens',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider clerkJSUrl="https://clerk.econolens.co.in/npm/@clerk/clerk-js@5.125.12/dist/clerk.browser.js">
      <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
        <body className="bg-white text-gray-900 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

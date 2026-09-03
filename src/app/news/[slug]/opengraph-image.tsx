import { ImageResponse } from 'next/og'
import { getArticleBySlug } from '@/lib/sanity'

// Per-article dynamic OG image — falls back to this generated card whenever
// generateMetadata() in page.tsx doesn't set an explicit `images` array
// (i.e. whenever the article has no coverImage, which today is every
// article). Once an article does get a coverImage, that explicit metadata
// takes precedence over this file-convention image automatically — this is
// just the fallback so social shares always show the headline instead of a
// blank/generic preview. Added 2026-09-03. Not run on the edge runtime
// (unlike the site-wide opengraph-image.tsx) so it can safely reuse the
// existing Node-based Sanity client.
export const alt = 'EconoLens'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 900

export default async function Image({ params }: { params: { slug: string } }) {
  let title = 'EconoLens'
  let category = 'Economics Intelligence'

  try {
    const article = await getArticleBySlug(params.slug)
    if (article?.title) title = article.title
    if (article?.category?.title) category = article.category.title
  } catch {
    // Sanity unreachable at render time — fall back to the defaults above
    // rather than failing the image response.
  }

  const titleSize = title.length > 70 ? 52 : 64

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0d2137 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '80px 100px',
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: '#c9a84c',
            marginBottom: 24,
          }}
        >
          {category}
        </div>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 800,
            letterSpacing: '-2px',
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 48, fontSize: 22, opacity: 0.6, letterSpacing: '1px' }}>
          EconoLens — www.econolens.co.in
        </div>
      </div>
    ),
    { ...size }
  )
}

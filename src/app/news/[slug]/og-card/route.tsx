import { ImageResponse } from 'next/og'
import { getArticleBySlug } from '@/lib/sanity'

// Generated headline card, used as the social preview image only for
// articles WITHOUT a cover image (see generateMetadata in ../page.tsx).
//
// History: this lived at ../opengraph-image.tsx (added 2026-09-03). In the
// App Router a file-convention opengraph-image always overrides
// `openGraph.images` from generateMetadata, so once articles started getting
// cover images (2026-10-13) the cover could never reach WhatsApp/LinkedIn —
// every share still showed this text card. Moved to a plain route so
// page.tsx decides: cover when present, this card otherwise.
export const revalidate = 900

const size = { width: 1200, height: 630 }

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
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
    { ...size, headers: { 'Cache-Control': 'public, max-age=900, s-maxage=900' } }
  )
}

import { ImageResponse } from 'next/og'
import { getArticleBySlug, urlFor } from '@/lib/sanity'

// 1080×1920 portrait image for WhatsApp Status / Instagram Story:
// cover image on top, then category, headline and the three summary points.
// Fetched by the ShareKit buttons on the article page (download, or native
// share sheet on phones). Added 2026-10-13.
export const revalidate = 900

const W = 1080
const H = 1920
const GOLD = '#c9a34f'
const NAVY = '#0a1428'

// Noto Sans regular + bold, subset to exactly the characters on the card.
// The bundled default font has no bold weight and no ₹, so headlines rendered
// thin and rupee signs as boxes. Any failure falls back to the default font.
async function loadFont(weight: 400 | 700, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Noto+Sans:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text()
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1]
    if (!src) return null
    const res = await fetch(src)
    return res.ok ? await res.arrayBuffer() : null
  } catch {
    return null
  }
}

function clip(text: string, max: number): string {
  const t = text.trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : max)}…`
}

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  let title = 'EconoLens'
  let category = 'Economics'
  let points: string[] = []
  let cover: string | undefined

  try {
    const article = await getArticleBySlug(params.slug)
    if (article?.title) title = article.title
    if (article?.category?.title) category = article.category.title
    if (Array.isArray(article?.summary)) points = article.summary.filter(Boolean).slice(0, 3)
    if (article?.coverImage?.asset) {
      cover = urlFor(article.coverImage).width(W).height(608).fit('crop').format('jpg').quality(85).url()
    }
  } catch {
    // Fall through with defaults; a plain card is better than a failed share.
  }

  const titleSize = title.length > 90 ? 54 : title.length > 60 ? 62 : 70
  const pointMax = points.length > 2 ? 240 : 280

  const shown = [category, title, ...points.map((p) => clip(p, pointMax)), 'Read the full analysis', 'econolens.co.in'].join(' ')
  const [regular, bold] = await Promise.all([loadFont(400, shown), loadFont(700, shown)])
  const fonts = [
    ...(regular ? [{ name: 'Noto Sans', data: regular, weight: 400 as const, style: 'normal' as const }] : []),
    ...(bold ? [{ name: 'Noto Sans', data: bold, weight: 700 as const, style: 'normal' as const }] : []),
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(180deg, #0f1e3a 0%, ${NAVY} 100%)`,
          color: 'white',
          fontFamily: fonts.length ? 'Noto Sans' : 'sans-serif',
        }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} width={W} height={608} style={{ width: W, height: 608, objectFit: 'cover' }} alt="" />
        ) : (
          <div style={{ width: W, height: 12, background: GOLD, display: 'flex' }} />
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            padding: cover ? '52px 72px 60px' : '300px 72px 60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: '5px',
              textTransform: 'uppercase',
              color: GOLD,
              marginBottom: 28,
            }}
          >
            {category}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: '-1px',
              marginBottom: 44,
            }}
          >
            {title}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {points.map((p, i) => (
              <div key={i} style={{ display: 'flex', marginBottom: 26 }}>
                <div style={{ display: 'flex', width: 12, height: 12, background: GOLD, marginTop: 17, marginRight: 22, flexShrink: 0 }} />
                <div style={{ display: 'flex', fontSize: 31, lineHeight: 1.38, color: '#d9dee8', flex: 1 }}>
                  {clip(p, pointMax)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexGrow: 1 }} />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderTop: `2px solid ${GOLD}`,
              paddingTop: 28,
            }}
          >
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: 'white' }}>
              Read the full analysis
            </div>
            <div style={{ display: 'flex', fontSize: 30, color: GOLD, marginTop: 6 }}>econolens.co.in</div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H, ...(fonts.length ? { fonts } : {}), headers: { 'Cache-Control': 'public, max-age=900, s-maxage=900' } }
  )
}

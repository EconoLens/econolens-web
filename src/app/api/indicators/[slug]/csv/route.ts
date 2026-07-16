import { NextResponse } from 'next/server'
import { getIndicatorBySlug } from '@/lib/indicators'

export const revalidate = 3600

/**
 * Crawlable CSV endpoint backing the Dataset schema's distribution URL on
 * the indicator detail page. A real, stable URL here (not just a client
 * download button) is what actually earns academic/student backlinks — a
 * paper's reference list can cite this directly.
 */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const indicator = await getIndicatorBySlug(params.slug)
  if (!indicator || indicator.points.length < 2) {
    return new NextResponse('Not found or no history available', { status: 404 })
  }

  const header = `date,${indicator.name} (${indicator.unit})`
  const rows = indicator.points.map((p) => `${p.date},${p.value}`)
  const csv = [header, ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${params.slug}.csv"`,
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    },
  })
}

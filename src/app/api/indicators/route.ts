import { NextResponse } from 'next/server'
import { getIndicators } from '@/lib/indicators'

export const revalidate = 3600 // 1 hour ISR

export async function GET() {
  const indicators = await getIndicators()
  return NextResponse.json({
    indicators,
    lastUpdated: new Date().toISOString(),
    sources: ['FRED (St. Louis Fed)', 'RBI', 'MOSPI', 'CMIE'],
  })
}

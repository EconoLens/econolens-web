import { NextResponse } from 'next/server'

export const revalidate = 3600 // 1 hour ISR

const FRED_SERIES = [
  { id: 'GDPC1', name: 'US Real GDP', unit: 'Billions USD', country: 'US', category: 'GDP' },
  { id: 'CPIAUCSL', name: 'US CPI', unit: 'Index', country: 'US', category: 'Inflation' },
  { id: 'UNRATE', name: 'US Unemployment', unit: '%', country: 'US', category: 'Employment' },
  { id: 'FEDFUNDS', name: 'Fed Funds Rate', unit: '%', country: 'US', category: 'Monetary Policy' },
  { id: 'DGS10', name: 'US 10Y Treasury', unit: '%', country: 'US', category: 'Rates' },
  { id: 'DEXINUS', name: 'USD/INR Exchange Rate', unit: 'INR per USD', country: 'IN', category: 'Forex' },
  { id: 'DCOILWTICO', name: 'Crude Oil (WTI)', unit: 'USD/barrel', country: 'Global', category: 'Commodities' },
  { id: 'GOLDAMGBD228NLBM', name: 'Gold Price', unit: 'USD/troy oz', country: 'Global', category: 'Commodities' },
]

const INDIA_STATIC = [
  { id: 'IN_GDP', name: 'India GDP Growth', value: '6.4', unit: '%', country: 'IN', category: 'GDP', change: 0.2, trend: 'up' },
  { id: 'IN_CPI', name: 'India CPI Inflation', value: '4.1', unit: '%', country: 'IN', category: 'Inflation', change: -0.3, trend: 'down' },
  { id: 'IN_REPO', name: 'RBI Repo Rate', value: '6.50', unit: '%', country: 'IN', category: 'Monetary Policy', change: 0, trend: 'stable' },
  { id: 'IN_UNEMP', name: 'India Unemployment', value: '7.8', unit: '%', country: 'IN', category: 'Employment', change: -0.1, trend: 'down' },
  { id: 'IN_TRADE', name: 'India Trade Balance', value: '-19.4', unit: 'Bn USD', country: 'IN', category: 'Trade', change: -1.2, trend: 'down' },
  { id: 'IN_FOREX', name: 'India Forex Reserves', value: '648.2', unit: 'Bn USD', country: 'IN', category: 'Forex', change: 3.1, trend: 'up' },
]

async function fetchFredSeries(seriesId: string) {
  const apiKey = process.env.FRED_API_KEY
  if (!apiKey) return null
  try {
    const res = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=2`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const obs = data.observations?.filter((o: any) => o.value !== '.') || []
    if (obs.length === 0) return null
    const latest = parseFloat(obs[0].value)
    const prev = obs[1] ? parseFloat(obs[1].value) : latest
    return {
      value: latest.toFixed(2),
      change: parseFloat((latest - prev).toFixed(2)),
      trend: latest > prev ? 'up' : latest < prev ? 'down' : 'stable',
      date: obs[0].date,
    }
  } catch {
    return null
  }
}

export async function GET() {
  const indicators: any[] = [...INDIA_STATIC]

  // Fetch FRED data (gracefully skip if no API key)
  await Promise.all(
    FRED_SERIES.map(async (series) => {
      const data = await fetchFredSeries(series.id)
      indicators.push({
        id: series.id,
        name: series.name,
        value: data?.value ?? 'N/A',
        unit: series.unit,
        country: series.country,
        category: series.category,
        change: data?.change ?? 0,
        trend: data?.trend ?? 'stable',
        date: data?.date,
      })
    })
  )

  return NextResponse.json({
    indicators,
    lastUpdated: new Date().toISOString(),
    sources: ['FRED (St. Louis Fed)', 'RBI', 'MOSPI', 'CMIE'],
  })
}

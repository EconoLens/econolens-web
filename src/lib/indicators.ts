/**
 * EconoLens — Indicator data (single source of truth)
 *
 * Both /api/indicators and the homepage "Live Macro" sidebar call this same
 * function. Previously the homepage had its own third hardcoded copy of
 * GDP/CPI/Repo/USD-INR values that never changed, separate from this file's
 * predecessor and separate from src/app/page.tsx's own literal array — see
 * the 2026-07-08 ops audit. This file removes that duplication.
 *
 * 2026-07-16: added `slug` + `source`/`sourceUrl` metadata and
 * getIndicatorBySlug()/fetchFredSeriesHistory() to back the new
 * /indicators/[slug] detail pages, without touching getIndicators()'s
 * existing behavior (still used by /api/indicators and the homepage).
 */

const FRED_SOURCE = 'Federal Reserve Bank of St. Louis (FRED)'
const fredSourceUrl = (seriesId: string) => `https://fred.stlouisfed.org/series/${seriesId}`

const FRED_SERIES = [
  { id: 'GDPC1', slug: 'us-real-gdp', name: 'US Real GDP', unit: 'Billions USD', country: 'US', category: 'GDP' },
  { id: 'CPIAUCSL', slug: 'us-cpi', name: 'US CPI', unit: 'Index', country: 'US', category: 'Inflation' },
  { id: 'UNRATE', slug: 'us-unemployment', name: 'US Unemployment', unit: '%', country: 'US', category: 'Employment' },
  { id: 'FEDFUNDS', slug: 'fed-funds-rate', name: 'Fed Funds Rate', unit: '%', country: 'US', category: 'Monetary Policy' },
  { id: 'DGS10', slug: 'us-10y-treasury', name: 'US 10Y Treasury', unit: '%', country: 'US', category: 'Rates' },
  { id: 'DEXINUS', slug: 'usd-inr-exchange-rate', name: 'USD/INR Exchange Rate', unit: 'INR per USD', country: 'IN', category: 'Forex' },
  { id: 'DCOILWTICO', slug: 'crude-oil-wti', name: 'Crude Oil (WTI)', unit: 'USD/barrel', country: 'Global', category: 'Commodities' },
  { id: 'GOLDAMGBD228NLBM', slug: 'gold-price', name: 'Gold Price', unit: 'USD/troy oz', country: 'Global', category: 'Commodities' },
]

// No free, FRED-style live JSON API exists for RBI/MOSPI data, so India
// indicators are manually maintained rather than faked as live. Each entry
// carries its own `date` and `isStatic: true` so the UI can label it
// honestly instead of claiming "Updated hourly" for data that isn't.
// Last manually verified: 2026-10-21. `date` = official release date of the
// figure shown; the reference period is noted in the comment on each line.
const INDIA_STATIC = [
  // Q1 FY2026-27 (Apr–Jun 2026) real GDP, YoY; prev quarter Q4 FY26 revised to 8.6%
  { id: 'IN_GDP', slug: 'india-gdp-growth', name: 'India GDP Growth', value: '7.8', unit: '%', country: 'IN', category: 'GDP', change: -0.8, trend: 'down' as const, date: '2026-08-31', isStatic: true, source: 'Ministry of Statistics & Programme Implementation (MoSPI)', sourceUrl: 'https://www.mospi.gov.in' },
  // September 2026 all-India CPI (base 2024=100), YoY; August 2026 final 4.83%
  { id: 'IN_CPI', slug: 'india-cpi-inflation', name: 'India CPI Inflation', value: '5.54', unit: '%', country: 'IN', category: 'Inflation', change: 0.71, trend: 'up' as const, date: '2026-10-12', isStatic: true, source: 'Ministry of Statistics & Programme Implementation (MoSPI)', sourceUrl: 'https://www.mospi.gov.in' },
  // 63rd MPC meeting, 5–7 Oct 2026: +25 bps from 5.25%
  { id: 'IN_REPO', slug: 'rbi-repo-rate', name: 'RBI Repo Rate', value: '5.50', unit: '%', country: 'IN', category: 'Monetary Policy', change: 0.25, trend: 'up' as const, date: '2026-10-07', isStatic: true, source: 'Reserve Bank of India', sourceUrl: 'https://www.rbi.org.in' },
  // PLFS monthly bulletin, September 2026, CWS age 15+; unchanged from August
  { id: 'IN_UNEMP', slug: 'india-unemployment', name: 'India Unemployment', value: '5.0', unit: '%', country: 'IN', category: 'Employment', change: 0, trend: 'stable' as const, date: '2026-10-15', isStatic: true, source: 'MoSPI — Periodic Labour Force Survey (PLFS)', sourceUrl: 'https://www.mospi.gov.in' },
  // September 2026 merchandise trade balance; August 2026 was -26.86 Bn USD
  { id: 'IN_TRADE', slug: 'india-trade-balance', name: 'India Trade Balance', value: '-30.21', unit: 'Bn USD', country: 'IN', category: 'Trade', change: -3.35, trend: 'down' as const, date: '2026-10-15', isStatic: true, source: 'Ministry of Commerce & Industry', sourceUrl: 'https://commerce.gov.in' },
  // Week ended 9 Oct 2026 (RBI Weekly Statistical Supplement); prior week 734.6
  { id: 'IN_FOREX', slug: 'india-forex-reserves', name: 'India Forex Reserves', value: '726.0', unit: 'Bn USD', country: 'IN', category: 'Forex', change: -8.6, trend: 'down' as const, date: '2026-10-16', isStatic: true, source: 'Reserve Bank of India', sourceUrl: 'https://www.rbi.org.in' },
]

export const INDICATOR_COUNT = FRED_SERIES.length + INDIA_STATIC.length // 14
export const INDICATOR_REGION_LABEL = 'the US, India, and global commodity markets'

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

/**
 * Pulls real history (not just the latest 2 points) for a trendline chart
 * on the indicator detail page. Returns [] (not an error) if FRED_API_KEY
 * isn't set or the request fails, so the page can render a clean
 * "history unavailable" state rather than crashing or faking data.
 */
export async function fetchFredSeriesHistory(
  seriesId: string,
  limit = 90
): Promise<{ date: string; value: number }[]> {
  const apiKey = process.env.FRED_API_KEY
  if (!apiKey) return []
  try {
    const res = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    const obs = (data.observations || []).filter((o: any) => o.value !== '.')
    return obs
      .map((o: any) => ({ date: o.date, value: parseFloat(o.value) }))
      .reverse() // API returns desc; chart wants ascending (oldest → newest)
  } catch {
    return []
  }
}

export async function getIndicators() {
  const indicators: any[] = [...INDIA_STATIC]

  await Promise.all(
    FRED_SERIES.map(async (series) => {
      const data = await fetchFredSeries(series.id)
      indicators.push({
        id: series.id,
        slug: series.slug,
        name: series.name,
        value: data?.value ?? 'N/A',
        unit: series.unit,
        country: series.country,
        category: series.category,
        change: data?.change ?? 0,
        trend: data?.trend ?? 'stable',
        date: data?.date,
        isStatic: false,
      })
    })
  )

  return indicators
}

export interface IndicatorDetail {
  id: string
  slug: string
  name: string
  unit: string
  country: string
  category: string
  isStatic: boolean
  points: { date: string; value: number }[]
  latestValue: number | null
  latestDate: string | null
  change: number
  trend: 'up' | 'down' | 'stable'
  source: string
  sourceUrl: string
}

export async function getAllIndicatorSlugs(): Promise<string[]> {
  return [...FRED_SERIES.map((s) => s.slug), ...INDIA_STATIC.map((s) => s.slug)]
}

/**
 * Single-indicator lookup backing /indicators/[slug]. FRED-backed series get
 * real history (subject to FRED_API_KEY being set); India series remain
 * honest single-point snapshots — no fabricated trendline for data that
 * isn't actually tracked over time yet.
 */
export async function getIndicatorBySlug(slug: string): Promise<IndicatorDetail | null> {
  const fredEntry = FRED_SERIES.find((s) => s.slug === slug)
  if (fredEntry) {
    const history = await fetchFredSeriesHistory(fredEntry.id)
    const latest = history[history.length - 1]
    const prev = history[history.length - 2]
    const change = latest && prev ? parseFloat((latest.value - prev.value).toFixed(2)) : 0
    const trend = !latest || !prev ? 'stable' : latest.value > prev.value ? 'up' : latest.value < prev.value ? 'down' : 'stable'
    return {
      id: fredEntry.id,
      slug: fredEntry.slug,
      name: fredEntry.name,
      unit: fredEntry.unit,
      country: fredEntry.country,
      category: fredEntry.category,
      isStatic: false,
      points: history,
      latestValue: latest?.value ?? null,
      latestDate: latest?.date ?? null,
      change,
      trend,
      source: FRED_SOURCE,
      sourceUrl: fredSourceUrl(fredEntry.id),
    }
  }

  const staticEntry = INDIA_STATIC.find((s) => s.slug === slug)
  if (staticEntry) {
    const value = parseFloat(staticEntry.value)
    return {
      id: staticEntry.id,
      slug: staticEntry.slug,
      name: staticEntry.name,
      unit: staticEntry.unit,
      country: staticEntry.country,
      category: staticEntry.category,
      isStatic: true,
      points: [{ date: staticEntry.date, value }],
      latestValue: value,
      latestDate: staticEntry.date,
      change: staticEntry.change,
      trend: staticEntry.trend,
      source: staticEntry.source,
      sourceUrl: staticEntry.sourceUrl,
    }
  }

  return null
}

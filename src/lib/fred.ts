/**
 * EconoLens — FRED (Federal Reserve Bank of St. Louis) data client
 *
 * Server-side only. Used by in-article live charts (ChartEmbed) to pull an
 * economicIndicator's series by its `fredSeriesId`. Responses are cached by
 * Next's fetch cache for an hour, matching the indicator ISR window.
 *
 * Returns `null` (never throws) when the key is missing, the series id is
 * blank, or FRED errors, so a chart can fall back to manually maintained
 * observations or render an honest "data unavailable" state instead of
 * breaking the article page.
 *
 * Env: FRED_API_KEY (Vercel, production + preview). Free key from
 * https://fred.stlouisfed.org/docs/api/api_key.html
 */

export interface Observation {
  /** ISO date, YYYY-MM-DD */
  date: string
  value: number
}

const FRED_OBSERVATIONS_URL = 'https://api.stlouisfed.org/fred/series/observations'

interface FredObservationsResponse {
  observations?: { date: string; value: string }[]
}

export async function getFredObservations(
  seriesId: string | undefined,
  opts: { start?: string; end?: string } = {}
): Promise<Observation[] | null> {
  const apiKey = process.env.FRED_API_KEY
  if (!apiKey || !seriesId) return null

  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: 'json',
  })
  if (opts.start) params.set('observation_start', opts.start)
  if (opts.end) params.set('observation_end', opts.end)

  try {
    const res = await fetch(`${FRED_OBSERVATIONS_URL}?${params.toString()}`, {
      next: { revalidate: 3600 },
    } as RequestInit)
    if (!res.ok) return null
    const json = (await res.json()) as FredObservationsResponse
    return (json.observations ?? [])
      // FRED marks missing values with "."
      .filter((o) => o.value !== '.' && o.value !== '')
      .map((o) => ({ date: o.date, value: Number(o.value) }))
      .filter((o) => Number.isFinite(o.value))
  } catch {
    return null
  }
}

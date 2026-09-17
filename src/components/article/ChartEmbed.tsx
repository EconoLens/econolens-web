/**
 * EconoLens — in-article live chart (`chartEmbed` content block)
 *
 * Renders 1–4 economicIndicator series as a server-rendered SVG line or
 * step chart. Zero client JS, same approach as MacroChart.tsx: crawlers read
 * the chart and its data table in raw HTML, and nothing shifts after load.
 *
 * Data source per indicator, in order:
 *   1. `observations` maintained in Sanity (series with no public API, e.g.
 *      RBI repo rate decisions, India CPI), else
 *   2. FRED via `fredSeriesId` (needs FRED_API_KEY), cached for an hour.
 *
 * Chart rules (EconoLens dataviz standard):
 *   - One y-axis per unit. Indicators with different units become separate
 *     stacked charts, never a dual axis.
 *   - Fixed categorical order, colour follows the indicator's position in the
 *     block (never its rank). Single series uses the brand gold.
 *   - Legend for 2+ series. Direct end labels only when they don't collide.
 *   - Hairline gridlines, 2px lines, end dot with a surface ring.
 *   - Every chart ships a data table (collapsed) and a source line.
 *   - Native SVG <title> tooltips on each point (no JS).
 */

import { getFredObservations, type Observation } from '@/lib/fred'

type AnyBlock = Record<string, any>

interface IndicatorRef {
  name?: string
  slug?: string
  unit?: string
  fredSeriesId?: string
  sourceUrl?: string
  observations?: { date?: string; value?: number }[]
}

interface Series {
  name: string
  unit: string
  /** Decimal places used for this series' labels, so 4 shows as 4.00% beside 3.75%. */
  decimals: number
  color: string
  points: Observation[]
  sourceLabel: string
  sourceUrl?: string
}

// Categorical dark steps, validated against the article surface --ink-mid
// (#0F2035): lightness band, chroma floor, CVD (worst adjacent ΔE 8.4),
// normal-vision floor and 3:1 contrast all pass. Order is the safety
// mechanism; do not reorder or append hues.
const SERIES_COLORS = ['#3987e5', '#d95926', '#199e70', '#c98500']
const SINGLE_SERIES_COLOR = 'var(--gold)'
const MAX_POINTS = 400
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const W = 720
const H = 300
const PAD = { top: 18, right: 132, bottom: 34, left: 52 }

function toTime(date: string): number {
  return Date.parse(date.length === 10 ? `${date}T00:00:00Z` : date)
}

const CURRENCY_PREFIX = new Set(['₹', '$', '€', '£', '¥', 'US$'])

/** Decimal places actually used by a set of numbers, capped at 2 (3.75 → 2, 5.5 → 1, 96 → 0). */
function decimalsOf(values: number[]): number {
  return Math.min(2, Math.max(0, ...values.map((v) => {
    const t = String(Number(v.toFixed(2)))
    return t.includes('.') ? t.split('.')[1].length : 0
  })))
}

function formatValue(v: number, unit: string, decimals = 2): string {
  const n = v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  if (unit === '%') return `${n}%`
  if (CURRENCY_PREFIX.has(unit)) return `${unit}${n}`
  return unit ? `${n} ${unit}` : n
}

function formatDate(t: number, spanDays: number): string {
  const d = new Date(t)
  if (spanDays > 3 * 365) return String(d.getUTCFullYear())
  if (spanDays > 60) return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}

function niceStep(rough: number): number {
  const exp = Math.floor(Math.log10(rough))
  const base = rough / 10 ** exp
  const nice = base <= 1 ? 1 : base <= 2 ? 2 : base <= 2.5 ? 2.5 : base <= 5 ? 5 : 10
  return nice * 10 ** exp
}

function downsample(points: Observation[]): Observation[] {
  if (points.length <= MAX_POINTS) return points
  const step = points.length / MAX_POINTS
  const out: Observation[] = []
  for (let i = 0; i < MAX_POINTS - 1; i++) out.push(points[Math.floor(i * step)])
  out.push(points[points.length - 1])
  return out
}

async function loadSeries(
  ind: IndicatorRef,
  color: string,
  start?: string,
  end?: string
): Promise<Series | null> {
  const name = ind.name || 'Series'
  const unit = ind.unit || ''
  const inRange = (o: Observation) => (!start || o.date >= start) && (!end || o.date <= end)

  const manual: Observation[] = (ind.observations || [])
    .filter((o): o is { date: string; value: number } =>
      typeof o?.date === 'string' && typeof o?.value === 'number' && Number.isFinite(o.value))
    .map((o) => ({ date: o.date, value: o.value }))

  let points = manual
  let sourceLabel = 'official releases, compiled by EconoLens'
  if (ind.sourceUrl) {
    try {
      sourceLabel = new URL(ind.sourceUrl).hostname.replace(/^www\./, '')
    } catch {
      /* keep the generic label for a malformed URL */
    }
  }
  if (points.length === 0 && ind.fredSeriesId) {
    const fred = await getFredObservations(ind.fredSeriesId, { start, end })
    if (fred) {
      points = fred
      sourceLabel = `FRED, series ${ind.fredSeriesId}`
    }
  }

  points = points.filter(inRange).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
  if (points.length === 0) return null
  return {
    name,
    unit,
    decimals: decimalsOf(points.map((p) => p.value)),
    color,
    points: downsample(points),
    sourceLabel,
    sourceUrl: ind.sourceUrl,
  }
}

function UnitChart({ series, stepped, ariaLabel }: { series: Series[]; stepped: boolean; ariaLabel: string }) {
  const allPoints = series.flatMap((s) => s.points)
  let tMin = Math.min(...allPoints.map((p) => toTime(p.date)))
  let tMax = Math.max(...allPoints.map((p) => toTime(p.date)))
  if (tMin === tMax) {
    tMin -= 86400000 * 15
    tMax += 86400000 * 15
  }
  const spanDays = (tMax - tMin) / 86400000

  const vMin = Math.min(...allPoints.map((p) => p.value))
  const vMax = Math.max(...allPoints.map((p) => p.value))
  const step = niceStep(Math.max(vMax - vMin, Math.abs(vMax) * 0.1, 0.01) / 4)
  let yMin = Math.floor(vMin / step) * step
  let yMax = Math.ceil(vMax / step) * step
  if (yMin === yMax) {
    yMin -= step
    yMax += step
  }

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const x = (t: number) => PAD.left + ((t - tMin) / (tMax - tMin)) * plotW
  const y = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * plotH

  const tickDecimals = decimalsOf([step])
  const yTicks: number[] = []
  for (let v = yMin; v <= yMax + step / 2; v += step) yTicks.push(Number(v.toFixed(6)))
  const xTickCount = Math.min(5, Math.max(2, Math.round(spanDays / 30)))
  const xTicks = Array.from({ length: xTickCount }, (_, i) => tMin + ((tMax - tMin) * i) / (xTickCount - 1))
  const unit = series[0].unit

  const paths = series.map((s) => {
    const pts = s.points.map((p) => [x(toTime(p.date)), y(p.value)] as const)
    let d = ''
    pts.forEach(([px, py], i) => {
      if (i === 0) d += `M${px.toFixed(1)},${py.toFixed(1)}`
      else if (stepped) d += ` L${px.toFixed(1)},${pts[i - 1][1].toFixed(1)} L${px.toFixed(1)},${py.toFixed(1)}`
      else d += ` L${px.toFixed(1)},${py.toFixed(1)}`
    })
    // A policy rate holds until the next decision: carry the last level to the right edge.
    const last = pts[pts.length - 1]
    if (stepped && last[0] < PAD.left + plotW) d += ` L${(PAD.left + plotW).toFixed(1)},${last[1].toFixed(1)}`
    return d
  })

  // End labels ride the marks only when they are at least 16px apart.
  const endYs = series.map((s) => y(s.points[s.points.length - 1].value))
  // Step series carry their last level to the right edge, so the end marker sits there.
  const endXs = series.map((s) => (stepped ? PAD.left + plotW : x(toTime(s.points[s.points.length - 1].date))))
  const labelsFit = endYs.every((a, i) => endYs.every((b, j) => i === j || Math.abs(a - b) >= 16))

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={ariaLabel}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={PAD.left} x2={PAD.left + plotW} y1={y(v)} y2={y(v)} stroke="var(--ink-border)" strokeWidth={1} />
          <text x={PAD.left - 8} y={y(v) + 3.5} textAnchor="end" fontSize="11" fill="var(--text-tertiary)" fontFamily="var(--font-mono)">
            {formatValue(v, unit, tickDecimals)}
          </text>
        </g>
      ))}
      {xTicks.map((t, i) => (
        <text
          key={`x${i}`}
          x={x(t)}
          y={H - 10}
          textAnchor={i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle'}
          fontSize="11"
          fill="var(--text-tertiary)"
          fontFamily="var(--font-mono)"
        >
          {formatDate(t, spanDays)}
        </text>
      ))}
      {series.map((s, si) => (
        <g key={s.name + si}>
          <path d={paths[si]} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {s.points.map((p, pi) => (
            <circle key={pi} cx={x(toTime(p.date))} cy={y(p.value)} r={8} fill="transparent">
              <title>{`${s.name}: ${formatValue(p.value, s.unit, s.decimals)} (${p.date})`}</title>
            </circle>
          ))}
          <circle
            cx={endXs[si]}
            cy={endYs[si]}
            r={4.5}
            fill={s.color}
            stroke="var(--ink-mid)"
            strokeWidth={2}
          />
          {labelsFit && (
            <text x={PAD.left + plotW + 10} y={endYs[si] + 4} fontSize="12" fill="var(--text-primary)" fontFamily="var(--font-mono)">
              {formatValue(s.points[s.points.length - 1].value, s.unit, s.decimals)}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

export default async function ChartEmbed({ block }: { block: AnyBlock }) {
  const indicators: IndicatorRef[] = Array.isArray(block.indicators) ? block.indicators.filter(Boolean).slice(0, 4) : []
  const multi = indicators.length > 1
  const loaded = await Promise.all(
    indicators.map((ind, i) =>
      loadSeries(ind, multi ? SERIES_COLORS[i] : SINGLE_SERIES_COLOR, block.startDate, block.endDate)
    )
  )
  const series = loaded.filter((s): s is Series => s !== null)
  const stepped = block.chartStyle === 'step'

  const boxStyle = {
    border: '0.5px solid var(--ink-border)',
    background: 'var(--ink-mid)',
    padding: '18px 20px 14px',
  } as const

  if (series.length === 0) {
    return (
      <figure style={{ margin: '1.5rem 0 2rem' }}>
        <div style={{ ...boxStyle, color: 'var(--text-tertiary)', fontSize: '0.8125rem', textAlign: 'center' }}>
          {block.title ? `${block.title}: ` : ''}chart data is unavailable right now.
        </div>
      </figure>
    )
  }

  // One chart per unit, so percentages never share an axis with, say, ₹ crore.
  const groups = new Map<string, Series[]>()
  series.forEach((s) => groups.set(s.unit, [...(groups.get(s.unit) || []), s]))

  const summary =
    block.alt ||
    series
      .map((s) => {
        const first = s.points[0]
        const last = s.points[s.points.length - 1]
        return `${s.name} moved from ${formatValue(first.value, s.unit, s.decimals)} (${first.date}) to ${formatValue(last.value, s.unit, s.decimals)} (${last.date})`
      })
      .join('; ')


  return (
    <figure style={{ margin: '1.75rem 0 2.25rem' }}>
      <div style={boxStyle}>
        {block.title && (
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
            {block.title}
          </div>
        )}

        {series.length > 1 && (
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', listStyle: 'none', padding: 0, margin: '0 0 10px' }}>
            {series.map((s, i) => (
              <li key={s.name + i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <span aria-hidden="true" style={{ width: 16, height: 2, background: s.color, display: 'inline-block', borderRadius: 1 }} />
                <span>{s.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {formatValue(s.points[s.points.length - 1].value, s.unit, s.decimals)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {Array.from(groups.entries()).map(([unit, group]) => (
          <UnitChart
            key={unit || 'unitless'}
            series={group}
            stepped={stepped}
            ariaLabel={groups.size > 1 ? `${summary} (${unit || 'unitless'} series)` : summary}
          />
        ))}

        <details style={{ marginTop: '10px' }}>
          <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>
            View data
          </summary>
          <div style={{ overflowX: 'auto', marginTop: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr>
                  {['Series', 'Date', 'Value'].map((h, i) => (
                    <th key={h} style={{ textAlign: i === 2 ? 'right' : 'left', padding: '6px 10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', borderBottom: '0.5px solid var(--ink-border)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {series.flatMap((s) => {
                  const rows = s.points.length > 60 ? s.points.slice(-24) : s.points
                  return rows.map((p, i) => (
                    <tr key={`${s.name}-${p.date}-${i}`} style={{ borderBottom: '0.5px solid var(--ink-border)' }}>
                      <td style={{ padding: '6px 10px', color: 'var(--text-secondary)' }}>{s.name}</td>
                      <td style={{ padding: '6px 10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{p.date}</td>
                      <td style={{ padding: '6px 10px', color: 'var(--text-primary)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                        {formatValue(p.value, s.unit, s.decimals)}
                      </td>
                    </tr>
                  ))
                })}
              </tbody>
            </table>
            {series.some((s) => s.points.length > 60) && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: '6px 0 0' }}>
                Long series show their latest 24 observations; the full series is at the source.
              </p>
            )}
          </div>
        </details>
      </div>

      <figcaption style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
        {block.caption ? `${block.caption} ` : ''}
        {series.length > 1 ? 'Sources: ' : 'Source: '}
        {series.map((s, i) => (
          <span key={s.name + i}>
            {i > 0 ? '; ' : ''}
            {series.length > 1 ? `${s.name}, ` : ''}
            {s.sourceUrl ? (
              <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
                {s.sourceLabel}
              </a>
            ) : (
              s.sourceLabel
            )}
          </span>
        ))}
        .
      </figcaption>
    </figure>
  )
}

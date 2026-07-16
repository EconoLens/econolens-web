/**
 * MacroChart — server-rendered SVG trendline for an indicator's history.
 *
 * Deliberately pure SVG with zero client JS: this codebase has no charting
 * library dependency today (no lightweight-charts, no D3, no recharts in
 * package.json), and adding one is a real dependency decision, not
 * something to slip in unilaterally. A server-rendered <path> already
 * satisfies the actual goals — Googlebot can read the trendline in raw
 * HTML, and there's zero CLS since nothing swaps after hydration. If real
 * interactivity (hover tooltips, zoom) is wanted later, that's a follow-up
 * decision, not a blocker for shipping honest historical charts now.
 */

interface MacroChartPoint {
  date: string
  value: number
}

interface MacroChartProps {
  points: MacroChartPoint[]
  unit: string
  name: string
  width?: number
  height?: number
}

function buildPath(points: MacroChartPoint[], width: number, height: number, padding = 12): string {
  if (points.length < 2) return ''
  const values = points.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = (width - padding * 2) / (points.length - 1)

  return points
    .map((p, i) => {
      const x = padding + i * stepX
      const y = height - padding - ((p.value - min) / range) * (height - padding * 2)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

export default function MacroChart({ points, unit, name, width = 640, height = 200 }: MacroChartProps) {
  if (points.length < 2) {
    return (
      <div
        style={{
          border: '0.5px solid var(--ink-border)',
          background: 'var(--ink-mid)',
          padding: '32px 24px',
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          fontSize: '0.8125rem',
        }}
      >
        Single data point on file — not enough history yet for a trendline.
      </div>
    )
  }

  const path = buildPath(points, width, height)
  const first = points[0]
  const last = points[points.length - 1]

  return (
    <div style={{ width: '100%', maxWidth: width }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${name} trend from ${first.date} to ${last.date}, latest ${last.value} ${unit}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <path d={path} fill="none" stroke="var(--gold)" strokeWidth={2} />
        <circle
          cx={width - 12}
          cy={
            height -
            12 -
            ((last.value - Math.min(...points.map((p) => p.value))) /
              (Math.max(...points.map((p) => p.value)) - Math.min(...points.map((p) => p.value)) || 1)) *
              (height - 24)
          }
          r={3}
          fill="var(--gold)"
        />
      </svg>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          color: 'var(--text-tertiary)',
          marginTop: '4px',
        }}
      >
        <span>{first.date}</span>
        <span>{last.date}</span>
      </div>
    </div>
  )
}

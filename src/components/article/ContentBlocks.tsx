/**
 * EconoLens — Article content-block renderer
 *
 * The article schema (sanity/schemas/article.ts) already lets editors add
 * images, CSV data tables, regression tables, and math blocks inside
 * layerOne/Two/Three. Until now, the article page's renderer only handled
 * plain-text `block` types (paragraphs, h2, h3) — anything else came
 * through with `block.children === undefined`, so it silently rendered as
 * an empty paragraph. Confirmed live on published, QA-"passed" articles
 * (e.g. ml-models-forecast-us-inflation-cpi-ets, which has a dataTable, a
 * mathBlock, and a regressionTable that were all invisible on the page).
 *
 * This module is the single source of truth for turning one content block
 * into JSX. It's used by both RenderBlocks and RenderBlocksWithInsert in
 * src/app/news/[slug]/page.tsx so the two never drift out of sync again.
 */

import type { CSSProperties, Key, ReactNode } from 'react'
import { urlFor } from '@/lib/sanity'

type AnyBlock = Record<string, any>

// ─── shared text-block styles (unchanged from the previous inline JSX) ────────

const H2_STYLE: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.25rem, 1.8vw, 1.625rem)',
  fontWeight: 600,
  color: 'var(--text-primary)',
  margin: '2.25rem 0 0.875rem',
  lineHeight: 1.25,
  letterSpacing: '-0.01em',
  borderLeft: '2px solid var(--gold)',
  paddingLeft: '14px',
}

const H3_STYLE: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.125rem',
  fontWeight: 500,
  color: 'var(--text-primary)',
  margin: '1.75rem 0 0.625rem',
}

const P_STYLE: CSSProperties = {
  fontSize: '1.0625rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.8,
  marginBottom: '1.25rem',
}

const CAPTION_STYLE: CSSProperties = {
  marginTop: '8px',
  fontSize: '0.75rem',
  color: 'var(--text-tertiary)',
  lineHeight: 1.5,
}

// ─── CSV parsing — dataTable and regressionTable both store a pasted-CSV
//     "data" string on the Sanity side, per the schema's field description. ──

function parseCsv(raw: string): string[][] {
  if (!raw) return []
  return raw
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(',').map((cell) => cell.trim()))
    .filter((row) => row.some((cell) => cell !== ''))
}

function isNumeric(value: string): boolean {
  return value !== undefined && value !== '' && !Number.isNaN(Number(value))
}

/** First column (besides the label column 0) that's numeric in every data row, or -1. */
function findChartColumn(header: string[], rows: string[][]): number {
  if (rows.length < 2) return -1
  for (let col = 1; col < header.length; col++) {
    if (rows.every((r) => isNumeric(r[col]))) return col
  }
  return -1
}

/**
 * Zero-dependency server-rendered SVG bar chart — same approach as
 * MacroChart.tsx (no charting library in package.json; adding one is a
 * separate dependency decision, not something to fold into a render fix).
 */
function BarChart({ labels, values, unitLabel }: { labels: string[]; values: number[]; unitLabel: string }) {
  const width = 640
  const height = 160
  const max = Math.max(...values, 0)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const barGap = 8
  const barWidth = Math.max(4, (width - barGap * (values.length + 1)) / values.length)
  const zeroY = height - ((0 - min) / range) * height

  return (
    <div style={{ margin: '0 0 12px' }}>
      <svg
        viewBox={`0 0 ${width} ${height + 24}`}
        role="img"
        aria-label={`Bar chart of ${unitLabel} across ${labels.join(', ')}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {values.map((v, i) => {
          const x = barGap + i * (barWidth + barGap)
          const h = Math.max((Math.abs(v) / range) * height, 1)
          const barY = v >= 0 ? zeroY - h : zeroY
          return (
            <g key={i}>
              <rect x={x} y={barY} width={barWidth} height={h} fill="var(--gold)" opacity={0.85} />
              <text
                x={x + barWidth / 2}
                y={height + 16}
                textAnchor="middle"
                fontSize="9"
                fill="var(--text-tertiary)"
                fontFamily="var(--font-mono)"
              >
                {(labels[i] || '').slice(0, 8)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function TableBlock({ block }: { block: AnyBlock }) {
  const rows = parseCsv(block.data || '')
  if (rows.length === 0) return null
  const [header, ...body] = rows
  const chartCol = findChartColumn(header, body)

  return (
    <figure style={{ margin: '1.5rem 0 2rem' }}>
      {chartCol > 0 && (
        <BarChart
          labels={body.map((r) => r[0])}
          values={body.map((r) => Number(r[chartCol]))}
          unitLabel={header[chartCol]}
        />
      )}
      <div style={{ overflowX: 'auto', border: '0.5px solid var(--ink-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--ink-mid)' }}>
              {header.map((h, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: i === 0 ? 'left' : 'right',
                    padding: '8px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--text-tertiary)',
                    borderBottom: '0.5px solid var(--ink-border)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: '0.5px solid var(--ink-border)' }}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      textAlign: ci === 0 ? 'left' : 'right',
                      padding: '8px 12px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(block.caption || block.notes) && (
        <figcaption style={CAPTION_STYLE}>
          {block.caption}
          {block.caption && block.notes ? ' — ' : ''}
          {block.notes}
        </figcaption>
      )}
    </figure>
  )
}

function ImageBlock({ block }: { block: AnyBlock }) {
  if (!block.asset) return null
  let src: string | undefined
  try {
    src = urlFor(block).width(1200).url()
  } catch {
    return null
  }
  if (!src) return null
  return (
    <figure style={{ margin: '1.5rem 0 2rem' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={block.alt || ''}
        loading="lazy"
        style={{ width: '100%', height: 'auto', display: 'block', border: '0.5px solid var(--ink-border)' }}
      />
      {block.caption && <figcaption style={CAPTION_STYLE}>{block.caption}</figcaption>}
    </figure>
  )
}

function MathBlock({ block }: { block: AnyBlock }) {
  if (!block.latex) return null
  return (
    <figure style={{ margin: '1.5rem 0 2rem' }}>
      <div
        style={{
          border: '0.5px solid var(--ink-border)',
          background: 'var(--ink-mid)',
          padding: '16px 20px',
          overflowX: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9375rem',
          color: 'var(--text-primary)',
        }}
      >
        {block.latex}
      </div>
      {block.description && <figcaption style={CAPTION_STYLE}>{block.description}</figcaption>}
    </figure>
  )
}

/**
 * Renders one content block to JSX. Handles every `of` type declared on
 * layerOne/Two/Three in the article schema: block (text/h2/h3), image,
 * dataTable, regressionTable, mathBlock.
 */
export function renderContentNode(block: AnyBlock, key: Key): ReactNode {
  switch (block._type) {
    case 'image':
      return <ImageBlock key={key} block={block} />
    case 'dataTable':
    case 'regressionTable':
      return <TableBlock key={key} block={block} />
    case 'mathBlock':
      return <MathBlock key={key} block={block} />
    default: {
      const text = block.children?.map((c: any) => c.text).join('') || ''
      if (block.style === 'h2') return <h2 key={key} style={H2_STYLE}>{text}</h2>
      if (block.style === 'h3') return <h3 key={key} style={H3_STYLE}>{text}</h3>
      return <p key={key} style={P_STYLE}>{text}</p>
    }
  }
}

/** True only for ordinary text paragraphs — used to place the newsletter insert after N of them. */
export function isParagraphNode(block: AnyBlock): boolean {
  return block._type === 'block' && block.style !== 'h2' && block.style !== 'h3'
}

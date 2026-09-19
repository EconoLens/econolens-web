/**
 * EconoLens — Article content-block renderer
 *
 * Single source of truth for turning one content block into JSX, used by
 * RenderBlocks and RenderBlocksWithInsert in src/app/news/[slug]/page.tsx.
 *
 * Handles every member of the shared article body (sanity/schemas/article.ts):
 *   - block          paragraphs, headings, blockquotes, bullet/number lists,
 *                    bold/italic/code/underline/strike, links, inline formulas
 *   - image          inline figure with alt + caption + credit
 *   - dataTable /
 *     regressionTable  RFC-4180 CSV → table (+ optional auto bar chart)
 *   - mathBlock      LaTeX typeset server-side with KaTeX
 *   - chartEmbed     live indicator chart (ChartEmbed.tsx)
 *
 * History:
 *   2026-08-05  rich blocks (image/table/math) stopped rendering as empty <p>.
 *   2026-09-17  links, marks and lists were being flattened to plain text;
 *               formulas printed raw LaTeX; commas inside CSV cells split
 *               rows; no live charts. All fixed here.
 */

/// <reference types="react/canary" />
// ↑ Enables async Server Component types (ChartEmbed awaits indicator data).

import 'katex/dist/katex.min.css'
import katex from 'katex'
import Link from 'next/link'
import type { CSSProperties, Key, ReactNode } from 'react'
import { urlFor } from '@/lib/sanity'
import ChartEmbed from './ChartEmbed'

type AnyBlock = Record<string, any>

// ─── shared styles ────────────────────────────────────────────────────────────

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

const H4_STYLE: CSSProperties = {
  ...H3_STYLE,
  fontSize: '1rem',
  margin: '1.5rem 0 0.5rem',
}

const P_STYLE: CSSProperties = {
  fontSize: '1.0625rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.8,
  marginBottom: '1.25rem',
}

const QUOTE_STYLE: CSSProperties = {
  ...P_STYLE,
  borderLeft: '2px solid var(--ink-border-2)',
  paddingLeft: '16px',
  fontStyle: 'italic',
  color: 'var(--text-primary)',
}

const LIST_STYLE: CSSProperties = {
  ...P_STYLE,
  paddingLeft: '1.5rem',
}

const LINK_STYLE: CSSProperties = {
  color: 'var(--gold-light)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
}

const CODE_STYLE: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.9em',
  background: 'var(--ink-mid)',
  padding: '1px 5px',
  border: '0.5px solid var(--ink-border)',
}

const CAPTION_STYLE: CSSProperties = {
  marginTop: '8px',
  fontSize: '0.75rem',
  color: 'var(--text-tertiary)',
  lineHeight: 1.5,
}

// ─── math (KaTeX, server-rendered; no client JS) ─────────────────────────────

/** Typeset LaTeX to HTML+MathML, or null when the expression is invalid. */
function renderLatex(latex: string, displayMode: boolean): string | null {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: true,
      output: 'htmlAndMathml',
      strict: 'ignore',
      trust: false,
    })
  } catch {
    return null
  }
}

function InlineMath({ latex, fallback }: { latex: string; fallback: string }) {
  const html = latex ? renderLatex(latex, false) : null
  if (!html) return <code style={CODE_STYLE}>{latex || fallback}</code>
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

function MathBlock({ block }: { block: AnyBlock }) {
  const latex = typeof block.latex === 'string' ? block.latex.trim() : ''
  if (!latex) return null
  const html = renderLatex(latex, true)
  return (
    <figure style={{ margin: '1.5rem 0 2rem' }}>
      <div
        style={{
          border: '0.5px solid var(--ink-border)',
          background: 'var(--ink-mid)',
          padding: '16px 20px',
          overflowX: 'auto',
          color: 'var(--text-primary)',
          fontSize: '1.0625rem',
        }}
      >
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem' }}>{latex}</div>
            <div style={{ ...CAPTION_STYLE, marginTop: '6px' }}>Formula shown as source: it could not be typeset.</div>
          </>
        )}
      </div>
      {block.description && <figcaption style={CAPTION_STYLE}>{block.description}</figcaption>}
    </figure>
  )
}

// ─── rich text (Portable Text spans, marks, links) ───────────────────────────

const DECORATORS: Record<string, (children: ReactNode, key: Key) => ReactNode> = {
  strong: (c, k) => <strong key={k} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{c}</strong>,
  em: (c, k) => <em key={k}>{c}</em>,
  code: (c, k) => <code key={k} style={CODE_STYLE}>{c}</code>,
  underline: (c, k) => <u key={k}>{c}</u>,
  'strike-through': (c, k) => <s key={k}>{c}</s>,
}

function renderLink(def: AnyBlock, children: ReactNode, key: Key): ReactNode {
  const href: string = typeof def.href === 'string' ? def.href.trim() : ''
  if (!href) return <span key={key}>{children}</span>
  // Site-relative and same-host links stay in-app; everything else opens safely in a new tab.
  const internal = href.startsWith('/') || /^https?:\/\/(www\.)?econolens\.co\.in(\/|$)/i.test(href)
  if (internal) {
    const path = href.replace(/^https?:\/\/(www\.)?econolens\.co\.in/i, '') || '/'
    return (
      <Link key={key} href={path} style={LINK_STYLE}>
        {children}
      </Link>
    )
  }
  return (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
      {children}
    </a>
  )
}

function renderSpans(block: AnyBlock): ReactNode {
  const children: AnyBlock[] = Array.isArray(block.children) ? block.children : []
  const markDefs = new Map<string, AnyBlock>(
    (Array.isArray(block.markDefs) ? block.markDefs : []).map((d: AnyBlock) => [d._key, d])
  )

  return children.map((span, i) => {
    const key = span._key || i
    const text: string = typeof span.text === 'string' ? span.text : ''
    // Marks are normally strings (decorator names or markDef keys). Some older
    // pipeline-created articles stored decorators as objects ({ _type: 'strong' }),
    // so normalise those rather than silently dropping the formatting.
    const marks: string[] = (Array.isArray(span.marks) ? span.marks : [])
      .map((m: unknown) =>
        typeof m === 'string' ? m : m && typeof m === 'object' && typeof (m as AnyBlock)._type === 'string' ? (m as AnyBlock)._type : ''
      )
      .filter(Boolean)

    // An inline formula replaces the span's placeholder text entirely.
    const mathDef = marks.map((m) => markDefs.get(m)).find((d) => d?._type === 'inlineMath')
    let node: ReactNode = mathDef ? <InlineMath latex={mathDef.latex || ''} fallback={text} /> : text

    marks.forEach((mark, mi) => {
      const k = `${key}-${mi}`
      if (DECORATORS[mark]) {
        node = DECORATORS[mark](node, k)
        return
      }
      const def = markDefs.get(mark)
      if (def?._type === 'link') node = renderLink(def, node, k)
    })

    return <span key={key}>{node}</span>
  })
}

// ─── lists: group consecutive list-item blocks into one <ul>/<ol> ────────────

/**
 * Portable Text stores each list item as its own block. Call this on a layer's
 * block array before rendering so consecutive items become one real list.
 */
export function groupListItems(blocks: AnyBlock[]): AnyBlock[] {
  const out: AnyBlock[] = []
  for (const block of blocks || []) {
    if (block?._type === 'block' && block.listItem) {
      const prev = out[out.length - 1]
      if (prev && prev._type === '__list' && prev.listItem === block.listItem) {
        prev.items.push(block)
        continue
      }
      out.push({ _type: '__list', _key: `list-${block._key || out.length}`, listItem: block.listItem, items: [block] })
      continue
    }
    out.push(block)
  }
  return out
}

function ListBlock({ block }: { block: AnyBlock }) {
  const items: AnyBlock[] = block.items || []
  const content = items.map((item, i) => (
    <li
      key={item._key || i}
      style={{ marginBottom: '0.5rem', marginLeft: `${Math.max(0, (item.level || 1) - 1) * 1.25}rem` }}
    >
      {renderSpans(item)}
    </li>
  ))
  return block.listItem === 'number' ? <ol style={LIST_STYLE}>{content}</ol> : <ul style={LIST_STYLE}>{content}</ul>
}

// ─── tables: RFC-4180 CSV ─────────────────────────────────────────────────────

/** Parses CSV per RFC 4180: quoted cells, commas and line breaks inside quotes, "" escapes. */
export function parseCsv(raw: string): string[][] {
  if (!raw) return []
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false
  const text = raw.replace(/^﻿/, '').trim()

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cell += ch
      }
      continue
    }
    if (ch === '"' && cell.trim() === '') {
      inQuotes = true
      cell = ''
    } else if (ch === ',') {
      row.push(cell.trim())
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell.trim())
      rows.push(row)
      row = []
      cell = ''
    } else {
      cell += ch
    }
  }
  row.push(cell.trim())
  rows.push(row)
  return rows.filter((r) => r.some((c) => c !== ''))
}

function isNumeric(value: string | undefined): boolean {
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
 * Zero-dependency server-rendered SVG bar chart (same approach as MacroChart.tsx).
 * EconoLens chart standard: bars capped at 24px and centred in their slot,
 * value on each bar cap, one zero baseline, labels truncated with the full
 * text kept in a native tooltip.
 */
function BarChart({ labels, values, unitLabel }: { labels: string[]; values: number[]; unitLabel: string }) {
  const width = 640
  const plotTop = 22
  const plotH = 150
  const height = plotTop + plotH + 28
  const max = Math.max(...values, 0)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const slot = width / values.length
  const barWidth = Math.min(24, slot * 0.6)
  const zeroY = plotTop + (max / range) * plotH
  const decimals = Math.min(2, Math.max(0, ...values.map((v) => (String(v).split('.')[1] || '').length)))

  return (
    <div style={{ margin: '0 0 12px' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Bar chart of ${unitLabel}: ${labels.map((l, i) => `${l} ${values[i]}`).join(', ')}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <line x1={0} x2={width} y1={zeroY} y2={zeroY} stroke="var(--ink-border-2)" strokeWidth={1} />
        {values.map((v, i) => {
          const cx = slot * i + slot / 2
          const h = Math.max((Math.abs(v) / range) * plotH, 1)
          const barY = v >= 0 ? zeroY - h : zeroY
          const label = labels[i] || ''
          return (
            <g key={i}>
              <title>{`${label}: ${v}`}</title>
              <rect x={cx - barWidth / 2} y={barY} width={barWidth} height={h} rx={2} fill="var(--gold)" />
              <text
                x={cx}
                y={v >= 0 ? barY - 6 : barY + h + 14}
                textAnchor="middle"
                fontSize="11"
                fill="var(--text-primary)"
                fontFamily="var(--font-mono)"
              >
                {v.toFixed(decimals)}
              </text>
              <text
                x={cx}
                y={height - 8}
                textAnchor="middle"
                fontSize="10"
                fill="var(--text-tertiary)"
                fontFamily="var(--font-mono)"
              >
                {label.length > 14 ? `${label.slice(0, 13)}…` : label}
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
  const width = Math.max(header.length, ...body.map((r) => r.length))
  // Auto-chart stays on by default for existing tables; editors can switch it off per table.
  const chartCol = block.chart === false ? -1 : findChartColumn(header, body)

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
              {Array.from({ length: width }, (_, i) => (
                <th
                  key={i}
                  scope="col"
                  style={{
                    textAlign: i === 0 ? 'left' : 'right',
                    padding: '8px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--text-tertiary)',
                    borderBottom: '0.5px solid var(--ink-border)',
                    whiteSpace: 'nowrap',
                    ...(i === 0 ? { position: 'sticky', left: 0, background: 'var(--ink-mid)' } : {}),
                  }}
                >
                  {header[i] ?? ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: '0.5px solid var(--ink-border)' }}>
                {Array.from({ length: width }, (_, ci) => (
                  <td
                    key={ci}
                    style={{
                      textAlign: ci === 0 ? 'left' : 'right',
                      padding: '8px 12px',
                      color: 'var(--text-secondary)',
                      ...(ci === 0 ? { position: 'sticky', left: 0, background: 'var(--ink)' } : {}),
                    }}
                  >
                    {row[ci] ?? ''}
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

// ─── images ───────────────────────────────────────────────────────────────────

function ImageBlock({ block }: { block: AnyBlock }) {
  if (!block.asset) return null
  let src: string | undefined
  try {
    src = urlFor(block).width(1200).fit('max').auto('format').url()
  } catch {
    return null
  }
  if (!src) return null
  const caption = [block.caption, block.credit ? `Credit: ${block.credit}` : ''].filter(Boolean).join(' · ')
  return (
    <figure style={{ margin: '1.5rem 0 2rem' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={block.alt || block.caption || ''}
        loading="lazy"
        decoding="async"
        style={{ width: '100%', height: 'auto', display: 'block', border: '0.5px solid var(--ink-border)' }}
      />
      {caption && <figcaption style={CAPTION_STYLE}>{caption}</figcaption>}
    </figure>
  )
}

// ─── dispatcher ───────────────────────────────────────────────────────────────

/** Renders one content block (or a grouped list from groupListItems) to JSX. */
export function renderContentNode(block: AnyBlock, key: Key): ReactNode {
  switch (block?._type) {
    case 'image':
      return <ImageBlock key={key} block={block} />
    case 'dataTable':
    case 'regressionTable':
      return <TableBlock key={key} block={block} />
    case 'mathBlock':
      return <MathBlock key={key} block={block} />
    case 'chartEmbed':
      // Async server component: fetches indicator data during render.
      return <ChartEmbed key={key} block={block} />
    case '__list':
      return <ListBlock key={key} block={block} />
    case 'block':
    default: {
      // Anything else carrying text children renders as text, as it did before
      // this change, so older pipeline-created blocks never disappear.
      if (block?._type !== 'block' && !Array.isArray(block?.children)) return null
      const content = renderSpans(block)
      switch (block.style) {
        case 'h1':
        case 'h2':
          return <h2 key={key} style={H2_STYLE}>{content}</h2>
        case 'h3':
          return <h3 key={key} style={H3_STYLE}>{content}</h3>
        case 'h4':
        case 'h5':
        case 'h6':
          return <h4 key={key} style={H4_STYLE}>{content}</h4>
        case 'blockquote':
          return <blockquote key={key} style={QUOTE_STYLE}>{content}</blockquote>
        default:
          return <p key={key} style={P_STYLE}>{content}</p>
      }
    }
  }
}

/** True only for ordinary text paragraphs — used to place the newsletter insert after N of them. */
export function isParagraphNode(block: AnyBlock): boolean {
  return block?._type === 'block' && !block.listItem && (!block.style || block.style === 'normal')
}

'use client'

import { useState } from 'react'

// One-tap sharing for WhatsApp chats, the WhatsApp Channel and Status/Stories.
//  - WhatsApp: opens WhatsApp with the headline, the three points and the link.
//  - Copy: same text to the clipboard, for pasting into the Channel (channels
//    can't be targeted by a share link) or anywhere else. The link in the text
//    pulls the cover image in as the preview.
//  - Story image: 1080×1920 PNG (./story-image) with cover, headline and points.
//    Phones get the native share sheet with the image attached; desktops
//    download it.
// Added 2026-10-13.

interface Props {
  title: string
  slug: string
  points: string[]
}

type Method = 'whatsapp' | 'copy' | 'story'

const SITE = 'https://www.econolens.co.in'

function track(method: Method) {
  window.gtag?.('event', 'share_click', { method, placement: 'article' })
}

export function buildShareText(title: string, points: string[], url: string): string {
  const bullets = points.filter(Boolean).slice(0, 3).map((p) => `▸ ${p.trim()}`)
  return [`*${title.replace(/\*/g, '')}*`, '', ...bullets.flatMap((b, i) => (i ? ['', b] : [b])), '', 'Read the full analysis 👇', url].join('\n')
}

export default function ShareKit({ title, slug, points }: Props) {
  const [status, setStatus] = useState<string>('')
  const shareUrl = `${SITE}/news/${slug}?utm_source=whatsapp&utm_medium=social&utm_campaign=article_share`
  const text = buildShareText(title, points, shareUrl)

  function flash(msg: string) {
    setStatus(msg)
    setTimeout(() => setStatus(''), 2200)
  }

  async function copyText() {
    track('copy')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    flash('Copied: headline, points and link')
  }

  async function storyImage() {
    track('story')
    setStatus('Preparing image…')
    try {
      const res = await fetch(`/news/${slug}/story-image`)
      if (!res.ok) throw new Error(String(res.status))
      const blob = await res.blob()
      const file = new File([blob], `econolens-${slug}-story.png`, { type: 'image/png' })
      if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text })
        setStatus('')
        return
      }
      const href = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = href
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(href), 4000)
      flash('Story image downloaded')
    } catch (err) {
      // A cancelled share sheet throws AbortError; that is not a failure.
      if ((err as Error)?.name === 'AbortError') setStatus('')
      else flash('Could not prepare the image. Please try again.')
    }
  }

  const btn: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.625rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '7px 12px',
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '0.5px solid var(--ink-border-2)',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    lineHeight: 1,
  }

  return (
    <div aria-label="Share this article" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '18px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginRight: '4px' }}>
        Share
      </span>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('whatsapp')}
        style={{ ...btn, color: 'var(--gold)', borderColor: 'var(--gold)' }}
      >
        WhatsApp
      </a>
      <button type="button" onClick={copyText} style={btn}>
        Copy text
      </button>
      <button type="button" onClick={storyImage} style={btn}>
        Story image
      </button>
      <span role="status" aria-live="polite" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-tertiary)' }}>
        {status}
      </span>
    </div>
  )
}

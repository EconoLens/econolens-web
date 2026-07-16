import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Captures EconoLens Intel signups from the inline article form.
 *
 * NOTE: Beehiiv has zero integration code as of 2026-07-16 (no API key
 * available yet) — this writes to the newsletter_signups table
 * (supabase/newsletter-signups.sql) as the durable source of truth so
 * signups aren't lost while that's pending. Once a Beehiiv (or other ESP)
 * key exists, add a sync step here or as a scheduled job that pushes
 * unsynced rows and sets synced_at.
 */
export async function POST(req: Request) {
  let body: { email?: string; source?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = (body.email || '').trim().toLowerCase()
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const source = body.source || 'news-inline'

  const { error } = await supabase
    .from('newsletter_signups')
    .upsert({ email, source }, { onConflict: 'email', ignoreDuplicates: true })

  if (error) {
    return NextResponse.json({ error: 'Could not save signup' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

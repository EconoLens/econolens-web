/**
 * EconoLens — Article-publish webhook
 *
 * Configure this as a Sanity webhook (sanity.io/manage → project → API →
 * Webhooks — manual step in the dashboard, cannot be done from code):
 *   URL:      https://www.econolens.co.in/api/webhooks/article-published
 *   Trigger:  Create + Update
 *   Filter:   _type == "article" && qaStatus == "passed"
 *   Secret:   set to the same value as SANITY_WEBHOOK_SECRET in Vercel
 *
 * Sanity signs webhook requests the same way Stripe does (per Sanity's own
 * docs, checked 2026-07-08): header `sanity-webhook-signature` in the form
 * `t=<timestamp>,v1=<base64url hmac-sha256 of "<timestamp>.<raw body>">`.
 *
 * On a verified publish event, this posts the article to Buffer
 * (Instagram + LinkedIn — see lib/buffer.ts for why X isn't included by
 * default). Newsletter (Beehiiv/Kit) is intentionally NOT wired here yet —
 * see project notes on why that's still a manual step.
 */

import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { sanityClient, urlFor } from '@/lib/sanity'
import { postArticleToBuffer } from '@/lib/buffer'

export const runtime = 'nodejs'

function verifySanitySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false

  const parts = Object.fromEntries(
    header.split(',').map((kv) => {
      const [k, v] = kv.split('=')
      return [k, v]
    }),
  )
  const timestamp = parts.t
  const signature = parts.v1
  if (!timestamp || !signature) return false

  const expected = createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('base64url')

  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(req: Request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'SANITY_WEBHOOK_SECRET is not configured' }, { status: 500 })
  }

  const rawBody = await req.text()
  const signatureHeader = req.headers.get('sanity-webhook-signature')

  if (!verifySanitySignature(rawBody, signatureHeader, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const documentId = req.headers.get('sanity-document-id')
  const operation = req.headers.get('sanity-operation')

  if (!documentId) {
    return NextResponse.json({ ok: true, skipped: 'no document id' })
  }

  // Fetch the fields we need directly — don't trust the webhook body shape,
  // it depends on the projection configured in the Sanity dashboard.
  // Note: the article schema's publish gate is the `qaStatus` field
  // (value "passed"), not a generic "status" field — confirmed against
  // sanity/schemas/article.ts and src/app/news/[slug]/page.tsx on 2026-07-08.
  const article = await sanityClient.fetch(
    `*[_id == $id][0]{
      title,
      "slug": slug.current,
      qaStatus,
      coverImage
    }`,
    { id: documentId },
  )

  if (!article || article.qaStatus !== 'passed') {
    return NextResponse.json({ ok: true, skipped: 'article not QA-passed yet', operation })
  }

  const articleUrl = `https://www.econolens.co.in/news/${article.slug}`
  const imageUrl = article.coverImage ? urlFor(article.coverImage).width(1200).url() : undefined

  try {
    const results = await postArticleToBuffer({
      title: article.title,
      url: articleUrl,
      imageUrl,
    })

    return NextResponse.json({ ok: true, results })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    // Don't fail the whole webhook 500 just because Buffer had a hiccup —
    // Sanity will retry on 5xx, which would re-post duplicates on success paths.
    return NextResponse.json({ ok: false, error: message }, { status: 200 })
  }
}

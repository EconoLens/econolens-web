/**
 * EconoLens — Supabase Response Cache Utilities
 * All Claude API responses are cached by query hash.
 * Cache hit = zero API cost. Target: 40%+ hit rate within 30 days.
 */

import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

// Server-side only — service role key never goes to client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface CachedResponse {
  id: string
  query_hash: string
  query_text: string
  response_text: string
  tokens_used: number
  model: string
  hit_count: number
  created_at: string
  last_hit_at: string
}

export interface CacheWritePayload {
  query_text: string
  response_text: string
  tokens_used: number
  model: string
}

// ─── HASH ─────────────────────────────────────────────────────────────────────

/**
 * Deterministic SHA-256 hash of query text.
 * Normalise: trim + lowercase + collapse whitespace.
 * Two semantically identical queries → same hash → same cache hit.
 */
export function generateQueryHash(queryText: string): string {
  const normalised = queryText.trim().toLowerCase().replace(/\s+/g, ' ')
  return createHash('sha256').update(normalised).digest('hex')
}

// ─── LOOKUP ───────────────────────────────────────────────────────────────────

/**
 * Check cache before hitting Claude API.
 * Returns cached response text if found, null if miss.
 * Also bumps hit_count + last_hit_at on every hit (fire-and-forget).
 */
export async function getCachedResponse(
  queryText: string
): Promise<string | null> {
  const hash = generateQueryHash(queryText)

  const { data, error } = await supabase
    .from('ai_response_cache')
    .select('id, response_text')
    .eq('query_hash', hash)
    .single()

  if (error || !data) return null

  // Fire-and-forget hit tracking — don't await, not on critical path
  supabase
    .from('ai_response_cache')
    .update({
      hit_count: supabase.rpc('increment', { row_id: data.id }), // see note below
      last_hit_at: new Date().toISOString(),
    })
    .eq('id', data.id)
    .then(() => {}) // suppress unhandled promise warning

  return data.response_text
}

/**
 * Simpler hit count increment — avoids RPC dependency.
 * Use this version if you haven't set up the increment RPC function.
 */
export async function getCachedResponseSimple(
  queryText: string
): Promise<{ hit: boolean; text: string | null; hash: string }> {
  const hash = generateQueryHash(queryText)

  const { data } = await supabase
    .from('ai_response_cache')
    .select('id, response_text, hit_count')
    .eq('query_hash', hash)
    .single()

  if (!data) return { hit: false, text: null, hash }

  // Increment hit count without RPC
  supabase
    .from('ai_response_cache')
    .update({
      hit_count: (data.hit_count ?? 0) + 1,
      last_hit_at: new Date().toISOString(),
    })
    .eq('id', data.id)
    .then(() => {})

  return { hit: true, text: data.response_text, hash }
}

// ─── WRITE ────────────────────────────────────────────────────────────────────

/**
 * Write a new response to cache after a real API call.
 * Uses upsert so duplicate hashes never cause conflicts.
 */
export async function setCachedResponse(
  payload: CacheWritePayload
): Promise<void> {
  const hash = generateQueryHash(payload.query_text)

  await supabase.from('ai_response_cache').upsert(
    {
      query_hash: hash,
      query_text: payload.query_text,
      response_text: payload.response_text,
      tokens_used: payload.tokens_used,
      model: payload.model,
      hit_count: 0,
      created_at: new Date().toISOString(),
      last_hit_at: new Date().toISOString(),
    },
    { onConflict: 'query_hash' }
  )
}

// ─── QUERY LOGGING ────────────────────────────────────────────────────────────

/**
 * Log every AI query (hit or miss) to ai_query_log.
 * Used by CFO for cost monitoring and by T-05 for cache efficiency reports.
 */
export async function logQuery({
  userId,
  queryText,
  responseId,
  tokensUsed,
  cached,
  model,
}: {
  userId: string | null
  queryText: string
  responseId?: string
  tokensUsed: number
  cached: boolean
  model: string
}): Promise<void> {
  await supabase.from('ai_query_log').insert({
    user_id: userId,
    query_text: queryText,
    response_id: responseId ?? null,
    tokens_used: tokensUsed,
    cached,
    model,
    created_at: new Date().toISOString(),
  })
}

// ─── CACHE STATS (for COO dashboard) ─────────────────────────────────────────

/**
 * Returns cache hit rate for the last N days.
 * Used in daily ops report.
 */
export async function getCacheStats(days = 7): Promise<{
  totalQueries: number
  cacheHits: number
  hitRate: number
  tokensSaved: number
}> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  const { data } = await supabase
    .from('ai_query_log')
    .select('cached, tokens_used')
    .gte('created_at', since)

  if (!data || data.length === 0) {
    return { totalQueries: 0, cacheHits: 0, hitRate: 0, tokensSaved: 0 }
  }

  const hits = data.filter((r) => r.cached)
  const tokensSaved = hits.reduce((sum, r) => sum + (r.tokens_used ?? 0), 0)

  return {
    totalQueries: data.length,
    cacheHits: hits.length,
    hitRate: Math.round((hits.length / data.length) * 100),
    tokensSaved,
  }
}

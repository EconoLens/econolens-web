/**
 * EconoLens — AI Query API Route
 * POST /api/ai-query
 *
 * Pipeline:
 *   1. Clerk auth (reject unauthenticated)
 *   2. Supabase user lookup → get plan
 *   3. Rate limit check (daily query count vs plan limit)
 *   4. Cache lookup → return if hit (0 API cost)
 *   5. Claude API call with prompt caching
 *   6. Cache write + query count increment
 *   7. Return response
 *
 * Never trust client-side plan claims — always verify from Supabase.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { researchQuery, explainConcept, PLAN_LIMITS, Plan } from '@/lib/claude'

// Service role — server-side only, never exposed to client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── REQUEST SCHEMA ───────────────────────────────────────────────────────────

interface QueryRequest {
  query: string
  type: 'research' | 'explain'
  term?: string  // For explain type
}

// ─── RATE LIMIT CHECK ─────────────────────────────────────────────────────────

async function checkRateLimit(
  userId: string,
  plan: Plan
): Promise<{ allowed: boolean; queriesUsedToday: number; limit: number }> {
  const limit = PLAN_LIMITS[plan].queriesPerDay
  if (limit === -1) return { allowed: true, queriesUsedToday: 0, limit: -1 }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('ai_query_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())

  const used = count ?? 0
  return { allowed: used < limit, queriesUsedToday: used, limit }
}

// ─── HANDLER ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Step 1: Auth ─────────────────────────────────────────────────────────
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Step 2: Parse + validate body ────────────────────────────────────────
  let body: QueryRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.query || typeof body.query !== 'string') {
    return NextResponse.json({ error: 'query is required' }, { status: 400 })
  }

  const queryText = body.query.trim().slice(0, 2000) // Hard cap at 2000 chars input

  // ── Step 3: Get user plan from Supabase (never trust client) ─────────────
  const { data: user } = await supabase
    .from('users')
    .select('id, plan, query_count')
    .eq('clerk_id', clerkId)
    .single()

  if (!user) {
    // Auto-create user on first query
    const { data: newUser } = await supabase
      .from('users')
      .insert({ clerk_id: clerkId, email: '', plan: 'free', query_count: 0 })
      .select('id, plan, query_count')
      .single()

    if (!newUser) {
      return NextResponse.json({ error: 'User setup failed' }, { status: 500 })
    }
    Object.assign(user ?? {}, newUser)
  }

  const plan = (user?.plan ?? 'free') as Plan

  // ── Step 4: Rate limit ───────────────────────────────────────────────────
  const { allowed, queriesUsedToday, limit } = await checkRateLimit(
    user!.id,
    plan
  )

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Daily query limit reached',
        plan,
        queriesUsedToday,
        limit,
        upgradeUrl: '/pricing',
      },
      { status: 429 }
    )
  }

  // ── Step 5: Call Claude (with cache) ─────────────────────────────────────
  try {
    const result =
      body.type === 'explain' && body.term
        ? await explainConcept(body.term, user!.id)
        : await researchQuery(queryText, user!.id, plan)

    // ── Step 6: Increment user query count ───────────────────────────────
    if (!result.cached) {
      await supabase
        .from('users')
        .update({ query_count: (user?.query_count ?? 0) + 1 })
        .eq('id', user!.id)
    }

    // ── Step 7: Return response ───────────────────────────────────────────
    return NextResponse.json({
      response: result.text,
      cached: result.cached,
      model: result.model,
      tokensUsed: result.tokensUsed,
      queriesRemaining: limit === -1 ? -1 : limit - queriesUsedToday - 1,
      plan,
    })
  } catch (error) {
    console.error('[ai-query] Claude API error:', error)
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 503 }
    )
  }
}

// Only POST allowed
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

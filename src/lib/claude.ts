/**
 * EconoLens — Claude API Client
 * ─────────────────────────────────────────────────────────────────────────────
 * COST REDUCTION ARCHITECTURE (T-05 mandate):
 *
 *  Layer 1 — Supabase response cache   → 0 tokens on hit (saves 100%)
 *  Layer 2 — Anthropic prompt cache    → saves 75% on system prompt tokens
 *  Layer 3 — Model routing             → Haiku for simple, Sonnet for complex
 *  Layer 4 — Max tokens cap            → hard ceiling per plan tier
 *  Layer 5 — Query logging             → CFO monitors spend in real time
 *
 * LOCKED SYSTEM PROMPTS: Do NOT change without a Notion log entry first.
 * See: CLAUDE.md → LOCKED SYSTEM PROMPTS section
 */

import Anthropic from '@anthropic-ai/sdk'
import { getCachedResponseSimple, setCachedResponse, logQuery } from './cache'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// ─── MODELS ───────────────────────────────────────────────────────────────────

export const MODELS = {
  FAST: 'claude-haiku-4-5-20251001',    // Simple queries, explain concept
  STANDARD: 'claude-sonnet-4-6',         // Research tool, news writer
  // POWER: 'claude-opus-4-6',           // Reserved for Phase 2 deep research
} as const

export type ModelTier = keyof typeof MODELS

// ─── PLAN LIMITS ─────────────────────────────────────────────────────────────

export const PLAN_LIMITS = {
  free: { queriesPerDay: 5, maxTokens: 1000 },
  pro: { queriesPerDay: 50, maxTokens: 2000 },
  research: { queriesPerDay: 200, maxTokens: 4000 },
  institutional: { queriesPerDay: -1, maxTokens: 8000 }, // -1 = unlimited
} as const

export type Plan = keyof typeof PLAN_LIMITS

// ─── LOCKED SYSTEM PROMPTS ────────────────────────────────────────────────────
// These have cache_control applied — Anthropic caches them for 5 minutes.
// Changing these resets the cache. Only change with a Notion decision log entry.

const SYSTEM_PROMPTS = {
  RESEARCH_TOOL: `You are EconoLens's economics research assistant. Scope: economics only.
Politely redirect off-topic queries. Always cite sources. Use FRED/World Bank/RBI data.
Format: direct answer → context → implications → sources.
Free tier: inform user of 5-query daily limit when applicable.`,

  EXPLAIN_CONCEPT: `You are explaining the economics term the reader highlighted.
Respond in exactly 2 sentences at the reader's level.
No jargon. No hedging. Be direct and concrete. Use a real-world example.`,

  NEWS_WRITER: `You are EconoLens's economics news writer. You receive official press releases
and announcements from central banks and economic institutions.
Rules: 1. Do NOT quote any sentence from source. 2. Synthesise into original sentences.
3. Add India-specific context paragraph. 4. Structure: Headline → 3-bullet summary
→ Layer 1 (200w plain English) → Layer 2 (600w context). 5. Source attribution block.
6. Label: "AI-assisted · Source: [Institution]". 7. Never mirror source sentence structure.
8. Append SEBI disclaimer if any asset price mentioned.`,

  PAPER_TRANSLATOR: `You receive an academic economics paper extract. Your job:
1. Explain the core argument in plain English (200 words max)
2. List 3 key findings in bullet points
3. Write "Why this matters for India's economy" (100 words)
4. Never reproduce more than 10 consecutive words from the source
5. Cite: author name, institution, year, NBER/SSRN link`,

  QA_REVIEWER: `You are reviewing an EconoLens article for quality. Check:
1. India-specific context paragraph — present? (YES/NO)
2. Three-layer structure — all three layers complete? (YES/NO)
3. Source attribution — institution + link present? (YES/NO)
4. SEBI disclaimer — present if any price mentioned? (YES/NO)
5. Factual accuracy — any claims that seem wrong? (list or NONE)
Output JSON: {"india_context": bool, "three_layers": bool, "source_attr": bool, "sebi": bool, "issues": []}`,
} as const

export type PromptType = keyof typeof SYSTEM_PROMPTS

// ─── CORE QUERY FUNCTION ─────────────────────────────────────────────────────

export interface QueryOptions {
  promptType: PromptType
  userMessage: string
  userId: string | null
  plan?: Plan
  modelTier?: ModelTier
  skipCache?: boolean  // Only true for QA reviewer (always fresh)
}

export interface QueryResult {
  text: string
  cached: boolean
  tokensUsed: number
  model: string
  queryHash?: string
}

/**
 * Main entry point for all Claude API calls in EconoLens.
 *
 * Flow:
 *   1. Check Supabase cache → return immediately if hit (0 API cost)
 *   2. Call Anthropic with prompt caching on system prompt (75% token saving)
 *   3. Write response to Supabase cache
 *   4. Log to ai_query_log for CFO monitoring
 */
export async function queryAI(options: QueryOptions): Promise<QueryResult> {
  const {
    promptType,
    userMessage,
    userId,
    plan = 'free',
    modelTier = 'STANDARD',
    skipCache = false,
  } = options

  const model = MODELS[modelTier]
  const maxTokens = PLAN_LIMITS[plan].maxTokens

  // ── Layer 1: Supabase response cache ──────────────────────────────────────
  if (!skipCache) {
    const cacheKey = `${promptType}::${userMessage}`
    const { hit, text, hash } = await getCachedResponseSimple(cacheKey)

    if (hit && text) {
      await logQuery({
        userId,
        queryText: userMessage,
        tokensUsed: 0,
        cached: true,
        model,
      })
      return { text, cached: true, tokensUsed: 0, model, queryHash: hash }
    }
  }

  // ── Layer 2: Anthropic API with prompt caching ────────────────────────────
  const systemPrompt = SYSTEM_PROMPTS[promptType]

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system: [
      {
        type: 'text',
        text: systemPrompt,
        // cache_control tells Anthropic to cache this system prompt for 5 min.
        // On repeated calls, the ~500-token system prompt costs 0 input tokens.
        // Saves ~75% on every non-cached query.
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userMessage }],
  })

  const responseText =
    response.content[0].type === 'text' ? response.content[0].text : ''

  const tokensUsed =
    (response.usage.input_tokens ?? 0) + (response.usage.output_tokens ?? 0)

  // ── Layer 3: Write to Supabase cache ──────────────────────────────────────
  if (!skipCache) {
    await setCachedResponse({
      query_text: `${promptType}::${userMessage}`,
      response_text: responseText,
      tokens_used: tokensUsed,
      model,
    })
  }

  // ── Layer 4: Log for CFO monitoring ───────────────────────────────────────
  await logQuery({
    userId,
    queryText: userMessage,
    responseId: response.id,
    tokensUsed,
    cached: false,
    model,
  })

  return {
    text: responseText,
    cached: false,
    tokensUsed,
    model,
  }
}

// ─── CONVENIENCE WRAPPERS ─────────────────────────────────────────────────────

/** Explain an economics term — uses Haiku (cheapest model, 2-sentence reply) */
export async function explainConcept(
  term: string,
  userId: string | null
): Promise<QueryResult> {
  return queryAI({
    promptType: 'EXPLAIN_CONCEPT',
    userMessage: `Explain this economics term: ${term}`,
    userId,
    modelTier: 'FAST',   // Haiku — 2-sentence reply doesn't need Sonnet
  })
}

/** Research tool query — uses Sonnet, respects plan tier */
export async function researchQuery(
  question: string,
  userId: string | null,
  plan: Plan = 'free'
): Promise<QueryResult> {
  return queryAI({
    promptType: 'RESEARCH_TOOL',
    userMessage: question,
    userId,
    plan,
    modelTier: 'STANDARD',
  })
}

/** News article generation — uses Sonnet, no cache (always fresh content) */
export async function generateNewsArticle(
  sourceContent: string,
  institution: string
): Promise<QueryResult> {
  return queryAI({
    promptType: 'NEWS_WRITER',
    userMessage: `Institution: ${institution}\n\nSource content:\n${sourceContent}`,
    userId: null,  // Pipeline call, not user-initiated
    modelTier: 'STANDARD',
    skipCache: true,  // News is always unique — don't cache
  })
}

/** Academic paper translation */
export async function translatePaper(
  paperExtract: string,
  citation: string
): Promise<QueryResult> {
  return queryAI({
    promptType: 'PAPER_TRANSLATOR',
    userMessage: `Citation: ${citation}\n\nPaper extract:\n${paperExtract}`,
    userId: null,
    modelTier: 'STANDARD',
    skipCache: false,  // Papers can be cached — same paper → same translation
  })
}

/** QA review — always fresh, uses Haiku (structured JSON output, fast) */
export async function reviewArticle(
  articleContent: string
): Promise<QueryResult> {
  return queryAI({
    promptType: 'QA_REVIEWER',
    userMessage: `Review this article:\n\n${articleContent}`,
    userId: null,
    modelTier: 'FAST',   // Haiku handles JSON output fine
    skipCache: true,      // QA must always be fresh
  })
}

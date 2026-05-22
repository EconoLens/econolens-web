# EconoLens — Claude Code Instructions

## Project Overview
EconoLens is an India-focused economics news and research platform. AI-assisted analysis of monetary policy, fiscal data, and global economic events — written for Indian students and professionals.

**Goal:** Build a working MVP fast — news feed, AI research tool, paywall.

---

## Tech Stack (Locked)

| Layer | Tool |
|---|---|
| Frontend | Next.js 14 App Router + TypeScript + Tailwind |
| CMS | Sanity v3 headless |
| Database | Supabase Postgres + Auth + Storage |
| Auth | Clerk |
| Hosting | Vercel |
| Payments IN | Razorpay |
| Payments INTL | Stripe |
| AI | Claude API claude-sonnet-4-20250514 with prompt caching |
| Newsletter | Beehiiv |
| Social | Buffer API |
| Accounting | Zoho Books |
| Economic data | FRED API (St. Louis Fed) |

---

## Folder Structure

```
src/app/api/news/          # RSS ingestion + Claude article generation
src/app/api/ai-query/      # AI research tool endpoint
src/app/api/indicators/    # FRED + World Bank data fetch
src/app/api/webhooks/      # Razorpay + Stripe + Clerk webhooks
src/app/api/cron/          # Scheduled jobs
src/components/ui/         # shadcn/ui base components
src/components/charts/     # Recharts wrappers
src/components/article/    # Article rendering, paywall gate, quiz
src/components/dashboard/  # Dashboard widgets
src/lib/                   # sanity.ts, supabase.ts, claude.ts, fred.ts, utils.ts
src/sanity/schemas/        # Sanity content schemas
content/drafts/
content/newsletter/
ops/outreach/
```

---

## Environment Variables

All values from 1Password. Never commit .env.local.

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
ANTHROPIC_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
FRED_API_KEY=
COPYSCAPE_API_KEY=
BEEHIIV_API_KEY=
BUFFER_ACCESS_TOKEN=
ZOHO_BOOKS_TOKEN=
```

---

## Claude API — Locked System Prompts (DO NOT CHANGE)

### News Article Generator
```
You are EconoLens's economics news writer. You receive official press releases
and announcements from central banks and economic institutions.
Rules:
1. Do NOT quote any sentence from the source document
2. Synthesise into entirely original sentences
3. Add one paragraph of India-specific economic context
4. Structure: Headline → 3-bullet summary → Layer 1 (200w) → Layer 2 (600w)
5. End with source attribution block + institution link
6. Label: AI-assisted · Source: [Institution]
7. Never mirror sentence structure from the source
```

### AI Research Tool
```
You are EconoLens's economics research assistant.
Scope: economics only. Redirect off-topic queries.
Always cite sources. Use FRED, World Bank, RBI data where relevant.
Format: direct answer → context → implications → sources.
Free users: 5 queries/day enforced by Supabase counter.
```

### Explain This Concept (in-article button)
```
Explain the highlighted economics term in exactly 2 sentences.
Match the reader's level (student/professional).
No jargon. Be direct and concrete.
```

---

## Prompt Caching — implement Day 1 (saves ~75% API cost)

```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'anthropic-beta': 'prompt-caching-2024-07-31',
    'x-api-key': process.env.ANTHROPIC_API_KEY!,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: [{ type: 'text', text: LOCKED_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: articleText }]
  })
});
```

---

## Supabase Schema

```sql
CREATE TABLE users (id UUID PRIMARY KEY, clerk_id TEXT UNIQUE, email TEXT, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE subscriptions (id UUID PRIMARY KEY, user_id UUID REFERENCES users(id), status TEXT, plan TEXT, valid_until TIMESTAMP, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE ai_response_cache (id UUID PRIMARY KEY, query_hash TEXT UNIQUE, query_text TEXT, response_text TEXT, tokens_used INTEGER, created_at TIMESTAMP DEFAULT NOW(), hit_count INTEGER DEFAULT 0);
CREATE TABLE economic_data_cache (country TEXT, indicator TEXT, data JSONB, fetched_at TIMESTAMP, PRIMARY KEY (country, indicator));
CREATE TABLE quiz_scores (id UUID PRIMARY KEY, user_id UUID, article_id TEXT, score INTEGER, created_at TIMESTAMP DEFAULT NOW());
CREATE INDEX idx_query_hash ON ai_response_cache(query_hash);
```

---

## Build Order

1. Scaffold — run setup-commands.sh in Codespace terminal
2. Supabase — create project, run schema SQL, copy keys to .env.local
3. Sanity — npx sanity init, create article schema, copy keys
4. Clerk — create app, copy keys, wrap layout with ClerkProvider
5. Homepage — hero, latest articles placeholder, subscribe CTA
6. News pipeline — /api/news: fetch RSS → Claude article → save to Sanity
7. Article pages — [slug] dynamic route, paywall gate at Layer 2
8. AI research tool — /api/ai-query with Supabase rate limiting
9. Payments — Razorpay checkout → webhook → update subscription
10. Dashboard — subscriber-only: saved articles, AI history, indicators
11. Indicators widget — FRED data + Recharts
12. Deploy — connect Vercel to GitHub, add env vars in Vercel dashboard

---

## Rules

- Never commit .env.local or any file containing API keys
- SUPABASE_SERVICE_KEY only in server-side routes, never in client code
- Implement AI query rate limiting before going public
- Paywall gate: Layer 1 (200w free) | Layer 2 (600w subscribers only)
- When uncertain about a decision, stop and ask

---

## Links

- Notion HQ: https://www.notion.so/3676e396ef8981619f1cfa132517a2a1
- Tech Stack: https://www.notion.so/3676e396ef89818192a4ccfce3213772
- Launch Checklist: https://www.notion.so/3676e396ef8981f182c6c7a6b7b2b63e
- Google Drive: https://drive.google.com/drive/folders/1bcNvqSECbu-jwvfFZoBh5oaLmuhrbaw2
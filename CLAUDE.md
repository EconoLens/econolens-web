# ECONOLENS — CLOUD HQ MASTER CONTEXT FILE v2.0
# ═══════════════════════════════════════════════════════════════════════════════
# THE SINGLE SOURCE OF TRUTH FOR ALL 52 AI EMPLOYEES
# Read by: Claude Code · Claude Cowork · Claude.ai Projects · All AI Tools
# Last updated: July 2026 | Version: 2.6 — SESSION 12 BRAIN SYNC + REALITY-CHECK CONSOLIDATION
# ═══════════════════════════════════════════════════════════════════════════════
# HOW THE CLOUD OFFICE WORKS:
# Every AI employee below has:
#   [TOOL]      → The actual SaaS product that does the work
#   [REPORTS]   → Which C-Suite officer they answer to
#   [ACCESSES]  → Which shared cloud systems they use
#   [DAILY JOB] → Their exact daily task list (no ambiguity)
#   [COWORK]    → Tasks assigned to Claude Cowork for execution
# ═══════════════════════════════════════════════════════════════════════════════

## 🧭 REALITY CHECK — CONSOLIDATED CURRENT STATE (single source of truth, updated 2026-07-23)

**Read this section first, before anything below it.** Everything past this point (the 52-role
org, the Make.com flows, the recurring task calendar) is a **target-state design doc** written
in Session 5 (May 2026) and never fully reconciled against what actually got built. Four separate
trackers tried to be "the real status" since then — the Notion **Founder Task List**, the Notion
**Services Bible**, the **`EconoHub_PMO_Master`** Google Sheet, and this file itself — and all
four drifted out of sync with reality independently (the PMO sheet showed 43/43 tasks 0% complete
when ~16 were already done; the Services Bible showed every Phase 1 service "Not started" when
4 were shipped). That drift is the actual problem KP flagged 2026-07-23: work has been getting
done since day one, but the record of it is scattered across chat history, dated snapshot files,
and three abandoned Notion/Sheet trackers instead of living in one place that's kept current.

**Going forward, there are exactly two living documents. Nothing else is authoritative:**
1. **This file (`CLAUDE.md`)** — architecture, org design, and the reality-check below. Edited
   in place; the Session Log at the bottom is the append-only history, everything above it is
   current state, not a snapshot.
2. **`ops/reports/PENDING-TASKS-MASTER-2026-07-21.md`** (or whatever date supersedes it) — the
   live, tiered, actionable task list. Update this file in place going forward instead of writing
   a new dated file each time; only start a new one if the old one becomes genuinely unwieldy.

The Notion Founder Task List, Notion Services Bible, and `EconoHub_PMO_Master` Sheet are
**retired** — treat them as historical inputs that were reconciled into the two files above, not
as something to check status against anymore.

### What's actually live (infrastructure, verified against the real repo + live site)

| Layer | Tool | Reality |
|---|---|---|
| Domain / hosting | econolens.co.in on Vercel (`khagan-s-projects` team), Hostinger DNS | ✅ Live |
| Source control | `github.com/EconoLens/econolens-web`, single `main`, PR-gated (TypeScript check on push/PR since 07-08) | ✅ Live — direct-push-only description in old ops docs is outdated |
| Framework | Next.js 14.2.25 (patched for CVE-2025-29927), App Router, TypeScript, Tailwind | ✅ Live |
| Auth | Clerk — gates `/dashboard` (restored 07-21 after being stubbed since 05-29) and some API routes; rest of site public by design | ✅ Live, Google Sign-In sub-issue open (see below) |
| CMS | Sanity, embedded Studio, article/contributor/category/economicIndicator/siteSettings schemas | ✅ Live |
| Database | Supabase — AI query cache, plan/rate-limit data, newsletter signup capture | ✅ Live |
| Payments | Razorpay checkout UI on `/pricing` | ⚠️ UI only — very likely not processing real payments (no GST/bank account behind it yet) |
| Analytics | GA4 | ✅ Live (fixed 07-02, CSP block fixed 07-08) |
| Economic data | FRED API (US/global indicators), India series static/manual | ✅ Live — 13 of 14 indicators show real data; Gold Price series still shows none |
| Content pipeline | Manual — KP + Claude draft, publish via Sanity | ✅ This is the real process — **not** the automated Make.com pipeline described later in this file |
| Social | Buffer → LinkedIn only (X excluded by design, per-post cost) | ✅ Live, LinkedIn admin access separately blocked |
| Newsletter | Beehiiv account + API keys exist | ❌ Zero integration code — no signup form, no send pipeline, no confirmation email |
| SE Ranking, Semrush, Ahrefs, Frase, Hotjar, Apollo.io | Named throughout the Marketing/Product role sections below | ❌ None ever actually set up — aspirational tooling only |
| Feedly, Uptime Robot, Copyscape | Named throughout the C-Suite/Tech/Content role sections below | ❌ None ever actually set up (Copyscape has env-var placeholders and a schema field, no funded account) |
| Make.com | Automated news pipeline (FLOW-01 through FLOW-05, later in this file) | ⚠️ Was built, then **explicitly abandoned as a strategy** — not running, kept below for historical/reference value only |
| 1Password | Named as the key-storage system throughout | ❌ Not actually set up — 4 real secrets were caught sitting in plaintext in Notion 2026-07-12 |

### What's actually blocking revenue

GST application submitted 2026-07-13, **not yet approved**. LUT filing → IEC code → HDFC business
account → Razorpay live keys / Stripe / Zoho Books all sequence behind it. This is a CEO-only
action — nothing technical is in the way. Full detail: `ops/reports/PENDING-TASKS-MASTER-2026-07-21.md`.

### Content reality

29 articles live as of 2026-07-08 (three-layer format: Overview/Analysis/Technical, real
citations). The `/study` curriculum page is fully built (24 topics across Macro, Micro,
Econometrics, International) but only 2 of 24 have actual articles linked (GDP, Inflation) — the
rest are placeholder text. This is the concrete, current scope of "content production," not the
30-articles/day automated volume described in the C-01 role below, which was never realized.

### Deploy reality

KP runs PowerShell scripts (`ops/push-to-github.ps1`, `ops/deploy-all-fixes.ps1`) that clone the
real repo fresh, copy in changes, commit, and push using his own GitHub credentials — this is the
actual deploy path, separate from Claude Cowork's scoped-PAT feature-branch-and-PR workflow (see
Session 12 log entry). Vercel auto-deploys on push to `main`, but the GitHub→Vercel webhook has
misfired before — always verify a deploy landed rather than assuming it did.

---

## 🏢 CLOUD OFFICE INFRASTRUCTURE — THE SHARED FOUNDATION (target-state design, see reality check above)

All 52 AI employees operate on these shared cloud systems.
Every tool connects to at least one of these. Nothing runs in isolation.

### TIER 1 — CORE INFRASTRUCTURE (All employees use these)
| System | URL / Access | Purpose | Who Reads It |
|--------|-------------|---------|-------------|
| CLOUD HQ Brain | CLAUDE.md (this file) | Single source of truth | All Claude tools |
| Notion HQ | notion.econolens.co.in | Decision log, task tracking, docs | All departments |
| Vercel Dashboard | vercel.com/khagan-s-projects/econolens-web | Deployments, env vars, logs | CTO, DevOps |
| GitHub Repo | github.com/EconoLens/econolens-web | All code, CI/CD | CTO, all devs |
| 1Password Vault | EconoLens Team vault | All API keys, credentials | COO, Security |
| Supabase | supabase.econolens.co.in | Database, auth, analytics | All backend |
| Cloudflare | cloudflare.com | DNS, CDN, WAF, SSL | COO, DevOps |

### TIER 2 — DEPARTMENT SYSTEMS
| System | Department | What Flows Through It |
|--------|-----------|----------------------|
| Sanity Studio | Content | All articles, drafts, publishing |
| GA4 Dashboard | Marketing | All traffic, events, conversions |
| Beehiiv | Marketing | Newsletter sends, subscribers |
| Buffer | Marketing | Social post scheduling |
| Wave + Zoho Books | Finance | Revenue, invoices, GST |
| SE Ranking | Marketing | SEO rankings, keyword tracking |
| Uptime Robot | Operations | Uptime alerts, status |
| Make.com | Operations | Automation workflows |

### TIER 3 — SHARED DATA LAYER (Supabase tables everyone reads/writes)
```
users              → Clerk user_id, plan, query_count, joined_at
subscriptions      → user_id, plan, status, razorpay/stripe_id, renews_at
ai_query_log       → user_id, query_text, response_id, tokens_used, cached
ai_response_cache  → query_hash, response_text, hit_count, model
articles           → sanity_id, published_at, source, copyscape_score
page_events        → user_id, event_type, page, timestamp (GA4 mirror)
quiz_scores        → user_id, article_id, score, completed_at
contributors       → user_id, verified, badge_level, articles_count
```

---

## 👑 C-SUITE — THE COMMAND LAYER

### CEO — YOU (Human Founder)
```
ROLE:    Strategic direction, final approvals, investor relations
DECIDES: Pricing changes, new tool adoption, major feature launches, contracts
REVIEWS: Weekly ops report (Monday 09:00 IST) + monthly P&L
APPROVES: Newsletter sends (10 min), major deployments, budget changes
TOOL:    Claude.ai Projects (strategy) + this CLAUDE.md (context)
```

### COO — Notion AI + Make.com + Vercel + Uptime Robot
```
ROLE:    Platform orchestration, all departments hitting daily targets
DAILY:   Check Make.com scenario runs (100% success required)
         Check Uptime Robot status (99.9% uptime mandate)
         Review daily pipeline log in Notion
         Escalate any failure to CEO with resolution plan
ACCESSES: All Tier 1 + Tier 2 systems (read access to everything)
COWORK TASKS:
  - Morning: "Check Make.com dashboard, log today's automation results to Notion"
  - If failure: "Create Notion incident report and draft Slack alert for CEO"
  - Weekly: "Compile weekly operations report from all department logs"
```

### CTO — Claude Code + GitHub Copilot + Vercel + Supabase
```
ROLE:    Full-stack architecture, all 18 tech roles report here
DAILY:   Review GitHub PRs, check Vercel build logs, Dependabot alerts
         Enforce: TypeScript always, Tailwind only, App Router, cached Claude calls
ACCESSES: GitHub (admin), Vercel (admin), Supabase (admin), 1Password (admin)
CLAUDE CODE TASKS:
  - Read CLAUDE.md before every session
  - Build from /app/ folder only, never touch /content/ or /ops/
  - Every commit: conventional format (feat:/fix:/chore:/docs:)
  - Every API route: validate Clerk auth before Supabase call
```

### CMO — SE Ranking + Semrush + Buffer + Beehiiv + GA4
```
ROLE:    Traffic growth, SEO, social, newsletter, brand — 50k sessions by Month 10
DAILY:   Review SE Ranking dashboard for ranking changes
         Confirm Buffer queue has posts scheduled for day
         Check Beehiiv subscriber count growth
ACCESSES: SE Ranking, GA4, Buffer, Beehiiv, Google Search Console
COWORK TASKS:
  - Daily: "Check SE Ranking for keywords in positions 11-20, log opportunities to Notion"
  - Weekly: "Generate traffic growth report from GA4, compare to last week"
  - Monthly: "Pull full keyword rank movement report, identify top 10 priorities"
```

### CFO — Wave + Zoho Books + Gemini Sheets + Stripe + Razorpay
```
ROLE:    Revenue tracking, GST compliance, break-even monitoring (target: 29 subs)
DAILY:   Check Stripe + Razorpay new subscriptions
         Monitor API cost in Supabase ai_query_log table
MONTHLY: Reconcile Wave + Zoho, generate P&L, LUT renewal check
ACCESSES: Wave, Zoho Books, Stripe Dashboard, Razorpay Dashboard, Supabase
COWORK TASKS:
  - Daily: "Log today's subscription count from Razorpay+Stripe to Notion Revenue Tracker"
  - Monthly: "Compile P&L from Wave export + Stripe analytics, paste to Notion Finance page"
  - Quarterly: "Generate GST summary from Zoho Books for CA review"
```

### CPO — Claude Projects + Notion AI + GA4 + Supabase Events
```
ROLE:    30-service roadmap delivery, subscription optimisation, UX
WEEKLY:  Sprint review, backlog prioritisation, paywall conversion check
ACCESSES: Notion (roadmap), GA4 (behaviour), Supabase (events), Stripe (funnel)
COWORK TASKS:
  - Weekly: "Update sprint board in Notion: mark completed services, set next 5 for sprint"
  - Monthly: "Pull GA4 session duration and bounce rate, compare to 4-min / 45% targets"
```

### CCO — Claude API + Feedly + Copyscape + Sanity CMS + Grammarly
```
ROLE:    30 articles/day pipeline, EEAT compliance, editorial standards
DAILY:   Verify pipeline ran (Sanity has 30 new articles)
         Spot-check 3 articles: source+author present, three layers complete, India context correct (present if relevant, omitted if not)
         Confirm Copyscape scores all under 10%
ACCESSES: Feedly, Sanity CMS, Copyscape dashboard, Claude API logs
COWORK TASKS:
  - Daily: "Open Sanity Studio, count today's articles, spot-check 3 random ones for quality"
  - Daily: "Check Copyscape dashboard for any articles flagged above 8%, log to Notion"
  - Weekly: "Review article topic distribution, flag gaps in India economics coverage"
```

### CSO — Perplexity Pro + NotebookLM + Gemini Deep Research + Ahrefs
```
ROLE:    Competitive intelligence, GEO strategy, institutional pipeline
WEEKLY:  Competitive scan, gap report, institutional outreach tracking
ACCESSES: Perplexity Pro, NotebookLM, Google Alerts, Ahrefs Brand Radar (Ph2)
COWORK TASKS:
  - Weekly: "Research 3 competitors (Trading Economics, VoxEU, Investopedia) for new features, log to Notion CSO Report"
  - Monthly: "Build institutional prospect list: 10 IIM/IIFT/DSE emails via Hunter.io, save to /ops/outreach/"
```

### CHRO — Notion AI + Hunter.io + Apollo + Gemini Workspace
```
ROLE:    AI tool evaluation, contributor program, freelancer sourcing
WEEKLY:  Tool ROI review, contributor applications
ACCESSES: Notion (tool registry), Hunter.io, Apollo.io (Ph2), Gemini
COWORK TASKS:
  - Weekly: "Update AI Tool Registry in Notion: cost, ROI, renewal date for all tools"
  - Monthly: "Review all contributor applications in Notion, verify credentials, issue invites"
```

---

## 💻 TECH TEAM — 18 ROLES (All report to CTO)

> **Reality:** T-01 (frontend), T-03 (backend), T-09 (deploy/CI), T-13 (Sanity schema), T-14
> (auth/payments) reflect real, ongoing work done via Claude Code sessions. T-06 (QA/Playwright),
> T-08 (security), T-11 (dataviz beyond the basic indicators dashboard), T-15 (Phase 2, not
> started), T-17 (design), T-18 (bundle analysis) are target-state — no one is actually doing
> these on a cadence. There is no dedicated person/tool per role; it's KP + Claude Code sessions
> covering whichever domain is needed.

### T-01: Lead Frontend Developer — Claude Code + Next.js + Tailwind
```
DOMAIN:   /app/(public)/ + /app/(auth)/ + /components/
MANDATE:  App Router only. Tailwind only. TypeScript always.
DAILY:    Build new UI pages/components as per CPO sprint spec
          Never use Pages Router. Never use inline styles.
ACCESSES: GitHub (feature branch), Vercel (preview deploys)
BUILDS:   Three-layer article UI, FRED dashboard, AI query interface
CLAUDE CODE COMMAND:
  When assigned a UI task: read CLAUDE.md → check phase → build component
  → git commit (feat: component-name) → push → PR with screenshot
```

### T-02: Frontend Component Builder — Claude Code + React + Framer Motion
```
DOMAIN:   /components/ui/ + /components/article/ + /components/dashboard/
MANDATE:  Design system tokens from Figma, no custom CSS outside Tailwind
BUILDS:   Article cards, quiz blocks, paywall modal, subscription CTAs, skeletons
ACCESSES: GitHub, Vercel preview
CLAUDE CODE:
  Every new component: create in /components/, export, add to index.ts
  Paywall modal: check Clerk user role from useAuth() before render
```

### T-03: Lead Backend Developer — Claude Code + Supabase + Node
```
DOMAIN:   /app/api/ (all routes — Claude Cowork must never touch this folder)
MANDATE:  Clerk auth validated on EVERY route before any Supabase call
          Service key server-side ONLY. Anon key client-side ONLY.
BUILDS:   AI query route, news pipeline, payment webhooks, paper translator
ACCESSES: Supabase (service role), GitHub, Vercel, 1Password
CLAUDE CODE:
  Route pattern: auth check → rate limit check → Supabase query → response
  All webhooks: verify signature before processing (Stripe + Razorpay)
```

### T-04: API Integration Developer — Claude Code + FRED + ElevenLabs + Beehiiv
```
DOMAIN:   /lib/ (all external API wrappers)
BUILDS:   lib/fred.ts, lib/beehiiv.ts, lib/buffer.ts, lib/elevenlabs.ts
MANDATE:  All API calls wrapped in try/catch with typed responses
          All keys from process.env — never hardcoded
ACCESSES: 1Password (read keys), GitHub, Vercel env vars
CLAUDE CODE:
  Every new API: create typed client in /lib/, add env var to .env.example
  FRED data: always use ISR (revalidate: 3600), never client-side fetch
```

### T-05: AI Systems Engineer — Claude Code + Claude API + Prompt Cache
```
DOMAIN:   /lib/claude.ts + /app/api/ai-query/ + /app/api/translate-paper/
MANDATE:  Prompt caching enabled on EVERY Claude API call (saves 75% cost)
          Response caching in Supabase ai_response_cache table
          System prompts: LOCKED — any change requires Notion log entry first
CLAUDE CODE:
  All Claude calls use cache_control: { type: "ephemeral" } on system prompt
  Cache hit check: query_hash → Supabase lookup → return cached if found
  Cost monitor: log tokens_used to ai_query_log table on every call
```

### T-06: QA Lead — Playwright + Lighthouse CI + BrowserStack
```
DOMAIN:   /tests/ folder (E2E) + GitHub Actions (.github/workflows/)
MANDATE:  No PR merges below PageSpeed 90 (Lighthouse CI gate, hard block)
          All critical user paths have Playwright test before feature ships
TESTS:    signup flow, AI query + paywall hit, upgrade → Razorpay → unlock
          article publish → Buffer post → Beehiiv queue (all within 60s)
ACCESSES: GitHub, BrowserStack, Vercel preview URLs
CLAUDE CODE:
  Before every new feature: write test spec first, build second
  Lighthouse CI: block merge if any page drops below 90
```

### T-07: AI Content QA Reviewer — Claude API + Perplexity + Copyscape
```
DOMAIN:   Content quality assurance (NOT codebase)
DAILY:    10% spot-check of published articles via Sanity API
          Verify: source+author present, three layers, India context (if relevant), graph/chart (if warranted), no hallucinations, Copyscape <10%
TOOL:     Claude API with reviewer system prompt (see locked prompts)
ACCESSES: Sanity CMS (read), Copyscape dashboard, Notion (log)
COWORK TASKS:
  Daily: "Pick 3 random articles from Sanity, run quality checklist, log pass/fail to Notion Content QA"
  If fail: "Draft correction note in Sanity draft, tag CCO for review"
```

### T-08: Security Engineer — Dependabot + 1Password + OWASP ZAP + Cloudflare WAF
```
DOMAIN:   Security across entire stack
DAILY:    Check GitHub Dependabot alerts (critical = 24h patch mandate)
          Verify API key rotation schedule in 1Password (90-day cycle)
MONTHLY:  OWASP ZAP scan on production, Cloudflare WAF rules review
ACCESSES: GitHub (Dependabot), 1Password (admin), Cloudflare (admin)
COWORK TASKS:
  Weekly: "Check 1Password vault — flag any keys older than 80 days, log to Notion Security"
  If CVE: "Create Notion security incident, assign patch PR in GitHub"
```

### T-09: DevOps Engineer — Vercel + Cloudflare + GitHub Actions
```
DOMAIN:   CI/CD pipeline, deployments, environment management
PIPELINE: ESLint → TypeScript check → Playwright → Lighthouse CI → deploy
MANDATE:  Zero hardcoded secrets ever. All in Vercel env vars.
          Production deploy = staging demo approved by CEO first
ACCESSES: Vercel (admin), Cloudflare (admin), GitHub (admin)
CLAUDE CODE:
  GitHub Actions: .github/workflows/ci.yml manages full pipeline
  Rollback plan: Vercel instant rollback if error rate > 1% in 5 min
```

### T-10: Database Architect — Supabase + PostgreSQL + pgAnalyze
```
DOMAIN:   Supabase schema, migrations, RLS policies
MANDATE:  RLS on EVERY table — no exceptions, ever
          All migrations in /supabase/migrations/ — no manual prod edits
          All FK columns indexed. EXPLAIN ANALYZE on any query > 100ms.
ACCESSES: Supabase (admin), pgAnalyze, GitHub
CLAUDE CODE:
  New table = RLS policy written before any data inserted
  Schema change = migration file + update to this CLAUDE.md Supabase section
```

### T-11: DataViz Engineer — D3.js + Recharts + Observable + FRED API
```
DOMAIN:   /components/charts/ + /app/(public)/dashboard/
MANDATE:  All charts from raw API data — never screenshot Bloomberg/Reuters
          All charts: WCAG AA accessible, dark mode, mobile responsive
BUILDS:   FRED indicators dashboard, 50-country macro map, slider series
ACCESSES: FRED API (via /lib/fred.ts), GitHub, Vercel
CLAUDE CODE:
  Chart data: always server-side via ISR (revalidate: 3600)
  D3 maps: use TopoJSON + World Bank data, never static images
```

### T-12: Performance Engineer — Lighthouse CI + Vercel Speed Insights + Cloudflare
```
DOMAIN:   PageSpeed, Core Web Vitals, bundle size, ISR config
MANDATE:  PageSpeed ≥ 90 ALL pages ALL times — this is non-negotiable
WEEKLY:   Run Vercel Speed Insights report → action plan if any page < 92
MONTHLY:  Bundle analysis with next-bundle-analyser → remove heavy deps
ACCESSES: Vercel Speed Insights, Lighthouse CI, GitHub
CLAUDE CODE:
  ISR config: news articles = 900s, dashboards = 3600s, static = false
  Image rule: all images next/image with WebP format, explicit width/height
```

### T-13: CMS Developer — Sanity v3 + GROQ + Sanity Studio
```
DOMAIN:   /sanity/ folder + studio.econolens.co.in
MANDATE:  Webhook on publish triggers Buffer + Beehiiv + GA4 in parallel
          Contributor access: article submit only, no schema edit access
BUILDS:   Article schema, contributor schema, quiz schema, dashboard schema
ACCESSES: Sanity (admin), GitHub, Vercel (webhook config)
CLAUDE CODE:
  Schema changes: update /sanity/schemas/ + update GROQ queries in /lib/
  New field = add to TypeScript type + update all GROQ queries using it
```

### T-14: Auth & Payments Developer — Clerk + Razorpay + Stripe
```
DOMAIN:   /app/(auth)/ + /app/api/webhooks/
MANDATE:  Clerk middleware on all protected routes
          Webhook verification: check signature before processing
          Upgrade flow: query_count >= 5 → modal → payment → role update → unlock
BUILDS:   Subscription gate, upgrade flow, institutional SSO (Ph2)
ACCESSES: Clerk (admin), Razorpay (admin), Stripe (admin), Supabase
CLAUDE CODE:
  Payment success webhook: update subscriptions table → update Clerk metadata
  Never trust client-side plan claims — always verify from Supabase
```

### T-15: Econometrics Developer — Pyodide + R-WASM + Observable [PHASE 2]
```
DOMAIN:   /app/(public)/lab/ + /components/lab/
MANDATE:  All computation client-side via WebAssembly — zero server cost
BUILDS:   Interactive econometrics lab, regression sliders, simulation games
ACCESSES: GitHub, Vercel, Observable (notebooks)
CLAUDE CODE [Phase 2]:
  Pyodide: lazy load only when user enters /lab/ route (bundle size)
  Observable: embed notebooks via iframe with postMessage API
```

### T-16: Website Handler & Site Reviewer — Screaming Frog + GSC + Claude Cowork
```
DOMAIN:   Site health, broken links, GSC coverage, pipeline verification
DAILY:    Screaming Frog crawl → 404 report → fix or flag to CTO
          Verify 30 articles published in Sanity (check article count)
          Buffer queue check — all posts published on schedule
ACCESSES: GSC, Sanity CMS, Buffer dashboard, Uptime Robot
COWORK TASKS:
  Daily: "Check article count in Sanity today vs yesterday. Log delta to Notion Site Health"
  Daily: "Check Buffer dashboard — confirm all social posts from today published successfully"
  Weekly: "Export GSC coverage report, flag any de-indexed pages to CTO"
```

### T-17: UI/UX Designer — Canva AI + Figma + Google Vids
```
DOMAIN:   Design system, wireframes, social templates, A/B test designs
MANDATE:  Every new feature: Figma wireframe BEFORE Claude Code builds it
          Design system tokens are the law — no one-off colours or fonts
BUILDS:   Brand system, article layouts, dashboard designs, Canva templates
ACCESSES: Figma (admin), Canva (team account), Google Vids
COWORK TASKS:
  Monthly: "Generate Canva social media template set for next month's topics"
  Per feature: "Create wireframe document in Notion for [feature name] before CTO briefing"
```

### T-18: Performance Bundle Optimiser — Lighthouse CI + Bundle Analyser
```
DOMAIN:   Build output, dependency tree, code splitting
MONTHLY:  next-bundle-analyser run → flag deps > 50KB → find alternatives
MANDATE:  Total First Load JS < 150KB on homepage
ACCESSES: GitHub, Vercel build logs
CLAUDE CODE:
  Dynamic imports: use next/dynamic for all heavy components (D3, Pyodide)
  Third-party scripts: load with next/script strategy="lazyOnload"
```

---

## 📈 MARKETING TEAM — 12 ROLES (All report to CMO)

> **Reality:** M-02 (Buffer→LinkedIn posting) is the only one of these four roles with a live
> tool behind it. M-01 (SE Ranking/Ahrefs), M-03 (Beehiiv newsletter — account exists, zero send
> pipeline), M-04 (BD/outreach — draft templates exist in `/ops/outreach/`, not an active
> cadence) are all target-state, not currently staffed or running.

### M-01: SEO Strategist — SE Ranking + Ahrefs + Frase + GSC
```
DAILY:    SE Ranking auto-report → positions 11-20 → priority content list
WEEKLY:   Competitor gap analysis vs VoxEU, Investopedia, Trading Economics
          GEO tracking: is EconoLens cited in AI search tools?
ACCESSES: SE Ranking, Google Search Console, Ahrefs (Ph2), Frase
COWORK TASKS:
  Weekly: "Pull SE Ranking report, extract keywords in positions 11-20, create content brief in Notion"
  Monthly: "Run competitor keyword gap analysis, identify 20 uncontested economics terms"
```

### M-02: Social Media Manager — Buffer + Canva AI + Semrush Social
```
DAILY:    Verify Buffer auto-published all articles within 60s of Sanity publish
          Create 1 original India economics infographic for LinkedIn (Canva AI)
          Schedule 3 Instagram Reels per week ("Economics in 60 Seconds")
ACCESSES: Buffer (admin), Canva (team), Semrush Social (Ph2)
COWORK TASKS:
  Daily: "Check Buffer queue — confirm last 30 article posts went live. Log any failures"
  Weekly: "Create 3 Canva infographics from this week's top economic data, schedule via Buffer"
```

### M-03: Newsletter Manager — Beehiiv + Claude API
```
FRIDAY:   Claude API curates top 5 stories → draft assembled → CEO 10-min review → send
WEEKLY:   Subscriber growth check (target: 2,000 by Month 6)
          A/B test subject lines — 45%+ open rate target
ACCESSES: Beehiiv (admin), Claude API, Sanity (read article list)
COWORK TASKS:
  Every Friday 06:00 IST: "Pull this week's top 5 articles from Sanity, draft newsletter in /content/newsletter/week-[N].md for CEO review"
  Monthly: "Generate Beehiiv subscriber growth report, log to Notion Marketing"
```

### M-04: BD & PR Manager — Hunter.io + Apollo + Gemini Gmail
```
MONTHLY:  10 publisher outreach emails (Springer, Wiley, Coursera, edX)
          5 institutional prospect emails (IIM, IIFT, DSE, XLRI, think tanks)
          Backlink campaign: pitch NBER/World Bank for paper citations
ACCESSES: Hunter.io, Apollo.io (Ph2), Gemini Gmail
COWORK TASKS:
  Monthly: "Draft 10 publisher outreach emails using template in /ops/outreach/publisher-template.md, save to /ops/outreach/month-[N]/"
  Monthly: "Draft 5 institutional pilot pitch emails, save to /ops/outreach/institutional-month-[N]/"
```

---

## 💰 FINANCE & BUSINESS TEAM — 8 ROLES (All report to CFO)

> **Reality:** none of these four roles are active yet — all of Razorpay/Stripe/Zoho Books/the
> unit-economics model are blocked behind the GST → LUT → IEC → HDFC account chain (see reality
> check at top). This section is the plan for once that chain clears, not current work.

### F-01: Revenue Planner — Gemini Sheets + Stripe + Razorpay + Looker Studio
```
MONTHLY:  Update 6-stream revenue model in Google Sheets
          Flag if any stream > 60% of total (diversification risk alert)
          Project Mediavine upgrade viability (when 50k sessions sustained)
ACCESSES: Stripe, Razorpay, Gemini Sheets, Looker Studio
COWORK TASKS:
  Monthly: "Export Stripe + Razorpay revenue to Sheets template in /ops/finance/revenue-month-[N].xlsx"
  Monthly: "Update revenue waterfall chart in Notion Finance page with actual vs target"
```

### F-02: Business Analyst — GA4 + Supabase Analytics + Gemini Sheets
```
WEEKLY:   CEO growth dashboard: MRR, DAU, article views, AI queries, upgrades
MONTHLY:  Cohort analysis, CAC/LTV/payback, churn by plan tier
          Break-even sensitivity: what if API cost 2x? what if RPM drops 30%?
ACCESSES: GA4, Supabase, Gemini Sheets, Looker Studio
COWORK TASKS:
  Weekly: "Pull GA4 + Supabase weekly data, fill CEO dashboard template in Notion"
  Monthly: "Run cohort analysis in Sheets: subscriber retention by month cohort"
```

### F-03: Investment Planner — Gemini Sheets + Wave + Looker Studio
```
MONTHLY:  Actual vs planned spend per phase
          Update 18-month financial model (P&L, cash flow, unit economics)
QUARTERLY: Investor-ready financial deck update (Phase 1 → 2 → 3 milestones)
ACCESSES: Wave, Gemini Sheets, Looker Studio
COWORK TASKS:
  Monthly: "Update investment tracker in Sheets: actual spend vs Phase 1 budget (₹0-50k)"
  Quarterly: "Refresh investor model with latest MRR, LTV, burn rate — save to /ops/finance/"
```

### F-04: Tax & Compliance Officer — Zoho Books + Iubenda + CookieYes
```
QUARTERLY: GSTR-1 + GSTR-3B filing prep (Zoho Books export for CA)
ANNUALLY:  LUT renewal (January — blocks all international revenue if missed)
           Iubenda policy auto-update review
ACCESSES: Zoho Books, Iubenda, CookieYes, Wave
COWORK TASKS:
  Quarterly: "Export Zoho Books GST report for [quarter], save to /ops/legal/gst-[quarter].pdf for CA"
  January: "Create LUT renewal reminder in Notion with CA appointment task"
```

---

## 🎯 PRODUCT & UX TEAM — 6 ROLES (All report to CPO)

> **Reality:** all three roles are target-state — no Hotjar, no formal sprint board, no A/B
> testing infrastructure exists. Product decisions currently happen ad hoc between KP and Claude,
> not through this structure.

### P-01: Platform Product Manager — Notion AI + Claude Projects
```
WEEKLY:   Sprint board update: completed services → next 5 services
          Feature spec writing for CTO (unambiguous, testable)
ACCESSES: Notion (roadmap admin), Claude Projects, GitHub (read)
COWORK TASKS:
  Weekly: "Update sprint board in Notion: mark [services] done, set next sprint services with acceptance criteria"
  Per feature: "Write feature spec document in Notion for [feature], include: goal, user story, acceptance criteria, test cases"
```

### P-02: UX Researcher — GA4 + Hotjar + Supabase Events
```
MONTHLY:  Reading pattern analysis: where do readers stop in three-layer articles?
          Quiz completion rates: flag any below 40%
          UX benchmark vs Bloomberg Terminal, FRED, Investopedia
ACCESSES: GA4, Hotjar (Ph2), Supabase events table
COWORK TASKS:
  Monthly: "Pull GA4 scroll depth data for all article pages, identify drop-off points, report to CPO"
  Monthly: "Compare EconoLens UX against 3 competitors, log feature gaps to Notion Product"
```

### P-03: Subscription PM — Stripe + Razorpay + GA4 Funnels
```
MONTHLY:  Conversion rate: free → paid (target ≥ 3%)
          Churn rate by plan (target ≤ 5%)
          Paywall modal A/B test results
ACCESSES: Stripe, Razorpay, GA4 funnel reports, Supabase
COWORK TASKS:
  Monthly: "Calculate free→paid conversion rate from Supabase data, log to Notion Subscription Metrics"
  Monthly: "Calculate monthly churn rate per plan, identify top exit reasons from cancellation data"
```

---

## ✍️ CONTENT OPS TEAM — 8 ROLES (All report to CCO)

> **Reality:** none of these run as automated pipelines — C-01's Make.com/Feedly/Copyscape
> automation is abandoned (see reality check at top). The real content process is KP + Claude
> manually drafting three-layer articles and publishing via Sanity; the Operations Checklist and
> locked prompts further below (Session 11 SOP) are what actually govern that manual process, not
> the automated triggers described in C-01/C-03/C-05.

### C-01: News Pipeline Operator — Feedly + Claude API + Copyscape + Sanity
```
AUTOMATED: RSS polling every 15 min via Make.com
TRIGGER:   New Feedly entry → Make.com → Claude API (with caching) → Copyscape → Sanity publish
SOURCES:   RBI, IMF, World Bank, Fed, ECB, NBER, PIIE, Brookings, MEA (50+ feeds)
RULES:     Reject if Copyscape > 10%. Regenerate once. Escalate if > 15%.
           Global framing by default (see Operations Checklist) — India context only when
           the topic is genuinely India-related, not forced into every article.
           Source attribution + author/byline mandatory on every article, always.
ACCESSES: Feedly, Claude API, Copyscape, Sanity API, Make.com
MONITORING: Make.com scenario success rate must be 100%
```

### C-02: Academic Paper Translator — Claude API + pdf.js
```
DAILY:    10 papers from NBER/SSRN/REPEC → plain English, India section only if relevant
RULES:    Never reproduce > 15 words from source. Synthesise only.
          Add "Why this matters for India's economy" section ONLY if the paper's findings
          are actually India-related or have material India implications — otherwise omit.
          Source attribution (author, institution, year, link) mandatory on every translation.
ACCESSES: Claude API, pdf.js, Sanity CMS
COWORK TASKS:
  Daily: "Check NBER + SSRN for today's new economics papers, translate top 3 using /prompts/paper-translator.md, save drafts to /content/drafts/"
```

### C-03: Audio Production Manager — ElevenLabs + Cloudflare R2 [PHASE 2]
```
TRIGGER:  Sanity publish webhook → ElevenLabs API → audio file → Cloudflare R2 → URL stored in Sanity article
MANDATE:  Audio live within 5 minutes of article publish
          Professional voice profile: economics-appropriate, authoritative
ACCESSES: ElevenLabs API, Cloudflare R2, Sanity API
```

### C-04: AI Content Reviewer — Claude API + Perplexity
```
DAILY:    Spot-check 10% of published articles (3 minimum per day)
CHECKLIST: ✓ Source attribution block present (mandatory, always)
           ✓ Author/byline present (mandatory, always)
           ✓ Three layers complete (Overview/Explainer/Technical)
           ✓ Economist-reviewer framing present, carried through Layer 1/2
           ✓ India context paragraph present IF India-related, correctly omitted if not
           ✓ Graph/chart/image present IF article type/data warrants it
           ✓ No factual hallucinations (verify with Perplexity)
           ✓ SEBI disclaimer on any price mention
ACCESSES: Sanity CMS (read), Perplexity Pro, Notion (QA log)
COWORK TASKS:
  Daily: "Quality check 3 random Sanity articles against /prompts/qa-checklist.md. Log results to Notion Content QA log."
```

### C-05: Quiz & Engagement Designer — Claude API + Supabase [PHASE 2]
```
TRIGGER:  New explainer article published → Claude API generates 3-5 questions
          Stored in quiz_scores table, displayed via Next.js quiz component
MANDATE:  Quiz completion → newsletter CTA triggered (email capture moment)
ACCESSES: Claude API, Supabase, Sanity (article content)
```

---

## ⚙️ MAKE.COM AUTOMATION FLOWS — THE NERVOUS SYSTEM

> ⚠️ **NOT RUNNING.** This automation was built, then explicitly abandoned as a content
> strategy — too unreliable. Content is produced manually (KP + Claude) and published straight
> to Sanity. Kept below as historical/reference design only — do not treat any of FLOW-01
> through FLOW-05 as live. See the reality check at the top of this file.

### FLOW-01: News Article Pipeline (runs every 15 minutes)
```
Trigger: Feedly RSS new item
Step 1:  Filter — source must be in approved list (RBI/IMF/NBER/Fed/ECB etc.)
Step 2:  Claude API → generate article with cached system prompt
Step 3:  Copyscape API → check score
Step 4a: Score < 10% → Sanity CMS publish
Step 4b: Score 10-15% → Claude API regenerate once → re-check
Step 4c: Score > 15% → Log to Notion escalation queue → stop
Step 5:  Buffer API → LinkedIn + X post (parallel with Step 6)
Step 6:  Beehiiv API → add to weekly digest queue (parallel with Step 5)
Step 7:  GA4 Measurement Protocol → track "article_published" event
Log:     Write run result to Notion Ops Log (success/fail/regeneration)
```

### FLOW-02: Subscription Conversion (triggers on user event)
```
Trigger: Supabase webhook — ai_query_log count >= 5 for user
Step 1:  Clerk API → check current user plan
Step 2:  If plan = 'free' → trigger paywall modal via Next.js event
Step 3:  User completes Razorpay/Stripe payment
Step 4:  Payment webhook → Supabase subscriptions table update
Step 5:  Clerk API → update user metadata (plan = 'pro')
Step 6:  GA4 → track "subscription_upgrade" event
```

### FLOW-03: Weekly Newsletter (Friday 06:00 IST cron)
```
Trigger: Scheduled cron (Make.com)
Step 1:  Sanity API → fetch top 5 articles (by GA4 views this week)
Step 2:  Claude API → curate and write newsletter draft
Step 3:  Save draft to /content/newsletter/week-[N].md via Cowork
Step 4:  Notion → create CEO review task (due: 07:00 IST)
Step 5:  After CEO approval → Beehiiv API → send newsletter
Step 6:  GA4 → track newsletter sent event
```

### FLOW-04: Monthly Financial Close (last Friday 08:00 IST cron)
```
Trigger: Scheduled cron (Make.com)
Step 1:  Stripe API → export month's revenue data
Step 2:  Razorpay API → export month's India revenue
Step 3:  Wave API → reconcile against recorded transactions
Step 4:  Google Sheets → auto-populate P&L template
Step 5:  Notion → create "CFO Monthly Review" task for CEO
Step 6:  Check: subscribers >= 29? If not → flag break-even gap
```

### FLOW-05: Site Health Daily (08:00 IST cron)
```
Trigger: Scheduled cron (Make.com)
Step 1:  Uptime Robot API → get 24h uptime percentage
Step 2:  Sanity API → count articles published today
Step 3:  Buffer API → confirm all posts from yesterday published
Step 4:  Google Search Console API → check index coverage
Step 5:  Log all results to Notion → "Daily Site Health: [date]"
Step 6:  If uptime < 99.5% OR articles < 28 → alert CEO via Notion
```

---

## 📁 FOLDER STRUCTURE — THE SHARED CLOUD FILESYSTEM

```
econolens/                    ← Root (Claude Code domain)
├── CLAUDE.md                 ← THIS FILE — master brain, update after decisions
├── .env.local                ← Never commit. Keys in 1Password + Vercel env vars.
├── app/                      ← Next.js (Claude Code only — Cowork never edits here)
│   ├── (public)/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── api/                  ← All API routes (Claude Code only)
├── components/               ← Shared UI (Claude Code only)
├── lib/                      ← API wrappers, utils (Claude Code only)
├── sanity/                   ← CMS schema (Claude Code only)
├── supabase/migrations/      ← DB migrations (Claude Code only)
├── tests/                    ← Playwright tests (Claude Code only)
│
├── content/                  ← Claude Cowork domain
│   ├── drafts/               ← Article drafts before Sanity publish
│   ├── newsletter/           ← Weekly digest drafts (week-N.md)
│   └── papers/               ← Translated academic papers
│
├── ops/                      ← Claude Cowork domain
│   ├── outreach/             ← BD email drafts and templates
│   ├── finance/              ← Revenue exports, P&L files
│   ├── legal/                ← GST exports, compliance docs
│   └── reports/              ← Weekly/monthly CEO reports
│
└── prompts/                  ← Locked system prompts (read-only)
    ├── news-writer.md        ← DO NOT CHANGE without Notion log entry
    ├── research-tool.md
    ├── paper-translator.md
    ├── qa-checklist.md
    └── explain-concept.md
```

---

## 🔑 ALL API KEYS — LOCATION MAP

```
Storage:    1Password → "EconoLens Production" vault
Deployment: Vercel → Environment Variables (production + preview)
Rotation:   Every 90 days — CHRO tracks in Notion Key Registry
Never:      In code, in git, in Notion, in emails, in Slack
```

| Key | 1Password Label | Vercel Var Name | Owner | Rotation |
|-----|----------------|-----------------|-------|----------|
| Anthropic | claude-api-key | ANTHROPIC_API_KEY | CTO | 90 days |
| Supabase Service | supabase-service | SUPABASE_SERVICE_KEY | CTO | 90 days |
| Supabase Anon | supabase-anon | SUPABASE_ANON_KEY | CTO | 90 days |
| Clerk Secret | clerk-secret | CLERK_SECRET_KEY | Auth Dev | 90 days |
| Razorpay Secret | razorpay-secret | RAZORPAY_KEY_SECRET | CFO | 90 days |
| Stripe Secret | stripe-secret | STRIPE_SECRET_KEY | CFO | 90 days |
| Sanity Token | sanity-api-token | SANITY_API_TOKEN | CMS Dev | 90 days |
| FRED API | fred-api-key | FRED_API_KEY | API Dev | Annual |
| Copyscape | copyscape-key | COPYSCAPE_API_KEY | CCO | 90 days |
| Beehiiv | beehiiv-api-key | BEEHIIV_API_KEY | CMO | 90 days |
| Buffer | buffer-token | BUFFER_ACCESS_TOKEN | CMO | 90 days |
| Zoho Books | zoho-token | ZOHO_BOOKS_TOKEN | CFO | 90 days |

---

## 🔒 LOCKED SYSTEM PROMPTS (DO NOT CHANGE WITHOUT NOTION LOG)

### NEWS WRITER (CCO / News Pipeline Operator)
```
# v2.4 — updated 2026-07-10 (KP decision — see Session 11 log)
You are EconoLens's economics news/analysis writer. You receive official press releases,
reports, and announcements from central banks, IMF/World Bank, and economic institutions.
Rules: 1. Do NOT quote any sentence from source. 2. Synthesise into original sentences.
3. India-specific context paragraph — INCLUDE ONLY IF the article's topic is genuinely
   related to India (Indian policy, Indian data, or a direct/material effect on India's
   economy). If not related, OMIT the section entirely — do not force it in.
4. Structure: Headline → 3-bullet summary → "Reviewed by: EconoLens Economics Desk" framing
   → Layer 1 (200w plain English, written IN the reviewer's voice) → Layer 2 (600w context,
   including a "where economists reviewing this same report disagree" subsection) →
   Layer 3 (technical/data). The economist-reviewer framing runs through the explanation
   itself — it is not a bolted-on section appended after a neutral summary.
5. Source attribution block — ALWAYS MANDATORY, every article, no exceptions.
6. Author/byline — ALWAYS MANDATORY. AI-generated pieces: "AI-assisted · Source: [Institution]".
   Human/contributor pieces: named contributor byline. Never publish without one or the other.
7. Never mirror source sentence structure.
8. Append SEBI disclaimer if any asset price or investment instrument mentioned.
9. Graph/chart/image — include when the article type or underlying data warrants visual
   representation (data-story, econometrics, research-guide, or any piece citing a forecast
   series, time series, or comparative statistics). Not mandatory for pure explainer/opinion
   pieces with no numeric series to visualise. Use real data (FRED/World Bank/IMF/source
   institution) — never a screenshot of a paywalled chart.
10. GLOBAL FRAMING DEFAULT — EconoLens is a global economics platform, not India-first
    (see brand positioning decision). Write for an international reader by default. India
    is one country among many in coverage, not the default lens — apply Indian tone/context
    only per Rule 3 above.
```

#### ⚠️ OPERATIONS CHECKLIST — CONTENT QUALITY (Check every article before publish)
```
# v2.4 — updated 2026-07-10
□ Plagiarism score < 10% via Copyscape (MANDATORY — do not publish without this check)
  → If 10–15%: regenerate once, re-check
  → If > 15%: escalate to CCO, do NOT publish
□ Source attribution block present (MANDATORY — every article, every time)
□ Author/byline present (MANDATORY — AI label or named contributor, every article)
□ Three-layer structure complete (Overview / Explainer / Technical)
□ Economist-reviewer framing present (opening "Reviewed by" framing + reviewer voice
  carried through Layer 1/2, including a "where economists disagree" read where relevant)
□ India-specific context paragraph — present IF topic is India-related, OMITTED (not forced)
  if not. Check relevance before requiring this section.
□ Graph/chart/image present IF article type or data warrants visualisation (data-story,
  econometrics, forecast/time-series content); OK to omit for pure explainer/opinion pieces
  with no series to chart
□ SEBI disclaimer appended if any asset price mentioned
□ No sentence mirrors source structure (paraphrase fully)
□ (Optional, not gating) Data & Working: for data-heavy pieces, show the actual derivation
  of any computed figure (percentage-point deltas, unit conversions, cross-report
  comparisons) rather than just stating the final number — encouraged when it aids
  transparency, not required on every article
```

### AI RESEARCH TOOL (CPO / AI Systems Engineer)
```
You are EconoLens's economics research assistant. Scope: economics only.
Politely redirect off-topic queries. Always cite sources. Use FRED/World Bank/RBI data.
Format: direct answer → context → implications → sources.
Free tier: inform user of 5-query daily limit when applicable.
```

### EXPLAIN THIS CONCEPT (Frontend / AI Systems Engineer)
```
You are explaining the economics term the reader highlighted.
Respond in exactly 2 sentences at the reader's level.
No jargon. No hedging. Be direct and concrete. Use a real-world example.
```

### ACADEMIC PAPER TRANSLATOR (CCO / Paper Translator)
```
You receive an academic economics paper extract. Your job:
1. Explain the core argument in plain English (200 words max)
2. List 3 key findings in bullet points
3. Write "Why this matters for India's economy" (100 words)
4. Never reproduce more than 10 consecutive words from the source
5. Cite: author name, institution, year, NBER/SSRN link
```

### CONTENT QA REVIEWER (QA Lead / AI Content Reviewer)
```
# v2.4 — updated 2026-07-10
You are reviewing an EconoLens article for quality. Check:
1. Source attribution — institution + link present? (YES/NO) — MANDATORY, always
2. Author/byline — AI label or named contributor present? (YES/NO) — MANDATORY, always
3. Three-layer structure — all three layers complete? (YES/NO)
4. Economist-reviewer framing — opening "Reviewed by" frame present, and is the reviewer
   voice carried through Layer 1/2 rather than appended as a separate section? (YES/NO)
5. India-specific context paragraph — is the topic actually India-related? If YES, is the
   paragraph present? If NOT India-related, confirm it was correctly omitted. (YES/NO/NA)
6. Graph/chart/image — does this article type/data warrant a visual, and if so is one
   present? (YES/NO/NA)
7. SEBI disclaimer — present if any price mentioned? (YES/NO/NA)
8. Factual accuracy — any claims that seem wrong? (list or NONE)
Output JSON: {source_attribution: bool, author_byline: bool, three_layers: bool,
  reviewer_framing: bool, india_context: bool|"na", graph_or_image: bool|"na",
  sebi: bool|"na", issues: [], verdict: "PASS"|"FAIL", action: "publish"|"revise"|"escalate"}
```

---

## 🗓️ RECURRING TASK CALENDAR — WHEN WHAT RUNS

> ⚠️ **ASPIRATIONAL — most of this calendar is not actually being executed.** No one is running
> the SE Ranking, competitor-scan, sprint-board, 1Password-audit, or GSC-check cadences below;
> those tools/processes were never set up (see reality check at top). What's real: Sanity
> publishing (manual, bursty — not a fixed cadence), Buffer→LinkedIn auto-post on publish, GA4
> collection, and ad-hoc Cowork sessions like this one. Treat this table as target design for
> once the org is actually staffed, not a report of what's happening today.

| Task | Frequency | Time (IST) | Owner | System |
|------|-----------|------------|-------|--------|
| News pipeline | Every 15 min | 24/7 | C-01 | Make.com FLOW-01 |
| Uptime check | Every 5 min | 24/7 | COO | Uptime Robot |
| Site health log | Daily | 08:00 | T-16 | Make.com FLOW-05 |
| Article spot-check | Daily | 10:00 | C-04 | Cowork task |
| Copyscape audit | Daily | 10:30 | CCO | Cowork task |
| Buffer queue verify | Daily | 09:00 | M-02 | Cowork task |
| SE Ranking check | Weekly Mon | 09:00 | M-01 | Cowork task |
| Competitor scan | Weekly Mon | 10:00 | CSO | Cowork task |
| Sprint board update | Weekly Mon | 11:00 | P-01 | Cowork task |
| Newsletter draft | Weekly Fri | 06:00 | M-03 | Make.com FLOW-03 |
| Newsletter send | Weekly Fri | 07:30 | CMO | After CEO review |
| Subscriber report | Weekly Fri | 08:00 | M-03 | Cowork task |
| 1Password audit | Weekly | Mon 09:00 | T-08 | Cowork task |
| GSC health check | Weekly | Tue 09:00 | T-16 | Cowork task |
| Revenue log | Monthly last Fri | 08:00 | F-01 | Make.com FLOW-04 |
| P&L report | Monthly last Fri | 10:00 | CFO | Cowork task |
| Cohort analysis | Monthly | Last Mon | F-02 | Cowork task |
| Bundle analysis | Monthly | 1st Mon | T-18 | Claude Code |
| AI tool ROI review | Monthly | 1st Mon | CHRO | Cowork task |
| Competitor UX audit | Monthly | 15th | P-02 | Cowork task |
| GST export for CA | Quarterly | Jan/Apr/Jul/Oct | F-04 | Cowork task |
| OWASP ZAP scan | Quarterly | 1st of Q | T-08 | Security run |
| LUT renewal | Annual | January | F-04 | Cowork task |

---

## 🔗 CLOUD OFFICE INTERLINKS — HOW TOOLS TALK TO EACH OTHER

```
Feedly ──────────────────────────────────► Make.com (FLOW-01)
                                                │
                    ┌───────────────────────────┤
                    ▼                           ▼
               Claude API ◄──── 1Password   Copyscape API
                    │           (keys)           │
                    ▼                           ▼
              Sanity CMS ◄──────────── PASS (<10%) / FAIL
                    │
        ┌───────────┼───────────────┐
        ▼           ▼               ▼
     Buffer      Beehiiv      GA4 (events)
   (social)  (newsletter)    (analytics)
        │           │
        ▼           ▼
  LinkedIn/X   Weekly Digest ──► Stripe/Razorpay (sponsor)


Clerk (auth) ──► Supabase (role check) ──► AI Query API
                        │                       │
                        ▼                       ▼
                Razorpay/Stripe          Response Cache
                   (payment)             (ai_response_cache)
                        │
                        ▼
                  Role → 'pro'
                  (unlimited access)


Vercel (hosting) ◄──── GitHub (CI/CD) ◄──── Claude Code (builds)
       │                                          │
       ▼                                          ▼
 Cloudflare (CDN)                         Lighthouse CI (PageSpeed gate)
       │
       ▼
 Uptime Robot ──► Slack/Notion alert ──► COO ──► CEO


Notion ◄────────────────────────────────────────────
  ├── Decision Log (CEO updates after every decision)
  ├── Ops Log (Make.com writes daily)
  ├── Sprint Board (P-01 updates weekly)
  ├── Content QA (C-04 writes daily)
  ├── SEO Reports (M-01 writes weekly)
  ├── Revenue Tracker (F-01 writes monthly)
  └── Key Registry (CHRO tracks all API key rotations)
```

---

## ✅ SESSION LOG — DECISIONS MADE

### Session 1 — May 2026 — Platform Architecture
- Three-phase build: Phase 1 (₹0–50k) → Phase 2 (₹2–8L) → Phase 3 (₹8–25L)
- 30 services mapped, tech stack locked
- Break-even: 29 subscribers OR 1–3 advertisers

### Session 2 — May 2026 — Content & Article Model
- Three-layer architecture locked (Overview/Explainer/Technical)
- AI articles: synthesise only, India context mandatory, Copyscape mandatory
- AdSense requirements: 20+ articles, PageSpeed 90+, GA4, Privacy Policy
- **Superseded by Session 11 (2026-07-10)** — India context is now conditional, not mandatory

### Session 3 — May 2026 — Claude Tool Interlinking
- CLAUDE.md as shared context bridge for Code + Cowork + Projects
- Prompt caching Day 1 — saves 75% API cost

### Session 4 — May 2026 — Full AI Organisation v1
- 52 AI employees across 8 departments defined
- C-Suite, Tech (18), Marketing, Finance, Product, Content Ops mapped
- Full org chart and KPI dashboard created

### Session 7 — May 2026 — Infrastructure Verified
- GitHub: github.com/econolens/econolens-web ✅ (repo name corrected from "platform")
- Vercel: vercel.com/econolens/econolens-web ✅ (project exists, Git not yet connected)
- Supabase: Active under khagankp@gmail.com ✅
- Hostinger: econolens.co.in registered ✅
- Next steps: Connect Vercel → GitHub, add econolens.co.in as custom domain, run Supabase schema SQL

### Session 6 — May 2026 — Domain Registered
- Domain: econolens.co.in (purchased from Hostinger)
- Registrar: Hostinger
- Previous placeholder (econolens.com) was unregistered — now resolved
- All internal URLs updated to econolens.co.in
- Next step: point Hostinger DNS to Vercel (add A record or CNAME)

### Session 8 — June 2026 — Entity Structure Decided
- Legal entity: **Sole Proprietorship** under the name **Econolens Media and Technology**
- Name confirmed available on MCA — no existing company/LLP registered with this name
- No MCA incorporation required at this stage
- Plan: MSME Udyam registration + GST (voluntary or at ₹20L turnover) + current bank account
- Conversion path: Sole Prop → Private Limited Company once revenue justifies it
- Background scheduled tasks paused until website is live and fully operational

### Session 5 — May 2026 — Cloud HQ v2.0 (THIS SESSION)
- CLAUDE.md upgraded to full Cloud Office brief (this file)
- Every AI employee has: tool, reports-to, accesses, daily job, Cowork tasks
- Make.com automation flows 01-05 defined
- Shared folder structure enforced (Code domain vs Cowork domain)
- API key location map created
- Recurring task calendar locked
- Cloud interlink diagram documented

### Session 10 — June 10, 2026 — Operational State Confirmed + CTO Activated

**SANITY STUDIO — NOW LIVE** ✅
- Fixed: SANITY_AUTH_TOKEN upgraded from Editor → Developer level in GitHub Secrets
- Studio deployed successfully to https://econolens.sanity.studio/
- Confirmed: EconoLens CMS loads, content structure accessible, logged in as khagankp@gmail.com
- GitHub Actions exit code 1 warning is cosmetic — deploy itself succeeded

**CTO (CLAUDE CODE) — ACTIVATED** ✅
- GitHub Codespaces connected to econolens/econolens-web repo
- devcontainer.json auto-installs Claude Code on container start
- Authenticated via Anthropic Claude.ai login (not API key — browser auth used)
- CTO is on-demand (not continuous) — summon via Codespaces terminal → `claude`

**CURRENT LIVE STATUS SUMMARY:**
- econolens.co.in ✅ Live
- econolens.sanity.studio ✅ Live
- Vercel auto-deploy ✅ Active
- Supabase (11 tables) ✅ Active
- GitHub CI/CD ✅ Active
- Make.com flows ❌ Not yet configured
- Buffer/Beehiiv connections ❌ Not yet configured
- News pipeline (FLOW-01) ❌ Pending Make.com setup

**NEXT ACTIONS QUEUED:**
1. Set up Make.com FLOW-01 (news pipeline — 30 articles/day)
2. Connect Buffer + Beehiiv to Make.com
3. Verify Clerk auth on live site
4. Add remaining Codespaces secrets

### Session 9 — June 6, 2026 — Full Infrastructure Audit + Deployment Review

**PLATFORM STATUS: LIVE** ✅
- econolens.co.in is live and serving the homepage
- Full editorial luxury redesign deployed (Cormorant Garamond, ink navy + gold)
- 140 commits on main branch including all pages: about, pricing, privacy, terms, articles, dashboard, research, indicators, sign-in, sign-up

**VERCEL — CORRECTED:**
- Account slug is `khagan-s-projects` (NOT `econolens` as previously recorded)
- Project: vercel.com/khagan-s-projects/econolens-web
- GitHub connected ✅, domain connected ✅, auto-deploy active ✅
- All env vars confirmed present (page lazy-loads — must scroll to see all)
- Env vars split: newer ones (May 28-30) = Production+Preview | older ones (May 23) = Production only

**SUPABASE — COMPLETE:**
- 11 tables created and live: users, subscriptions, ai_query_log, ai_response_cache, articles, contributors, economic_data_cache, page_events, quiz_scores, content_suspension_log, ai_cache
- Env var names in code: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY (no NEXT_PUBLIC prefix — server-side only)
- Grievances table (IT Rules 2021) not yet run — pending

**SANITY STUDIO — BLOCKED (1 user action needed):**
- 25 GitHub Actions runs all failed: "Forbidden - User is missing required grant sanity.project.deployStudio"
- Root cause: SANITY_AUTH_TOKEN in GitHub Secrets is an Editor-level token — needs Developer level
- Fix: Go to sanity.io/manage → project rvv43603 → API → Add token → Role: Developer → Copy → GitHub → Settings → Secrets → Update SANITY_AUTH_TOKEN
- Studio will be at: econolens.sanity.studio (studioHost = 'econolens')

**CLAUDE CODE CONNECTION (GitHub Codespaces):**
- devcontainer.json already configured: auto-installs claude-code on container start
- To connect: github.com/econolens/econolens-web → green Code button → Codespaces tab → Create codespace on main
- In terminal: `claude` → "Read CLAUDE.md and tell me what to build first"
- Codespaces secrets needed (one-time setup): go to github.com/settings/codespaces and add: ANTHROPIC_API_KEY, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

**KEY CORRECTION:**
- CLAUDE.md previously said Vercel = vercel.com/econolens — WRONG. Correct: vercel.com/khagan-s-projects

### Session 11 — July 10, 2026 — Article SOP Revision (Economist-Review Format + Conditional India Context)

**DECISION (KP, via Cowork):** Updated the locked News Writer prompt, Operations Checklist, and
Content QA Reviewer prompt (all three: this file, /prompts/news-writer.md, /prompts/qa-checklist.md)
plus the Sanity article schema:

1. **Economist-reviewer framing is now the required article structure.** Every article opens
   "Reviewed by: EconoLens Economics Desk" and Layers 1–2 are written IN that reviewer's voice
   (including a "where economists reviewing this same report disagree" read) — not as a neutral
   summary with commentary bolted on afterward.
2. **India context is now CONDITIONAL, not mandatory.** Include only if the article's topic is
   genuinely India-related (Indian policy/data, or material effect on India's economy). Omit
   entirely otherwise — do not force it in. (Consistent with the existing global-positioning
   brand rule: EconoLens is a global platform, India is one country among many in coverage.)
3. **Graph/chart/image is now required when article type or data warrants visualisation**
   (data-story, econometrics, forecast/time-series pieces) — optional for pure explainer/opinion
   pieces with no numeric series to chart. Use real data only, no paywalled-chart screenshots.
4. **Source attribution + author/byline are ALWAYS mandatory, every article, no exceptions**
   (this was already the rule for source attribution — now made explicit for byline/AI-label too).
5. Sanity schema (`sanity/schemas/article.ts`) updated: `indiaContext` field validation relaxed
   from hard-required to conditional/optional; `qaChecklist` object fields renamed/added to match
   (`indiaContextPresentOrNA`, `graphOrImagePresentOrNA`); `aiLabel` description updated to note
   it's mandatory alongside `sourceAttribution`.

**Why:** Forcing India context into every article undermined the global-platform positioning and
read as filler on non-India topics. Mandating a visual only when data actually warrants one avoids
decorative/unnecessary charts. The economist-reviewer framing was requested to make analysis read
as expert-reviewed rather than plain news summary.

**How to apply:** All future article generation (manual or automated) must pass the updated
Operations Checklist before publish. Prepared by Claude Cowork — not committed/pushed to GitHub
(per standing rule); KP reviews and deploys manually. **Action needed:** log this decision in
Notion Decision Log per the locked-prompt governance rule, once Notion is connected.

### Session 12 — July 21–23, 2026 — Brain Sync + Post-Audit Fixes Confirmed Merged

**CRITICAL FINDING — THIS FILE WAS NEVER ACTUALLY LIVE:** The v2.2–2.4 updates (Sessions 8–11,
including the corrected Vercel slug, the conditional-India-context SOP revision, and the full
session log) existed only in the local Cowork working folder and were **never committed or
pushed to GitHub**. `origin/main` was still serving the original **May 2026 v2.1** — wrong
Vercel account slug (`econolens` instead of `khagan-s-projects`), mandatory India-context rule,
no session log past Session 2. Anyone spinning up a fresh Codespaces session and running
`claude` was reading a five-version-old brain. Fixed this session: content reconciled and
pushed via PR (see below) so GitHub main is now the actual source of truth again, matching the
file's own governance rule ("re-upload/re-sync after every update").

**Verified merged to `origin/main` since Session 11 (2026-07-10), confirmed via `git log`:**
- **Dashboard auth gating restored** (PR #12, commit `6e71300`, 2026-07-21). `/dashboard` had
  shown a static "sign in" placeholder to *every* visitor, logged in or not, since 2026-05-29 —
  the Clerk `useUser` check was pulled pending env vars and never restored. Clerk is confirmed
  live in production, so the check is back. The old fake hardcoded "saved articles" list was
  deliberately **not** restored alongside it — replaced with an honest empty state per the
  no-fake-data rule from the 2026-07-08 ops audit.
- **CSP fix for Clerk CAPTCHA** (PR #13, commit `cb390f7`, 2026-07-21) — allowed
  `challenges.cloudflare.com` so Clerk's CAPTCHA actually loads.
- **Study page link fix** (same PR #12) — the `/study` "Inflation & Price Theory" tile had
  `slug: null` since scaffolding even though `study-understanding-inflation-explained` has been
  live since 07-13; one-line fix, was never a missing-content gap for that topic.
- **Newsletter success copy fixed** (same PR #12) — no longer claims "check your inbox to
  confirm" when no confirmation email exists (Beehiiv not wired up yet).
- **Indicator detail pages + article growth hooks** (PR #11, 2026-07-16) — Cite This Article,
  newsletter CTA on articles.
- **3 hardcoded fake "live" indicator values fixed** (PR #6, from the 07-08 audit) —
  `/indicators` now shows 13 of 14 series with real, varying as-of dates. Only **Gold Price**
  still shows no data — needs checking whether it's actually a FRED series.
- `package-lock.json`/`next` version mismatch resolved — both now resolve `next@14.2.25`
  (the CVE-2025-29927-patched version).

**Still open (verified against live repo/site 2026-07-21, not carried over blind):**
- **GST**: applied 2026-07-13, **not yet approved/registered**. Blocks LUT → IEC → HDFC business
  account → Razorpay/Stripe/Zoho Books in sequence — this is the single highest-leverage
  CEO-only blocker right now.
- **Google Sign-In**: diagnosed 2026-07-19 ("Missing required parameter: client_id"), walkthrough
  written in `ops/reports/Google-Signin-Fix-2026-07-19.md`, requires KP in Clerk Dashboard +
  Google Cloud Console — not something Claude Code/Cowork can fix from the repo side.
  Not yet confirmed fixed.
- **GitHub push token**: not persisted in the Cowork sandbox — has been a recurring bottleneck
  since the 2026-07-11 PAT grant (each new session needs it supplied again). Ask KP for it
  early in any session expected to ship code.
- **Stale branches needing a decision, not a merge**: `fix/nextjs-cve-2025-29927` (superseded —
  the real CVE fix already landed via the `next@14.2.25` bump; this branch predates the `src/`
  refactor and its `middleware.ts` looks corrupted — close, don't merge). `Khagan-kp-patch-1`
  (adds an unauthenticated `/api/debug-buffer-channels` route, confirmed not live on main —
  formally merge-with-fix or close). `fix/llms-txt-refresh-2026-07-16` (same stale-fork issue —
  redo fresh off current main if still wanted). `vercel/install-vercel-speed-insights-3vubjy`
  (already merged — delete the stale ref).
- **1Password**: still not set up for real — 4 secrets were caught sitting in plaintext in
  Notion on 2026-07-12.
- **Beehiiv Phase 0** unblocks the whole newsletter build: rotate the exposed API key, confirm
  sender domain auth (SPF/DKIM/DMARC), check subscriber count, lock a send day.
- Full current-priority list lives in `ops/reports/PENDING-TASKS-MASTER-2026-07-21.md` —
  treat that file, not this session log, as the live task tracker; this log is for
  architecture/decision history.

**Why this matters for the brain itself:** this file's own footer says "re-upload after every
update" and lists schema/phase changes as update triggers — but there was no mechanism catching
that the file wasn't in git at all. Going forward: any edit to this file made in a Cowork or
Claude.ai Projects session must be committed and pushed (feature branch → PR → KP merges) in the
same session it's made, not left as a local-only artifact.

**Addendum — reality-check consolidation (same session, KP's follow-up ask):** KP flagged that
EconoLens's day-one-to-today work "is not stored anywhere, very distributed, many out of focus,
many ideas outdated" — accurate. By this point there were **four independent trackers** that had
each separately tried to be "the real status" and drifted: the Notion Founder Task List, the
Notion Services Bible, the `EconoHub_PMO_Master` Google Sheet, and this file's own 52-role design
(written Session 5, describing Make.com automation, Feedly, Uptime Robot, SE Ranking, and dozens
of other tools/roles that were either abandoned or never actually set up). Fix applied this
session: added a **"REALITY CHECK — CONSOLIDATED CURRENT STATE"** section right after this file's
header (before the org design), pulling together and reconciling `EconoLens_Operations_Workflow.md`
(2026-07-08), the `master-status-csuite-assignments-2026-07-13.md` reconciliation, and this
session's own verified `git log` findings into one place. Tagged the Make.com flows section, the
Recurring Task Calendar, and each of the five non-C-Suite department sections (Tech/Marketing/
Finance/Product/Content-Ops) with brief reality notes distinguishing what's actually running from
target-state design, rather than deleting the design work (it's still useful as a roadmap). The
Notion Founder Task List, Services Bible, and PMO Sheet are declared retired — `CLAUDE.md` (this
file) plus `ops/reports/PENDING-TASKS-MASTER-2026-07-21.md` are now the only two living trackers,
and both should be edited in place going forward rather than superseded by yet another new dated
file each session.

---

### Session 13 — August 1, 2026 — New Content Vertical: Research Papers, Explained

KP asked for a new "branch of service": detailed, plain-language economic analysis of academic
research papers and theses — same idea as the abandoned-on-paper C-02 "Academic Paper
Translator" role and the `research-guide` articleType (S105, "Reading Research") that already
existed in the article schema but had never been surfaced anywhere on the site (no landing page,
not in nav, zero published articles).

**Route conflict found and resolved with KP:** `/research` already exists in code as a paid AI
Q&A chat tool (`src/app/research/page.tsx`, backed by `/api/research`) — built, but not linked
from nav, so effectively dormant. Using "Research" as the nav label for the new section would
have silently pointed users at the wrong feature. KP chose: nav label **"Research"** now points to
a **new route, `/papers`**; the existing AI chat tool stays at `/research`, still unlinked,
untouched, to be dealt with separately.

**What shipped this session (branch `feat/research-papers-section`, PR pending KP merge):**
- Added optional paper-metadata fields to the `article` schema (both `sanity/schemas/article.ts`
  and its `src/sanity/schemas/article.ts` duplicate — see note below): `paperAuthors`,
  `paperSource`, `paperUrl`, `paperPublishedDate`. All `hidden` unless
  `articleType === 'research-guide'`, so they don't clutter every other article type in Studio.
- New `/papers` landing page — lists all `research-guide` articles via the existing
  `getArticlesByType()` helper (already in `lib/sanity.ts`, previously unused for this purpose).
- Nav + footer updated: "Research" link added to `NAV_LINKS` in `src/app/layout.tsx`, pointing
  to `/papers`.
- `/news/[slug]` detail page: added a conditional "Original Paper" info block (authors, journal/
  repository, link to the source paper) shown only when `articleType === 'research-guide'`.
  Layer 1/2/3 rendering, source attribution, and India/Global context sections were already
  generic and needed no changes — `research-guide` already rendered correctly as "Journal
  Review" via the existing `TYPE_LABELS` map.
- `ARTICLE_PROJECTION` in `lib/sanity.ts` extended with the four new fields so listings/detail
  pages can read them.

**Note on the duplicate schema directory:** `src/sanity/schemas/` mirrors root `sanity/schemas/`
almost field-for-field (only comments/formatting differ) but nothing in the codebase imports
from it (`sanity.config.ts` imports the root `sanity/schemas`) — confirmed via grep, it's dead
code. Updated both to keep them in sync rather than deleting the unused copy, since deleting
wasn't in scope this session; worth a follow-up decision on whether to remove it outright.

**Not done yet — the actual content pipeline:** this session only shipped the container (schema
fields, nav, landing page, detail-page rendering). Zero `research-guide` articles exist yet.
The `/prompts/paper-translator.md` locked prompt referenced in the Content Ops section below
(C-02) has never actually existed as a file — same "designed on paper, never built" pattern as
the Make.com flows. Writing that prompt and the first 1-3 translated-paper articles is the
next step, and per [[feedback_no_duplicate_articles]] / [[feedback_verify_before_writing_code]]
should follow the same three-layer + India/global-context + source-attribution rules as every
other article, not a separate standard.

---

*ECONOLENS CLOUD HQ — CLAUDE.md v2.7*
*Next update trigger: new tool adoption, pricing change, schema change, phase transition*
*File location: /econolens/CLAUDE.md (root of project)*
*This file must be committed and pushed to GitHub in the same session it's edited — a local-only
copy is not the source of truth, see Session 12 finding above*

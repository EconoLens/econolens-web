/**
 * EconoLens — Article Schema
 * Covers: S101 (AI Breaking News), S102 (Explainer Library), S103 (Econometrics),
 *         S104 (Mathematical Economics), S105 (Regression Series),
 *         S108 (Three-Layer Architecture), S113/114/115 (Fun Tabs)
 *
 * THREE-LAYER ARCHITECTURE (mandatory for all articles):
 *   Layer 1 — Overview      (plain English, 200 words, any reader)
 *   Layer 2 — Explainer     (context + implications, 600 words, graduates)
 *   Layer 3 — Technical     (methodology, data, academic, 1000+ words)
 *
 * RULES (CCO mandate):
 *   - India context paragraph: MANDATORY on every article
 *   - Source attribution block: MANDATORY
 *   - SEBI disclaimer: MANDATORY if any asset price mentioned
 *   - Copyscape score: must be < 10% before publish
 */

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',

  groups: [
    { name: 'content', title: '📝 Content', default: true },
    { name: 'layers', title: '📚 Three Layers' },
    { name: 'india', title: '🇮🇳 India Context' },
    { name: 'meta', title: '⚙️ Meta & SEO' },
    { name: 'pipeline', title: '🤖 Pipeline & QA' },
    { name: 'monetisation', title: '💰 Monetisation' },
  ],

  fields: [
    // ── CORE ──────────────────────────────────────────────────────────────────

    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      group: 'content',
      validation: (R) =>
        R.required().min(20).max(120).warning('Aim for 60–80 characters for SEO'),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'articleType',
      title: 'Article Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Breaking News (S101)', value: 'news' },
          { title: 'Explainer (S102)', value: 'explainer' },
          { title: 'Econometrics Series (S103)', value: 'econometrics' },
          { title: 'Mathematical Economics (S104)', value: 'math-economics' },
          { title: 'Reading Research (S105)', value: 'research-guide' },
          { title: 'Fun — Football/Sports Economics (S113)', value: 'fun-sports' },
          { title: 'Fun — Tech & AI Economics (S114)', value: 'fun-tech' },
          { title: 'Fun — Entertainment & Bollywood (S115)', value: 'fun-entertainment' },
          { title: 'Data Story', value: 'data-story' },
          { title: 'Opinion / Analysis', value: 'opinion' },
        ],
        layout: 'dropdown',
      },
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'content',
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (R) => R.required().warning('Required for accessibility and SEO'),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'summary',
      title: 'Summary (3 bullet points)',
      description: 'Shown at top of article. Exactly 3 bullets.',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      validation: (R) =>
        R.required().min(3).max(3).error('Exactly 3 summary bullets required'),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'content',
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'contributor' }],
      group: 'content',
      description: 'Leave blank for AI-generated articles',
    }),

    defineField({
      name: 'isAiGenerated',
      title: 'AI-Generated?',
      type: 'boolean',
      group: 'pipeline',
      initialValue: false,
    }),

    // ── THREE LAYERS ──────────────────────────────────────────────────────────

    defineField({
      name: 'layerOne',
      title: 'Layer 1 — Overview (Plain English)',
      description: '~200 words. Any reader can understand. No jargon.',
      type: 'array',
      group: 'layers',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        },
      ],
      validation: (R) => R.required().error('Layer 1 is mandatory'),
    }),

    defineField({
      name: 'layerTwo',
      title: 'Layer 2 — Explainer (Context & Implications)',
      description: '~600 words. For economics graduates and professionals.',
      type: 'array',
      group: 'layers',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        },
        {
          type: 'object',
          name: 'dataTable',
          title: 'Data Table',
          fields: [
            defineField({ name: 'caption', type: 'string', title: 'Table Caption' }),
            defineField({ name: 'data', type: 'text', title: 'CSV Data', description: 'Paste as CSV, rendered as table' }),
          ],
        },
      ],
      validation: (R) => R.required().error('Layer 2 is mandatory'),
    }),

    defineField({
      name: 'layerThree',
      title: 'Layer 3 — Technical (Academic / Methodology)',
      description: '1000+ words. For researchers and advanced students.',
      type: 'array',
      group: 'layers',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        },
        {
          type: 'object',
          name: 'mathBlock',
          title: 'Mathematical Expression',
          fields: [
            defineField({ name: 'latex', type: 'string', title: 'LaTeX Expression' }),
            defineField({ name: 'description', type: 'string', title: 'Description' }),
          ],
        },
        {
          type: 'object',
          name: 'regressionTable',
          title: 'Regression Table',
          fields: [
            defineField({ name: 'caption', type: 'string', title: 'Table Caption' }),
            defineField({ name: 'data', type: 'text', title: 'Table Data (CSV)' }),
            defineField({ name: 'notes', type: 'string', title: 'Notes (significance levels etc.)' }),
          ],
        },
      ],
      validation: (R) => R.required().error('Layer 3 is mandatory'),
    }),

    // ── INDIA CONTEXT (MANDATORY) ─────────────────────────────────────────────

    defineField({
      name: 'indiaContext',
      title: '🇮🇳 India Context Paragraph',
      description: 'MANDATORY. Why this matters for India\'s economy. ~100 words.',
      type: 'text',
      group: 'india',
      rows: 5,
      validation: (R) =>
        R.required()
          .min(80)
          .error('India context is mandatory on every article (CCO mandate)'),
    }),

    defineField({
      name: 'indiaDataPoints',
      title: 'India Data Points',
      description: 'Specific India statistics referenced (RBI, MoSPI, SEBI data)',
      type: 'array',
      group: 'india',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'stat', type: 'string', title: 'Statistic' }),
            defineField({ name: 'source', type: 'string', title: 'Source (RBI/MoSPI/SEBI etc.)' }),
            defineField({ name: 'date', type: 'date', title: 'Data Date' }),
          ],
        },
      ],
    }),

    // ── SOURCE ATTRIBUTION (MANDATORY) ────────────────────────────────────────

    defineField({
      name: 'sourceAttribution',
      title: 'Source Attribution',
      description: 'MANDATORY. Institution + link for all primary sources.',
      type: 'array',
      group: 'pipeline',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'institution', type: 'string', title: 'Institution', validation: (R) => R.required() }),
            defineField({ name: 'title', type: 'string', title: 'Document / Press Release Title' }),
            defineField({ name: 'url', type: 'url', title: 'URL', validation: (R) => R.required() }),
            defineField({ name: 'publishedDate', type: 'date', title: 'Published Date' }),
          ],
          preview: {
            select: { title: 'institution', subtitle: 'title' },
          },
        },
      ],
      validation: (R) =>
        R.required().min(1).error('At least one source is mandatory'),
    }),

    defineField({
      name: 'aiLabel',
      title: 'AI Label',
      description: 'Auto-set for pipeline articles. E.g. "AI-assisted · Source: RBI"',
      type: 'string',
      group: 'pipeline',
    }),

    // ── SEBI DISCLAIMER ────────────────────────────────────────────────────────

    defineField({
      name: 'hasPriceMention',
      title: 'Contains asset price / stock mention?',
      type: 'boolean',
      group: 'pipeline',
      initialValue: false,
      description: 'If YES → SEBI disclaimer is automatically appended',
    }),

    defineField({
      name: 'sebiDisclaimer',
      title: 'SEBI Disclaimer (auto-appended if price mentioned)',
      type: 'text',
      group: 'pipeline',
      readOnly: true,
      initialValue:
        'Disclaimer: This article is for informational purposes only and does not constitute investment advice. EconoLens is not a SEBI-registered investment advisor. Please consult a qualified financial advisor before making investment decisions.',
    }),

    // ── QA & PIPELINE ─────────────────────────────────────────────────────────

    defineField({
      name: 'copyscapeScore',
      title: 'Copyscape Score (%)',
      type: 'number',
      group: 'pipeline',
      description: 'Must be < 10% to publish. Auto-filled by Make.com pipeline.',
      validation: (R) =>
        R.min(0).max(100).warning('Score above 10% — do not publish'),
    }),

    defineField({
      name: 'qaStatus',
      title: 'QA Status',
      type: 'string',
      group: 'pipeline',
      options: {
        list: [
          { title: '⏳ Pending Review', value: 'pending' },
          { title: '✅ Passed', value: 'passed' },
          { title: '❌ Failed — Needs Fix', value: 'failed' },
          { title: '🔄 Regenerated', value: 'regenerated' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),

    defineField({
      name: 'qaChecklist',
      title: 'QA Checklist',
      type: 'object',
      group: 'pipeline',
      fields: [
        defineField({ name: 'indiaContextPresent', type: 'boolean', title: '🇮🇳 India context present', initialValue: false }),
        defineField({ name: 'threeLayersComplete', type: 'boolean', title: '📚 All three layers complete', initialValue: false }),
        defineField({ name: 'sourceAttributionPresent', type: 'boolean', title: '📎 Source attribution present', initialValue: false }),
        defineField({ name: 'sebiCompliant', type: 'boolean', title: '⚖️ SEBI compliant (disclaimer if needed)', initialValue: false }),
        defineField({ name: 'noHallucinations', type: 'boolean', title: '🔍 Fact-checked (no hallucinations)', initialValue: false }),
      ],
    }),

    defineField({
      name: 'feedSource',
      title: 'RSS Feed Source',
      type: 'string',
      group: 'pipeline',
      description: 'Auto-filled by Make.com. E.g. rbi.org.in, imf.org',
    }),

    defineField({
      name: 'makeRunId',
      title: 'Make.com Run ID',
      type: 'string',
      group: 'pipeline',
      description: 'For tracing pipeline runs. Auto-filled.',
    }),

    // ── SEO & META ─────────────────────────────────────────────────────────────

    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'meta',
      description: 'If blank, uses article headline. Max 60 chars.',
      validation: (R) => R.max(60).warning('Keep under 60 characters'),
    }),

    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'meta',
      rows: 3,
      description: '150–160 characters. Used by Google and AI search engines.',
      validation: (R) =>
        R.min(120).max(160).warning('Aim for 150–160 characters'),
    }),

    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      group: 'meta',
      description: 'Leave blank unless this is a syndicated article',
    }),

    defineField({
      name: 'focusKeyword',
      title: 'Focus Keyword',
      type: 'string',
      group: 'meta',
      description: 'Primary keyword for SE Ranking tracking',
    }),

    defineField({
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      group: 'meta',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
    }),

    // ── MONETISATION ──────────────────────────────────────────────────────────

    defineField({
      name: 'accessLevel',
      title: 'Access Level',
      type: 'string',
      group: 'monetisation',
      options: {
        list: [
          { title: '🌐 Free (Layer 1 + 2 visible)', value: 'free' },
          { title: '🔒 Pro (All 3 layers)', value: 'pro' },
          { title: '🔒 Research (Full + data download)', value: 'research' },
        ],
        layout: 'radio',
      },
      initialValue: 'free',
      description: 'Phase 1: all free. Phase 2: pro gates Layer 3.',
    }),

    defineField({
      name: 'ga4Views',
      title: 'GA4 Page Views',
      type: 'number',
      group: 'monetisation',
      description: 'Synced from GA4 by Make.com. Used for newsletter top-5 selection.',
      readOnly: true,
      initialValue: 0,
    }),

    defineField({
      name: 'featured',
      title: 'Featured Article?',
      type: 'boolean',
      group: 'monetisation',
      initialValue: false,
      description: 'Shown in homepage hero and newsletter header',
    }),

    // ── AUDIO (Phase 2 placeholder) ────────────────────────────────────────────

    defineField({
      name: 'audioUrl',
      title: 'Audio URL (Phase 2)',
      type: 'url',
      group: 'meta',
      description: 'Auto-filled by ElevenLabs pipeline (Phase 2). Cloudflare R2 URL.',
    }),
  ],

  // ── PREVIEW ───────────────────────────────────────────────────────────────

  preview: {
    select: {
      title: 'title',
      subtitle: 'articleType',
      media: 'coverImage',
      qa: 'qaStatus',
      copyscape: 'copyscapeScore',
    },
    prepare({ title, subtitle, media, qa, copyscape }) {
      const qaIcon = qa === 'passed' ? '✅' : qa === 'failed' ? '❌' : '⏳'
      const cpIcon = copyscape != null ? (copyscape < 10 ? '✓' : '⚠️') : ''
      return {
        title,
        subtitle: `${subtitle} | QA: ${qaIcon} | Copyscape: ${copyscape ?? '—'}% ${cpIcon}`,
        media,
      }
    },
  },

  // ── ORDERING ──────────────────────────────────────────────────────────────

  orderings: [
    {
      title: 'Published (newest first)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'GA4 Views (most popular)',
      name: 'ga4ViewsDesc',
      by: [{ field: 'ga4Views', direction: 'desc' }],
    },
    {
      title: 'QA Pending first',
      name: 'qaPending',
      by: [{ field: 'qaStatus', direction: 'asc' }],
    },
  ],
})

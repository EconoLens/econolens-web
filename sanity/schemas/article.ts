/**
 * EconoLens — Article Schema
 * THREE-LAYER ARCHITECTURE (mandatory):
 *   Layer 1 — Overview (plain English, 200 words)
 *   Layer 2 — Explainer (context + implications, 600 words)
 *   Layer 3 — Technical (methodology, data, academic, 1000+ words)
 * RULES: India context MANDATORY, Source attribution MANDATORY,
 *        SEBI disclaimer MANDATORY if any asset price mentioned,
 *        Copyscape score must be < 10% before publish
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
    defineField({ name: 'title', title: 'Headline', type: 'string', group: 'content', validation: (R) => R.required().min(20).max(120) }),
    defineField({ name: 'slug', title: 'URL Slug', type: 'slug', group: 'content', options: { source: 'title', maxLength: 96 }, validation: (R) => R.required() }),
    defineField({
      name: 'articleType', title: 'Article Type', type: 'string', group: 'content',
      options: { list: [
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
      ], layout: 'dropdown' },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }], group: 'content', validation: (R) => R.required() }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', group: 'content', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    // ── PAPER METADATA (shown only for Reading Research / research-guide) ────
    defineField({
      name: 'paperAuthors', title: 'Original Paper Authors', type: 'array', group: 'content',
      of: [{ type: 'string' }], options: { layout: 'tags' },
      description: 'Authors of the academic paper/thesis being translated (not the EconoLens writer).',
      hidden: ({ parent }) => parent?.articleType !== 'research-guide',
    }),
    defineField({
      name: 'paperSource', title: 'Journal / Repository', type: 'string', group: 'content',
      description: 'Where the original paper was published, e.g. NBER Working Paper, SSRN, AER, a university thesis repository.',
      hidden: ({ parent }) => parent?.articleType !== 'research-guide',
    }),
    defineField({
      name: 'paperUrl', title: 'Original Paper URL', type: 'url', group: 'content',
      description: 'Link to the original paper/thesis (DOI, SSRN, NBER, arXiv, etc.)',
      hidden: ({ parent }) => parent?.articleType !== 'research-guide',
    }),
    defineField({
      name: 'paperPublishedDate', title: 'Original Paper Publication Date', type: 'date', group: 'content',
      hidden: ({ parent }) => parent?.articleType !== 'research-guide',
    }),
    defineField({
      name: 'coverImage', title: 'Cover Image', type: 'image', group: 'content', options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: (R) => R.required() }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      ],
    }),
    defineField({ name: 'summary', title: 'Summary (3 bullet points)', type: 'array', group: 'content', of: [{ type: 'string' }], validation: (R) => R.required().min(3).max(3).error('Exactly 3 summary bullets required') }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', group: 'content', validation: (R) => R.required() }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'contributor' }], group: 'content', description: 'Leave blank for AI-generated articles' }),
    defineField({ name: 'isAiGenerated', title: 'AI-Generated?', type: 'boolean', group: 'pipeline', initialValue: false }),
    defineField({
      name: 'layerOne', title: 'Layer 1 — Overview (Plain English)', description: '~200 words. No jargon.', type: 'array', group: 'layers',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' }), defineField({ name: 'caption', type: 'string', title: 'Caption' })] }],
      validation: (R) => R.required().error('Layer 1 is mandatory'),
    }),
    defineField({
      name: 'layerTwo', title: 'Layer 2 — Explainer (Context & Implications)', description: '~600 words.', type: 'array', group: 'layers',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' }), defineField({ name: 'caption', type: 'string', title: 'Caption' })] },
        { type: 'object', name: 'dataTable', title: 'Data Table', fields: [defineField({ name: 'caption', type: 'string', title: 'Table Caption' }), defineField({ name: 'data', type: 'text', title: 'CSV Data' })] },
      ],
      validation: (R) => R.required().error('Layer 2 is mandatory'),
    }),
    defineField({
      name: 'layerThree', title: 'Layer 3 — Technical (Academic / Methodology)', description: '1000+ words.', type: 'array', group: 'layers',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' }), defineField({ name: 'caption', type: 'string', title: 'Caption' })] },
        { type: 'object', name: 'mathBlock', title: 'Mathematical Expression', fields: [defineField({ name: 'latex', type: 'string', title: 'LaTeX Expression' }), defineField({ name: 'description', type: 'string', title: 'Description' })] },
        { type: 'object', name: 'regressionTable', title: 'Regression Table', fields: [defineField({ name: 'caption', type: 'string', title: 'Table Caption' }), defineField({ name: 'data', type: 'text', title: 'Table Data (CSV)' }), defineField({ name: 'notes', type: 'string', title: 'Notes' })] },
      ],
      validation: (R) => R.required().error('Layer 3 is mandatory'),
    }),
    defineField({ name: 'indiaContext', title: '🇮🇳 India Context Paragraph', description: "MANDATORY. Why this matters for India's economy. ~100 words.", type: 'text', group: 'india', rows: 5, validation: (R) => R.required().min(80).error('India context is mandatory (CCO mandate)') }),
    defineField({
      name: 'indiaDataPoints', title: 'India Data Points', type: 'array', group: 'india',
      of: [{ type: 'object', fields: [defineField({ name: 'stat', type: 'string', title: 'Statistic' }), defineField({ name: 'source', type: 'string', title: 'Source' }), defineField({ name: 'date', type: 'date', title: 'Data Date' })] }],
    }),
    defineField({
      name: 'sourceAttribution', title: 'Source Attribution', description: 'MANDATORY. Institution + link for all primary sources.', type: 'array', group: 'pipeline',
      of: [{ type: 'object', fields: [
        defineField({ name: 'institution', type: 'string', title: 'Institution', validation: (R) => R.required() }),
        defineField({ name: 'title', type: 'string', title: 'Document Title' }),
        defineField({ name: 'url', type: 'url', title: 'URL', validation: (R) => R.required() }),
        defineField({ name: 'publishedDate', type: 'date', title: 'Published Date' }),
      ], preview: { select: { title: 'institution', subtitle: 'title' } } }],
      validation: (R) => R.required().min(1).error('At least one source is mandatory'),
    }),
    defineField({ name: 'aiLabel', title: 'AI Label', type: 'string', group: 'pipeline', description: 'E.g. "AI-assisted · Source: RBI"' }),
    defineField({ name: 'hasPriceMention', title: 'Contains asset price / stock mention?', type: 'boolean', group: 'pipeline', initialValue: false }),
    defineField({ name: 'sebiDisclaimer', title: 'SEBI Disclaimer', type: 'text', group: 'pipeline', readOnly: true, initialValue: 'Disclaimer: This article is for informational purposes only and does not constitute investment advice. EconoLens is not a SEBI-registered investment advisor. Please consult a qualified financial advisor before making investment decisions.' }),
    defineField({ name: 'copyscapeScore', title: 'Copyscape Score (%)', type: 'number', group: 'pipeline', validation: (R) => R.min(0).max(100).warning('Score above 10% — do not publish') }),
    defineField({
      name: 'qaStatus', title: 'QA Status', type: 'string', group: 'pipeline',
      options: { list: [{ title: '⏳ Pending Review', value: 'pending' }, { title: '✅ Passed', value: 'passed' }, { title: '❌ Failed', value: 'failed' }, { title: '🔄 Regenerated', value: 'regenerated' }], layout: 'radio' },
      initialValue: 'pending',
    }),
    defineField({
      name: 'qaChecklist', title: 'QA Checklist', type: 'object', group: 'pipeline',
      fields: [
        defineField({ name: 'indiaContextPresent', type: 'boolean', title: '🇮🇳 India context present', initialValue: false }),
        defineField({ name: 'threeLayersComplete', type: 'boolean', title: '📚 All three layers complete', initialValue: false }),
        defineField({ name: 'sourceAttributionPresent', type: 'boolean', title: '📎 Source attribution present', initialValue: false }),
        defineField({ name: 'sebiCompliant', type: 'boolean', title: '⚖️ SEBI compliant', initialValue: false }),
        defineField({ name: 'noHallucinations', type: 'boolean', title: '🔍 Fact-checked', initialValue: false }),
      ],
    }),
    defineField({ name: 'feedSource', title: 'RSS Feed Source', type: 'string', group: 'pipeline' }),
    defineField({ name: 'makeRunId', title: 'Make.com Run ID', type: 'string', group: 'pipeline' }),
    defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string', group: 'meta', validation: (R) => R.max(60) }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', group: 'meta', rows: 3, validation: (R) => R.min(120).max(160) }),
    defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url', group: 'meta' }),
    defineField({ name: 'focusKeyword', title: 'Focus Keyword', type: 'string', group: 'meta' }),
    defineField({ name: 'relatedArticles', title: 'Related Articles', type: 'array', group: 'meta', of: [{ type: 'reference', to: [{ type: 'article' }] }] }),
    defineField({
      name: 'accessLevel', title: 'Access Level', type: 'string', group: 'monetisation',
      options: { list: [{ title: '🌐 Free (Layer 1 + 2 visible)', value: 'free' }, { title: '🔒 Pro (All 3 layers)', value: 'pro' }, { title: '🔒 Research (Full + data download)', value: 'research' }], layout: 'radio' },
      initialValue: 'free',
    }),
    defineField({ name: 'ga4Views', title: 'GA4 Page Views', type: 'number', group: 'monetisation', readOnly: true, initialValue: 0 }),
    defineField({ name: 'featured', title: 'Featured Article?', type: 'boolean', group: 'monetisation', initialValue: false }),
    defineField({ name: 'audioUrl', title: 'Audio URL (Phase 2)', type: 'url', group: 'meta' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'articleType', media: 'coverImage', qa: 'qaStatus', copyscape: 'copyscapeScore' },
    prepare({ title, subtitle, media, qa, copyscape }) {
      const qaIcon = qa === 'passed' ? '✅' : qa === 'failed' ? '❌' : '⏳'
      return { title, subtitle: `${subtitle} | QA: ${qaIcon} | Copyscape: ${copyscape ?? '—'}%`, media }
    },
  },
  orderings: [
    { title: 'Published (newest first)', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'GA4 Views (most popular)', name: 'ga4ViewsDesc', by: [{ field: 'ga4Views', direction: 'desc' }] },
    { title: 'QA Pending first', name: 'qaPending', by: [{ field: 'qaStatus', direction: 'asc' }] },
  ],
})

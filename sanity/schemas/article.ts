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

import { defineArrayMember, defineField, defineType } from 'sanity'

// ── SHARED ARTICLE BODY BLOCKS (2026-09-17) ─────────────────────────────────
// One block set for layerOne, layerTwo and layerThree. Before this, tables were
// only allowed in Layer 2 and formulas/regression tables only in Layer 3, so
// Studio flagged valid content as invalid depending on which layer it sat in.
// Existing documents stay valid: every previously allowed type and field
// name is unchanged; this only adds options.

const textBlock = defineArrayMember({
  type: 'block',
  marks: {
    // Keep the default decorators; declaring `annotations` replaces Sanity's
    // default link annotation, so it is redefined here with relative-URL support.
    decorators: [
      { title: 'Strong', value: 'strong' },
      { title: 'Emphasis', value: 'em' },
      { title: 'Code', value: 'code' },
      { title: 'Underline', value: 'underline' },
      { title: 'Strike', value: 'strike-through' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({
            name: 'href',
            type: 'url',
            title: 'URL',
            description: 'Internal links as /news/<slug> or /indicators; external links as full https:// URLs.',
            validation: (R) => R.required().uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
          }),
        ],
      },
      {
        name: 'inlineMath',
        type: 'object',
        title: 'Inline formula',
        description: 'Select placeholder text, then enter the LaTeX, e.g. \\beta_1',
        fields: [defineField({ name: 'latex', type: 'string', title: 'LaTeX', validation: (R) => R.required() })],
      },
    ],
  },
})

const imageBlock = defineArrayMember({
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
      description: 'Required. Describe what the image or chart shows, including the trend for charts.',
      validation: (R) => R.required().error('Alt text is required on every image'),
    }),
    defineField({ name: 'caption', type: 'string', title: 'Caption', description: 'For charts, name the data source.' }),
    defineField({ name: 'credit', type: 'string', title: 'Credit', description: 'e.g. "EconoLens original" or the data source.' }),
  ],
})

const tableFields = [
  defineField({ name: 'caption', type: 'string', title: 'Table Caption', validation: (R) => R.required().warning('Add a caption so readers know what the table shows') }),
  defineField({
    name: 'data',
    type: 'text',
    title: 'CSV Data',
    description: 'First row is the header. Wrap any cell containing a comma in double quotes, e.g. "3.0% (avg, 2024-25)".',
    validation: (R) => R.required(),
  }),
  defineField({ name: 'notes', type: 'string', title: 'Notes / Source', description: 'Source line, significance levels, units.' }),
  defineField({
    name: 'chart',
    type: 'boolean',
    title: 'Draw bar chart from first all-numeric column?',
    description: 'On by default when a column is fully numeric. Switch off to show only the table.',
  }),
]

const dataTableBlock = defineArrayMember({ type: 'object', name: 'dataTable', title: 'Data Table', fields: tableFields })

const regressionTableBlock = defineArrayMember({ type: 'object', name: 'regressionTable', title: 'Regression Table', fields: tableFields })

const mathBlock = defineArrayMember({
  type: 'object',
  name: 'mathBlock',
  title: 'Mathematical Expression',
  fields: [
    defineField({
      name: 'latex',
      type: 'text',
      rows: 3,
      title: 'LaTeX Expression',
      description: 'Typeset on the page with KaTeX. Example: \\hat{\\beta} = (X^\\top X)^{-1} X^\\top y',
      validation: (R) => R.required(),
    }),
    defineField({ name: 'description', type: 'string', title: 'Description', description: 'The "where…" line defining every symbol.' }),
  ],
})

const chartEmbedBlock = defineArrayMember({
  type: 'object',
  name: 'chartEmbed',
  title: 'Live Chart (economic indicators)',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Chart Title', validation: (R) => R.required() }),
    defineField({
      name: 'indicators',
      type: 'array',
      title: 'Indicators',
      description: 'Up to 4. Indicators sharing a unit share one axis; different units get separate charts.',
      of: [{ type: 'reference', to: [{ type: 'economicIndicator' }] }],
      validation: (R) => R.required().min(1).max(4),
    }),
    defineField({ name: 'startDate', type: 'date', title: 'Start Date' }),
    defineField({ name: 'endDate', type: 'date', title: 'End Date', description: 'Leave blank for latest.' }),
    defineField({
      name: 'chartStyle',
      type: 'string',
      title: 'Chart Style',
      options: {
        list: [
          { title: 'Line (continuous series: CPI, GDP, FX)', value: 'line' },
          { title: 'Step (policy rates that change on decision dates)', value: 'step' },
        ],
        layout: 'radio',
      },
      initialValue: 'line',
    }),
    defineField({ name: 'caption', type: 'string', title: 'Caption' }),
    defineField({
      name: 'alt',
      type: 'text',
      rows: 2,
      title: 'Chart Summary (alt text)',
      description: 'One or two sentences stating what the chart shows. Auto-generated from the data if left blank.',
    }),
  ],
  preview: {
    select: { title: 'title', style: 'chartStyle' },
    prepare: ({ title, style }) => ({ title: title || 'Live chart', subtitle: `📈 ${style || 'line'} chart` }),
  },
})

const BODY_BLOCKS = [textBlock, imageBlock, dataTableBlock, regressionTableBlock, mathBlock, chartEmbedBlock]

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
      of: BODY_BLOCKS,
      validation: (R) => R.required().error('Layer 1 is mandatory'),
    }),
    defineField({
      name: 'layerTwo', title: 'Layer 2 — Explainer (Context & Implications)', description: '~600 words.', type: 'array', group: 'layers',
      of: BODY_BLOCKS,
      validation: (R) => R.required().error('Layer 2 is mandatory'),
    }),
    defineField({
      name: 'layerThree', title: 'Layer 3 — Technical (Academic / Methodology)', description: '1000+ words.', type: 'array', group: 'layers',
      of: BODY_BLOCKS,
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
        defineField({
          name: 'sourceComplianceChecked', type: 'boolean', title: '©️ Source-use compliance checked', initialValue: false,
          description: 'Only for research-guide (paper translation) articles. Confirms: no verbatim quote over 15 words, abstract paraphrased not copied, no reproduced figures/tables/images from the original, © notice included if any direct quote is used, and — for paywalled journal sources without a stated quotation policy — near-zero direct quoting applied by default.',
          hidden: ({ parent }) => parent?.articleType !== 'research-guide',
        }),
      ],
    }),
    defineField({ name: 'feedSource', title: 'RSS Feed Source', type: 'string', group: 'pipeline' }),
    defineField({ name: 'makeRunId', title: 'Make.com Run ID', type: 'string', group: 'pipeline' }),
    defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string', group: 'meta', validation: (R) => R.max(60) }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', group: 'meta', rows: 3, validation: (R) => R.min(120).max(160) }),
    defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url', group: 'meta' }),
    defineField({ name: 'focusKeyword', title: 'Focus Keyword', type: 'string', group: 'meta' }),
    defineField({
      name: 'faqSection', title: 'FAQ / Q&A (GEO)', type: 'array', group: 'meta',
      description: 'Question & answer pairs. Rendered as an on-page FAQ and emitted as FAQPage structured data -- this is what AI answer engines (ChatGPT, Perplexity, Google AI Overviews) pull direct-answer snippets from, not just search crawlers.',
      of: [{
        type: 'object', name: 'faqItem',
        fields: [
          defineField({ name: 'question', title: 'Question', type: 'string', validation: (R) => R.required() }),
          defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (R) => R.required() }),
        ],
        preview: { select: { title: 'question' } },
      }],
    }),
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

/**
 * EconoLens — Shop product schema (added 2026-11-13).
 * KP posts exam notes, Excel templates and service offers from Studio.
 * The site reads these at /shop and /shop/[slug].
 */
import { defineField, defineType } from 'sanity'

export const SHOP_SECTIONS = [
  { title: 'Exam Notes', value: 'exam-notes' },
  { title: 'Excel Templates & Planners', value: 'templates' },
  { title: 'Project Reports (DPR)', value: 'project-reports' },
  { title: 'Thesis Data Analysis', value: 'thesis-support' },
]

export default defineType({
  name: 'product',
  title: 'Shop Product',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Product name', type: 'string', validation: (R) => R.required().max(90) }),
    defineField({ name: 'slug', title: 'URL slug', type: 'slug', options: { source: 'title', maxLength: 80 }, validation: (R) => R.required() }),
    defineField({
      name: 'section', title: 'Shop section', type: 'string',
      options: { list: SHOP_SECTIONS, layout: 'radio' }, validation: (R) => R.required(),
    }),
    defineField({ name: 'tagline', title: 'One-line description', type: 'string', validation: (R) => R.required().max(140) }),
    defineField({ name: 'description', title: 'Full description', type: 'text', rows: 6 }),
    defineField({
      name: 'includes', title: "What's included", description: 'One line per item, e.g. "25 MCQs with worked answers".',
      type: 'array', of: [{ type: 'string' }],
    }),
    defineField({ name: 'audience', title: 'Who it is for', type: 'string' }),
    defineField({ name: 'format', title: 'Format', type: 'string', description: 'e.g. "PDF · 10 pages" or "Excel (.xlsx)" or "Service"' }),
    defineField({ name: 'price', title: 'Price (₹)', type: 'number', description: 'Leave empty for services priced on enquiry.', validation: (R) => R.min(0) }),
    defineField({ name: 'priceNote', title: 'Price note', type: 'string', description: 'e.g. "from ₹10,000 per report" or "launch price"' }),
    defineField({ name: 'buyUrl', title: 'Buy / enquiry link', type: 'url', description: 'Marketplace checkout link, payment page, or WhatsApp chat link. Empty = shows "Coming soon".', validation: (R) => R.uri({ scheme: ['http', 'https'] }) }),
    defineField({ name: 'ctaLabel', title: 'Button text', type: 'string', initialValue: 'Buy now' }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })] }),
    defineField({ name: 'featured', title: 'Feature at the top of the shop', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Sort order (low first)', type: 'number', initialValue: 10 }),
    defineField({ name: 'published', title: 'Show on the site', type: 'boolean', initialValue: true }),
  ],
  orderings: [{ title: 'Sort order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'section', media: 'coverImage' } },
})

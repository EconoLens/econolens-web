/**
 * EconoLens — Site Settings Schema
 * Singleton document — one instance only.
 * Controls homepage, nav, SEO defaults, social links.
 */

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',

  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'EconoLens',
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: "India's AI-powered economics intelligence platform",
    }),

    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      initialValue: 'https://econolens.co.in',
    }),

    defineField({
      name: 'defaultMetaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      description: "Used when article/page doesn't have its own meta description",
    }),

    defineField({
      name: 'ogImage',
      title: 'Default OG Image',
      type: 'image',
      description: 'Used for social sharing when article has no cover image',
    }),

    defineField({
      name: 'homepageFeaturedArticles',
      title: 'Homepage Featured Articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      validation: (R) => R.max(5),
      description: 'Up to 5 articles shown in homepage hero',
    }),

    defineField({
      name: 'homepageFeaturedIndicators',
      title: 'Homepage Dashboard Indicators',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'economicIndicator' }] }],
      validation: (R) => R.max(6),
      description: 'Up to 6 indicators shown on homepage (S107)',
    }),

    defineField({
      name: 'navCategories',
      title: 'Navigation Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'Categories shown in main navigation',
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'twitter', type: 'url', title: 'X / Twitter' }),
        defineField({ name: 'linkedin', type: 'url', title: 'LinkedIn' }),
        defineField({ name: 'instagram', type: 'url', title: 'Instagram' }),
        defineField({ name: 'youtube', type: 'url', title: 'YouTube' }),
        defineField({ name: 'telegram', type: 'url', title: 'Telegram' }),
      ],
    }),

    defineField({
      name: 'newsletterCta',
      title: 'Newsletter CTA Text',
      type: 'string',
      initialValue: "Get India's economics news in your inbox every Friday",
    }),

    defineField({
      name: 'adsensePublisherId',
      title: 'AdSense Publisher ID',
      type: 'string',
      description: 'E.g. pub-XXXXXXXXXXXXXXXX. Used for AdSense eligibility (Phase 1 goal)',
    }),

    defineField({
      name: 'ga4MeasurementId',
      title: 'GA4 Measurement ID',
      type: 'string',
      initialValue: 'G-JKGQJFE2X0',
      description: 'Already configured — do not change',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})

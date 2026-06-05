/**
 * EconoLens — Economic Indicator Schema
 * Covers: S107 — Live Economic Indicators Dashboard
 *
 * Stores indicator metadata. Actual data is fetched live from FRED API
 * and cached in Supabase economic_data_cache table.
 * This schema stores the indicator config — what to show, how to display it.
 */

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'economicIndicator',
  title: 'Economic Indicator',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Indicator Name',
      type: 'string',
      description: 'E.g. "India Repo Rate" or "US CPI (YoY)"',
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'fredSeriesId',
      title: 'FRED Series ID',
      type: 'string',
      description: 'E.g. "FEDFUNDS" for Fed Funds Rate. From fred.stlouisfed.org',
    }),

    defineField({
      name: 'rbiSeriesId',
      title: 'RBI / India Data Series ID',
      type: 'string',
      description: 'For India-specific indicators not on FRED',
    }),

    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      options: {
        list: [
          { title: '🇮🇳 India', value: 'IN' },
          { title: '🇺🇸 United States', value: 'US' },
          { title: '🇪🇺 Euro Zone', value: 'EU' },
          { title: '🇬🇧 United Kingdom', value: 'GB' },
          { title: '🇨🇳 China', value: 'CN' },
          { title: '🌍 Global', value: 'GLOBAL' },
        ],
      },
      initialValue: 'IN',
    }),

    defineField({
      name: 'indicatorType',
      title: 'Indicator Type',
      type: 'string',
      options: {
        list: [
          { title: 'Interest Rate', value: 'interest-rate' },
          { title: 'Inflation', value: 'inflation' },
          { title: 'GDP Growth', value: 'gdp' },
          { title: 'Unemployment', value: 'unemployment' },
          { title: 'Trade Balance', value: 'trade' },
          { title: 'Exchange Rate', value: 'forex' },
          { title: 'Stock Index', value: 'equity' },
          { title: 'Commodity', value: 'commodity' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'string',
      description: 'E.g. "%" or "₹ Crore" or "USD/barrel"',
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'frequency',
      title: 'Update Frequency',
      type: 'string',
      options: {
        list: [
          { title: 'Daily', value: 'daily' },
          { title: 'Weekly', value: 'weekly' },
          { title: 'Monthly', value: 'monthly' },
          { title: 'Quarterly', value: 'quarterly' },
          { title: 'Annual', value: 'annual' },
        ],
      },
    }),

    defineField({
      name: 'description',
      title: 'Plain English Description',
      type: 'text',
      rows: 3,
      description: 'Shown as tooltip on dashboard. No jargon.',
    }),

    defineField({
      name: 'chartType',
      title: 'Chart Type',
      type: 'string',
      options: {
        list: [
          { title: 'Line Chart', value: 'line' },
          { title: 'Bar Chart', value: 'bar' },
          { title: 'Area Chart', value: 'area' },
          { title: 'Single Value (Big Number)', value: 'single' },
        ],
      },
      initialValue: 'line',
    }),

    defineField({
      name: 'featured',
      title: 'Show on Homepage Dashboard?',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'order',
      title: 'Display Order on Dashboard',
      type: 'number',
      initialValue: 99,
    }),

    defineField({
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      description: 'Articles that explain this indicator',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'indicatorType',
      country: 'country',
      featured: 'featured',
    },
    prepare({ title, subtitle, country, featured }) {
      return {
        title,
        subtitle: `${country} | ${subtitle} ${featured ? '⭐ Featured' : ''}`,
      }
    },
  },
})

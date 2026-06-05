/**
 * EconoLens — Category Schema
 * Top-level economics topic categories.
 * Used for filtering, SEO, and newsletter curation.
 */

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'icon',
      title: 'Icon (emoji)',
      type: 'string',
      description: 'E.g. 📈 for Markets, 🏦 for Monetary Policy',
    }),

    defineField({
      name: 'color',
      title: 'Accent Color (hex)',
      type: 'string',
      description: 'Used for category pills. E.g. #1e3a5f',
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 2,
      description: 'For /category/[slug] page. 150–160 chars.',
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = shown first in nav',
      initialValue: 99,
    }),
  ],

  preview: {
    select: { title: 'title', icon: 'icon' },
    prepare({ title, icon }) {
      return { title: `${icon ?? ''} ${title}` }
    },
  },
})

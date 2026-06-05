/**
 * EconoLens — Contributor Schema
 * Covers: S112 — Expert Contributor Program
 *
 * Contributor tiers:
 *   None   → applied, not yet verified
 *   Bronze → 1–5 published articles
 *   Silver → 6–20 articles, verified credentials
 *   Gold   → 20+ articles, institutional affiliation
 */

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contributor',
  title: 'Contributor',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Profile URL Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      validation: (R) => R.max(300).warning('Keep bio under 300 characters'),
    }),

    defineField({
      name: 'credentials',
      title: 'Credentials',
      description: 'E.g. "PhD Economics, JNU" or "Economist, RBI"',
      type: 'string',
    }),

    defineField({
      name: 'institution',
      title: 'Institution / Affiliation',
      type: 'string',
    }),

    defineField({
      name: 'clerkId',
      title: 'Clerk User ID',
      type: 'string',
      description: 'Links Sanity contributor to auth user',
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Private — not displayed publicly',
    }),

    defineField({
      name: 'badgeLevel',
      title: 'Badge Level',
      type: 'string',
      options: {
        list: [
          { title: '— None (Applied)', value: 'none' },
          { title: '🥉 Bronze (1–5 articles)', value: 'bronze' },
          { title: '🥈 Silver (6–20 articles)', value: 'silver' },
          { title: '🥇 Gold (20+ articles)', value: 'gold' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),

    defineField({
      name: 'verified',
      title: 'Credentials Verified?',
      type: 'boolean',
      initialValue: false,
      description: 'CHRO verifies credentials before Silver/Gold badge',
    }),

    defineField({
      name: 'articlesCount',
      title: 'Published Articles Count',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'linkedin', type: 'url', title: 'LinkedIn' }),
        defineField({ name: 'twitter', type: 'url', title: 'X / Twitter' }),
        defineField({ name: 'website', type: 'url', title: 'Personal Website' }),
        defineField({ name: 'googleScholar', type: 'url', title: 'Google Scholar' }),
      ],
    }),

    defineField({
      name: 'appliedAt',
      title: 'Applied At',
      type: 'datetime',
    }),

    defineField({
      name: 'verifiedAt',
      title: 'Verified At',
      type: 'datetime',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'credentials',
      media: 'photo',
      badge: 'badgeLevel',
      verified: 'verified',
    },
    prepare({ title, subtitle, media, badge, verified }) {
      const badgeIcon = { none: '—', bronze: '🥉', silver: '🥈', gold: '🥇' }[badge] ?? '—'
      const verifiedIcon = verified ? '✅' : '⏳'
      return {
        title,
        subtitle: `${subtitle ?? 'No credentials'} | ${badgeIcon} | ${verifiedIcon}`,
        media,
      }
    },
  },
})

/**
 * EconoLens — Sanity Schema Registry
 * Register ALL schemas here. Order determines Sanity Studio sidebar order.
 */

import article from './article'
import contributor from './contributor'
import category from './category'
import economicIndicator from './economicIndicator'
import siteSettings from './siteSettings'

export const schemaTypes = [
  // Content (most used — shown first)
  article,
  category,

  // People
  contributor,

  // Data / Product
  economicIndicator,

  // Config (shown last)
  siteSettings,
]

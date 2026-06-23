import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'

/**
 * Root-level Sanity Studio config - required by sanity deploy.
 * basePath must match the Next.js studio route: /studio
 */
export default defineConfig({
  name: 'econolens',
  title: 'EconoLens CMS',
  basePath: '/studio',

  projectId: 'rvv43603',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})

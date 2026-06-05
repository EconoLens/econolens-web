import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemas'

/**
 * Root-level Sanity Studio config — required by `sanity deploy`.
 * The CLI looks for sanity.config.ts in the same directory as sanity.cli.ts.
 * Schemas are imported from src/sanity/schemas/ where they live.
 */
export default defineConfig({
  name: 'econolens',
  title: 'EconoLens CMS',

  projectId: 'rvv43603',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})

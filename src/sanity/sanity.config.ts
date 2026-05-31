/**
 * EconoLens — Sanity Studio Configuration
 * Studio URL: studio.econolens.co.in (after deploy)
 * Local: http://localhost:3333
 */

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'econolens',
  title: 'EconoLens CMS',

  projectId: 'rvv43603',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('EconoLens Content')
          .items([
            // ── CONTENT ────────────────────────────────────────────────────
            S.listItem()
              .title('📰 Articles')
              .child(
                S.list()
                  .title('Articles by Type')
                  .items([
                    S.listItem()
                      .title('📡 Breaking News (S101)')
                      .child(
                        S.documentList()
                          .title('Breaking News')
                          .filter('_type == "article" && articleType == "news"')
                      ),
                    S.listItem()
                      .title('📚 Explainers (S102)')
                      .child(
                        S.documentList()
                          .title('Explainers')
                          .filter('_type == "article" && articleType == "explainer"')
                      ),
                    S.listItem()
                      .title('🧮 Econometrics (S103)')
                      .child(
                        S.documentList()
                          .title('Econometrics Series')
                          .filter('_type == "article" && articleType == "econometrics"')
                      ),
                    S.listItem()
                      .title('📐 Math Economics (S104)')
                      .child(
                        S.documentList()
                          .title('Mathematical Economics')
                          .filter('_type == "article" && articleType == "math-economics"')
                      ),
                    S.listItem()
                      .title('🔬 Reading Research (S105)')
                      .child(
                        S.documentList()
                          .title('Reading Research')
                          .filter('_type == "article" && articleType == "research-guide"')
                      ),
                    S.divider(),
                    S.listItem()
                      .title('⚽ Sports Economics (S113)')
                      .child(
                        S.documentList()
                          .title('Sports Economics')
                          .filter('_type == "article" && articleType == "fun-sports"')
                      ),
                    S.listItem()
                      .title('💻 Tech Economics (S114)')
                      .child(
                        S.documentList()
                          .title('Tech Economics')
                          .filter('_type == "article" && articleType == "fun-tech"')
                      ),
                    S.listItem()
                      .title('🎬 Entertainment Econ (S115)')
                      .child(
                        S.documentList()
                          .title('Entertainment Economics')
                          .filter('_type == "article" && articleType == "fun-entertainment"')
                      ),
                    S.divider(),
                    S.listItem()
                      .title('⏳ QA Pending')
                      .child(
                        S.documentList()
                          .title('Articles Awaiting QA')
                          .filter('_type == "article" && qaStatus == "pending"')
                      ),
                    S.listItem()
                      .title('❌ QA Failed')
                      .child(
                        S.documentList()
                          .title('Failed QA — Needs Fix')
                          .filter('_type == "article" && qaStatus == "failed"')
                      ),
                    S.listItem()
                      .title('📋 All Articles')
                      .child(S.documentTypeList('article').title('All Articles')),
                  ])
              ),

            S.divider(),

            // ── CATEGORIES & CONTRIBUTORS ──────────────────────────────────
            S.documentTypeListItem('category').title('🏷️ Categories'),
            S.listItem()
              .title('👤 Contributors (S112)')
              .child(
                S.list()
                  .title('Contributors')
                  .items([
                    S.listItem()
                      .title('⏳ Pending Verification')
                      .child(
                        S.documentList()
                          .title('Pending')
                          .filter('_type == "contributor" && verified == false')
                      ),
                    S.listItem()
                      .title('✅ Verified')
                      .child(
                        S.documentList()
                          .title('Verified Contributors')
                          .filter('_type == "contributor" && verified == true')
                      ),
                    S.listItem()
                      .title('🥇 Gold / Silver')
                      .child(
                        S.documentList()
                          .title('Gold & Silver')
                          .filter('_type == "contributor" && (badgeLevel == "gold" || badgeLevel == "silver")')
                      ),
                    S.documentTypeListItem('contributor').title('All Contributors'),
                  ])
              ),

            S.divider(),

            // ── PRODUCT / DATA ─────────────────────────────────────────────
            S.documentTypeListItem('economicIndicator').title('📊 Indicators Dashboard (S107)'),

            S.divider(),

            // ── SETTINGS ──────────────────────────────────────────────────
            S.listItem()
              .title('⚙️ Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
          ]),
    }),

    // GROQ query playground — only in development
    ...(process.env.NODE_ENV === 'development' ? [visionTool()] : []),
  ],

  schema: {
    types: schemaTypes,
  },
})

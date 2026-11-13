// EconoLens Shop (added 2026-11-13).
// Products are posted from Sanity Studio as `product` documents. Until a section has
// products in Sanity, the starter list below fills it, so every section shows real titles.
// A product with no buyUrl shows a "Coming soon" button instead of a broken link.

import { sanityClient } from '@/lib/sanity'

export type ShopSectionId = 'exam-notes' | 'templates' | 'project-reports' | 'thesis-support'

export interface ShopSection {
  id: ShopSectionId
  title: string
  kicker: string
  blurb: string
}

export const SHOP_SECTIONS: ShopSection[] = [
  {
    id: 'exam-notes',
    title: 'Exam Notes',
    kicker: 'UGC-NET · RBI Grade B · IES · M.A.',
    blurb: 'Concise, exam-focused notes written by economists, with diagrams, a formula sheet and practice MCQs with worked answers.',
  },
  {
    id: 'templates',
    title: 'Excel Templates & Planners',
    kicker: 'Ready to use · No macros',
    blurb: 'Working spreadsheets for loans, savings goals, budgets and project finance. Change the yellow cells and everything else updates.',
  },
  {
    id: 'project-reports',
    title: 'Project Reports (DPR)',
    kicker: 'For bank loans and subsidy schemes',
    blurb: 'Detailed project reports for small manufacturing, dairy, solar and food-processing units, with full financial projections.',
  },
  {
    id: 'thesis-support',
    title: 'Thesis Data Analysis',
    kicker: 'For M.Phil. and Ph.D. researchers',
    blurb: 'Help running and interpreting your econometric analysis: regression, time series, panel data and diagnostic tests.',
  },
]

export interface Product {
  _id: string
  title: string
  slug: string
  section: ShopSectionId
  tagline: string
  description?: string
  includes?: string[]
  audience?: string
  format?: string
  price?: number
  priceNote?: string
  buyUrl?: string
  ctaLabel?: string
  coverUrl?: string
  coverAlt?: string
  featured?: boolean
  order?: number
}

export const STARTER_PRODUCTS: Product[] = [
  {
    _id: 'starter-consumer-behaviour',
    title: 'Theory of Consumer Behaviour and Demand',
    slug: 'exam-notes-consumer-behaviour-demand',
    section: 'exam-notes',
    tagline: 'Microeconomics Part A: utility, indifference curves, Slutsky, duality and elasticity, with 25 MCQs.',
    description:
      'Everything examiners ask about consumer theory in one place: cardinal and ordinal utility, consumer equilibrium, Hicks and Slutsky decompositions, revealed preference, Roy’s identity and Shephard’s lemma, elasticities and their aggregation rules, and consumer surplus with CV and EV.',
    includes: ['10 pages of exam-focused notes', '4 diagrams', 'One-page formula sheet', '25 MCQs with worked answers'],
    audience: 'UGC-NET Economics, RBI Grade B, IES and M.A. Economics students',
    format: 'PDF · 10 pages',
    price: 99,
    priceNote: 'Launch price',
    ctaLabel: 'Buy PDF',
    order: 1,
    featured: true,
  },
  {
    _id: 'starter-dpr-model',
    title: 'DPR Financial Model for Small Units',
    slug: 'template-dpr-financial-model',
    section: 'templates',
    tagline: 'Project cost, means of finance, 5-year projections, DSCR, break-even and IRR in one workbook.',
    description:
      'The financial core of a bank-ready project report. Enter your project cost, loan terms, capacity, prices and fixed costs; the model builds the profit and loss projections, loan and depreciation schedules, DSCR, break-even utilisation and an approximate project IRR.',
    includes: ['Inputs sheet with every assumption labelled', '5-year projections', 'Term-loan and depreciation schedules', 'DSCR, break-even and IRR summary', 'Chart of sales, EBITDA and profit'],
    audience: 'Entrepreneurs, consultants and CA/CS students preparing project reports',
    format: 'Excel (.xlsx)',
    price: 299,
    ctaLabel: 'Buy template',
    order: 1,
    featured: true,
  },
  {
    _id: 'starter-emi',
    title: 'Loan EMI Planner with Prepayment',
    slug: 'template-loan-emi-planner',
    section: 'templates',
    tagline: 'Your EMI, the full repayment schedule, and how much a monthly prepayment saves.',
    includes: ['Monthly EMI and total interest', '360-month schedule', 'Prepayment savings and new loan tenure', 'Balance chart'],
    format: 'Excel (.xlsx)',
    price: 49,
    ctaLabel: 'Buy template',
    order: 2,
  },
  {
    _id: 'starter-sip',
    title: 'SIP Goal Planner',
    slug: 'template-sip-goal-planner',
    section: 'templates',
    tagline: 'How much to invest each month to reach a goal after inflation, with optional step-up.',
    includes: ['Inflation-adjusted goal value', 'Required monthly SIP, flat or step-up', 'Year-by-year growth table and chart'],
    format: 'Excel (.xlsx)',
    price: 49,
    ctaLabel: 'Buy template',
    order: 3,
  },
  {
    _id: 'starter-budget',
    title: 'Monthly Household Budget (50/30/20)',
    slug: 'template-monthly-budget-planner',
    section: 'templates',
    tagline: 'Plan against actual spending, with an automatic 50/30/20 check.',
    includes: ['Planned vs actual by category', 'Needs / wants / savings split', 'Chart against the 50/30/20 guide'],
    format: 'Excel (.xlsx)',
    price: 49,
    ctaLabel: 'Buy template',
    order: 4,
  },
  {
    _id: 'starter-dpr-service',
    title: 'Detailed Project Report for a Bank Loan',
    slug: 'service-detailed-project-report',
    section: 'project-reports',
    tagline: 'A complete, bank-ready DPR for dairy, solar, food processing or small manufacturing units.',
    description:
      'We prepare the full report: project background, market assessment, technical details, project cost and means of finance, five to seven years of financial projections, DSCR, break-even analysis and sensitivity. Prepared by an economist with project-report experience across dairy, solar and food processing.',
    includes: ['Market and technical sections', 'Project cost and means of finance', 'Financial projections with DSCR and break-even', 'Editable Excel model with the report'],
    audience: 'Entrepreneurs applying for term loans or government schemes',
    format: 'Service · report in PDF and Word',
    priceNote: 'Quoted per project',
    ctaLabel: 'Request a quote',
    order: 1,
    featured: true,
  },
  {
    _id: 'starter-thesis',
    title: 'Econometric Analysis Support',
    slug: 'service-thesis-data-analysis',
    section: 'thesis-support',
    tagline: 'Help running, checking and interpreting the econometrics in your thesis.',
    description:
      'Support with data preparation, model choice and diagnostic testing for regression, time series (ARIMA, unit roots, cointegration) and panel data, and with reading the results correctly. The research, writing and conclusions remain yours.',
    includes: ['Model selection and diagnostics', 'Results tables and interpretation notes', 'One review call'],
    audience: 'M.Phil. and Ph.D. researchers in economics, commerce and allied fields',
    format: 'Service',
    priceNote: 'Quoted per project',
    ctaLabel: 'Ask about your project',
    order: 1,
  },
]

const PRODUCT_QUERY = `*[_type == "product" && published != false] | order(order asc, _createdAt desc){
  _id, title, "slug": slug.current, section, tagline, description, includes, audience, format,
  price, priceNote, buyUrl, ctaLabel, featured, order,
  "coverUrl": coverImage.asset->url, "coverAlt": coverImage.alt
}`

/** Sanity products, with each section that has none in Sanity filled from the starter list. */
export async function getProducts(): Promise<Product[]> {
  let fromCms: Product[] = []
  try {
    fromCms = (await sanityClient.fetch(PRODUCT_QUERY, {}, { next: { revalidate: 600 } })) || []
  } catch {
    fromCms = []
  }
  const sectionsWithCms = new Set(fromCms.map((p) => p.section))
  const starters = STARTER_PRODUCTS.filter((p) => !sectionsWithCms.has(p.section))
  return [...fromCms.filter((p) => p.slug), ...starters]
}

export async function getProduct(slug: string): Promise<Product | null> {
  const all = await getProducts()
  return all.find((p) => p.slug === slug) || null
}

export function formatPrice(p: Product): string {
  if (typeof p.price === 'number') return p.price === 0 ? 'Free' : `₹${p.price.toLocaleString('en-IN')}`
  return p.priceNote || 'Price on request'
}

export const SHOP_EMAIL = 'contact@econolens.co.in'

/** Services without a buy link open an email to EconoLens with the product named in the subject. */
export function actionFor(p: Product): { href: string | null; label: string; external: boolean } {
  if (p.buyUrl) return { href: p.buyUrl, label: p.ctaLabel || 'Buy now', external: true }
  if (p.section === 'project-reports' || p.section === 'thesis-support') {
    return { href: `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent('Enquiry: ' + p.title)}`, label: p.ctaLabel || 'Enquire', external: false }
  }
  return { href: null, label: 'Coming soon', external: false }
}

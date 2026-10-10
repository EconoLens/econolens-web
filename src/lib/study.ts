// Study curriculum: the four tracks and every planned topic, in teaching order.
// A topic shows as a full card only when a Sanity article with its `slug` is
// live (category "study", qaStatus "passed"); otherwise it is listed under
// "Coming next". Each card leads with the reader's question, not the article
// title — the title becomes the subtitle (design locked 2026-10-10).

export type Cover =
  | { kind: 'text'; text: string }
  | { kind: 'wave' } // business cycle
  | { kind: 'cross' } // supply and demand

export interface Topic {
  label: string
  slug: string
  level: 'Foundations' | 'Core' | 'Advanced' | 'Methods'
  question?: string
  cover?: Cover
  caption?: string
  learn?: string[]
}

export interface Track {
  id: string
  number: string
  title: string
  blurb: string
  topics: Topic[]
}

export const TRACKS: Track[] = [
  {
    id: 'macro',
    number: '01',
    title: 'Macroeconomics',
    blurb: 'How whole economies grow, stall and recover — and what governments and central banks do about it.',
    topics: [
      {
        label: 'GDP & National Accounts',
        slug: 'study-understanding-gdp-explained',
        level: 'Foundations',
        question: 'What does GDP actually measure?',
        cover: { kind: 'text', text: 'Y = C + I + G + (X − M)' },
        caption: 'The four parts that add up to a country’s GDP',
        learn: ['The three ways to count GDP, and why they give the same answer', 'Why unpaid work and pollution never show up in the number'],
      },
      {
        label: 'Inflation & Price Theory',
        slug: 'study-understanding-inflation-explained',
        level: 'Foundations',
        question: 'Why do prices keep rising?',
        cover: { kind: 'text', text: 'π = (P₁ − P₀) ÷ P₀' },
        caption: 'Inflation is the percentage change in the price level',
        learn: ['How a price index tracks a basket of goods', 'Demand-pull vs cost-push inflation'],
      },
      {
        label: 'Monetary Policy',
        slug: 'study-monetary-policy-explained',
        level: 'Core',
        question: 'How does a central bank steer the economy?',
        cover: { kind: 'text', text: 'Rate ↑ → Borrowing ↓ → Prices ↓' },
        caption: 'The chain from a rate decision to inflation',
        learn: ['The four channels a rate change travels through', 'Rules versus discretion: the open debate'],
      },
      {
        label: 'Business Cycles',
        slug: 'study-business-cycles-explained',
        level: 'Core',
        question: 'Why do economies boom and then slow down?',
        cover: { kind: 'wave' },
        caption: 'Expansion, peak, contraction, trough',
        learn: ['Why no single number tells you the phase', 'What the yield curve warns about'],
      },
      {
        label: 'Fiscal Policy & Multipliers',
        slug: 'study-fiscal-policy-multipliers-explained',
        level: 'Core',
        question: 'Does government spending really grow the economy?',
        cover: { kind: 'text', text: 'k = 1 ÷ (1 − MPC)' },
        caption: 'The simple spending multiplier',
        learn: ['Why multipliers are bigger in recessions', 'What actually makes debt sustainable'],
      },
      {
        label: 'Exchange Rates & Open Economy',
        slug: 'study-exchange-rates-open-economy-explained',
        level: 'Advanced',
        question: 'What decides the value of a currency?',
        cover: { kind: 'text', text: 'Fixed rate · Free capital · Own policy — pick two' },
        caption: 'The open-economy trilemma',
        learn: ['Why a weaker currency is good and bad news', 'The trilemma no country escapes'],
      },
    ],
  },
  {
    id: 'micro',
    number: '02',
    title: 'Microeconomics',
    blurb: 'How buyers, sellers and firms make choices — and how prices come out of those choices.',
    topics: [
      {
        label: 'Supply, Demand & Markets',
        slug: 'study-supply-demand-markets-explained',
        level: 'Foundations',
        question: 'Who really sets the price of things?',
        cover: { kind: 'cross' },
        caption: 'Where the two curves cross, the price settles',
        learn: ['Equilibrium in one picture', 'Elasticity, and why taxes hit some goods harder'],
      },
      { label: 'Elasticity', slug: 'study-elasticity-explained', level: 'Foundations' },
      { label: 'Market Structures', slug: 'study-market-structures-explained', level: 'Core' },
      { label: 'Game Theory', slug: 'study-game-theory-explained', level: 'Core' },
      { label: 'Information Economics', slug: 'study-information-economics-explained', level: 'Advanced' },
      { label: 'Welfare Economics', slug: 'study-welfare-economics-explained', level: 'Advanced' },
    ],
  },
  {
    id: 'econometrics',
    number: '03',
    title: 'Econometrics',
    blurb: 'The toolkit economists use to test ideas against real data.',
    topics: [
      {
        label: 'OLS Regression',
        slug: 'study-ols-regression-explained',
        level: 'Methods',
        question: 'How do economists measure the effect of one thing on another?',
        cover: { kind: 'text', text: 'ŷ = β₀ + β₁x' },
        caption: 'The fitted regression line',
        learn: ['What “least squares” actually minimises', 'The four conditions that make the estimate reliable'],
      },
      { label: 'Time Series Analysis', slug: 'study-time-series-explained', level: 'Methods' },
      { label: 'Panel Data Methods', slug: 'study-panel-data-explained', level: 'Methods' },
      { label: 'Instrumental Variables', slug: 'study-instrumental-variables-explained', level: 'Advanced' },
      { label: 'Difference-in-Differences', slug: 'study-difference-in-differences-explained', level: 'Advanced' },
      { label: 'ARIMA & GARCH', slug: 'study-arima-garch-explained', level: 'Advanced' },
    ],
  },
  {
    id: 'international',
    number: '04',
    title: 'International',
    blurb: 'How countries trade, borrow and invest across borders.',
    topics: [
      { label: 'Comparative Advantage', slug: 'study-comparative-advantage-explained', level: 'Foundations' },
      { label: 'Balance of Payments', slug: 'study-balance-of-payments-explained', level: 'Core' },
      { label: 'Trade Policy & Tariffs', slug: 'study-trade-policy-tariffs-explained', level: 'Core' },
      { label: 'Capital Flows & FDI', slug: 'study-capital-flows-fdi-explained', level: 'Core' },
      { label: 'Purchasing Power Parity', slug: 'study-purchasing-power-parity-explained', level: 'Advanced' },
      { label: 'Development Finance', slug: 'study-development-finance-explained', level: 'Advanced' },
    ],
  },
]

/** Order in which a guide is chosen for the "Start here" spot. */
export const START_HERE_ORDER = [
  'study-understanding-gdp-explained',
  'study-understanding-inflation-explained',
  'study-supply-demand-markets-explained',
  'study-ols-regression-explained',
]

export function readingMinutes(words?: number): number | null {
  if (!words || words < 50) return null
  return Math.max(2, Math.round(words / 220))
}

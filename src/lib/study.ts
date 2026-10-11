// Study curriculum: ten tracks in three groups, and every planned topic, in teaching order.
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

export type TrackGroup = 'foundations' | 'advanced' | 'applied'

export const GROUPS: { id: TrackGroup; title: string; blurb: string }[] = [
  { id: 'foundations', title: 'Foundations', blurb: 'The core toolkit every economist builds on.' },
  { id: 'advanced', title: 'Advanced theory', blurb: 'The graduate-level models behind modern research and policy.' },
  { id: 'applied', title: 'Applied fields', blurb: 'Economics at work on the questions shaping this century.' },
]

export interface Track {
  id: string
  group: TrackGroup
  number: string
  title: string
  blurb: string
  topics: Topic[]
}

export const TRACKS: Track[] = [
  {
    id: 'micro',
    group: 'foundations',
    number: '01',
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
    id: 'macro',
    group: 'foundations',
    number: '02',
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
    id: 'mathematical',
    group: 'foundations',
    number: '03',
    title: 'Mathematical Economics',
    blurb: 'The mathematics that turns economic ideas into precise, testable models.',
    topics: [
      { label: 'Optimisation & Lagrange Multipliers', slug: 'study-optimisation-lagrange-explained', level: 'Methods' },
      { label: 'Comparative Statics', slug: 'study-comparative-statics-explained', level: 'Methods' },
      { label: 'Linear Algebra for Economists', slug: 'study-linear-algebra-economists-explained', level: 'Methods' },
      { label: 'Difference & Differential Equations', slug: 'study-difference-differential-equations-explained', level: 'Advanced' },
      { label: 'Dynamic Optimisation', slug: 'study-dynamic-optimisation-explained', level: 'Advanced' },
      { label: 'Fixed Points & Existence of Equilibrium', slug: 'study-fixed-points-equilibrium-explained', level: 'Advanced' },
    ],
  },
  {
    id: 'econometrics',
    group: 'foundations',
    number: '04',
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
      {
        label: 'Time Series Analysis',
        slug: 'study-time-series-explained',
        level: 'Methods',
        question: 'Why can two unrelated trends look perfectly correlated?',
        cover: { kind: 'text', text: 'yₜ = c + φyₜ₋₁ + εₜ' },
        caption: 'The AR(1) model: stationary only when |φ| < 1',
        learn: ['Stationarity, unit roots and the Dickey–Fuller test', 'Cointegration: real long-run relationships between trends'],
      },
      { label: 'Panel Data Methods', slug: 'study-panel-data-explained', level: 'Methods' },
      { label: 'Instrumental Variables', slug: 'study-instrumental-variables-explained', level: 'Advanced' },
      {
        label: 'Difference-in-Differences',
        slug: 'study-difference-in-differences-explained',
        level: 'Advanced',
        question: 'How do economists measure what a policy actually did?',
        cover: { kind: 'text', text: 'δ = ΔTreated − ΔControl' },
        caption: 'Change in the treated group minus change in the control group',
        learn: ['The New Jersey minimum wage natural experiment', 'Parallel trends and the regression form'],
      },
      { label: 'ARIMA & GARCH', slug: 'study-arima-garch-explained', level: 'Advanced' },
    ],
  },
  {
    id: 'advanced-micro',
    group: 'advanced',
    number: '05',
    title: 'Advanced Microeconomics',
    blurb: 'How rational choice, markets and incentives work once the simplifying assumptions are lifted.',
    topics: [
      { label: 'Consumer Theory & Duality', slug: 'study-consumer-theory-duality-explained', level: 'Advanced' },
      { label: 'Producer Theory & Cost Functions', slug: 'study-producer-theory-explained', level: 'Advanced' },
      { label: 'General Equilibrium & Welfare Theorems', slug: 'study-general-equilibrium-explained', level: 'Advanced' },
      { label: 'Choice under Uncertainty', slug: 'study-choice-under-uncertainty-explained', level: 'Advanced' },
      { label: 'Mechanism Design & Auctions', slug: 'study-mechanism-design-explained', level: 'Advanced' },
      { label: 'Behavioural Economics', slug: 'study-behavioural-economics-explained', level: 'Core' },
    ],
  },
  {
    id: 'advanced-macro',
    group: 'advanced',
    number: '06',
    title: 'Advanced Macroeconomics',
    blurb: 'The dynamic models central banks and researchers use to explain growth, cycles and policy.',
    topics: [
      { label: 'Solow & Endogenous Growth', slug: 'study-growth-models-explained', level: 'Advanced' },
      { label: 'Ramsey & Overlapping Generations', slug: 'study-ramsey-olg-explained', level: 'Advanced' },
      { label: 'Consumption & Investment Theory', slug: 'study-consumption-investment-explained', level: 'Advanced' },
      { label: 'Real Business Cycle Models', slug: 'study-real-business-cycle-explained', level: 'Advanced' },
      { label: 'New Keynesian Model & DSGE', slug: 'study-new-keynesian-dsge-explained', level: 'Advanced' },
      { label: 'Unemployment & Search Models', slug: 'study-search-unemployment-explained', level: 'Advanced' },
    ],
  },
  {
    id: 'international',
    group: 'applied',
    number: '07',
    title: 'International Economics',
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
  {
    id: 'health',
    group: 'applied',
    number: '08',
    title: 'Health Economics',
    blurb: 'How societies pay for, ration and value health and healthcare.',
    topics: [
      { label: 'Demand for Health & Healthcare', slug: 'study-demand-for-health-explained', level: 'Foundations' },
      { label: 'Health Insurance & Moral Hazard', slug: 'study-health-insurance-explained', level: 'Core' },
      { label: 'Health Financing Systems', slug: 'study-health-financing-explained', level: 'Core' },
      { label: 'Cost-Effectiveness Analysis', slug: 'study-cost-effectiveness-explained', level: 'Methods' },
      { label: 'Pharmaceutical Markets & Pricing', slug: 'study-pharmaceutical-markets-explained', level: 'Advanced' },
      { label: 'The Economics of Pandemics', slug: 'study-pandemic-economics-explained', level: 'Advanced' },
    ],
  },
  {
    id: 'agricultural',
    group: 'applied',
    number: '09',
    title: 'Agricultural Economics',
    blurb: 'The economics of food, farming and the land that feeds the world.',
    topics: [
      { label: 'Farm Production & Productivity', slug: 'study-farm-productivity-explained', level: 'Foundations' },
      { label: 'Agricultural Prices & Volatility', slug: 'study-agricultural-prices-explained', level: 'Core' },
      { label: 'Food Security', slug: 'study-food-security-explained', level: 'Core' },
      { label: 'Agricultural Policy & Subsidies', slug: 'study-agricultural-policy-explained', level: 'Core' },
      { label: 'Land, Water & Irrigation', slug: 'study-land-water-irrigation-explained', level: 'Advanced' },
      { label: 'Agricultural Trade & Value Chains', slug: 'study-agricultural-trade-explained', level: 'Advanced' },
    ],
  },
  {
    id: 'environmental',
    group: 'applied',
    number: '10',
    title: 'Environmental Economics',
    blurb: 'Putting a price on pollution, nature and a changing climate.',
    topics: [
      { label: 'Externalities & Pigouvian Taxes', slug: 'study-externalities-pigouvian-taxes-explained', level: 'Foundations' },
      { label: 'Carbon Pricing & Emissions Trading', slug: 'study-carbon-pricing-explained', level: 'Core' },
      { label: 'Valuing the Environment', slug: 'study-valuing-environment-explained', level: 'Core' },
      { label: 'Climate Change Economics', slug: 'study-climate-economics-explained', level: 'Core' },
      { label: 'Natural Resource Economics', slug: 'study-natural-resources-explained', level: 'Advanced' },
      { label: 'The Economics of the Energy Transition', slug: 'study-energy-transition-explained', level: 'Advanced' },
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

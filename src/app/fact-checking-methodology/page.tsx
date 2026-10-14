import Link from 'next/link'
import { PolicyBody, PolicyHeader, PolicySection, linkStyle, listStyle } from '@/components/PolicyPage'

export const metadata = {
  title: 'Fact-Checking Methodology — EconoLens',
  description:
    'How EconoLens checks every figure, chart and claim before publication: primary sources only, numbers traced to the release, working shown, and dated corrections.',
  alternates: { canonical: 'https://www.econolens.co.in/fact-checking-methodology' },
}

export default function FactCheckingMethodologyPage() {
  return (
    <>
      <PolicyHeader
        eyebrow="Standards"
        title="Fact-Checking Methodology"
        intro={
          <p style={{ margin: 0 }}>
            The step-by-step checks every EconoLens article goes through before it is published. This page sets out how we
            apply our <Link href="/editorial-policy" style={linkStyle}>Editorial Policy</Link> in practice.
          </p>
        }
      />
      <PolicyBody>
        <PolicySection title="1. Primary sources only">
          <p>
            Every article starts from an official release: a central bank statement, a national statistics office bulletin, or a
            report from an international institution such as the IMF, World Bank, WTO, OECD or BIS. Academic papers are used for
            Research pieces and are always named and linked.
          </p>
          <p>
            News reports from other publishers are never used as the source of a figure. Each article lists its primary sources,
            with links, under &ldquo;Primary Sources&rdquo; at the end of the page.
          </p>
        </PolicySection>

        <PolicySection title="2. Every number traced to the release">
          <ul style={listStyle}>
            <li>Each figure in the article is matched against the source document: the value, the unit, the period and whether it is seasonally adjusted.</li>
            <li>Where a second official dataset carries the same series, such as the Federal Reserve Bank of St. Louis (FRED) database, we cross-check the numbers against it.</li>
            <li>Any figure we calculate ourselves, such as a percentage-point change, a ratio or a back-calculated earlier value, is shown with its working in a &ldquo;Data and working&rdquo; section, so readers can repeat the arithmetic.</li>
            <li>Where rounding in the published figures makes our calculation differ slightly from the official one, we say so and give the official figure.</li>
          </ul>
        </PolicySection>

        <PolicySection title="3. Charts and tables">
          <p>
            Charts and tables are built from the underlying data, never copied as images from another publication. Each chart
            states its source and units, and live charts on the site draw directly from the series on our{' '}
            <Link href="/indicators" style={linkStyle}>Indicators</Link> pages. Where a chart shows a trend, the data table behind it
            is available beside it.
          </p>
        </PolicySection>

        <PolicySection title="4. Facts kept separate from analysis">
          <p>
            What the source says and what we think it means are kept apart. Interpretation sits in a clearly headed
            &ldquo;EconoLens Analysis&rdquo; section. Where economists reading the same data reach different conclusions, we set out
            the competing readings rather than presenting one as settled.
          </p>
        </PolicySection>

        <PolicySection title="5. Original wording">
          <p>
            Articles are written in our own words. Before publication, each article is compared against the source documents it
            cites, and any passage that repeats a source&rsquo;s wording is rewritten, apart from official titles, names and quoted
            figures. Direct quotations are kept short, marked with quotation marks and attributed.
          </p>
        </PolicySection>

        <PolicySection title="6. Final review before publication">
          <p>
            No article is published automatically. Each one is checked against this list and approved by the editor before it goes
            live. Anything that cannot be confirmed from a primary source is removed or clearly attributed as a view rather than a
            fact.
          </p>
        </PolicySection>

        <PolicySection title="7. When we get it wrong">
          <p>
            Errors that change the meaning of an article are corrected in the text and logged with a date at the end of the
            article and on our <Link href="/corrections" style={linkStyle}>Corrections</Link> page. To report a possible error, use the{' '}
            <Link href="/contact" style={linkStyle}>Contact</Link> page and include the article link and the specific issue.
          </p>
        </PolicySection>

        <PolicySection title="What this does not cover">
          <p>
            EconoLens publishes economics analysis and education. It is not investment advice; see the{' '}
            <Link href="/disclaimer" style={linkStyle}>Disclaimer</Link>.
          </p>
        </PolicySection>
      </PolicyBody>
    </>
  )
}

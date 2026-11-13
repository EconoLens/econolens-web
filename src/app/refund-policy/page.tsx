import type { Metadata } from 'next'
import PolicyPage, { H } from '../shop/PolicyPage'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Refunds and cancellations for EconoLens Shop purchases: digital notes and templates, and project-report and data-analysis services.',
  alternates: { canonical: 'https://www.econolens.co.in/refund-policy' },
}

const MAIL = <a href="mailto:contact@econolens.co.in" style={{ color: 'var(--accent)' }}>contact@econolens.co.in</a>

export default function RefundPolicyPage() {
  return (
    <PolicyPage kicker="Shop policies" title="Refund & Cancellation Policy" updated="13 November 2026">
      <p>
        This policy covers purchases from the EconoLens Shop at econolens.co.in/shop, operated by Econolens Media and Technology.
        Please read it before you pay. For any request, write to {MAIL} with your name, the product, the payment reference and the date of payment.
      </p>

      <H>Digital products (exam notes, Excel templates)</H>
      <p>
        Digital products are delivered as files and cannot be returned once downloaded, so we do not offer refunds for a change of mind.
        You are entitled to a full refund or a replacement file if:
      </p>
      <ul style={{ paddingLeft: '20px' }}>
        <li>you paid but did not receive the file within 24 hours and we cannot deliver it after you contact us;</li>
        <li>the file is corrupted, will not open, or is materially different from its description on the product page;</li>
        <li>you were charged twice for the same order.</li>
      </ul>
      <p>Please raise these issues within 7 days of payment.</p>

      <H>Services (project reports, thesis data analysis)</H>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Each service is confirmed by email with its scope, price, delivery date and any advance payable.</li>
        <li>If you cancel before work starts, the advance is refunded in full.</li>
        <li>If you cancel after work has started, we refund the advance minus the share of work already completed, as set out in the confirmation email.</li>
        <li>If we cannot deliver the agreed scope, we refund the amount paid for the undelivered part.</li>
        <li>Once the final deliverable has been sent and accepted, the fee is not refundable.</li>
      </ul>

      <H>How refunds are paid</H>
      <p>
        Approved refunds are made to the original payment method within 5–7 working days of approval. Your bank or payment app may take a few
        more days to show the credit. We do not charge any fee for processing a refund.
      </p>

      <H>Contact</H>
      <p>Email {MAIL}. We reply within two working days.</p>
    </PolicyPage>
  )
}

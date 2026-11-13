import type { Metadata } from 'next'
import PolicyPage, { H } from '../shop/PolicyPage'

export const metadata: Metadata = {
  title: 'Delivery Policy',
  description: 'How and when EconoLens Shop purchases are delivered: digital files by email or download link, and services on the agreed timeline.',
  alternates: { canonical: 'https://www.econolens.co.in/delivery-policy' },
}

const MAIL = <a href="mailto:contact@econolens.co.in" style={{ color: 'var(--accent)' }}>contact@econolens.co.in</a>

export default function DeliveryPolicyPage() {
  return (
    <PolicyPage kicker="Shop policies" title="Delivery Policy" updated="13 November 2026">
      <p>
        Everything sold in the EconoLens Shop is delivered electronically. We do not ship physical goods, so there are no shipping charges.
      </p>

      <H>Digital products</H>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Exam notes are delivered as PDF files and templates as Excel (.xlsx) files.</li>
        <li>After payment you receive the file, or a download link, on the email address or phone number you gave at checkout, usually within minutes and no later than 24 hours.</li>
        <li>If nothing arrives within 24 hours, check your spam folder, then write to {MAIL} with your payment reference.</li>
        <li>Files are licensed for your personal use. Please do not share or resell them.</li>
      </ul>

      <H>Services</H>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Project reports and thesis data-analysis work are delivered by email on the date agreed in your confirmation email.</li>
        <li>Delivery times depend on scope and on receiving the information we need from you; we tell you before work starts.</li>
      </ul>

      <H>Contact</H>
      <p>Email {MAIL}. We reply within two working days.</p>
    </PolicyPage>
  )
}

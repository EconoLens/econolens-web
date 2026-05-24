import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | EconoLens",
  description: "Terms of service for EconoLens.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <header className="border-b border-neutral-200 pb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-neutral-500">Last updated: May 2026</p>
      </header>
      <div className="mt-10 space-y-8 text-base leading-relaxed text-neutral-700">
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">Acceptance of terms</h2>
          <p>
            By accessing or using EconoLens (&quot;the Service&quot;), you agree to be bound by
            these Terms of Service. If you do not agree, please do not use the Service.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">Use of the Service</h2>
          <p>
            EconoLens provides AI-powered economic research and news aggregation for informational
            purposes only. You must not use the Service for any unlawful purpose or in a way that
            violates these terms.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">Free and paid tiers</h2>
          <p>
            Free accounts receive up to 200-word AI research answers per query. Pro accounts (paid)
            receive extended 600-word answers. We reserve the right to change pricing and tier
            limits with reasonable notice.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">Disclaimer</h2>
          <p>
            Content on EconoLens is for informational purposes only and does not constitute
            financial, investment, or legal advice. We make no warranties about the accuracy or
            completeness of AI-generated responses.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, EconoLens shall not be liable for any indirect,
            incidental, or consequential damages arising from your use of the Service.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">Changes to terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the Service after changes
            constitutes acceptance of the updated terms.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href="mailto:khagankp@gmail.com" className="text-blue-600 underline">
              khagankp@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

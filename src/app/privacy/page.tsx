import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | EconoLens",
  description: "Privacy policy for EconoLens.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <header className="border-b border-neutral-200 pb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-neutral-500">Last updated: June 2026</p>
      </header>
      <div className="mt-10 space-y-8 text-base leading-relaxed text-neutral-700">
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">Information we collect</h2>
          <p>
            When you sign up, we collect your email address and name via Clerk authentication. We
            also collect the queries you submit to the research tool and your subscription status.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">How we use your information</h2>
          <p>
            We use your information to provide and improve EconoLens, including personalising your
            experience and enforcing usage limits. We do not sell your personal data to third parties.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">AI research queries</h2>
          <p>
            Queries are cached in an anonymised form using a content hash. Raw query text is sent to
            Anthropic for processing and is governed by Anthropic&apos;s Privacy Policy.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">Third-party services</h2>
          <p>
            EconoLens relies on: Clerk (authentication), Supabase (database), Vercel (hosting),
            Anthropic (AI), and Razorpay (payments). Each service is governed by its own privacy
            policy.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">Data retention</h2>
          <p>
            We retain your account data for as long as your account is active. You may request
            deletion of your account and associated data at any time by contacting us.
          </p>
        </section>
        <section id="cookies">
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">Cookie Policy</h2>
          <p>
            EconoLens uses essential cookies to keep you signed in and remember your session
            preferences. We also use analytics cookies to understand how visitors use the site,
            helping us improve the experience over time. Non-essential cookies can be disabled in
            your browser settings at any time without affecting core functionality.
          </p>
          <p className="mt-3">
            <strong>Essential cookies</strong> are required for the site to function — they manage
            authentication sessions and security tokens. <strong>Analytics cookies</strong> collect
            anonymised usage data (pages visited, time on site) to help us understand audience
            behaviour. We do not use advertising or tracking cookies.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">Contact</h2>
          <p>
            For privacy-related questions email{" "}
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

import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "₹0",
    cadence: "forever",
    description:
      "Read the news, sample the research, and get a feel for EconoLens.",
    features: [
      "Layer 1 of every article (≈200 words)",
      "5 AI research queries per day",
      "Weekly newsletter",
    ],
    cta: { label: "Continue free", href: "/sign-up" },
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    cadence: "per month",
    description:
      "Full long-form analysis, unlimited research, and the subscriber dashboard.",
    features: [
      "Layer 2 of every article (≈600 words)",
      "Unlimited AI research queries",
      "FRED + World Bank indicators dashboard",
      "Saved articles and history",
    ],
    cta: { label: "Subscribe — ₹499/mo", href: "/api/checkout" },
    highlight: true,
  },
];

export default function SubscribePage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-neutral-200 bg-gradient-to-b from-neutral-50 to-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Pricing
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            One plan. Built for serious readers of economics.
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Start free. Upgrade when you want the full picture.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={
                tier.highlight
                  ? "flex flex-col rounded-lg border-2 border-neutral-900 bg-white p-8 shadow-sm"
                  : "flex flex-col rounded-lg border border-neutral-200 bg-white p-8"
              }
            >
              <h2 className="text-sm font-medium uppercase tracking-wider text-neutral-500">
                {tier.name}
              </h2>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-semibold text-neutral-900">
                  {tier.price}
                </span>
                <span className="text-sm text-neutral-500">{tier.cadence}</span>
              </div>
              <p className="mt-4 text-sm text-neutral-600">{tier.description}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-neutral-800">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-neutral-900" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.cta.href}
                className={
                  tier.highlight
                    ? "mt-8 inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
                    : "mt-8 inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                }
              >
                {tier.cta.label}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-neutral-500">
          Payments via Razorpay (India) and Stripe (international). Cancel anytime
          from your dashboard.
        </p>
      </section>
    </main>
  );
}

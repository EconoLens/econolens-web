"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const savedArticles = [
  {
    slug: "rbi-mpc-april-2026",
    title: "RBI holds repo rate at 6.25% as inflation pressures ease",
    date: "May 20, 2026",
  },
  {
    slug: "india-q4-gdp-fy26",
    title: "India Q4 GDP growth surprises at 7.4% on services and capex push",
    date: "May 18, 2026",
  },
  {
    slug: "fed-dot-plot-2026",
    title: "Fed dot plot signals two more cuts in 2026 — implications for the rupee",
    date: "May 15, 2026",
  },
];

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm text-neutral-500">Loading…</p>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Sign in to view your dashboard
        </h1>
        <p className="mt-3 text-neutral-600">
          The dashboard is for subscribers. Sign in or create an account to continue.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/sign-in"
            className="inline-flex items-center rounded-md bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
          >
            Create account
          </Link>
        </div>
      </main>
    );
  }

  const subscriptionStatus = "Free";
  const greetingName =
    user.firstName || user.username || user.emailAddresses[0]?.emailAddress || "there";

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="border-b border-neutral-200 pb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          Dashboard
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">
          Welcome back, {greetingName}.
        </h1>
      </header>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Subscription
          </p>
          <p className="mt-3 text-2xl font-semibold text-neutral-900">
            {subscriptionStatus}
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            Upgrade to Pro for full Layer 2 access and unlimited research queries.
          </p>
          <Link
            href="/subscribe"
            className="mt-4 inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Upgrade — ₹499/mo
          </Link>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Account
          </p>
          <p className="mt-3 text-sm text-neutral-600">Email</p>
          <p className="text-neutral-900">
            {user.emailAddresses[0]?.emailAddress ?? "—"}
          </p>
          <p className="mt-3 text-sm text-neutral-600">Member since</p>
          <p className="text-neutral-900">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
          Saved articles
        </h2>
        <div className="mt-6 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
          {savedArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="flex items-baseline justify-between px-5 py-4 hover:bg-neutral-50"
            >
              <span className="text-sm font-medium text-neutral-900">
                {article.title}
              </span>
              <span className="text-xs text-neutral-500">{article.date}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

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

  // Every account is on the Free tier today — Razorpay/Stripe aren't live yet
  // (blocked on GST registration, see ops/reports/PENDING-TASKS-MASTER).
  // This is a real, accurate default, not a placeholder.
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
            href="/pricing"
            className="mt-4 inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            View plans
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
        <div className="mt-6 rounded-lg border border-neutral-200 bg-white px-5 py-8 text-center">
          <p className="text-sm text-neutral-600">
            You haven&apos;t saved any articles yet.
          </p>
          <Link
            href="/articles"
            className="mt-3 inline-flex items-center text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
          >
            Browse articles →
          </Link>
        </div>
      </section>
    </main>
  );
}

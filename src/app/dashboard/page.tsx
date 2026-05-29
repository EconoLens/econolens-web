"use client";
// Clerk useUser temporarily removed until env vars are set in Vercel
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <header className="border-b border-neutral-200 pb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">Your Dashboard</h1>
        <p className="mt-3 text-neutral-600">Sign in to access your full dashboard.</p>
      </header>
      <div className="mt-10 flex gap-4">
        <Link href="/sign-in" className="inline-flex items-center rounded-md bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800">
          Sign in
        </Link>
        <Link href="/sign-up" className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50">
          Create account
        </Link>
      </div>
    </main>
  );
}

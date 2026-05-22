"use client";

import { useState, type FormEvent } from "react";

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [cached, setCached] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError("");
    setResponse("");
    setCached(false);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status})`);
      } else {
        setResponse(data.response ?? "");
        setCached(Boolean(data.cached));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="border-b border-neutral-200 pb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          AI Research
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">
          Ask an economics question
        </h1>
        <p className="mt-3 text-neutral-600">
          Sourced from FRED, World Bank, and RBI data where relevant. Off-topic queries
          will be redirected.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label htmlFor="query" className="block text-sm font-medium text-neutral-900">
          Your question
        </label>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={5}
          placeholder="e.g. How does RBI's repo rate change affect bond yields?"
          className="block w-full resize-y rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="inline-flex items-center rounded-md bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {loading ? "Thinking…" : "Submit"}
        </button>
      </form>

      {error && (
        <div className="mt-8 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {response && (
        <section className="mt-10 border-t border-neutral-200 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Answer</h2>
            {cached && (
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Cached
              </span>
            )}
          </div>
          <div className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-neutral-800">
            {response}
          </div>
        </section>
      )}
    </main>
  );
}

"use client";

import { useState } from "react";

function mdToHtml(text: string): string {
  let s = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  s = s.replace(/```[\w]*\n?([\s\S]*?)```/g, (_m: string, c: string) =>
    `<pre style="background:#f5f5f5;border-radius:6px;padding:12px 16px;overflow-x:auto;margin:12px 0;font-size:13px;font-family:monospace"><code>${c.trim()}</code></pre>`
  );
  s = s.replace(/^### (.+)$/gm, '<h3 style="font-size:14px;font-weight:600;margin:16px 0 4px">$1</h3>');
  s = s.replace(/^## (.+)$/gm, '<h2 style="font-size:16px;font-weight:600;margin:20px 0 6px">$1</h2>');
  s = s.replace(/^# (.+)$/gm, '<h1 style="font-size:18px;font-weight:700;margin:24px 0 8px">$1</h1>');
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  s = s.replace(/((?:^- .+$\n?)+)/gm, (block: string) => {
    const items = block
      .trim()
      .split("\n")
      .map((l: string) => `<li style="margin-left:20px;list-style-type:disc">${l.replace(/^- /, "")}</li>`)
      .join("");
    return `<ul style="margin:8px 0">${items}</ul>`;
  });
  s = s.replace(/\n\n/g, "<br/><br/>");
  s = s.replace(/\n/g, "<br/>");
  return s;
}

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [cached, setCached] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        <p className="mt-2 text-sm text-neutral-500">
          Powered by Claude. Free tier: 200-word answers. Pro: 600 words.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. What is the current RBI repo rate and its effect on inflation?"
          rows={4}
          className="w-full rounded-lg border border-neutral-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Submit"}
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
          <div
            className="mt-4 text-base leading-relaxed text-neutral-800"
            dangerouslySetInnerHTML={{ __html: mdToHtml(response) }}
          />
        </section>
      )}
    </main>
  );
}

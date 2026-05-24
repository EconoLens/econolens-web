"use client";

import { useState, type FormEvent } from "react";

function mdToHtml(text: string): string {
    let s = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    // fenced code blocks
  s = s.replace(/```[\w]*\n?([\s\S]*?)```/g, (_m, c) =>
        `<pre style="background:#f5f5f5;border-radius:6px;padding:12px 16px;overflow-x:auto;margin:12px 0;font-size:13px;font-family:monospace"><code>${c.trim()}</code></pre>`
                  );
    // headings
  s = s.replace(/^### (.+)$/gm, '<h3 style="font-size:14px;font-weight:600;margin:16px 0 4px">$1</h3>');
    s = s.replace(/^## (.+)$/gm, '<h2 style="font-size:16px;font-weight:600;margin:20px 0 6px">$1</h2>');
    s = s.replace(/^# (.+)$/gm, '<h1 style="font-size:18px;font-weight:700;margin:24px 0 8px">$1</h1>');
    // bold / italic
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
    // unordered list items
  s = s.replace(/((?:^- .+$\n?)+)/gm, (block) => {
        const items = block.trim().split("\n")
          .map((l) => `<li style="margin-left:20px;list-style-type:disc">${l.replace(/^- /, "")}</li>`)
          .join("");
        return `<ul style="margin:8px 0">${items}</ul>`;
  });
    // paragraphs
  s = s.replace(/\n\n/g, '<br/><br/>');
    s = s.replace(/\n/g, "<br/>");
    return s;
}

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
                      </p>p>
                      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">
                                Ask an economics question
                      </h1>h1>
                      <p className="mt-3 text-neutral-600">
                                Sourced from FRED, World Bank, and RBI data where relevant. Off-topic queries
                                will be redirected.
                      </p>p>
              </header>header>
        
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                      <label htmlFor="query" className="block text-sm font-medium text-neutral-900">
                                Your question
                      </label>label>
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
                        {loading ? "Thinking..." : "Submit"}
                      </button>button>
              </form>form>
        
          {error && (
                  <div className="mt-8 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                  </div>div>
              )}
        
          {response && (
                  <section className="mt-10 border-t border-neutral-200 pt-8">
                            <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-neutral-900">Answer</h2>h2>
                              {cached && (
                                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                                                  Cached
                                  </span>span>
                                        )}
                            </div>div>
                            <div
                                          className="mt-4 text-base leading-relaxed text-neutral-800"
                                          dangerouslySetInnerHTML={{ __html: mdToHtml(response) }}
                                        />
                  </section>section>
              )}
        </main>main>
      );
}</main>

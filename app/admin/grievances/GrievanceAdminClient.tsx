/**
 * GrievanceAdminClient.tsx — Client component for grievance admin panel
 * Shows SLA countdown in red for grievances > 14 days old.
 */
"use client";

import { useState } from "react";
import type { Grievance } from "./page";

const TYPE_LABELS: Record<string, string> = {
  copyright_infringement: "Copyright Infringement",
  defamation: "Defamation",
  privacy_violation: "Privacy Violation",
  illegal_content: "Illegal Content",
  financial_advice_violation: "Financial Advice Violation",
  other: "Other",
};

const STATUS_COLORS: Record<string, string> = {
  received: "bg-yellow-100 text-yellow-800",
  acknowledged: "bg-blue-100 text-blue-800",
  in_review: "bg-purple-100 text-purple-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-gray-100 text-gray-700",
};

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function SLABadge({ receivedAt, status }: { receivedAt: string; status: string }) {
  if (status === "resolved" || status === "rejected") return null;
  const days = daysSince(receivedAt);
  const remaining = 15 - days;
  const isOverdue = remaining <= 0;
  const isWarning = remaining <= 3;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        isOverdue
          ? "bg-red-100 text-red-700"
          : isWarning
          ? "bg-orange-100 text-orange-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {isOverdue ? `⚠️ ${Math.abs(remaining)}d overdue` : `${remaining}d left`}
    </span>
  );
}

export default function GrievanceAdminClient({ grievances }: { grievances: Grievance[] }) {
  const [selected, setSelected] = useState<Grievance | null>(null);
  const [action, setAction] = useState<"resolve" | "reject" | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [localGrievances, setLocalGrievances] = useState(grievances);

  async function handleAction(grievanceId: string) {
    if (!action || !note.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/grievance-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grievanceId, action, note }),
      });

      if (res.ok) {
        setLocalGrievances((prev) =>
          prev.map((g) =>
            g.id === grievanceId
              ? {
                  ...g,
                  status: action === "resolve" ? "resolved" : "rejected",
                  resolution_note: note,
                  resolved_at: new Date().toISOString(),
                }
              : g
          )
        );
        setSelected(null);
        setAction(null);
        setNote("");
      }
    } finally {
      setLoading(false);
    }
  }

  const open = localGrievances.filter((g) => !["resolved", "rejected"].includes(g.status));
  const closed = localGrievances.filter((g) => ["resolved", "rejected"].includes(g.status));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Legal Grievances</h1>
            <p className="text-sm text-gray-500 mt-1">IT Rules 2021 — 15-day SLA</p>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
              {open.length} open
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              {closed.length} closed
            </span>
          </div>
        </div>

        {/* Open grievances */}
        <div className="space-y-3 mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Open</h2>
          {open.length === 0 && (
            <p className="text-gray-400 text-sm">No open grievances.</p>
          )}
          {open.map((g) => (
            <div
              key={g.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs text-gray-400">
                      {g.id.split("-")[0].toUpperCase()}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[g.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {g.status.replace("_", " ")}
                    </span>
                    <span className="text-xs text-gray-500">
                      {TYPE_LABELS[g.type] ?? g.type}
                    </span>
                    <SLABadge receivedAt={g.received_at} status={g.status} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {g.name} · {g.email}
                  </p>
                  {g.content_url && (
                    <a
                      href={g.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline truncate block"
                    >
                      {g.content_url}
                    </a>
                  )}
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{g.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setSelected(g); setAction("resolve"); setNote(""); }}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => { setSelected(g); setAction("reject"); setNote(""); }}
                    className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closed grievances */}
        {closed.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Closed</h2>
            {closed.map((g) => (
              <div key={g.id} className="bg-white border border-gray-100 rounded-xl p-4 opacity-60">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-gray-400">{g.id.split("-")[0].toUpperCase()}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[g.status] ?? ""}`}>
                    {g.status}
                  </span>
                  <span className="text-xs text-gray-500">{TYPE_LABELS[g.type] ?? g.type}</span>
                  <span className="text-xs text-gray-400">{g.name} · {g.email}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action modal */}
      {selected && action && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
              {action === "resolve" ? "Resolve Grievance" : "Reject Grievance"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {selected.name} — {TYPE_LABELS[selected.type] ?? selected.type}
            </p>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={action === "resolve" ? "Resolution note (sent to complainant)…" : "Rejection reason…"}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleAction(selected.id)}
                disabled={loading || !note.trim()}
                className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving…" : action === "resolve" ? "Mark Resolved" : "Reject"}
              </button>
              <button
                onClick={() => { setSelected(null); setAction(null); setNote(""); }}
                className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

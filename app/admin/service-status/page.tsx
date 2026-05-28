/**
 * /admin/service-status — Service & content kill switch control panel
 *
 * Shows live/offline status of all service env variables.
 * Allows toggling via Vercel API (VERCEL_TOKEN required in env).
 *
 * commit: "feat: three-level content and service kill switch"
 */
"use client";

import { useState } from "react";

const SERVICES = [
  {
    key: "COMMUNITY_LIVE",
    label: "Community Platform",
    description: "Public forums, comments, user posts",
    routes: ["/community"],
  },
  {
    key: "AI_TOOL_LIVE",
    label: "AI Economics Research Tool",
    description: "AI-powered research assistant",
    routes: ["/research", "/ai-tool"],
  },
  {
    key: "NEWS_PIPELINE_LIVE",
    label: "News Pipeline",
    description: "Automated news ingestion and publication",
    routes: ["/news", "/latest"],
  },
  {
    key: "DECODING_LIVE",
    label: "Decoding Economics",
    description: "Educational economics explainer series",
    routes: ["/decoding"],
  },
  {
    key: "NEWSLETTER_LIVE",
    label: "Newsletter System",
    description: "Email newsletter subscription and delivery",
    routes: ["/newsletter"],
  },
] as const;

type ServiceKey = (typeof SERVICES)[number]["key"];

type ServiceStatuses = Record<ServiceKey, boolean>;

// Initial statuses — read from Next.js public env (set via Vercel dashboard)
// These are the server-rendered initial values; toggling calls the Vercel API
const INITIAL_STATUSES: ServiceStatuses = {
  COMMUNITY_LIVE: process.env.NEXT_PUBLIC_COMMUNITY_LIVE === "true",
  AI_TOOL_LIVE: process.env.NEXT_PUBLIC_AI_TOOL_LIVE === "true",
  NEWS_PIPELINE_LIVE: process.env.NEXT_PUBLIC_NEWS_PIPELINE_LIVE === "true",
  DECODING_LIVE: process.env.NEXT_PUBLIC_DECODING_LIVE === "true",
  NEWSLETTER_LIVE: process.env.NEXT_PUBLIC_NEWSLETTER_LIVE === "true",
};

export default function ServiceStatusPage() {
  const [statuses, setStatuses] = useState<ServiceStatuses>(INITIAL_STATUSES);
  const [toggling, setToggling] = useState<ServiceKey | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function toggleService(key: ServiceKey, currentValue: boolean) {
    setToggling(key);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/toggle-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: !currentValue }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatuses((prev) => ({ ...prev, [key]: !currentValue }));
        setMessage({
          type: "success",
          text: `${key} set to ${!currentValue ? "LIVE" : "OFFLINE"}. Vercel will redeploy in ~30 seconds.`,
        });
      } else {
        setMessage({ type: "error", text: data.message || "Toggle failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Check VERCEL_TOKEN in env." });
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-gray-900">Service Status</h1>
          <p className="text-sm text-gray-500 mt-1">
            Toggle services live or offline. Changes update Vercel environment variables
            and trigger an automatic redeploy (~30 seconds).
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-3">
          {SERVICES.map((service) => {
            const isLive = statuses[service.key];
            const isToggling = toggling === service.key;

            return (
              <div
                key={service.key}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                        isLive ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    <span className="font-medium text-gray-900 text-sm">{service.label}</span>
                    <span
                      className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                        isLive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isLive ? "LIVE" : "OFFLINE"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{service.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Routes: {service.routes.join(", ")}
                  </p>
                </div>
                <button
                  onClick={() => toggleService(service.key, isLive)}
                  disabled={isToggling}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLive
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {isToggling ? "…" : isLive ? "Take Offline" : "Go Live"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Level 3 kill switch notice */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-amber-800 mb-1">
            Level 3 Kill Switch — Emergency Offline
          </h3>
          <p className="text-xs text-amber-700">
            To take the entire site offline immediately, set{" "}
            <code className="font-mono bg-amber-100 px-1 rounded">SITE_LIVE=false</code> in
            Vercel dashboard. This overrides all service switches and returns 503 for all routes.
            Use only in emergencies.
          </p>
        </div>
      </div>
    </div>
  );
}

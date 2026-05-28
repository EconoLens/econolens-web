/**
 * POST /api/admin/toggle-service
 * Updates a service kill-switch env variable via Vercel API and triggers redeploy.
 * Requires VERCEL_TOKEN, VERCEL_PROJECT_ID, and optionally VERCEL_TEAM_ID in env.
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const ALLOWED_KEYS = [
  "COMMUNITY_LIVE",
  "AI_TOOL_LIVE",
  "NEWS_PIPELINE_LIVE",
  "DECODING_LIVE",
  "NEWSLETTER_LIVE",
] as const;

type AllowedKey = (typeof ALLOWED_KEYS)[number];

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key, value }: { key: AllowedKey; value: boolean } = await req.json();

  if (!ALLOWED_KEYS.includes(key)) {
    return NextResponse.json({ error: "Invalid key." }, { status: 400 });
  }

  const vercelToken = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!vercelToken || !projectId) {
    return NextResponse.json(
      { error: "VERCEL_TOKEN and VERCEL_PROJECT_ID must be set in environment." },
      { status: 500 }
    );
  }

  const teamParam = teamId ? `?teamId=${teamId}` : "";

  // Upsert the env variable on Vercel
  const upsertRes = await fetch(
    `https://api.vercel.com/v10/projects/${projectId}/env/${teamParam}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value: value ? "true" : "false",
        type: "plain",
        target: ["production", "preview"],
      }),
    }
  );

  if (!upsertRes.ok) {
    // If already exists, try PATCH instead
    const upsertData = await upsertRes.json() as { error?: { code?: string }; envs?: Array<{ id: string }> };
    if (upsertData?.error?.code === "ENV_ALREADY_EXISTS" && Array.isArray(upsertData.envs)) {
      const envId = upsertData.envs[0]?.id;
      if (envId) {
        await fetch(
          `https://api.vercel.com/v10/projects/${projectId}/env/${envId}${teamParam}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${vercelToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ value: value ? "true" : "false" }),
          }
        );
      }
    }
  }

  // Trigger a new deployment to pick up the env change
  await fetch(`https://api.vercel.com/v13/deployments${teamParam}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "econolens",
      target: "production",
      source: "api",
    }),
  }).catch((err) => console.error("Redeploy trigger failed:", err));

  return NextResponse.json({ success: true, key, value });
}

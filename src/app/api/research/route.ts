import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are EconoLens's economics research assistant.
Scope: economics only. Redirect off-topic queries.
Always cite sources. Use FRED, World Bank, RBI data where relevant.
Format: direct answer → context → implications → sources.`;

type AnthropicMessage = {
  content?: Array<{ type: string; text?: string }>;
  error?: { message?: string };
};

function hashQuery(query: string): string {
  return createHash("sha256").update(query.trim().toLowerCase()).digest("hex");
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query =
    typeof body === "object" && body !== null && "query" in body
      ? String((body as { query: unknown }).query ?? "").trim()
      : "";

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const queryHash = hashQuery(query);

  try {
    const sb = supabaseAdmin();
    const cached = await sb
      .from("ai_cache")
      .select("response_text")
      .eq("query_hash", queryHash)
      .maybeSingle();

    if (cached.data?.response_text) {
      return NextResponse.json({ response: cached.data.response_text, cached: true });
    }

    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: query }],
      }),
    });

    const data = (await apiRes.json()) as AnthropicMessage;
    if (!apiRes.ok) {
      return NextResponse.json(
        { error: data.error?.message ?? `Anthropic returned ${apiRes.status}` },
        { status: 502 },
      );
    }

    const responseText =
      data.content
        ?.filter((c) => c.type === "text")
        .map((c) => c.text ?? "")
        .join("\n")
        .trim() ?? "";

    if (responseText) {
      await sb.from("ai_cache").insert({
        query_hash: queryHash,
        query_text: query,
        response_text: responseText,
      });
    }

    return NextResponse.json({ response: responseText, cached: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

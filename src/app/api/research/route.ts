import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are EconoLens's economics research assihstant.
Scope: economics only. Redirect off-topic queries.
Always cite sources. Use FRED, World Bank, RBI data where relevant.
Format: direct answer, context, implications, sources.`;

const FREE_WORD_LIMIT = 200;
const PAID_WORD_LIMIT = 600;

type AnthropicMessage = {
  content?: Array<{ type: string; text?: string }>;
  error?: { message?: string };
};

function hashQuery(query: string): string {
  return createHash("sha256").update(query.trim().toLowerCase()).digest("hex");
}

function truncateToWords(text: string, limit: number): { text: string; wasTruncated: boolean } {
  const words = text.trim().split(/\s+/);
  if (words.length <= limit) return { text, wasTruncated: false };
  return { text: words.slice(0, limit).join(" ") + "…", wasTruncated: true };
}

async function checkSubscription(userId: string): Promise<boolean> {
  try {
    const sb = supabaseAdmin();
    const { data } = await sb
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  let query = "";
  try {
    const body = await req.json();
    query = (body.query ?? "").toString().trim();
  } catch {
    query = "";
  }

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }
  if (query.length > 600) {
    return NextResponse.json({ error: "Query too long" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  // Paywall: determine word limit by subscription tier
  let wordLimit = FREE_WORD_LIMIT;
  let isPaid = false;
  try {
    const { userId } = await auth();
    if (userId) {
      isPaid = await checkSubscription(userId);
      wordLimit = isPaid ? PAID_WORD_LIMIT : FREE_WORD_LIMIT;
    }
  } catch {
    wordLimit = FREE_WORD_LIMIT;
  }

  const queryHash = hashQuery(query);

  try {
    const sb = supabaseAdmin();

    // Check cache first
    const cached = await sb
      .from("ai_cache")
      .select("response_text")
      .eq("query_hash", queryHash)
      .maybeSingle();

    if (cached.data?.response_text) {
      const { text, wasTruncated } = truncateToWords(cached.data.response_text, wordLimit);
      return NextResponse.json({
        response: text,
        cached: true,
        tier: isPaid ? "paid" : "free",
        truncated: wasTruncated,
      });
    }

    // Call Anthropic
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: query }],
      }),
    });

    if (!apiRes.ok) {
      const data = (await apiRes.json()) as AnthropicMessage;
      return NextResponse.json(
        { error: data.error?.message ?? `Anthropic returned ${apiRes.status}` },
        { status: 502 }
      );
    }

    const data = (await apiRes.json()) as AnthropicMessage;
    const responseText =
      data.content
        ?.filter((c) => c.type === "text")
        .map((c) => c.text ?? "")
        .join("\n")
        .trim() ?? "";

    // Cache the full response
    if (responseText) {
      await sb.from("ai_cache").insert({
        query_hash: queryHash,
        query_text: query,
        response_text: responseText,
      });
    }

    const { text, wasTruncated } = truncateToWords(responseText, wordLimit);
    return NextResponse.json({
      response: text,
      cached: false,
      tier: isPaid ? "paid" : "free",
      truncated: wasTruncated,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

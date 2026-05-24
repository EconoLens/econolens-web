import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

export function sanitizeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function stripHtml(s: string): string {
  return String(s).replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

export function sanitizeQuery(s: string): string {
  return String(s)
    .replace(/[;\-\-]/g, "")
    .replace(/\/\*|\*\//g, "")
    .slice(0, 500)
    .trim();
}

export function isSafeExternalUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return ["http:", "https:"].includes(u.protocol) && !u.hostname.includes("localhost");
  } catch { return false; }
}

const ss = (max = 1000) => z.string().max(max).transform(stripHtml);
const se = z.string().email().max(254).toLowerCase().trim();

export const NewsSearchSchema = z.object({
  q: ss(200).optional(),
  category: z.enum(["monetary-policy", "markets", "trade", "fiscal", "global", "india"]).optional(),
  page: z.coerce.number().int().min(1).max(50).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

export const AiResearchSchema = z.object({
  query: ss(600).min(3),
  context: ss(2000).optional(),
  mode: z.enum(["summary", "deep", "indicators"]).default("summary"),
});

export const NewsletterSchema = z.object({ email: se, name: ss(100).optional() });

export const PaymentSchema = z.object({
  plan: z.enum(["premium_monthly", "premium_annual"]),
  userId: z.string().uuid(),
  currency: z.enum(["INR"]).default("INR"),
});

export function apiError(msg: string, status = 400): NextResponse {
  return NextResponse.json({ error: msg }, { status });
}

export function apiSuccess(data: unknown, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

export async function validateBody<T>(req: NextRequest, schema: z.ZodSchema<T>): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    return { data };
  } catch (e) {
    if (e instanceof z.ZodError) return { error: apiError(e.errors.map(x => x.message).join(", ")) };
    return { error: apiError("Invalid request body") };
  }
}

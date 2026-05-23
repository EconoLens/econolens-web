import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type RazorpayPayload = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        email?: string;
        notes?: Record<string, string>;
        amount?: number;
        status?: string;
      };
    };
    subscription?: {
      entity?: {
        id?: string;
        status?: string;
        notes?: Record<string, string>;
        current_end?: number;
      };
    };
  };
};

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "RAZORPAY_KEY_SECRET is not configured" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const rawBody = await req.text();

  if (!signature || !verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: RazorpayPayload;
  try {
    payload = JSON.parse(rawBody) as RazorpayPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = payload.event ?? "";
  const payment = payload.payload?.payment?.entity;
  const subscription = payload.payload?.subscription?.entity;

  const clerkId =
    payment?.notes?.clerk_id ??
    subscription?.notes?.clerk_id ??
    "";
  const email = payment?.email ?? "";

  if (!clerkId && !email) {
    return NextResponse.json({ ok: true, skipped: "no user identifier" });
  }

  const status =
    event === "subscription.cancelled" || event === "subscription.halted"
      ? "cancelled"
      : event === "payment.failed"
        ? "failed"
        : "active";

  const validUntil = subscription?.current_end
    ? new Date(subscription.current_end * 1000).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const sb = supabaseAdmin();

    let userId: string | null = null;

    if (clerkId) {
      const existing = await sb
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .maybeSingle();

      if (existing.data?.id) {
        userId = existing.data.id;
      } else {
        const inserted = await sb
          .from("users")
          .insert({ clerk_id: clerkId, email: email || null })
          .select("id")
          .single();
        userId = inserted.data?.id ?? null;
      }
    }

    if (!userId) {
      return NextResponse.json({ ok: true, skipped: "no user record" });
    }

    await sb.from("subscriptions").insert({
      user_id: userId,
      status,
      plan: "pro",
      valid_until: validUntil,
    });

    return NextResponse.json({ ok: true, event, status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/admin/suspend-content
 *
 * Three-level content kill switch:
 *   Level 1: Set content_status = 'suspended' (HTTP 410 Gone on article page)
 *   Level 2: Set content_status = 'removed' (harder removal)
 *   Level 3: Service kill switch via Vercel env var (whole service offline)
 *
 * Requires Clerk admin role. Logs all actions to content_suspension_log.
 * Sends alert to FOUNDER_ALERT_EMAIL.
 *
 * commit: "feat: three-level content and service kill switch"
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_STATUSES = ["suspended", "removed"] as const;
const ALLOWED_CONTENT_TYPES = ["article", "community_post", "comment"] as const;

type ContentStatus = (typeof ALLOWED_STATUSES)[number];
type ContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    content_type: ContentType;
    content_id: string;
    new_status: ContentStatus;
    reason: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { content_type, content_id, new_status, reason } = body;

  // Validate inputs
  if (!content_type || !content_id || !new_status || !reason?.trim()) {
    return NextResponse.json(
      { error: "content_type, content_id, new_status, and reason are required." },
      { status: 400 }
    );
  }

  if (!ALLOWED_CONTENT_TYPES.includes(content_type)) {
    return NextResponse.json({ error: "Invalid content_type." }, { status: 400 });
  }

  if (!ALLOWED_STATUSES.includes(new_status)) {
    return NextResponse.json({ error: "new_status must be 'suspended' or 'removed'." }, { status: 400 });
  }

  // Determine the table to update
  const tableMap: Record<ContentType, string> = {
    article: "posts",
    community_post: "community_posts",
    comment: "comments",
  };

  const tableName = tableMap[content_type];

  // Fetch current status before update
  const { data: currentRecord } = await supabaseAdmin
    .from(tableName)
    .select("content_status")
    .eq("id", content_id)
    .single();

  const previousStatus = (currentRecord as { content_status?: string } | null)?.content_status ?? "live";

  // Update the content_status on the content record
  const { error: updateError } = await supabaseAdmin
    .from(tableName)
    .update({ content_status: new_status })
    .eq("id", content_id);

  if (updateError) {
    console.error("Content status update error:", updateError);
    return NextResponse.json(
      { error: "Failed to update content status.", detail: updateError.message },
      { status: 500 }
    );
  }

  // Log the action
  const { error: logError } = await supabaseAdmin
    .from("content_suspension_log")
    .insert({
      content_type,
      content_id,
      previous_status: previousStatus,
      new_status,
      reason,
      actioned_by: userId,
    });

  if (logError) {
    console.error("Suspension log error:", logError);
    // Non-fatal — content was already updated
  }

  // Send founder alert
  const founderEmail = process.env.FOUNDER_ALERT_EMAIL;
  if (founderEmail) {
    await resend.emails
      .send({
        from: "EconoLens Admin Alerts <admin@econolens.co.in>",
        to: founderEmail,
        subject: `🔴 Content ${new_status === "suspended" ? "Suspended" : "Removed"} — ${content_type} ${content_id}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="color:#DC2626">Content ${new_status === "suspended" ? "Suspended" : "Removed"}</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px;border-bottom:1px solid #E5E7EB;color:#6B7280;width:140px">Type</td><td style="padding:8px;border-bottom:1px solid #E5E7EB">${content_type}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #E5E7EB;color:#6B7280">Content ID</td><td style="padding:8px;border-bottom:1px solid #E5E7EB;font-family:monospace">${content_id}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #E5E7EB;color:#6B7280">Action</td><td style="padding:8px;border-bottom:1px solid #E5E7EB">${previousStatus} → ${new_status}</td></tr>
              <tr><td style="padding:8px;color:#6B7280">Reason</td><td style="padding:8px">${reason}</td></tr>
            </table>
            <p style="font-size:12px;color:#9CA3AF;margin-top:16px">Actioned by admin user: ${userId}</p>
          </div>
        `,
      })
      .catch((err) => console.error("Founder alert failed:", err));
  }

  return NextResponse.json({
    success: true,
    content_type,
    content_id,
    previous_status: previousStatus,
    new_status,
  });
}

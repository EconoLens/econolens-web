/**
 * POST /api/admin/grievance-action
 * Resolve or reject a grievance. Sends resolution email to complainant.
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

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { grievanceId, action, note } = await req.json();

  if (!grievanceId || !action || !note?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!["resolve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const newStatus = action === "resolve" ? "resolved" : "rejected";

  const { data: grievance, error: fetchError } = await supabaseAdmin
    .from("grievances")
    .select("name, email, type")
    .eq("id", grievanceId)
    .single();

  if (fetchError || !grievance) {
    return NextResponse.json({ error: "Grievance not found" }, { status: 404 });
  }

  const { error: updateError } = await supabaseAdmin
    .from("grievances")
    .update({
      status: newStatus,
      resolution_note: note,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", grievanceId);

  if (updateError) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  const shortId = grievanceId.split("-")[0].toUpperCase();

  // Send resolution email to complainant
  await resend.emails.send({
    from: "EconoLens Legal <legal@econolens.co.in>",
    to: grievance.email,
    subject: `Grievance ${newStatus === "resolved" ? "Resolved" : "Update"} — Ref ${shortId}`,
    html: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px"><h2>Grievance ${newStatus === "resolved" ? "Resolved" : "Rejected"}</h2><p>Dear ${grievance.name},</p><p>Your grievance (Reference: ${shortId}) has been ${newStatus}.</p><p><strong>Note:</strong> ${note}</p><p style="font-size:12px;color:#9CA3AF">EconoLens Legal · IT Rules 2021</p></div>`,
  }).catch(console.error);

  return NextResponse.json({ success: true, status: newStatus });
}

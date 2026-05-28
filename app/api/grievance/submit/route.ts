/**
 * POST /api/grievance/submit
 *
 * Accepts grievance form data, saves to Supabase, sends:
 *   1. Auto-acknowledgement email to complainant (within 5 minutes target)
 *   2. Founder alert email immediately
 *
 * commit: "feat: legal grievance management system IT Rules 2021"
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_TYPES = [
  "copyright_infringement",
  "defamation",
  "privacy_violation",
  "illegal_content",
  "financial_advice_violation",
  "other",
] as const;

type GrievanceType = (typeof ALLOWED_TYPES)[number];

const TYPE_LABELS: Record<GrievanceType, string> = {
  copyright_infringement: "Copyright Infringement",
  defamation: "Defamation",
  privacy_violation: "Privacy Violation",
  illegal_content: "Illegal Content",
  financial_advice_violation: "Financial Advice Violation",
  other: "Other",
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const type = (formData.get("type") as string)?.trim() as GrievanceType;
    const description = (formData.get("description") as string)?.trim();
    const content_url = (formData.get("content_url") as string)?.trim() || null;

    if (!name || !email || !type || !description) {
      return NextResponse.json(
        { error: "validation_error", message: "Name, email, type and description are required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "validation_error", message: "Invalid grievance type." },
        { status: 400 }
      );
    }

    if (description.length > 2000) {
      return NextResponse.json(
        { error: "validation_error", message: "Description exceeds 2000 characters." },
        { status: 400 }
      );
    }

    // Handle evidence file upload
    let evidence_url: string | null = null;
    const evidenceFile = formData.get("evidence") as File | null;

    if (evidenceFile && evidenceFile.size > 0) {
      const MAX_SIZE = 10 * 1024 * 1024;
      if (evidenceFile.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "validation_error", message: "Evidence file must be under 10 MB." },
          { status: 400 }
        );
      }
      const fileExt = evidenceFile.name.split(".").pop()?.toLowerCase();
      const allowed = ["pdf", "jpg", "jpeg", "png", "webp"];
      if (!fileExt || !allowed.includes(fileExt)) {
        return NextResponse.json(
          { error: "validation_error", message: "Only PDF and image files allowed." },
          { status: 400 }
        );
      }
      const arrayBuffer = await evidenceFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("grievance-evidence")
        .upload(fileName, buffer, { contentType: evidenceFile.type, upsert: false });
      if (!uploadError && uploadData) {
        const { data: publicUrl } = supabaseAdmin.storage
          .from("grievance-evidence")
          .getPublicUrl(uploadData.path);
        evidence_url = publicUrl.publicUrl;
      }
    }

    // Insert grievance
    const { data: grievance, error: insertError } = await supabaseAdmin
      .from("grievances")
      .insert({ name, email, type, content_url, description, evidence_url, status: "received" })
      .select("id")
      .single();

    if (insertError || !grievance) {
      console.error("Grievance insert error:", insertError);
      return NextResponse.json(
        { error: "database_error", message: "Failed to save grievance. Please try again." },
        { status: 500 }
      );
    }

    const grievanceId = grievance.id as string;
    const shortId = grievanceId.split("-")[0].toUpperCase();
    const deadline = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric"
    });

    // Send emails non-blocking
    const emailPromises: Promise<unknown>[] = [
      resend.emails.send({
        from: "EconoLens Legal <legal@econolens.co.in>",
        to: email,
        subject: `Grievance Received — Reference ${shortId}`,
        html: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px"><h2>Your Grievance Has Been Received</h2><p>Dear ${name},</p><p>We have received your grievance regarding <strong>${TYPE_LABELS[type]}</strong>.</p><p><strong>Reference:</strong> ${shortId} (Full: ${grievanceId})</p><p>You will receive a response within <strong>15 days</strong> as required by law.</p><p style="font-size:12px;color:#9CA3AF">EconoLens · IT Rules 2021 Compliance</p></div>`,
      }).catch(err => console.error("Ack email failed:", err)),
    ];

    const founderEmail = process.env.FOUNDER_ALERT_EMAIL;
    if (founderEmail) {
      emailPromises.push(
        resend.emails.send({
          from: "EconoLens Legal Alerts <legal@econolens.co.in>",
          to: founderEmail,
          subject: `⚠️ New Grievance — ${TYPE_LABELS[type]} [${shortId}]`,
          html: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px"><h2 style="color:#DC2626">New Legal Grievance</h2><p><strong>Ref:</strong> ${shortId}</p><p><strong>Type:</strong> ${TYPE_LABELS[type]}</p><p><strong>From:</strong> ${name} (${email})</p><p><strong>URL:</strong> ${content_url || "Not provided"}</p><p style="background:#FEF3C7;padding:12px;border-radius:8px">⏱ Deadline: ${deadline}</p><p><a href="https://econolens.com/admin/grievances" style="background:#111827;color:white;padding:10px 20px;border-radius:6px;text-decoration:none">View in Admin →</a></p></div>`,
        }).catch(err => console.error("Founder alert failed:", err))
      );
    }

    await Promise.allSettled(emailPromises);

    return NextResponse.json({ success: true, grievanceId: shortId, fullId: grievanceId }, { status: 201 });
  } catch (err) {
    console.error("Grievance submission error:", err);
    return NextResponse.json({ error: "server_error", message: "Unexpected error." }, { status: 500 });
  }
}

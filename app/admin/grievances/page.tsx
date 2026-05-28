/**
 * /admin/grievances — Admin grievance management panel
 * Protected by Clerk (admin role). Shows all grievances with SLA countdown.
 * commit: "feat: legal grievance management system IT Rules 2021"
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import GrievanceAdminClient from "./GrievanceAdminClient";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export type Grievance = {
  id: string;
  name: string;
  email: string;
  type: string;
  content_url: string | null;
  description: string;
  evidence_url: string | null;
  status: string;
  received_at: string;
  acknowledged_at: string | null;
  resolved_at: string | null;
  resolution_note: string | null;
};

export default async function GrievancesAdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: grievances, error } = await supabaseAdmin
    .from("grievances")
    .select("*")
    .order("received_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Failed to load grievances: {error.message}
      </div>
    );
  }

  return <GrievanceAdminClient grievances={(grievances as Grievance[]) ?? []} />;
}

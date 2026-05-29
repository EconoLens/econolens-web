import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Fallback so module loads at build time without env vars set in Vercel
const url = process.env.SUPABASE_URL ?? "https://placeholder.supabase.co";
const anonKey = process.env.SUPABASE_ANON_KEY ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

export const supabase: SupabaseClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export function supabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("supabaseAdmin must only be used on the server");
  }
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_KEY is not set");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

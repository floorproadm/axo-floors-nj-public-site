import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { buildEstimatePayload } from "./estimate";

// Same existing public anonymous connection as the generated browser client.
// No privileged client, session, configuration change or database policy change.
export async function insertEstimate(raw: unknown, attribution: unknown) {
  const payload = buildEstimatePayload(raw, attribution);
  const client = createClient<Database>("https://dcfmrqrbsfxvqhihpamd.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZm1ycXJic2Z4dnFoaWhwYW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjE5MTEsImV4cCI6MjA4NTYzNzkxMX0.TKL0qDwIrg9pXLewjpg1YmF_Pw5tCwUK7zdj7vho8A8", {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { error } = await client.from("leads").insert([payload]);
  if (error) return { saved: false as const };
  return { saved: true as const };
}
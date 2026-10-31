import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { isUnknownConsentColumnError, reportConsentSaveFailure, withAdsConsent } from "@/lib/ads-consent";
import { buildEstimatePayload } from "./estimate";

// Same existing public anonymous connection as the generated browser client.
// No privileged client, session, configuration change or database policy change.
export async function insertEstimate(raw: unknown, attribution: unknown) {
  const payload = buildEstimatePayload(raw, attribution);
  const client = createClient<Database>("https://dcfmrqrbsfxvqhihpamd.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZm1ycXJic2Z4dnFoaWhwYW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjE5MTEsImV4cCI6MjA4NTYzNzkxMX0.TKL0qDwIrg9pXLewjpg1YmF_Pw5tCwUK7zdj7vho8A8", {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  // The id is generated here so the confirmed lead doubles as the Meta
  // external_id without a post-insert select.
  const withId = { ...payload, id: crypto.randomUUID() };
  // The consent notice above the final submit button is the consent action;
  // store it on the lead. If the columns are rejected, report it (no PII) and
  // still save the lead without the consent record. The generated types lag
  // the external schema, hence the cast.
  type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
  let { error } = await client.from("leads").insert([withAdsConsent(withId)] as LeadInsert[]);
  if (error && isUnknownConsentColumnError(error)) {
    reportConsentSaveFailure("get-started", error);
    ({ error } = await client.from("leads").insert([withId]));
  }
  if (error) return { saved: false as const };
  return { saved: true as const, id: withId.id };
}
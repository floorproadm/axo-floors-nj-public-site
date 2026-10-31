import { ADS_CONSENT_VERSION } from "@/lib/ads-consent";

export const PUBLIC_LEAD_ERROR = "We couldn't save your request. Please call or text (732) 351-8653.";
export type PublicLeadSource = "contact" | "get-started" | "quiz";
export interface PublicLeadInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  services?: string[];
  source: PublicLeadSource;
}
export interface PublicLeadRpcArgs {
  p_org_id: string;
  p_name: string;
  p_email: string | null;
  p_phone: string;
  p_message: string;
  p_services: string[];
  p_lead_source: PublicLeadSource;
  p_consent_ads: boolean;
  p_consent_text_version: string;
}
type RpcClient = { rpc: (name: "submit_public_lead", args: PublicLeadRpcArgs) => PromiseLike<{ data: unknown; error: unknown }> };
export const isLeadId = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
export const ignorePublicSubmission = (website: string, renderedAt: number, now = Date.now()) => Boolean(website) || now - renderedAt < 3000;

// One retry, with exactly the same consent-bearing contract; no direct inserts.
export async function submitPublicLead(client: RpcClient, input: PublicLeadInput): Promise<string> {
  const args: PublicLeadRpcArgs = {
    p_org_id: "a0000000-0000-0000-0000-000000000001",
    p_name: input.name.trim(), p_email: input.email?.trim() || null,
    p_phone: input.phone?.trim() || "", p_message: input.message || "",
    p_services: input.services ?? [], p_lead_source: input.source,
    p_consent_ads: true, p_consent_text_version: ADS_CONSENT_VERSION,
  };
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { data, error } = await client.rpc("submit_public_lead", args);
      if (!error && isLeadId(data)) return data;
    } catch { /* No provider errors or personal details in logs. */ }
    if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  console.error("[public-lead] submission failed", { source: input.source });
  throw new Error(PUBLIC_LEAD_ERROR);
}
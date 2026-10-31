// Advertising-consent notice shown above the final submit button of every lead
// form. The notice plus clicking submit is the visitor's consent action; the
// version and timestamp are stored on the lead record.
export const ADS_CONSENT_VERSION = "v1-2026-10";
export const ADS_CONSENT_NOTICE =
  "By submitting, you agree to be contacted by AXO Floors about your project and to our Privacy Policy, including sharing hashed (encrypted) contact information with advertising partners such as Meta to measure our ads.";

export function withAdsConsent<T extends Record<string, unknown>>(payload: T) {
  return {
    ...payload,
    consent_ads: true,
    consent_text_version: ADS_CONSENT_VERSION,
    consent_at: new Date().toISOString(),
  };
}

// PostgREST rejects columns missing from the schema cache. When the consent
// columns have not been added to the external leads table yet, the caller
// retries without them so a missing migration never blocks a lead.
export function isUnknownConsentColumnError(error: unknown): boolean {
  const message = String((error as { message?: string } | null)?.message ?? "");
  return (
    message.includes("consent_ads") ||
    message.includes("consent_text_version") ||
    message.includes("consent_at")
  );
}

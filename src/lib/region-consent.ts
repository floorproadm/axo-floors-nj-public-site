// Regions where advertising tracking requires prior visitor consent:
// EU/EEA member states, the United Kingdom and Switzerland. While the site
// runs without a consent banner, the Meta pixel stays off in these regions
// and in every region we cannot resolve (unknown, Tor, or lookup failure).
export const CONSENT_REQUIRED_REGIONS: ReadonlySet<string> = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
]);

export function isTrackingAllowed(region: string): boolean {
  const code = region.trim().toUpperCase();
  // "XX" is an unknown country, "T1" is Tor traffic; both stay unresolved.
  if (!code || code === "XX" || code === "T1") return false;
  return !CONSENT_REQUIRED_REGIONS.has(code);
}

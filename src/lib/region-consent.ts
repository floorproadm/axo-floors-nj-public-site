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
  // Only well-formed ISO-style country codes count. Anything else — unknown,
  // Tor, a proxy's trace, or malformed output — stays unresolved and keeps
  // the pixel off.
  if (!/^[A-Z]{2}$/.test(code)) return false;
  // Special codes: "XX" unknown country, "T1" Tor, "A1"/"A2"/"O1"
  // anonymous-proxy / satellite / other-reserved classifications.
  if (["XX", "T1", "A1", "A2", "O1"].includes(code)) return false;
  return !CONSENT_REQUIRED_REGIONS.has(code);
}

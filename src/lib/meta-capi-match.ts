// Pure normalization + SHA-256 helpers for Meta Conversions API customer
// matching. Server-side only in practice: the browser fbq call never receives
// these values. Empty inputs are omitted — never hash an empty string.
export interface LeadMatchInput {
  email?: string;
  phone?: string;
  name?: string;
  zip?: string;
  city?: string;
  leadId?: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Digits only; US numbers get the country code prepended.
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `1${digits}` : digits;
}

// First token is the first name, last token the last name; lowercase, no punctuation.
export function splitName(name: string): { fn?: string; ln?: string } {
  const clean = (token: string) => token.replace(/[^\p{L}\p{N}]/gu, "");
  const tokens = name.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return {};
  const fn = clean(tokens[0]);
  const ln = tokens.length > 1 ? clean(tokens[tokens.length - 1]) : undefined;
  return { ...(fn ? { fn } : {}), ...(ln ? { ln } : {}) };
}

export function normalizeZip(zip: string): string {
  return zip.replace(/\D/g, "").slice(0, 5);
}

export function normalizeCity(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, "");
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Hashed user_data matching fields for a consented Lead event.
export async function buildHashedMatchFields(input: LeadMatchInput): Promise<Record<string, string>> {
  const fields: Record<string, string> = {};
  const put = async (key: string, value: string | undefined) => {
    if (value) fields[key] = await sha256Hex(value);
  };
  await put("em", input.email ? normalizeEmail(input.email) : undefined);
  await put("ph", input.phone ? normalizePhone(input.phone) : undefined);
  const { fn, ln } = input.name ? splitName(input.name) : {};
  await put("fn", fn);
  await put("ln", ln);
  await put("zp", input.zip ? normalizeZip(input.zip) : undefined);
  await put("ct", input.city ? normalizeCity(input.city) : undefined);
  await put("country", "us");
  await put("external_id", input.leadId);
  return fields;
}

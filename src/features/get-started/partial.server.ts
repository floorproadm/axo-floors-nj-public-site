// Server-only bridge to FloorPRO's private partial-estimate intake.
// The secret is read per call from server env; it never reaches the browser.
// Every failure "fails closed": the partial feature does nothing, the form continues.

export const PARTIAL_INTAKE_URL = "https://dcfmrqrbsfxvqhihpamd.supabase.co/functions/v1/partial-estimate-intake";
export const SESSION_COOKIE = "axo_pe";
export const CAPTURED_COOKIE = "axo_pe_c";
export const PENDING_COMPLETE_COOKIE = "axo_pe_pc";
export const SESSION_KEY_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export type PartialOp = "capture" | "touch" | "begin_finalization" | "release_finalization" | "complete";
export type CaptureFields = { full_name: string; phone: string; email: string | null; project_location: string };
export type IntakeResult = { status: string; notification_already_authorized?: boolean } | null;
export type Intake = (op: PartialOp, sessionKey: string, fields?: CaptureFields) => Promise<IntakeResult>;

export function newSessionKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function signBody(secret: string, timestamp: string, rawBody: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${timestamp}.${rawBody}`));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Signed call to the fixed endpoint. Returns null when unconfigured, disabled, or failing. */
export function createIntake(secret: string | undefined, fetcher: typeof fetch = fetch): Intake {
  return async (op, sessionKey, fields) => {
    if (!secret || secret.length < 32 || !SESSION_KEY_PATTERN.test(sessionKey)) return null;
    const raw = JSON.stringify({ op, session_key: sessionKey, ...(op === "capture" && fields ? fields : {}) });
    const timestamp = String(Math.floor(Date.now() / 1000));
    try {
      const response = await fetcher(PARTIAL_INTAKE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-pe-timestamp": timestamp, "x-pe-signature": await signBody(secret, timestamp, raw) },
        body: raw,
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) { console.warn("partial-estimate intake unavailable", { op, status: response.status }); return null; }
      const body = (await response.json()) as Record<string, unknown>;
      return typeof body.status === "string" ? { status: body.status, notification_already_authorized: body.notification_already_authorized === true } : null;
    } catch { console.warn("partial-estimate intake unreachable", { op }); return null; }
  };
}

// Best-effort per-isolate throttles (no platform rate-limit primitive exists).
const hits = new Map<string, number[]>();
export function allow(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) { hits.set(key, recent); return false; }
  recent.push(now); hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}

/** Same-origin check for the browser-initiated partial actions. Missing Origin fails closed. */
export function sameOrigin(origin: string | undefined, host: string | undefined): boolean {
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}

/**
 * Wraps the EXISTING canonical lead save. The lead insert runs exactly once.
 * - begin_finalization first, so FloorPRO suppresses the abandonment alert.
 * - Confirmed save: complete (retried); if unconfirmed the finalizing guard stays
 *   in place server-side (FloorPRO never alerts a finalizing request) and the
 *   caller keeps a pending-completion marker to retry later.
 * - Definitive "not saved": release the guard so a real abandonment can still alert.
 * - Thrown/ambiguous insert: keep the guard (a missed alert is safer than a false one).
 */
export async function finalizeAroundSave<T extends { saved: boolean }>(sessionKey: string | undefined, intake: Intake, save: () => Promise<T>) {
  const tracked = !!sessionKey && SESSION_KEY_PATTERN.test(sessionKey);
  const guard = tracked ? await intake("begin_finalization", sessionKey!) : null;
  const result = await save(); // throws propagate: no release on ambiguity
  if (!tracked) return { result, completion: "none" as const };
  if (!result.saved) {
    if (guard?.status === "finalizing") await intake("release_finalization", sessionKey!);
    return { result, completion: "released" as const };
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    const done = await intake("complete", sessionKey!);
    if (done?.status === "completed") return { result, completion: "completed" as const };
  }
  return { result, completion: "pending" as const };
}

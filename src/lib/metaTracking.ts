// Central Meta event helper. Browser events go through the pixel installed by
// meta-pixel.ts; confirmed business outcomes (Lead) also get a server-side copy
// carrying the same event id so Meta deduplicates the two paths.
import { reportMetaConversion } from "@/lib/meta-capi.functions";
import { safeAnalyticsPage } from "@/lib/analytics";
import { isMetaTrackingActive } from "@/lib/meta-pixel";
import type { LeadMatchInput } from "@/lib/meta-capi-match";

export type MetaStandardEvent = "Lead" | "Contact" | "ViewContent" | "Schedule";

type MetaWindow = Window & { fbq?: (...args: unknown[]) => void };

// Only confirmed business outcomes get a server-side copy.
const SERVER_REPORTED: ReadonlySet<MetaStandardEvent> = new Set(["Lead"]);

export function trackPageView(): void {
  if (!isMetaTrackingActive()) return;
  try {
    (window as MetaWindow).fbq?.("track", "PageView");
  } catch {
    // Ad blockers or a blocked script must never break the page.
  }
}

// Fire ONLY after the underlying action succeeded (a saved form, a viewed
// service page) — never on button clicks, step advances or validation errors.
// userData goes only to the server copy (hashed there); the browser fbq call
// never receives it.
export function trackEvent(name: MetaStandardEvent, params: Record<string, unknown> = {}, userData?: LeadMatchInput): void {
  // In consent-required or unresolved regions the pixel never started, so no
  // event — browser or server — may leave for this visit.
  if (!isMetaTrackingActive()) return;
  const eventId = crypto.randomUUID();
  try {
    (window as MetaWindow).fbq?.("track", name, params, { eventID: eventId });
  } catch {
    // Never let tracking interfere with a submitted form.
  }
  if (!SERVER_REPORTED.has(name)) return;
  const page = safeAnalyticsPage(window.location.href);
  void reportMetaConversion({
    data: {
      event_name: name,
      event_id: eventId,
      // Token-free allowlisted path only; never the raw URL.
      event_source_url: page?.page_location ?? `${window.location.origin}/`,
      fbp: readCookie("_fbp"),
      fbc: readCookie("_fbc") || fbcFromClickId(),
      ...(userData
        ? {
            match: {
              email: userData.email,
              phone: userData.phone,
              name: userData.name,
              zip: userData.zip,
              city: userData.city,
              lead_id: userData.leadId,
            },
          }
        : {}),
    },
  }).catch(() => undefined);
}

function readCookie(name: string): string | undefined {
  try {
    const prefix = `${name}=`;
    for (const part of document.cookie.split(";")) {
      const trimmed = part.trim();
      if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
    }
  } catch {
    // Storage unavailable.
  }
  return undefined;
}

// Meta's own format for building _fbc when the click id is still only in the URL.
function fbcFromClickId(): string | undefined {
  try {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (!fbclid) return undefined;
    return `fb.1.${Date.now()}.${fbclid}`;
  } catch {
    return undefined;
  }
}

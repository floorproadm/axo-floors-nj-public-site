// Meta Pixel bootstrap. Browser-only: every browser API sits inside a called
// function, never at module scope, so SSR never touches window.
import { createPageViewTracker, safeAnalyticsPage } from "@/lib/analytics";
import { isTrackingAllowed } from "@/lib/region-consent";

export const META_PIXEL_ID = "403151700983838";
const REGION_CACHE_KEY = "axo-visit-region";

type MetaFbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: (...args: unknown[]) => void;
  loaded: boolean;
  version: string;
};
type MetaWindow = Window & { fbq?: MetaFbq; _fbq?: MetaFbq };

let stopPixel: (() => void) | undefined;

export function initializeMetaPixel(pixelId: string): void {
  if (typeof window === "undefined" || stopPixel) return;
  // Never load the pixel on a direct private-page visit (same rule as GA4).
  if (!safeAnalyticsPage(window.location.href)) return;
  void readVisitRegion()
    .then((region) => {
      if (stopPixel || !isTrackingAllowed(region)) return;
      start(pixelId);
    })
    .catch(() => {
      // Tracking failures must never interfere with browsing or submitting forms.
    });
}

// Region lookup is cached per page visit and fails closed: when the region
// cannot be resolved, the pixel stays off for that visit.
async function readVisitRegion(): Promise<string> {
  try {
    const cached = window.sessionStorage.getItem(REGION_CACHE_KEY);
    if (cached) return cached;
  } catch {
    return "";
  }
  let region = "";
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2000);
    try {
      const response = await fetch("/cdn-cgi/trace", { signal: controller.signal, cache: "no-store" });
      if (response.ok) {
        const fields = parseTrace(await response.text());
        // An h= other than the page's host is a rewrite proxy's trace, not ours.
        if (fields["h"] === window.location.host) region = fields["loc"] ?? "";
      }
    } finally {
      window.clearTimeout(timer);
    }
  } catch {
    // Region stays unresolved.
  }
  try {
    window.sessionStorage.setItem(REGION_CACHE_KEY, region);
  } catch {
    // Storage unavailable; the next visit simply re-resolves.
  }
  return region;
}

function parseTrace(text: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const index = line.indexOf("=");
    if (index > 0) fields[line.slice(0, index)] = line.slice(index + 1).trim();
  }
  return fields;
}

function start(pixelId: string): void {
  const w = window as MetaWindow;
  if (w.fbq) return; // Another install already owns the queue.
  const fbq: MetaFbq = function (...args: unknown[]) {
    // Dispatch through callMethod when the SDK is ready; queue otherwise.
    if (fbq.callMethod) fbq.callMethod.apply(fbq, args);
    else fbq.queue.push(args);
  };
  fbq.queue = [];
  fbq.push = fbq;
  // Flags mirror the standard snippet; loaded=true is not SDK readiness.
  fbq.loaded = true;
  fbq.version = "2.0";
  w.fbq = fbq;
  w._fbq = fbq;

  fbq("init", pixelId, {}, { agent: "lovable" });

  const script = document.createElement("script");
  script.id = "axo-meta-pixel";
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  const track = createPageViewTracker(() => {
    fbq("track", "PageView");
  });

  // Both routers use browser history. Observing that shared boundary avoids
  // changing legacy pages or adding two competing router listeners.
  let timer: ReturnType<typeof setTimeout> | undefined;
  const onNavigation = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => track(window.location.href), 0);
  };
  const originalPush = window.history.pushState;
  const originalReplace = window.history.replaceState;
  const push: History["pushState"] = function (this, ...args) {
    originalPush.apply(this, args);
    onNavigation();
  };
  const replace: History["replaceState"] = function (this, ...args) {
    originalReplace.apply(this, args);
    onNavigation();
  };
  window.history.pushState = push;
  window.history.replaceState = replace;
  window.addEventListener("popstate", onNavigation);
  stopPixel = () => {
    if (timer) clearTimeout(timer);
    if (window.history.pushState === push) window.history.pushState = originalPush;
    if (window.history.replaceState === replace) window.history.replaceState = originalReplace;
    window.removeEventListener("popstate", onNavigation);
    stopPixel = undefined;
  };

  track(window.location.href);
}

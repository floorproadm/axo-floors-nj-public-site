type Tag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: Tag };

const publicPages: Record<string, string> = {
  '/': 'Home', '/installation': 'Flooring Installation', '/hardwood-flooring': 'Flooring Installation',
  '/refinishing': 'Floor Refinishing', '/sanding-and-refinish': 'Floor Refinishing',
  '/vinyl-plank-flooring': 'Vinyl Plank Flooring', '/stairs': 'Stairs', '/gallery': 'Gallery',
  '/stain-gallery': 'Stain Gallery', '/contact': 'Contact', '/about': 'About', '/finishes': 'Finishes',
  '/blog': 'Journal', '/get-started': 'Get Started', '/schedule-estimate': 'Schedule Estimate',
  '/quiz': 'Floor Estimate', '/thank-you': 'Thank You', '/hub': 'Links', '/builders': 'Builders',
  '/realtors': 'Realtors', '/builder-offer': 'Builder Partnerships', '/partner-program': 'Partner Program',
  '/referral-program': 'Referral Program', '/campaign': 'Campaign', '/wow-pack': 'Wow Pack',
  '/review-request': 'Review Request', '/service-areas/new-jersey': 'New Jersey Service Areas',
};

// Free-text campaign names/content/terms can contain customer details. Only known
// channel identifiers are retained; all other query strings, hashes and tokens are dropped.
const sources = new Set(['google', 'bing', 'instagram', 'facebook', 'meta', 'yelp', 'houzz', 'angi', 'thumbtack', 'nextdoor', 'newsletter', 'gbp', 'google-business-profile']);
const mediums = new Set(['organic', 'cpc', 'ppc', 'paid', 'paid-social', 'paid_social', 'social', 'bio', 'email', 'referral', 'qr']);

export function safeAnalyticsPage(href: string) {
  const url = new URL(href);
  const path = url.pathname.replace(/\/$/, '') || '/';
  let title = publicPages[path];
  let safePath = path;
  if (!title && /^\/blog\/[^/]+$/.test(path)) {
    safePath = '/blog/article';
    title = 'Journal Article';
  }
  if (!title && /^\/service-areas\/new-jersey\/[^/]+$/.test(path)) {
    safePath = '/service-areas/new-jersey/city';
    title = 'New Jersey City Service Area';
  }
  if (!title) return null; // No private portals, invoices, auth, tokens or unknown URLs.
  const source = url.searchParams.get('utm_source')?.toLowerCase();
  const medium = url.searchParams.get('utm_medium')?.toLowerCase();
  return {
    page_location: url.origin + safePath,
    page_path: safePath,
    page_title: `${title} | AXO Floors NJ`,
    ...(source && sources.has(source) ? { campaign_source: source } : {}),
    ...(medium && mediums.has(medium) ? { campaign_medium: medium } : {}),
  };
}

export function safeAnalyticsReferrer(referrer: string): string {
  try { return new URL(referrer).origin + '/'; } catch { return ''; }
}

export function createPageViewTracker(send: (page: NonNullable<ReturnType<typeof safeAnalyticsPage>>) => void) {
  let previous = '';
  let campaign: { campaign_source?: string; campaign_medium?: string } = {};
  return (href: string) => {
    const page = safeAnalyticsPage(href);
    const navigationKey = new URL(href).pathname;
    if (!page) { previous = navigationKey; return; }
    if (previous === navigationKey) return;
    previous = navigationKey;
    if (page.campaign_source) campaign.campaign_source = page.campaign_source;
    if (page.campaign_medium) campaign.campaign_medium = page.campaign_medium;
    send({ ...page, ...campaign });
  };
}

let stopTracking: (() => void) | undefined;

export function initializeAnalytics(measurementId: string) {
  if (typeof window === 'undefined' || stopTracking || !/^G-[A-Z0-9]+$/.test(measurementId)) return;
  const initial = safeAnalyticsPage(window.location.href);
  // Do not load Google's tag on a direct private-link visit.
  if (!initial) return;
  const browser = window as AnalyticsWindow;
  browser.dataLayer = browser.dataLayer || [];
  const tag: Tag = function (..._args: unknown[]) {
    // gtag requires an Arguments object, not an ordinary array.
    browser.dataLayer?.push(arguments);
  };
  browser.gtag = tag;
  tag('set', 'developer_id.dZjgwMW', true);
  tag('js', new Date());
  tag('config', measurementId, {
    ...initial,
    page_referrer: safeAnalyticsReferrer(document.referrer),
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    // Never infer free-text campaigns from the original browser URL.
    campaign_name: '(not set)', campaign_content: '(not set)', campaign_term: '(not set)',
  });
  const track = createPageViewTracker((page) => {
    tag('set', { page_location: page.page_location, page_title: page.page_title });
    tag('event', 'page_view', { ...page, page_referrer: safeAnalyticsReferrer(document.referrer), send_to: measurementId });
  });
  const script = document.createElement('script');
  script.id = 'axo-google-analytics';
  script.async = true;
  script.referrerPolicy = 'origin';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Both routers use browser history. Observing that shared boundary avoids
  // changing legacy pages or adding two competing router listeners.
  let timer: ReturnType<typeof setTimeout> | undefined;
  const onNavigation = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => track(window.location.href), 0);
  };
  const originalPush = window.history.pushState;
  const originalReplace = window.history.replaceState;
  const push: History['pushState'] = function (this: History, ...args) { originalPush.apply(this, args); onNavigation(); };
  const replace: History['replaceState'] = function (this: History, ...args) { originalReplace.apply(this, args); onNavigation(); };
  window.history.pushState = push;
  window.history.replaceState = replace;
  window.addEventListener('popstate', onNavigation);
  stopTracking = () => {
    if (timer) clearTimeout(timer);
    if (window.history.pushState === push) window.history.pushState = originalPush;
    if (window.history.replaceState === replace) window.history.replaceState = originalReplace;
    window.removeEventListener('popstate', onNavigation);
    stopTracking = undefined;
  };
  track(window.location.href);
}
// ---- Phase 1B events: strict allowlist, fixed values only, never customer details ----
const eventParams = {
  generate_lead: { form_location: ['get_started'], service_path: ['new-installation', 'floor-refinish', 'install-plus-refinish', 'not-sure'] },
  estimate_step_1_completed: { form_location: ['get_started'] },
  sms_click: { link_location: ['get_started', 'get_started_thank_you', 'gallery', 'mobile_sticky'] },
  phone_click: { link_location: ['get_started', 'gallery', 'mobile_sticky', 'header', 'footer'] },
} as const;
export type AnalyticsEventName = keyof typeof eventParams;
const productionHosts = new Set(['axofloorsnj.com', 'www.axofloorsnj.com', 'axo-floors-nj.lovable.app']);

export function safeAnalyticsEvent(name: string, params: Record<string, unknown> = {}) {
  const allowed = (eventParams as Record<string, Record<string, readonly string[]>>)[name];
  if (!allowed) return null;
  const out: Record<string, string> = {};
  for (const [key, values] of Object.entries(allowed)) {
    const value = params[key];
    if (typeof value === 'string' && values.includes(value)) out[key] = value;
    else return null; // Every allowlisted parameter is required and fixed.
  }
  return out;
}

export function createEventDispatcher(send: (name: string, params: Record<string, string>) => void) {
  const sentKeys = new Set<string>();
  return (name: AnalyticsEventName, params: Record<string, unknown>, href: string, dedupeKey?: string) => {
    try {
      const url = new URL(href);
      if (!productionHosts.has(url.hostname) || !safeAnalyticsPage(href)) return false;
      const safe = safeAnalyticsEvent(name, params);
      if (!safe) return false;
      if (dedupeKey) { const key = `${name}:${dedupeKey}`; if (sentKeys.has(key)) return false; sentKeys.add(key); }
      send(name, safe);
      return true;
    } catch { return false; }
  };
}

const dispatch = createEventDispatcher((name, params) => {
  const tag = (window as AnalyticsWindow).gtag;
  if (stopTracking && tag) tag('event', name, params);
});

/** Never throws; silently skipped without GA4, off-production, or on private pages. */
export function trackEvent(name: AnalyticsEventName, params: Record<string, unknown>, dedupeKey?: string) {
  if (typeof window === 'undefined') return false;
  return dispatch(name, params, window.location.href, dedupeKey);
}

/** Call only after the server has confirmed the existing final lead save. */
export function trackGenerateLead(servicePath: string, submissionId: string) {
  return trackEvent('generate_lead', { form_location: 'get_started', service_path: servicePath }, submissionId);
}

// Only ever called with the server's authoritative "captured" result; the server
// bridge stays inert until PARTIAL_ESTIMATE_INTAKE_SECRET and FloorPRO's switch are on.
export const STEP1_CAPTURE_ENABLED = true;
export function trackEstimateStep1Completed(confirmation: { durable: boolean; captureId: string } | null, enabled = STEP1_CAPTURE_ENABLED) {
  if (!enabled || !confirmation?.durable || !confirmation.captureId) return false;
  return trackEvent('estimate_step_1_completed', { form_location: 'get_started' }, confirmation.captureId);
}

export function trackContactClick(kind: 'sms_click' | 'phone_click', location: string) {
  return trackEvent(kind, { link_location: location });
}

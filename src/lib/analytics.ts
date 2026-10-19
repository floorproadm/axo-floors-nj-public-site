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
  const push: History['pushState'] = function (...args) { originalPush.apply(this, args); onNavigation(); };
  const replace: History['replaceState'] = function (...args) { originalReplace.apply(this, args); onNavigation(); };
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
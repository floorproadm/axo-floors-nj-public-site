export interface GetStartedData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  addressVerified: boolean;
  city: string;
  zip: string;
  leadSource: string;
  services: string[];
  // Branch A

  consultType: string;
  consultTopics: string;
  // Branch B
  wishlist: string;
  timeline: string;
  budget: number;
  currentFloor: string;
  condition: string;
  areas: string[];
  stairsCount: string;
  sqft: string;
  sqftNotSure: boolean;
  propertyType: string;
  furnished: string;
  homeAge: string;
  // Final
  consent: boolean;
}

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  referrer?: string;
  landing_path?: string;
}

export const DRAFT_KEY = "axo_get_started_draft";
const UTM_KEY = "axo_get_started_utm";

export const emptyData: GetStartedData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  addressVerified: false,
  city: "",
  zip: "",
  leadSource: "",
  services: [],
  consultType: "",

  consultTopics: "",
  wishlist: "",
  timeline: "",
  budget: 8000,
  currentFloor: "",
  condition: "",
  areas: [],
  stairsCount: "",
  sqft: "",
  sqftNotSure: false,
  propertyType: "",
  furnished: "",
  homeAge: "",
  consent: false,
};

export function loadDraft(): { data: GetStartedData; step: number } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const draftData = parsed.data ?? {};
    // Migrate old single-service drafts to the new multi-select array
    if (typeof draftData.service === "string" && draftData.service) {
      draftData.services = [draftData.service];
      delete draftData.service;
    }
    return {
      data: { ...emptyData, ...draftData },
      step: typeof parsed.step === "number" ? parsed.step : 0,
    };

  } catch {
    return null;
  }
}

export function saveDraft(data: GetStartedData, step: number) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, step }));
  } catch {
    /* storage unavailable — non-fatal */
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
    sessionStorage.removeItem(UTM_KEY);
  } catch {
    /* noop */
  }
}

/** Capture UTMs once on page load and keep them across step navigation. */
export function captureUtms(): UtmParams {
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"] as const;
  let stored: UtmParams = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(UTM_KEY) || "{}");
  } catch {
    stored = {};
  }
  const params = new URLSearchParams(window.location.search);
  const fresh: UtmParams = {};
  keys.forEach((k) => {
    const v = params.get(k);
    if (v) fresh[k] = v.slice(0, 200);
  });
  const merged: UtmParams = {
    ...stored,
    ...fresh,
    referrer: stored.referrer || document.referrer || undefined,
    landing_path: stored.landing_path || window.location.pathname + window.location.search,
  };
  try {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(merged));
  } catch {
    /* noop */
  }
  return merged;
}

// ─── Formatting / validation helpers ───────────────────────

export function formatPhone(input: string): string {
  const d = input.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export const isValidPhone = (v: string) => v.replace(/\D/g, "").length === 10;
export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());

export function formatBudget(v: number): string {
  const base = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
  return v >= 50000 ? `${base}+` : base;
}

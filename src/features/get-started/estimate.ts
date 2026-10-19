import { z } from "zod";
import { AXO_ORG_ID } from "@/lib/constants";

export const estimateServices = [
  { value: "refinishing", label: "Sanding & Refinishing" },
  { value: "installation", label: "Flooring Installation" },
  { value: "stairs", label: "Stairs & Railings" },
  { value: "repair", label: "Repairs / Other / Not Sure" },
] as const;

const cleanLine = (max: number) => z.string().trim().max(max).refine((v) => !/[\r\n\x00-\x1f\x7f]/.test(v), "Please use a single line of text.");
export const estimateSchema = z.object({
  name: cleanLine(120).refine((v) => v.length >= 2, "Please enter your full name."),
  phone: cleanLine(40).refine((v) => /^(?:1)?[2-9]\d{2}[2-9]\d{6}$/.test(v.replace(/\D/g, "")), "Please enter a valid US phone number."),
  service: z.enum(["refinishing", "installation", "stairs", "repair"], { errorMap: () => ({ message: "Please select a service." }) }),
  location: cleanLine(120).refine((v) => /^\d{5}(?:-\d{4})?$/.test(v) || (/[a-zA-Z]/.test(v) && /^[\p{L}\p{M} .,'’()-]+$/u.test(v) && v.length >= 2), "Please enter a city or a 5-digit ZIP code."),
  message: z.string().trim().max(2000, "Please keep your project description under 2,000 characters.").refine((v) => !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(v), "Please remove unsupported characters."),
  email: cleanLine(200).refine((v) => !v || z.string().email().safeParse(v).success, "Please enter a valid email address, or leave it blank."),
  consent: z.boolean().refine((v) => v, "Please give permission for us to contact you about this project."),
});
export type EstimateInput = z.infer<typeof estimateSchema>;
export const emptyEstimate = { name: "", phone: "", service: "", location: "", message: "", email: "", consent: false };

// Only safe channel tokens and origin-only referrers; never persist arbitrary queries.
export const attributionSchema = z.object({
  utm_source: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/).optional(),
  utm_medium: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/).optional(),
  utm_campaign: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/).optional(),
  referrer: z.string().max(200).refine((v) => { try { const u = new URL(v); return /^https?:$/.test(u.protocol) && !u.username && !u.password && v === u.origin + "/"; } catch { return false; } }).optional(),
  landing_path: z.enum(["/", "/hub", "/contact", "/get-started", "/installation", "/refinishing", "/gallery", "/quiz", "/schedule-estimate"]).optional(),
});
export type EstimateAttribution = z.infer<typeof attributionSchema>;
export function captureEstimateAttribution(): EstimateAttribution {
  let stored: Record<string, unknown> = {};
  try { stored = JSON.parse(sessionStorage.getItem("axo_get_started_utm") || "{}"); } catch { /* no stored attribution */ }
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
    const value = params.get(key) || stored[key];
    if (typeof value === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(value)) result[key] = value;
  }
  try {
    const value = typeof stored.referrer === "string" ? stored.referrer : document.referrer;
    const url = new URL(value);
    if (/^https?:$/.test(url.protocol) && !url.username && !url.password) result.referrer = url.origin + "/";
  } catch { /* no usable referrer */ }
  const landing = typeof stored.landing_path === "string" ? stored.landing_path.split(/[?#]/)[0] : window.location.pathname;
  if (attributionSchema.shape.landing_path.safeParse(landing).success) result.landing_path = landing;
  return attributionSchema.parse(result);
}

export function buildEstimatePayload(raw: unknown, attribution: unknown = {}) {
  const data = estimateSchema.parse(raw);
  const safe = attributionSchema.parse(attribution);
  const zip = /^\d{5}(?:-\d{4})?$/.test(data.location);
  const label = estimateServices.find((s) => s.value === data.service)?.label || data.service;
  const rows = ["## Request", `- Service: ${label}`, `- Project city or ZIP: ${data.location}`, "- Contact permission: Granted for this submitted project"];
  if (data.message) rows.push("", "## Project", `- Description: ${data.message}`);
  const entries = Object.entries(safe);
  if (entries.length) rows.push("", "## Attribution", ...entries.map(([k, v]) => `- ${k}: ${v}`));
  return { organization_id: AXO_ORG_ID, name: data.name, phone: data.phone, email: data.email || null,
    city: zip ? null : data.location, zip_code: zip ? data.location : null, address: null,
    services: [data.service], lead_source: "Website — Get Started", status: "new_lead", priority: "high", contact_type: "web_form",
    message: data.message || null, notes: rows.join("\n"), budget: null, room_size: null };
}
export type EstimatePayload = ReturnType<typeof buildEstimatePayload>;

// Injectable boundaries permit real validation and synthetic-only side-effect tests.
export async function sendEstimate(raw: unknown, attribution: unknown, insert: (data: EstimateInput, attribution: EstimateAttribution) => Promise<void>, notify: (payload: EstimatePayload) => Promise<boolean>) {
  const data = estimateSchema.parse(raw);
  const safe = attributionSchema.parse(attribution);
  const payload = buildEstimatePayload(data, safe);
  await insert(data, safe);
  let notificationSent = false;
  try { notificationSent = await notify(payload); } catch { /* lead already saved: never insert again */ }
  return { saved: true as const, notificationSent };
}
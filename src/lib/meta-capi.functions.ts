// Server-side copy of confirmed conversion events (Meta Conversions API).
// The browser pixel already fired the same event with the same event id; Meta
// deduplicates the pair. This function must never break the form UX: every
// failure path returns quietly.
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { META_PIXEL_ID } from "@/lib/meta-pixel";
import { buildHashedMatchFields } from "@/lib/meta-capi-match";

const matchSchema = z.object({
  email: z.string().max(200).optional(),
  phone: z.string().max(40).optional(),
  name: z.string().max(120).optional(),
  zip: z.string().max(12).optional(),
  city: z.string().max(120).optional(),
  lead_id: z.string().uuid().optional(),
});

const payloadSchema = z.object({
  event_name: z.enum(["Lead", "Contact", "ViewContent", "Schedule"]),
  event_id: z.string().uuid(),
  event_source_url: z.string().url().max(200),
  fbp: z.string().max(200).optional(),
  fbc: z.string().max(300).optional(),
  // Raw contact details travel only in this POST body — never in URLs, logs or
  // browser event params — and are hashed before leaving for Meta. Present only
  // when the visitor submitted a form showing the advertising-consent notice.
  match: matchSchema.optional(),
});

export const reportMetaConversion = createServerFn({ method: "POST" })
  .inputValidator((raw) => payloadSchema.parse(raw))
  .handler(async ({ data }) => {
    const gatewayKey = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["META_ADS_API_KEY"];
    // One server transport only: the linked connector replaces the old token.
    if (!gatewayKey || !connectionKey) return { sent: false as const };

    const request = getRequest();
    const ip = ["cf-connecting-ip", "x-forwarded-for", "x-real-ip"]
      .map((header) => request.headers.get(header)?.split(",")[0]?.trim())
      .find((value) => Boolean(value));
    const userAgent = request.headers.get("user-agent")?.trim();
    const user_data: Record<string, string> = {};
    if (userAgent) user_data.client_user_agent = userAgent;
    if (ip) user_data.client_ip_address = ip;
    if (data.fbp?.trim()) user_data.fbp = data.fbp;
    if (data.fbc?.trim()) user_data.fbc = data.fbc;
    // Hashed matching fields only for consented Lead events; the consent record
    // (notice version + timestamp) lives on the lead row.
    if (data.event_name === "Lead" && data.match) {
      Object.assign(user_data, await buildHashedMatchFields({
        email: data.match.email,
        phone: data.match.phone,
        name: data.match.name,
        zip: data.match.zip,
        city: data.match.city,
        leadId: data.match.lead_id,
      }));
    }
    if (Object.keys(user_data).length === 0) {
      console.info("[capi] skipped: no user_data");
      return { sent: false as const };
    }
    // Every transmitted website event needs the original request's IP and UA.
    // Never invent either or substitute the server's own identity.
    if (!ip || !userAgent) {
      console.info("[capi] skipped: missing request metadata");
      return { sent: false as const };
    }

    const body: Record<string, unknown> = {
      data: [
        {
          event_name: data.event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: data.event_id,
          action_source: "website",
          event_source_url: data.event_source_url,
          user_data,
        },
      ],
      partner_agent: "lovable",
    };
    const testCode = process.env["META_TEST_EVENT_CODE"];
    if (testCode) body.test_event_code = testCode;

    try {
      const response = await fetch(`https://connector-gateway.lovable.dev/meta_ads/v26.0/${META_PIXEL_ID}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gatewayKey}`,
          "X-Connection-Api-Key": connectionKey,
        },
        body: JSON.stringify(body),
      });
      // Return/log only receipt fields, never the event payload or arbitrary
      // provider messages that might echo identifiers or credentials.
      const raw = await response.json().catch(() => null);
      const receiptSchema = z.object({
        events_received: z.number().optional(),
        fbtrace_id: z.string().regex(/^[A-Za-z0-9_-]+$/).max(200).optional(),
        error: z.object({
          code: z.number().optional(),
          error_subcode: z.number().optional(),
          type: z.string().regex(/^[A-Za-z0-9_]+$/).max(100).optional(),
          fbtrace_id: z.string().regex(/^[A-Za-z0-9_-]+$/).max(200).optional(),
        }).optional(),
      });
      const parsed = receiptSchema.safeParse(raw);
      const receipt = parsed.success ? parsed.data : {};
      const sent = response.ok && !receipt.error && (receipt.events_received ?? 0) > 0;
      console.info("Meta CAPI receipt", { status: response.status, ...receipt });
      if (!sent) console.error("Meta CAPI rejected an event", { status: response.status, ...receipt });
      return { sent, status: response.status, response: receipt };
    } catch {
      console.error("Meta CAPI request failed", { reason: "transport_failure" });
      return { sent: false as const };
    }
  });

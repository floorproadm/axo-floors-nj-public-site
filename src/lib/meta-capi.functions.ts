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
    const token = process.env["META_CAPI_TOKEN"];
    // Token not configured yet: the browser pixel still reports on its own.
    if (!token) return { sent: false as const };

    const request = getRequest();
    const ip = (request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "")
      .split(",")[0]
      .trim();
    const user_data: Record<string, string> = {
      client_user_agent: request.headers.get("user-agent") ?? "",
    };
    if (ip) user_data.client_ip_address = ip;
    if (data.fbp) user_data.fbp = data.fbp;
    if (data.fbc) user_data.fbc = data.fbc;
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
      const response = await fetch(`https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error("Meta CAPI rejected an event", response.status, await response.text().catch(() => ""));
      }
      return { sent: response.ok };
    } catch (error) {
      console.error("Meta CAPI request failed", error);
      return { sent: false as const };
    }
  });

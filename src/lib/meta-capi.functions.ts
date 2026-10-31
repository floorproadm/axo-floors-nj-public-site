// Server-side copy of confirmed conversion events (Meta Conversions API).
// The browser pixel already fired the same event with the same event id; Meta
// deduplicates the pair. This function must never break the form UX: every
// failure path returns quietly.
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { META_PIXEL_ID } from "@/lib/meta-pixel";

const payloadSchema = z.object({
  event_name: z.enum(["Lead", "Contact", "ViewContent", "Schedule"]),
  event_id: z.string().uuid(),
  event_source_url: z.string().url().max(200),
  fbp: z.string().max(200).optional(),
  fbc: z.string().max(300).optional(),
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
    // No email/phone/name/zip matching fields: the site runs without a consent
    // banner, so there is no stored explicit advertising acceptance to match
    // customer identifiers against.

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

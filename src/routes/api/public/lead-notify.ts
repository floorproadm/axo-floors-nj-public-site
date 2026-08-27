import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

const NOTIFY_TO = "axofloorsnj@gmail.com";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  city: z.string().max(120).optional().nullable(),
  zip_code: z.string().max(20).optional().nullable(),
  lead_source: z.string().max(120).optional().nullable(),
  services: z.array(z.string().max(80)).max(20).optional().nullable(),
  budget: z.number().optional().nullable(),
  room_size: z.string().max(40).optional().nullable(),
  notes: z.string().max(8000).optional().nullable(),
});

type Lead = z.infer<typeof schema>;

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Parse the "## Section" + "- Label: value" markdown produced by /get-started. */
function parseNotes(notes: string): { title: string; rows: [string, string][] }[] {
  const sections: { title: string; rows: [string, string][] }[] = [];
  let current: { title: string; rows: [string, string][] } | null = null;
  for (const rawLine of notes.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("##")) {
      current = { title: line.replace(/^#+\s*/, ""), rows: [] };
      sections.push(current);
      continue;
    }
    const m = line.replace(/^[-*]\s*/, "").match(/^([^:]{1,60}):\s*(.+)$/);
    if (m && current) current.rows.push([m[1]!.trim(), m[2]!.trim()]);
    else if (current) current.rows.push(["", line.replace(/^[-*]\s*/, "")]);
  }
  return sections.filter((s) => s.rows.length > 0);
}

function table(title: string, rows: [string, string][]): string {
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600">${esc(v)}</td></tr>`,
    )
    .join("");
  return `<h3 style="margin:24px 0 8px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#8B6914">${esc(title)}</h3><table style="width:100%;border-collapse:collapse">${body}</table>`;
}

function buildHtml(lead: Lead): string {
  const contact: [string, string][] = [
    ["Name", lead.name],
    ["Phone", lead.phone || "—"],
    ["Email", lead.email],
    ["Address", [lead.address, lead.city, lead.zip_code].filter(Boolean).join(", ") || "—"],
    ["Source", lead.lead_source || "—"],
  ];
  const summary: [string, string][] = [
    ["Services", (lead.services || []).join(", ") || "—"],
    ["Square footage", lead.room_size ? `${lead.room_size} sq ft` : "—"],
    ["Budget", typeof lead.budget === "number" && lead.budget > 0 ? `$${lead.budget.toLocaleString("en-US")}` : "—"],
  ];
  const detail = lead.notes ? parseNotes(lead.notes) : [];

  return `<!DOCTYPE html><html><body style="margin:0;background:#f6f6f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#0b1a2b;border-radius:12px 12px 0 0;padding:20px 24px">
    <div style="color:#D4AF37;font-size:12px;letter-spacing:.12em;text-transform:uppercase">New lead — axofloorsnj.com</div>
    <div style="color:#fff;font-size:22px;font-weight:700;margin-top:4px">${esc(lead.name)}</div>
  </div>
  <div style="background:#fff;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px;padding:8px 24px 28px">
    ${table("Contact", contact)}
    ${table("Summary", summary)}
    ${detail.map((s) => table(s.title, s.rows)).join("")}
    <div style="margin-top:24px">
      <a href="tel:${esc((lead.phone || "").replace(/[^\d+]/g, ""))}" style="display:inline-block;background:#D4AF37;color:#0b1a2b;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:8px">Call ${esc(lead.name.split(" ")[0] || "lead")}</a>
      <a href="mailto:${esc(lead.email)}" style="display:inline-block;margin-left:8px;color:#0b1a2b;text-decoration:none;font-weight:600;padding:12px 12px">Reply by email</a>
    </div>
  </div>
  <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:16px">Sent automatically by the AXO Floors website.</p>
</div></body></html>`;
}

function buildText(lead: Lead): string {
  return [
    `New lead from axofloorsnj.com`,
    ``,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone || "-"}`,
    `Email: ${lead.email}`,
    `Address: ${[lead.address, lead.city, lead.zip_code].filter(Boolean).join(", ")}`,
    `Source: ${lead.lead_source || "-"}`,
    `Services: ${(lead.services || []).join(", ")}`,
    ``,
    lead.notes || "",
  ].join("\n");
}

function encodeHeader(value: string): string {
  // RFC 2047 for non-ASCII subject/name values
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function buildRaw(lead: Lead): string {
  const boundary = `axo_${Math.random().toString(36).slice(2)}`;
  const message = [
    `To: ${NOTIFY_TO}`,
    `Reply-To: ${lead.email}`,
    `Subject: ${encodeHeader(`New lead: ${lead.name} — ${(lead.services || []).join(", ") || "Website inquiry"}`)}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    Buffer.from(buildText(lead), "utf8").toString("base64"),
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    Buffer.from(buildHtml(lead), "utf8").toString("base64"),
    `--${boundary}--`,
    ``,
  ].join("\r\n");

  return Buffer.from(message, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export const Route = createFileRoute("/api/public/lead-notify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed: Lead;
        try {
          parsed = schema.parse(await request.json());
        } catch {
          return Response.json({ error: "invalid_payload" }, { status: 400 });
        }

        const lovableKey = process.env["LOVABLE_API_KEY"];
        const gmailKey = process.env["GOOGLE_MAIL_API_KEY"];
        if (!lovableKey || !gmailKey) {
          console.error("lead-notify: missing gateway credentials");
          return Response.json({ error: "email_not_configured" }, { status: 500 });
        }

        const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": gmailKey,
          },
          body: JSON.stringify({ raw: buildRaw(parsed) }),
        });

        if (!res.ok) {
          const body = await res.text();
          console.error(`lead-notify: gmail send failed [${res.status}] ${body}`);
          return Response.json({ error: "send_failed", status: res.status, body }, { status: 502 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});

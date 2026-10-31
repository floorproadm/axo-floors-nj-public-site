// @ts-nocheck
import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const read = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");

describe("Meta domain verification", () => {
  it("ships the verification tag in the SSR head so it appears in raw HTML", () => {
    const root = read("src/routes/__root.tsx");
    expect(root).toContain('"facebook-domain-verification"');
    expect(root).toContain("ji0rza11layhtf208ql5v7mbyzfn9j");
  });
});

describe("Meta conversion helper", () => {
  const helper = read("src/lib/metaTracking.ts");

  it("generates a unique event id per event and passes it to the pixel", () => {
    expect(helper).toContain("crypto.randomUUID()");
    expect(helper).toContain("{ eventID: eventId }");
  });

  it("never fires without an active, region-permitted pixel", () => {
    expect(helper).toContain("isMetaTrackingActive()");
  });

  it("guards every fbq call so ad blockers never throw", () => {
    expect(helper).toContain('fbq?.("track"');
  });

  it("reports only Lead to the server, with the same event id", () => {
    expect(helper).toContain('new Set(["Lead"])');
    expect(helper).toContain("event_id: eventId");
  });

  it("never puts the raw URL or query string into the server report", () => {
    expect(helper).toContain("safeAnalyticsPage(window.location.href)");
    expect(helper).not.toContain("window.location.href,\n");
  });
});

describe("Meta Conversions API server function", () => {
  const capi = read("src/lib/meta-capi.functions.ts");

  it("reads the access token inside the handler, never at module scope", () => {
    expect(capi).toContain('process.env["META_CAPI_TOKEN"]');
    expect(capi.indexOf('process.env["META_CAPI_TOKEN"]')).toBeGreaterThan(capi.indexOf(".handler"));
  });

  it("sends the deduplication pair and the lovable partner agent", () => {
    expect(capi).toContain("event_id: data.event_id");
    expect(capi).toContain('partner_agent: "lovable"');
    expect(capi).toContain('action_source: "website"');
  });

  it("supports the optional test event code", () => {
    expect(capi).toContain('process.env["META_TEST_EVENT_CODE"]');
    expect(capi).toContain("body.test_event_code = testCode");
  });

  it("sends no customer matching identifiers without a stored consent record", () => {
    expect(capi).not.toMatch(/sha-?256/i);
    expect(capi).not.toContain("external_id");
    expect(capi).not.toMatch(/\b(em|ph|fn|ln|zp):/);
  });

  it("fails quiet so the form UX never breaks", () => {
    expect(capi).toContain("return { sent: false as const }");
  });
});

describe("Conversion wiring", () => {
  it("fires Lead only after the get-started save is confirmed", () => {
    const source = read("src/pages/GetStarted.tsx");
    expect(source).toContain('trackMetaEvent("Lead", { content_name: "get-started"');
    expect(source.indexOf("saved.current = true")).toBeLessThan(source.indexOf('trackMetaEvent("Lead"'));
  });

  it("fires Lead only after the contact form insert succeeds", () => {
    const source = read("src/pages/Contact.tsx");
    expect(source).toContain('trackMetaEvent("Lead", { content_name: "contact-form" })');
    expect(source.indexOf("if (error) throw error")).toBeLessThan(source.indexOf('trackMetaEvent("Lead"'));
  });

  it("fires Lead only after the quiz lead insert succeeds", () => {
    const source = read("src/components/quiz/QuizFlow.tsx");
    expect(source).toContain('trackMetaEvent("Lead", { content_name: "quiz"');
    expect(source.indexOf("if (saveError) throw")).toBeLessThan(source.indexOf('trackMetaEvent("Lead"'));
  });

  it("fires ViewContent on the three service pages", () => {
    for (const [file, name] of [
      ["src/pages/Refinishing.tsx", "refinishing"],
      ["src/pages/Installation.tsx", "installation"],
      ["src/pages/Stairs.tsx", "stairs"],
    ]) {
      const source = read(file);
      expect(source).toContain(`trackMetaEvent("ViewContent", { content_name: "${name}", content_category: "service" })`);
    }
  });

  it("discloses the server-side reports in the privacy policy", () => {
    expect(read("src/routes/privacy-policy.tsx")).toContain("Conversions API");
  });
});

// @ts-nocheck -- vitest is run via bunx, matching existing project tests.
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const read = (file) => readFileSync(resolve(process.cwd(), file), "utf8");

const sourceFiles = readdirSync("src", { recursive: true })
  .map(String)
  .filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes(".test."))
  .map((f) => `src/${f}`);

const LEAD_FACING = [
  "src/pages/Links.tsx",
  "src/pages/Index.tsx",
  "src/pages/Gallery.tsx",
  "src/pages/GetStarted.tsx",
  "src/components/shared/Header.tsx",
  "src/components/locations/ssr/HeaderSSR.tsx",
];

describe("text-us message", () => {
  it("keeps the owner's wording as the single source", () => {
    const constants = read("src/lib/constants.ts");
    expect(constants).toContain(
      'export const AXO_SMS_MESSAGE = "Hi! My name is [Your Name]. I\'m interested in getting a flooring quote.";',
    );
    expect(constants).toContain("export const AXO_SMS_HREF");
    expect(constants).toMatch(/AXO_SMS_HREF = `sms:/);
    expect(constants).toContain("encodeURIComponent(AXO_SMS_MESSAGE)");
  });

  it("retires the old greetings everywhere on the site", () => {
    const stale = sourceFiles.filter((f) => {
      const c = read(f);
      return (
        /sms:/.test(c) &&
        /Hi AXO Floors!|Interested in flooring quote from your website/.test(c)
      );
    });
    expect(stale).toEqual([]);
  });

  it("routes every lead-facing text button through the shared message", () => {
    for (const f of LEAD_FACING) {
      expect(read(f), f).toMatch(/AXO_SMS_HREF|AXO_SMS_MESSAGE/);
    }
  });

  it("leaves only the purpose-built flows with their own wording", () => {
    const offenders = sourceFiles
      .filter((f) => {
        const c = read(f);
        return /sms:/.test(c) && !/AXO_SMS_HREF|AXO_SMS_MESSAGE/.test(c);
      })
      .sort();
    expect(offenders).toEqual(
      [
        "src/components/referral/ReferralDashboard.tsx", // share with any contact
        "src/components/shared/OnMyWayButton.tsx", // staff -> customer arrival note
        "src/pages/PublicInvoice.tsx", // invoice page, opens with no message
        "src/pages/PublicPortal.tsx", // client portal, opens with no message
        "src/pages/ReviewRequest.tsx", // photos to Eduardo's own number
        "src/pages/StainGallery.tsx", // booking with name, ZIP and chosen colors
      ].sort(),
    );
  });
});

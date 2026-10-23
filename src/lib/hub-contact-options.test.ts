// @ts-nocheck -- vitest is run via bunx, matching existing project tests.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");

describe("hub contact options", () => {
  const hub = read("src/pages/Links.tsx");
  const toggle = hub.slice(hub.indexOf("const PhoneToggle"), hub.indexOf("const Links ="));

  it("offers a call pathway and a text pathway, chosen by the visitor", () => {
    expect(hub).toContain("tel:${AXO_PHONE_TEL}");
    expect(hub).toContain("sms:${AXO_PHONE_TEL}");
    expect(hub).toContain("Call now");
    expect(hub).toContain("Prefer texting? Text Us Directly");
  });

  it("no longer sends visitors straight to a phone call", () => {
    expect(hub).not.toContain('"Call Us — (732) 351-8653"');
    expect(hub).not.toContain('to: "tel:+17323518653"');
  });

  it("hides the two choices behind a button that opens them below", () => {
    expect(hub).toContain("aria-expanded");
    expect(hub).toContain('aria-controls="phone-options"');
    expect(hub).toContain('id="phone-options"');
    // The choices only exist once the button is opened.
    expect(hub).toContain("{open && (");
    // Panel sits after the button in the markup, i.e. below it.
    expect(hub.indexOf('id="phone-options"')).toBeGreaterThan(hub.indexOf("aria-expanded"));
  });

  it("keeps the button the same shape as every hub row, in the gold primary style", () => {
    expect(toggle).toContain("rounded-xl px-5 py-3.5 font-heading");
    expect(toggle).toContain("gold-gradient");
    expect(toggle).toContain("text-black");
    // The revealed choices stay quiet rows.
    expect(toggle).toContain("bg-white/10");
  });

  it("shows an arrow that flips when the list opens", () => {
    expect(toggle).toContain("ChevronDown");
    expect(toggle).toContain("rotate-180");
  });

  it("marks each choice with an icon", () => {
    expect(hub).toMatch(/icon:\s*Phone/);
    expect(hub).toMatch(/icon:\s*MessageSquare/);
    expect(hub).toMatch(/<Icon[^>]*aria-hidden/);
  });

  it("pre-fills the text with the owner's shared message", () => {
    expect(hub).toContain("const SMS_BODY = AXO_SMS_MESSAGE;");
    expect(hub).not.toContain("Hi AXO Floors!");
  });
});

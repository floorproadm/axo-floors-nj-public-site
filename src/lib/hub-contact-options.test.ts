// @ts-nocheck -- vitest is run via bunx, matching existing project tests.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");

describe("hub contact options", () => {
  const hub = read("src/pages/Links.tsx");

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
});

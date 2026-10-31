// @ts-nocheck
import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";
import { CONSENT_REQUIRED_REGIONS, isTrackingAllowed } from "./region-consent";

const read = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");

describe("Meta pixel regional gating", () => {
  it("allows ordinary US traffic", () => {
    expect(isTrackingAllowed("US")).toBe(true);
  });

  it("blocks every consent-required region", () => {
    expect(CONSENT_REQUIRED_REGIONS.has("GB")).toBe(true);
    expect(CONSENT_REQUIRED_REGIONS.has("DE")).toBe(true);
    for (const region of CONSENT_REQUIRED_REGIONS) {
      expect(isTrackingAllowed(region)).toBe(false);
    }
  });

  it("blocks unresolved regions", () => {
    for (const region of ["", "XX", "T1", "zz"]) {
      expect(isTrackingAllowed(region)).toBe(false);
    }
  });
});

describe("Meta pixel install", () => {
  it("bootstraps the owner's pixel with the lovable agent", () => {
    const source = read("src/lib/meta-pixel.ts");
    expect(source).toContain('META_PIXEL_ID = "403151700983838"');
    expect(source).toContain('{ agent: "lovable" }');
    expect(source).toContain('"/cdn-cgi/trace"');
  });

  it("gates every region decision through the consent module", () => {
    expect(read("src/lib/meta-pixel.ts")).toContain("isTrackingAllowed(region)");
  });

  it("mounts the pixel in the root shell", () => {
    expect(read("src/routes/__root.tsx")).toContain("<MetaPixel />");
  });
});

// @ts-nocheck -- vitest is run via bunx, matching existing project tests.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");

describe("menu contents", () => {
  it("keeps Builders out of every navigation bar", () => {
    const files = [
      "src/components/shared/Header.tsx",
      "src/components/shared/AppSidebar.tsx",
      "src/components/locations/ssr/HeaderSSR.tsx",
    ];
    for (const file of files) {
      expect(read(file), file).not.toContain("/builders");
    }
  });

  it("keeps the Builders page itself live", () => {
    expect(read("src/App.tsx")).toContain('<Route path="/builders" element={<Builders />} />');
    expect(read("src/routes/sitemap[.]xml.ts")).toContain('"/builders"');
  });
});

// @ts-nocheck -- vitest is run via bunx, matching existing project tests.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { vinylPageHidden } from "./vinyl-page-hidden";

const read = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");

describe("hidden /vinyl-plank-flooring page", () => {
  it("answers the URL with 404 instead of the page", () => {
    const response = vinylPageHidden();
    expect(response.status).toBe(404);
    expect(response.headers.get("Location")).toBeNull();
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("keeps the page out of every menu, the sitemap, robots and the app router", () => {
    const files = [
      "src/components/shared/Header.tsx",
      "src/components/shared/AppSidebar.tsx",
      "src/components/locations/ssr/HeaderSSR.tsx",
      "src/components/shared/MobileStickyCTA.tsx",
      "src/routes/sitemap[.]xml.ts",
      "src/App.tsx",
      "src/pages/Installation.tsx",
      "public/robots.txt",
    ];
    for (const file of files) {
      expect(read(file), file).not.toContain("/vinyl-plank-flooring");
    }
  });

  it("keeps the page source in the repo so the owner can resume it", () => {
    expect(read("src/pages/VinylPlankFlooring.tsx")).toContain("Vinyl Plank Flooring");
  });
});

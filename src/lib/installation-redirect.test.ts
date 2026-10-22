// @ts-nocheck -- vitest is run via bunx, matching existing project tests.
import { describe, expect, it } from "vitest";
import { installationRedirect } from "./installation-redirect";

describe("installation legacy redirects", () => {
  it("permanently redirects /installation-v2 directly to /installation", () => {
    const response = installationRedirect();
    expect(response.status).toBe(301);
    expect(response.headers.get("Location")).toBe("/installation");
  });
  it("permanently redirects /hardwood-flooring directly to /installation", () => {
    const response = installationRedirect();
    expect(response.status).toBe(301);
    expect(response.headers.get("Location")).toBe("/installation");
  });
});
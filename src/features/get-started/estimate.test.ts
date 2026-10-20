// @ts-nocheck -- follows the project's bunx Vitest test convention.
import { describe, it, expect, vi } from "vitest";
import { AXO_ORG_ID } from "../../lib/constants";
import { estimateSchema, buildEstimatePayload, sendEstimate, captureEstimateAttribution, toggleEstimateService } from "./estimate";
const valid = { name: "Synthetic Test", phone: "(732) 555-0123", services: ["refinishing"], location: "Freehold", email: "", message: "", consent: true };
describe("Compact estimate rules", () => {
  it.each(["name", "phone", "location"])("requires %s", (key) => {
    expect(estimateSchema.safeParse({ ...valid, [key]: "" }).success).toBe(false);
  });
  it("requires project contact consent", () => { expect(estimateSchema.safeParse({ ...valid, consent: false }).success).toBe(false); });
  it("accepts blank optional email and description", () => { expect(estimateSchema.safeParse(valid).success).toBe(true); });
  it("validates supplied email", () => {
    expect(estimateSchema.safeParse({ ...valid, email: "invalid" }).success).toBe(false);
    expect(estimateSchema.safeParse({ ...valid, email: "synthetic@example.com" }).success).toBe(true);
    expect(estimateSchema.safeParse({ ...valid, email: "synthetic@example.com\r\nBcc: other@example.com" }).success).toBe(false);
  });
  it("accepts US phone with optional country code and rejects invalid US numbers", () => {
    expect(estimateSchema.safeParse({ ...valid, phone: "+1 732 555 0123" }).success).toBe(true);
    for (const phone of ["123", "0000000000", "+44 7325550123"]) expect(estimateSchema.safeParse({ ...valid, phone }).success).toBe(false);
  });
  it("accepts typed city OR ZIP without street selection", () => {
    expect(buildEstimatePayload(valid)).toMatchObject({ city: "Freehold", zip_code: null, address: null });
    expect(buildEstimatePayload({ ...valid, location: "07728" })).toMatchObject({ city: null, zip_code: "07728", address: null });
    expect(estimateSchema.safeParse({ ...valid, location: "12 Main St" }).success).toBe(false);
  });
  it.each(["refinishing", "installation", "stairs", "repair", "consultation"])("maps %s to existing service array", (service) => {
    expect(buildEstimatePayload({ ...valid, services: [service] })).toMatchObject({ services: [service], organization_id: AXO_ORG_ID, status: "new_lead", contact_type: "web_form", email: null });
  });
  it("preserves installation and refinishing in selected order", () => {
    expect(buildEstimatePayload({ ...valid, services: ["installation", "refinishing"] }).services).toEqual(["installation", "refinishing"]);
  });
  it("also preserves stairs with installation and refinishing", () => {
    expect(buildEstimatePayload({ ...valid, services: ["installation", "refinishing", "stairs"] }).services).toEqual(["installation", "refinishing", "stairs"]);
  });
  it("requires at least one service", () => {
    expect(estimateSchema.safeParse({ ...valid, services: [] }).success).toBe(false);
  });
  it.each([["unexpected"], ["installation", "installation"], Array(6).fill("stairs"), "installation", null])("rejects invalid services %j", (services) => {
    expect(estimateSchema.safeParse({ ...valid, services }).success).toBe(false);
  });
  it("rejects guidance combined with specific services", () => {
    expect(estimateSchema.safeParse({ ...valid, services: ["consultation", "installation"] }).success).toBe(false);
  });
  it("guidance clears specific services", () => {
    expect(toggleEstimateService(["installation", "refinishing"], "consultation", true)).toEqual(["consultation"]);
  });
  it("specific services clear guidance and allow combinations", () => {
    const first = toggleEstimateService(["consultation"], "installation", true);
    expect(first).toEqual(["installation"]);
    expect(toggleEstimateService(first, "refinishing", true)).toEqual(["installation", "refinishing"]);
  });
  it("deselects services without duplicates or changing other selections", () => {
    expect(toggleEstimateService(["installation", "stairs"], "installation", false)).toEqual(["stairs"]);
    expect(toggleEstimateService(["stairs"], "stairs", true)).toEqual(["stairs"]);
    expect(toggleEstimateService(["consultation"], "consultation", false)).toEqual([]);
  });
  it("includes every selected label in notes", () => {
    expect(buildEstimatePayload({ ...valid, services: ["installation", "refinishing", "stairs", "repair"] }).notes).toContain("- Services: Flooring Installation, Sanding & Refinishing, Stairs & Railings, Repairs & Restoration");
    expect(buildEstimatePayload({ ...valid, services: ["consultation"] }).notes).toContain("Not Sure / Need Guidance");
  });
  it("limits free text and contact fields", () => {
    for (const [key, size] of [["name",121],["email",201],["message",2001],["location",121]]) expect(estimateSchema.safeParse({ ...valid, [key]: "a".repeat(size) }).success).toBe(false);
  });
  it("makes exactly one insert and notification after successful validation", async () => {
    const insert = vi.fn().mockResolvedValue(undefined), notify = vi.fn().mockResolvedValue(true);
    const combination = { ...valid, services: ["installation", "refinishing", "stairs"] };
    await expect(sendEstimate(combination, {}, insert, notify)).resolves.toEqual({ saved: true, notificationSent: true });
    expect(insert).toHaveBeenCalledTimes(1); expect(notify).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith(combination, {});
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ services: combination.services, notes: expect.stringContaining("Flooring Installation, Sanding & Refinishing, Stairs & Railings") }));
    expect(insert.mock.invocationCallOrder[0]).toBeLessThan(notify.mock.invocationCallOrder[0]);
  });
  it("never inserts or notifies invalid submissions", async () => {
    const insert = vi.fn(), notify = vi.fn();
    await expect(sendEstimate({ ...valid, consent: false }, {}, insert, notify)).rejects.toThrow();
    expect(insert).not.toHaveBeenCalled(); expect(notify).not.toHaveBeenCalled();
  });
  it("does not notify when lead insertion fails", async () => {
    const insert = vi.fn().mockRejectedValue(new Error("mock failure")), notify = vi.fn();
    await expect(sendEstimate(valid, {}, insert, notify)).rejects.toThrow();
    expect(insert).toHaveBeenCalledTimes(1); expect(notify).not.toHaveBeenCalled();
  });
  it("does not reinsert after notification failure", async () => {
    const insert = vi.fn().mockResolvedValue(undefined), notify = vi.fn().mockRejectedValue(new Error("mock failure"));
    expect(await sendEstimate(valid, {}, insert, notify)).toEqual({ saved: true, notificationSent: false });
    expect(insert).toHaveBeenCalledTimes(1); expect(notify).toHaveBeenCalledTimes(1);
  });
  it("drops arbitrary queries, tokens and unsafe attribution values", () => {
    vi.stubGlobal("window", { location: { search: "?utm_source=instagram&name=Synthetic&utm_campaign=person%40example.com&token=secret", pathname: "/get-started" } });
    vi.stubGlobal("sessionStorage", { getItem: () => JSON.stringify({ referrer: "https://example.com/private?email=synthetic@example.com", landing_path: "/hub?token=private", fbclid: "private" }) });
    vi.stubGlobal("document", { referrer: "" });
    expect(captureEstimateAttribution()).toEqual({ utm_source: "instagram", referrer: "https://example.com/", landing_path: "/hub" });
    vi.unstubAllGlobals();
  });
});
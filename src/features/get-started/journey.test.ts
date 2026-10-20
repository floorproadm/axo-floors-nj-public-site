// @ts-nocheck -- follows the project's bunx Vitest test convention.
import { describe, expect, it, vi } from "vitest";
import { emptyJourney, journeySchema, journeySteps, journeyServices, normalizeJourney, switchJourneyService, type Journey } from "./journey";
import { estimateSchema, buildEstimatePayload, sendEstimate } from "./estimate";
import { insertEstimate } from "./estimate.server";
const database = vi.hoisted(() => ({ insert: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ from: () => ({ insert: database.insert }) }) }));
const contact = { name: "Synthetic Journey", phone: "7325550123", email: "", location: "07728", message: "Synthetic project", consent: true };
const install: Journey = { ...emptyJourney, serviceType: "new-installation", finishScope: "new-floor", floorType: "hardwood", materials: "customer_has", delivered: "yes", areaPreset: "1200", stairs: "yes", stairsCount: "12-20", startDate: "2026-11-14", timeline: "not-sure", contactMethod: "text" };
const refinish: Journey = { ...emptyJourney, serviceType: "floor-refinish", condition: "moderate-wear", customArea: "345.5", stairs: "no", timeline: "asap", contactMethod: "phone" };
const guidance: Journey = { ...emptyJourney, serviceType: "not-sure", timeline: "planning", contactMethod: "either" };
const form = (journey: Journey) => ({ ...contact, services: journeyServices(journey.serviceType), journey });
describe("Owner-approved guided journey", () => {
  it.each(["new-installation", "install-plus-refinish"])("requires finish scope for %s and has ten pages", (serviceType) => {
    expect(journeySteps(serviceType)).toEqual(["contact", "service", "finishScope", "floorType", "materials", "area", "date", "details", "timeline", "reach"]);
    expect(journeySchema.safeParse({ ...install, serviceType, finishScope: "" }).success).toBe(false);
  });
  it("refinishing has seven pages without purchase, scope or date", () => {
    expect(journeySteps("floor-refinish")).toEqual(["contact", "service", "condition", "area", "details", "timeline", "reach"]);
    expect(estimateSchema.safeParse(form(refinish)).success).toBe(true);
  });
  it("guidance has five pages and no technical/area requirements", () => {
    expect(journeySteps("not-sure")).toEqual(["contact", "service", "details", "timeline", "reach"]);
    expect(estimateSchema.safeParse(form(guidance)).success).toBe(true);
  });
  it.each(["new-installation", "floor-refinish", "install-plus-refinish", "not-sure"])("maps %s to canonical services", (service) => {
    const expected = service === "new-installation" ? ["installation"] : service === "floor-refinish" ? ["refinishing"] : service === "install-plus-refinish" ? ["installation", "refinishing"] : ["consultation"];
    expect(journeyServices(service)).toEqual(expected);
  });
  it("combination never changes services with finish scope", () => {
    for (const finishScope of ["new-floor", "existing", "both", "not-sure"] as const)
      expect(buildEstimatePayload(form({ ...install, serviceType: "install-plus-refinish", finishScope })).services).toEqual(["installation", "refinishing"]);
  });
  it("rejects a mismatched services array", () => {
    expect(estimateSchema.safeParse({ ...form(install), services: ["refinishing"] }).success).toBe(false);
  });
  it.each(["floorType", "materials", "delivered", "stairs", "stairsCount", "timeline", "contactMethod"])("requires visible %s", (key) => {
    expect(journeySchema.safeParse({ ...install, [key]: "" }).success).toBe(false);
  });
  it("requires refinishing condition", () => { expect(journeySchema.safeParse({ ...refinish, condition: "" }).success).toBe(false); });
  it("delivery is required only when flooring is purchased", () => {
    expect(journeySchema.safeParse({ ...install, materials: "axo_supply", delivered: "" }).success).toBe(true);
    expect(normalizeJourney({ ...install, materials: "needs_help" }).delivered).toBe("");
  });
  it("requires preset OR positive custom area, without Not Sure", () => {
    for (const customArea of ["", "0", "-1", "NaN", "Infinity", "1e3", "<script>"])
      expect(journeySchema.safeParse({ ...refinish, customArea }).success).toBe(false);
    expect(journeySchema.safeParse({ ...refinish, areaPreset: "200" }).success).toBe(false);
    expect(journeySchema.safeParse({ ...refinish, areaPreset: "not-sure", customArea: "" }).success).toBe(false);
    expect(journeySchema.safeParse({ ...refinish, customArea: "0.5" }).success).toBe(true);
  });
  it.each(["1-5", "6-11", "12-20", "20-plus"])("accepts stairs count %s", (stairsCount) => {
    expect(journeySchema.safeParse({ ...install, stairsCount }).success).toBe(true);
  });
  it("No stairs clears hidden count", () => { expect(journeySchema.parse({ ...install, stairs: "no" }).stairsCount).toBe(""); });
  it("date is optional and valid calendar dates only", () => {
    expect(journeySchema.safeParse({ ...install, startDate: "" }).success).toBe(true);
    for (const startDate of ["2026-02-30", "2026-13-01", "<script>"]) expect(journeySchema.safeParse({ ...install, startDate }).success).toBe(false);
  });
  it("switching branch clears all technical answers while preserving common preferences", () => {
    expect(switchJourneyService(install, "not-sure")).toEqual({ ...emptyJourney, serviceType: "not-sure", timeline: "not-sure", contactMethod: "text" });
  });
  it("server normalization excludes hidden answers from refinishing and guidance notes", () => {
    const result = buildEstimatePayload(form({ ...install, serviceType: "not-sure" }));
    for (const label of ["Finish scope", "Flooring type", "Material delivered", "Area preset", "Stair count", "Preferred exact start date", "Floor condition"])
      expect(result.notes).not.toContain(label);
    expect(journeySchema.parse({ ...install, serviceType: "floor-refinish", condition: "damaged" }).floorType).toBe("");
  });
  it("1200+ is a threshold in notes, not exact area or fake budget", () => {
    const payload = buildEstimatePayload(form(install));
    expect(payload.notes).toContain("Whole Floor (1200+ sq ft)");
    expect(payload.room_size).toBeNull(); expect(payload.budget).toBeNull();
  });
  it("saves every relevant installation answer and same notes in exactly one notification", async () => {
    const insert = vi.fn(async () => undefined), notify = vi.fn(async () => true);
    const result = await sendEstimate(form(install), {}, insert, notify);
    expect(result.saved).toBe(true); expect(insert).toHaveBeenCalledTimes(1); expect(notify).toHaveBeenCalledTimes(1);
    const payload = notify.mock.calls[0]?.[0] as ReturnType<typeof buildEstimatePayload> | undefined;
    expect(payload?.notes).toEqual(buildEstimatePayload(form(install)).notes);
    for (const value of ["For the new floor being installed", "Hardwood", "already bought it", "Material delivered: Yes", "12 – 20 steps", "2026-11-14", "General timeline: Not sure", "Text Message", "Synthetic project"]) expect(payload?.notes).toContain(value);
  });
  it("server rejects incomplete wizard before insert", async () => {
    database.insert.mockClear();
    await expect(insertEstimate(form({ ...install, timeline: "" }), {})).rejects.toThrow();
    expect(database.insert).not.toHaveBeenCalled();
  });
  it("server inserts one canonical combined lead with structured notes", async () => {
    database.insert.mockClear(); database.insert.mockResolvedValue({ error: null });
    expect(await insertEstimate(form({ ...install, serviceType: "install-plus-refinish" }), {})).toEqual({ saved: true });
    expect(database.insert).toHaveBeenCalledTimes(1);
    expect(database.insert).toHaveBeenCalledWith([expect.objectContaining({ services: ["installation", "refinishing"], notes: expect.stringContaining("Whole Floor (1200+ sq ft)") })]);
  });
  it("no notification for failed insert; no reinsert for failed notification", async () => {
    const insert = vi.fn(async () => { throw new Error("synthetic"); }), notify = vi.fn(async () => false);
    await expect(sendEstimate(form(guidance), {}, insert, notify)).rejects.toThrow(); expect(notify).not.toHaveBeenCalled();
    const success = vi.fn(async () => undefined);
    expect(await sendEstimate(form(guidance), {}, success, notify)).toEqual({ saved: true, notificationSent: false });
    expect(success).toHaveBeenCalledTimes(1); expect(notify).toHaveBeenCalledTimes(1);
  });
  it("optional email and media-free payload preserve contact validation", () => {
    expect(buildEstimatePayload(form(guidance)).email).toBeNull();
    expect(estimateSchema.safeParse({ ...form(guidance), email: "invalid" }).success).toBe(false);
    expect(estimateSchema.safeParse({ ...form(guidance), consent: false }).success).toBe(false);
    expect(estimateSchema.parse({ ...form(guidance), photos: ["local"], video: "local" })).not.toHaveProperty("photos");
  });
});

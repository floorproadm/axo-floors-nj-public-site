// @ts-nocheck -- follows the project's bunx Vitest test convention.
import { describe, it, expect, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({ insert: vi.fn(), from: vi.fn(), create: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.create }));
import { insertEstimate } from "./estimate.server";
const valid = { name: "Synthetic Server Test", phone: "7325550123", services: ["stairs"], location: "Freehold", message: "", email: "", consent: true };
describe("Server-side estimate boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.insert.mockResolvedValue({ error: null });
    mocks.from.mockReturnValue({ insert: mocks.insert });
    mocks.create.mockReturnValue({ from: mocks.from });
  });
  it("validates before opening a database connection", async () => {
    await expect(insertEstimate({ ...valid, phone: "bad" }, {})).rejects.toThrow();
    expect(mocks.create).not.toHaveBeenCalled(); expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("creates exactly one existing lead with optional email null and no session", async () => {
    expect(await insertEstimate(valid, {})).toEqual({ saved: true });
    expect(mocks.from).toHaveBeenCalledWith("leads"); expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(mocks.insert.mock.calls[0][0]).toEqual([expect.objectContaining({ email: null, services: ["stairs"], city: "Freehold", status: "new_lead" })]);
    expect(mocks.create.mock.calls[0][2].auth.persistSession).toBe(false);
  });
  it("never reports success for database failure", async () => {
    mocks.insert.mockResolvedValue({ error: { message: "synthetic error" } });
    expect(await insertEstimate(valid, {})).toEqual({ saved: false });
    expect(mocks.insert).toHaveBeenCalledTimes(1);
  });
  it("inserts one lead containing the complete multi-service array and labels", async () => {
    const services = ["installation", "refinishing", "stairs"];
    expect(await insertEstimate({ ...valid, services }, {})).toEqual({ saved: true });
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(mocks.insert).toHaveBeenCalledWith([expect.objectContaining({ services, notes: expect.stringContaining("Flooring Installation, Sanding & Refinishing, Stairs & Railings") })]);
  });
  it("accepts the archived consultation key alone", async () => {
    expect(await insertEstimate({ ...valid, services: ["consultation"] }, {})).toEqual({ saved: true });
    expect(mocks.insert).toHaveBeenCalledWith([expect.objectContaining({ services: ["consultation"] })]);
  });
  it.each([[], ["unknown"], ["stairs", "stairs"], ["consultation", "stairs"], Array(6).fill("repair")])("rejects invalid arrays before any insert %j", async (services) => {
    await expect(insertEstimate({ ...valid, services }, {})).rejects.toThrow();
    expect(mocks.create).not.toHaveBeenCalled(); expect(mocks.insert).not.toHaveBeenCalled();
  });
});
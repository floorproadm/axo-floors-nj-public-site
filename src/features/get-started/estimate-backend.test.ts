// @ts-nocheck -- follows the project's bunx Vitest test convention.
import { describe, it, expect, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({ rpc: vi.fn(), create: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.create }));
import { insertEstimate } from "./estimate.server";
const valid = { name: "Synthetic Server Test", phone: "7325550123", services: ["stairs"], location: "Freehold", message: "", email: "", consent: true };
describe("Server-side estimate boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.rpc.mockResolvedValue({ data: "11111111-1111-4111-8111-111111111111", error: null });
    mocks.create.mockReturnValue({ rpc: mocks.rpc });
  });
  it("validates before opening a database connection", async () => {
    await expect(insertEstimate({ ...valid, phone: "bad" }, {})).rejects.toThrow();
    expect(mocks.create).not.toHaveBeenCalled(); expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("creates exactly one existing lead with optional email null and no session", async () => {
    expect(await insertEstimate(valid, {})).toEqual({ saved: true, id: expect.any(String) });
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(mocks.rpc.mock.calls[0]).toEqual(["submit_public_lead", expect.objectContaining({ p_email: null, p_services: ["stairs"], p_message: expect.stringContaining("Freehold"), p_lead_source: "get-started" })]);
    expect(mocks.create.mock.calls[0][2].auth.persistSession).toBe(false);
  });
  it("never reports success for database failure", async () => {
    mocks.rpc.mockResolvedValue({ error: { message: "synthetic error" } });
    expect(await insertEstimate(valid, {})).toEqual({ saved: false });
    expect(mocks.rpc).toHaveBeenCalledTimes(2);
  });
  it("inserts one lead containing the complete multi-service array and labels", async () => {
    const services = ["installation", "refinishing", "stairs"];
    expect(await insertEstimate({ ...valid, services }, {})).toEqual({ saved: true, id: expect.any(String) });
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(mocks.rpc).toHaveBeenCalledWith("submit_public_lead", expect.objectContaining({ p_services: services, p_message: expect.stringContaining("Flooring Installation, Sanding & Refinishing, Stairs & Railings") }));
  });
  it("accepts the archived consultation key alone", async () => {
    expect(await insertEstimate({ ...valid, services: ["consultation"] }, {})).toEqual({ saved: true, id: expect.any(String) });
    expect(mocks.rpc).toHaveBeenCalledWith("submit_public_lead", expect.objectContaining({ p_services: ["consultation"] }));
  });
  it.each([[], ["unknown"], ["stairs", "stairs"], ["consultation", "stairs"], Array(6).fill("repair")])("rejects invalid arrays before any insert %j", async (services) => {
    await expect(insertEstimate({ ...valid, services }, {})).rejects.toThrow();
    expect(mocks.create).not.toHaveBeenCalled(); expect(mocks.rpc).not.toHaveBeenCalled();
  });
});
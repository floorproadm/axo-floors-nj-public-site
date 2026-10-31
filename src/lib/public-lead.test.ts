import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { ignorePublicSubmission, submitPublicLead } from "./public-lead";

const id = "22222222-2222-4222-8222-222222222222";
const input = { name: "Synthetic Tester", phone: "7325550123", source: "contact" as const };
describe("Public lead submission rules", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
  it("sends the exact consent-bearing RPC contract with an empty services array", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: id, error: null });
    expect(await submitPublicLead({ rpc }, input)).toBe(id);
    expect(rpc).toHaveBeenCalledExactlyOnceWith("submit_public_lead", {
      p_org_id: "a0000000-0000-0000-0000-000000000001", p_name: "Synthetic Tester",
      p_email: null, p_phone: "7325550123", p_message: "", p_services: [],
      p_lead_source: "contact", p_consent_ads: true, p_consent_text_version: "v1-2026-10",
    });
  });
  it("retries once only after 2000ms, preserving all arguments", async () => {
    const rpc = vi.fn().mockResolvedValueOnce({ data: null, error: {} }).mockResolvedValueOnce({ data: id, error: null });
    const pending = submitPublicLead({ rpc }, input);
    await vi.advanceTimersByTimeAsync(1999);
    expect(rpc).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(await pending).toBe(id);
    expect(rpc).toHaveBeenCalledTimes(2);
    expect(rpc.mock.calls[1]).toEqual(rpc.mock.calls[0]);
  });
  it("does not treat a missing UUID as success and never logs provider PII", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: "private@example.com" } });
    const assertion = expect(submitPublicLead({ rpc }, input)).rejects.toThrow("call or text (732) 351-8653");
    await vi.advanceTimersByTimeAsync(2000);
    await assertion;
    expect(rpc).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenCalledExactlyOnceWith("[public-lead] submission failed", { source: "contact" });
  });
  it("ignores a populated honeypot even after three seconds", () => {
    expect(ignorePublicSubmission("https://spam.example", 1000, 9000)).toBe(true);
  });
  it("ignores under-three-second submissions but accepts exactly three seconds", () => {
    expect(ignorePublicSubmission("", 1000, 3999)).toBe(true);
    expect(ignorePublicSubmission("", 1000, 4000)).toBe(false);
  });
});
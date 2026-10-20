// @ts-nocheck -- vitest is run via bunx, matching existing project tests.
import { describe, expect, it, vi } from "vitest";
import { allow, createIntake, finalizeAroundSave, newSessionKey, PARTIAL_INTAKE_URL, sameOrigin, signBody } from "./partial.server";

const key = newSessionKey();
const intakeWith = (replies: Record<string, unknown>) => {
  const calls: string[] = [];
  const intake = vi.fn(async (op) => { calls.push(op); const r = replies[op]; return typeof r === "function" ? r() : r ?? null; });
  return { calls, intake };
};

describe("partial-estimate bridge", () => {
  it("fails closed with no secret: no network call, form unaffected", async () => {
    const fetcher = vi.fn();
    expect(await createIntake(undefined, fetcher)("capture", key, {})).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("treats backend feature_disabled (503) as not durable", async () => {
    const fetcher = vi.fn(async () => new Response('{"error":"feature_disabled"}', { status: 503 }));
    expect(await createIntake("s".repeat(40), fetcher)("capture", key, { full_name: "Test", phone: "7325550123", email: null, project_location: "Edison" })).toBeNull();
  });
  it("signs timestamp.rawBody to the fixed endpoint without org fields", async () => {
    let seen;
    const fetcher = vi.fn(async (url, init) => { seen = { url, init }; return Response.json({ status: "captured" }); });
    const secret = "s".repeat(40);
    expect(await createIntake(secret, fetcher)("touch", key)).toEqual({ status: "captured", notification_already_authorized: false });
    expect(seen.url).toBe(PARTIAL_INTAKE_URL);
    const ts = seen.init.headers["x-pe-timestamp"];
    expect(seen.init.headers["x-pe-signature"]).toBe(await signBody(secret, ts, seen.init.body));
    expect(JSON.parse(seen.init.body)).toEqual({ op: "touch", session_key: key });
  });
  it("session keys are opaque 43-char random values", () => {
    expect(key).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(newSessionKey()).not.toBe(key);
  });
  it("rejects cross-origin and missing Origin", () => {
    expect(sameOrigin("https://axofloorsnj.com", "axofloorsnj.com")).toBe(true);
    expect(sameOrigin("https://evil.example", "axofloorsnj.com")).toBe(false);
    expect(sameOrigin(undefined, "axofloorsnj.com")).toBe(false);
  });
  it("throttles touches to one per minute per session", () => {
    expect(allow("touch:t1", 1, 60_000, 0)).toBe(true);
    expect(allow("touch:t1", 1, 60_000, 30_000)).toBe(false);
    expect(allow("touch:t1", 1, 60_000, 61_000)).toBe(true);
  });
});

describe("finalization around the canonical save", () => {
  it("no session: saves once, no partial calls", async () => {
    const { calls, intake } = intakeWith({});
    const save = vi.fn(async () => ({ saved: true }));
    expect((await finalizeAroundSave(undefined, intake, save)).result.saved).toBe(true);
    expect(save).toHaveBeenCalledTimes(1); expect(calls).toEqual([]);
  });
  it("success: begin_finalization before insert, then complete", async () => {
    const { calls, intake } = intakeWith({ begin_finalization: { status: "finalizing" }, complete: { status: "completed" } });
    const order: string[] = [];
    const out = await finalizeAroundSave(key, async (op) => { order.push(op); return intake(op); }, async () => { order.push("insert"); return { saved: true }; });
    expect(order).toEqual(["begin_finalization", "insert", "complete"]);
    expect(out.completion).toBe("completed");
  });
  it("partial backend down: lead still saved once, completion left pending (guard not released)", async () => {
    const { calls, intake } = intakeWith({});
    const save = vi.fn(async () => ({ saved: true }));
    const out = await finalizeAroundSave(key, intake, save);
    expect(save).toHaveBeenCalledTimes(1);
    expect(out).toEqual({ result: { saved: true }, completion: "pending" });
    expect(calls).not.toContain("release_finalization");
  });
  it("definitive save failure releases the guard", async () => {
    const { calls, intake } = intakeWith({ begin_finalization: { status: "finalizing" } });
    const out = await finalizeAroundSave(key, intake, async () => ({ saved: false }));
    expect(out.completion).toBe("released"); expect(calls).toEqual(["begin_finalization", "release_finalization"]);
  });
  it("ambiguous (thrown) save keeps the guard to prevent false alerts", async () => {
    const { calls, intake } = intakeWith({ begin_finalization: { status: "finalizing" } });
    await expect(finalizeAroundSave(key, intake, async () => { throw new Error("timeout"); })).rejects.toThrow();
    expect(calls).toEqual(["begin_finalization"]);
  });
});

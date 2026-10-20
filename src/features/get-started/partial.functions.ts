import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, getRequestHeader, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { estimateSchema } from "./estimate";
import {
  allow, CAPTURED_COOKIE, createIntake, newSessionKey, PENDING_COMPLETE_COOKIE, sameOrigin, SESSION_COOKIE, SESSION_KEY_PATTERN,
} from "./partial.server";

const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", maxAge: 60 * 60 * 24 * 14 };
const contactSchema = z.object({
  name: estimateSchema.innerType().shape.name,
  phone: estimateSchema.innerType().shape.phone,
  email: estimateSchema.innerType().shape.email,
  location: estimateSchema.innerType().shape.location,
}).strict();

function guard() {
  if (!sameOrigin(getRequestHeader("origin"), getRequestHeader("host"))) return null;
  const ip = getRequestHeader("cf-connecting-ip") || "unknown";
  return { ip };
}

/** Step 1 durable capture. Returns firstDurable only on the first authoritative "captured" for this session. */
export const capturePartialStep1 = createServerFn({ method: "POST" })
  .inputValidator((raw) => contactSchema.parse(raw))
  .handler(async ({ data }) => {
    const ctx = guard();
    if (!ctx || !allow(`capture:${ctx.ip}`, 10, 10 * 60_000)) return { firstDurable: false };
    const intake = createIntake(process.env["PARTIAL_ESTIMATE_INTAKE_SECRET"]);
    let key = getCookie(SESSION_COOKIE);
    if (!key || !SESSION_KEY_PATTERN.test(key)) key = newSessionKey();
    if (!allow(`capture:${key}`, 5, 10 * 60_000)) return { firstDurable: false };
    const result = await intake("capture", key, {
      full_name: data.name, phone: data.phone, email: data.email || null, project_location: data.location,
    });
    if (result?.status !== "captured") return { firstDurable: false }; // unconfigured, disabled, failed or not incomplete
    setCookie(SESSION_COOKIE, key, cookieOptions);
    const first = getCookie(CAPTURED_COOKIE) !== "1";
    setCookie(CAPTURED_COOKIE, "1", cookieOptions);
    return { firstDurable: first };
  });

/** Meaningful step progress only; throttled to one backend touch per minute per session. */
export const touchPartial = createServerFn({ method: "POST" }).handler(async () => {
  const key = getCookie(SESSION_COOKIE);
  if (!guard() || !key || !SESSION_KEY_PATTERN.test(key) || !allow(`touch:${key}`, 1, 60_000)) return { ok: false };
  const result = await createIntake(process.env["PARTIAL_ESTIMATE_INTAKE_SECRET"])("touch", key);
  return { ok: result?.status === "touched" };
});

/** Retries a completion that could not be confirmed right after a successful full save. */
export const flushPartialCompletion = createServerFn({ method: "POST" }).handler(async () => {
  const key = getCookie(SESSION_COOKIE);
  if (!guard() || getCookie(PENDING_COMPLETE_COOKIE) !== "1" || !key || !SESSION_KEY_PATTERN.test(key) || !allow(`flush:${key}`, 3, 60_000)) return { ok: false };
  const result = await createIntake(process.env["PARTIAL_ESTIMATE_INTAKE_SECRET"])("complete", key);
  if (result?.status !== "completed") return { ok: false };
  for (const name of [SESSION_COOKIE, CAPTURED_COOKIE, PENDING_COMPLETE_COOKIE]) deleteCookie(name, { path: "/" });
  return { ok: true };
});

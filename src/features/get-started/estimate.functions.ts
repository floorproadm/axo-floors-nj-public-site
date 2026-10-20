import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { estimateSchema, attributionSchema } from "./estimate";
import { insertEstimate } from "./estimate.server";
import { CAPTURED_COOKIE, createIntake, finalizeAroundSave, PENDING_COMPLETE_COOKIE, SESSION_COOKIE } from "./partial.server";

export const saveEstimate = createServerFn({ method: "POST" })
  .inputValidator((raw) => z.object({ form: estimateSchema, attribution: attributionSchema }).parse(raw))
  .handler(async ({ data }) => {
    const intake = createIntake(process.env["PARTIAL_ESTIMATE_INTAKE_SECRET"]);
    try {
      // The lead insert runs once; partial-estimate failures never change its outcome.
      const { result, completion } = await finalizeAroundSave(getCookie(SESSION_COOKIE), intake, () => insertEstimate(data.form, data.attribution));
      if (completion === "completed") for (const name of [SESSION_COOKIE, CAPTURED_COOKIE, PENDING_COMPLETE_COOKIE]) deleteCookie(name, { path: "/" });
      if (completion === "pending") setCookie(PENDING_COMPLETE_COOKIE, "1", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 14 });
      return result;
    } catch { return { saved: false as const }; }
  });

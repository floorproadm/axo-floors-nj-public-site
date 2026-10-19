import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { estimateSchema, attributionSchema } from "./estimate";
import { insertEstimate } from "./estimate.server";

export const saveEstimate = createServerFn({ method: "POST" })
  .inputValidator((raw) => z.object({ form: estimateSchema, attribution: attributionSchema }).parse(raw))
  .handler(async ({ data }) => {
    try { return await insertEstimate(data.form, data.attribution); }
    catch { return { saved: false as const }; }
  });
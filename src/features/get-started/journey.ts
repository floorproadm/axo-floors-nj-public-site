import { z } from "zod";
import { AREA_PRESETS, FINISH_SCOPE_OPTIONS, FLOOR_TYPE_OPTIONS, MATERIALS_OPTIONS, MATERIAL_DELIVERED_OPTIONS, QUIZ_CONDITION_OPTIONS, STAIRS_COUNT_OPTIONS, SERVICE_TYPE_OPTIONS } from "./copy";

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" }, { value: "1-month", label: "Within 1 month" },
  { value: "3-months", label: "Within 3 months" }, { value: "planning", label: "Just planning" }, { value: "not-sure", label: "Not sure" },
] as const;
export const contactOptions = [{ value: "text", label: "Text Message" }, { value: "phone", label: "Phone Call" }, { value: "either", label: "Either Works for Me" }] as const;
export const journeyFields = z.object({
  serviceType: z.enum(["", "new-installation", "floor-refinish", "install-plus-refinish", "not-sure"]),
  finishScope: z.enum(["", "new-floor", "existing", "both", "not-sure"]),
  floorType: z.enum(["", "hardwood", "laminate", "vinyl", "custom"]),
  materials: z.enum(["", "customer_has", "axo_supply", "needs_help"]),
  delivered: z.enum(["", "yes", "no", "not_sure"]),
  condition: z.enum(["", "light-wear", "moderate-wear", "heavy-wear", "damaged"]),
  areaPreset: z.enum(["", "200", "400", "600", "1200"]),
  customArea: z.string().max(16), stairs: z.enum(["", "yes", "no"]),
  stairsCount: z.enum(["", "1-5", "6-11", "12-20", "20-plus"]),
  startDate: z.string().max(10), timeline: z.enum(["", "asap", "1-month", "3-months", "planning", "not-sure"]),
  contactMethod: z.enum(["", "text", "phone", "either"]),
});
export type Journey = z.infer<typeof journeyFields>;
export const emptyJourney: Journey = { serviceType: "", finishScope: "", floorType: "", materials: "", delivered: "", condition: "", areaPreset: "", customArea: "", stairs: "", stairsCount: "", startDate: "", timeline: "", contactMethod: "" };
export const isInstallation = (service: string) => service === "new-installation" || service === "install-plus-refinish";
export function normalizeJourney(input: Journey): Journey {
  const data = { ...input };
  if (data.serviceType === "new-installation") { data.finishScope = ""; data.startDate = ""; }
  if (!isInstallation(data.serviceType)) { data.finishScope = ""; data.floorType = ""; data.materials = ""; data.delivered = ""; data.startDate = ""; }
  if (data.serviceType !== "floor-refinish") data.condition = "";
  if (data.serviceType === "not-sure" || !data.serviceType) { data.areaPreset = ""; data.customArea = ""; data.stairs = ""; data.stairsCount = ""; }
  if (data.materials !== "customer_has") data.delivered = "";
  if (data.stairs !== "yes") data.stairsCount = "";
  return data;
}
export function switchJourneyService(data: Journey, serviceType: Journey["serviceType"]): Journey {
  // Retain common contact preferences, but reset all technical answers on a branch change.
  return { ...emptyJourney, timeline: data.timeline, contactMethod: data.contactMethod, serviceType };
}
export function journeyServices(service: string): ("installation" | "refinishing" | "consultation")[] {
  if (service === "new-installation") return ["installation"];
  if (service === "floor-refinish") return ["refinishing"];
  if (service === "install-plus-refinish") return ["installation", "refinishing"];
  return service === "not-sure" ? ["consultation"] : [];
}
export const journeySchema = journeyFields.transform(normalizeJourney).superRefine((data, ctx) => {
  const required = (key: keyof Journey) => { if (!data[key]) ctx.addIssue({ code: "custom", path: [key], message: "Please choose an option." }); };
  required("serviceType"); required("timeline"); required("contactMethod");
  if (isInstallation(data.serviceType)) {
    if (data.serviceType === "install-plus-refinish") required("finishScope");
    required("floorType"); required("materials");
    if (data.materials === "customer_has") required("delivered");
    if (data.startDate) {
      const date = new Date(`${data.startDate}T12:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.startDate) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== data.startDate)
        ctx.addIssue({ code: "custom", path: ["startDate"], message: "Please select a valid date or leave it blank." });
    }
  }
  if (data.serviceType === "floor-refinish") required("condition");
  if (isInstallation(data.serviceType) || data.serviceType === "floor-refinish") {
    if (Boolean(data.areaPreset) === Boolean(data.customArea) || (data.customArea && (!/^\d+(?:\.\d+)?$/.test(data.customArea) || Number(data.customArea) <= 0 || !Number.isFinite(Number(data.customArea)))))
      ctx.addIssue({ code: "custom", path: ["areaPreset"], message: "Choose a preset OR enter positive custom square footage." });
    required("stairs"); if (data.stairs === "yes") required("stairsCount");
  }
});
export type JourneyStep = "contact" | "service" | "finishScope" | "floorType" | "materials" | "condition" | "area" | "date" | "details" | "timeline" | "reach";
export function journeySteps(service: string): JourneyStep[] {
  if (service === "new-installation") return ["contact", "service", "floorType", "materials", "area", "timeline", "reach"];
  const technical: JourneyStep[] = isInstallation(service) ? ["finishScope", "floorType", "materials", "area", "date"] : service === "floor-refinish" ? ["condition", "area"] : [];
  return ["contact", "service", ...technical, "details", "timeline", "reach"];
}
export const stepFields: Record<JourneyStep, string[]> = { contact: ["name", "phone", "email", "location"], service: ["serviceType"], finishScope: ["finishScope"], floorType: ["floorType"], materials: ["materials", "delivered"], condition: ["condition"], area: ["areaPreset", "stairs", "stairsCount"], date: ["startDate"], details: ["message"], timeline: ["timeline"], reach: ["contactMethod", "consent"] };
export function journeyNotes(data: Journey): string[] {
  const label = (options: readonly { value: string; label: string }[], value: string) => options.find((option) => option.value === value)?.label || value;
  const rows = [`- Service journey: ${label(SERVICE_TYPE_OPTIONS, data.serviceType)}`];
  if (isInstallation(data.serviceType)) {
    if (data.finishScope) rows.push(`- Finish scope: ${label(FINISH_SCOPE_OPTIONS, data.finishScope)}`);
    rows.push(`- Flooring type: ${label(FLOOR_TYPE_OPTIONS, data.floorType)}`, `- Materials: ${label(MATERIALS_OPTIONS, data.materials)}`);
    if (data.delivered) rows.push(`- Material delivered: ${label(MATERIAL_DELIVERED_OPTIONS, data.delivered)}`);
    if (data.startDate) rows.push(`- Preferred exact start date: ${data.startDate}`);
  }
  if (data.condition) rows.push(`- Floor condition: ${label(QUIZ_CONDITION_OPTIONS, data.condition)}`);
  if (data.areaPreset) {
    const preset = AREA_PRESETS.find((option) => option.value === data.areaPreset);
    rows.push(`- Area preset: ${preset?.label} (${preset?.hint})`);
  }
  if (data.customArea) rows.push(`- Custom square footage: ${data.customArea} sq ft`);
  if (data.stairs) rows.push(`- Stairs included: ${data.stairs === "yes" ? "Yes" : "No"}`);
  if (data.stairsCount) rows.push(`- Stair count: ${label(STAIRS_COUNT_OPTIONS, data.stairsCount)}`);
  rows.push(`- General timeline: ${label(timelineOptions, data.timeline)}`, `- Preferred contact method: ${label(contactOptions, data.contactMethod)}`);
  return rows;
}

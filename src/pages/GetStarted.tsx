import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/shared/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { AXO_ORG_ID, AXO_PHONE_DISPLAY } from "@/lib/constants";
import AddressAutocomplete from "@/features/get-started/AddressAutocomplete";
import {
  AREA_PRESETS,
  BELOW_GRADE_OPTIONS,
  COLOR_CHANGE_OPTIONS,
  FINISH_SCOPE_OPTIONS,
  FLOOR_TYPE_OPTIONS,
  LIVING_OPTIONS,
  LOCATION_OPTIONS,
  MATERIALS_OPTIONS,
  MATERIAL_DELIVERED_OPTIONS,
  QUIZ_BUDGET_OPTIONS,
  QUIZ_CONDITION_OPTIONS,
  QUIZ_COPY,
  QUIZ_TIMELINE_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  STAIRS_COUNT_OPTIONS,
  SUBFLOOR_OPTIONS,
  ATTRIBUTION_OPTIONS,
  WOOD_TYPE_OPTIONS,
  gsCopy,
} from "@/features/get-started/copy";
import {
  captureUtms,
  clearDraft,
  emptyData,
  formatBudget,
  formatPhone,
  isValidEmail,
  isValidPhone,
  loadDraft,
  saveDraft,
  servicesFromType,
  type GetStartedData,
  type UtmParams,
} from "@/features/get-started/state";

type StepId = string;

interface Step {
  id: StepId;
  title: string;
  helper?: string;
  render: () => React.ReactElement;
  validate?: () => string | null;
}

const amberBtn =
  "gold-gradient text-accent-foreground shadow-gold transition-smooth hover:opacity-90 font-heading font-semibold tracking-wide";


export default function GetStarted() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState<GetStartedData>(emptyData);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const utmRef = useRef<UtmParams>({});

  // Restore draft + capture UTMs once on load
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setData(draft.data);
      setStep(draft.step);
    }
    utmRef.current = captureUtms();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !done) saveDraft(data, step);
  }, [data, step, hydrated, done]);

  const set = useCallback(<K extends keyof GetStartedData>(key: K, value: GetStartedData[K]) => {
    setError(null);
    setData((d) => ({ ...d, [key]: value }));
  }, []);

  const isConsultation =
    data.services.length === 1 && data.services[0] === "consultation";


  const radioStep = (
    key: keyof GetStartedData,
    title: string,
    options: readonly (string | { value: string; label: string; hint?: string })[],
    errorMsg: string,
    helper?: string,
  ): Step => ({
    id: String(key),
    title,
    helper,
    render: () => (
      <RadioGroup
        value={String(data[key] ?? "")}
        onValueChange={(v) => set(key, v as never)}
        className="space-y-3"
      >
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const label = typeof opt === "string" ? opt : opt.label;
          const hint = typeof opt === "string" ? undefined : opt.hint;
          const active = String(data[key] ?? "") === value;
          return (
            <label
              key={value}
              htmlFor={`${String(key)}-${value}`}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                active ? "border-accent bg-accent/10 shadow-sm" : "border-border hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem id={`${String(key)}-${value}`} value={value} className="mt-1" />
              <span>
                <span className="block font-medium leading-snug">{label}</span>
                {hint && <span className="block text-sm text-muted-foreground">{hint}</span>}
              </span>
            </label>
          );
        })}
      </RadioGroup>
    ),
    validate: () => (String(data[key] ?? "").length > 0 ? null : errorMsg),
  });

  // ── Step assembly ────────────────────────────────────────
  const steps = useMemo<Step[]>(() => {
    const list: Step[] = [];

    list.push({
      id: "name",
      title: gsCopy.fields.name.label,
      render: () => (
        <Input
          autoFocus
          value={`${data.firstName}${data.lastName ? ` ${data.lastName}` : ""}`}
          placeholder={gsCopy.fields.name.placeholder}
          onChange={(e) => {
            const raw = e.target.value;
            const trimmedStart = raw.replace(/^\s+/, "");
            const parts = trimmedStart.split(" ");
            const first = parts.shift() ?? "";
            setError(null);
            setData((d) => ({ ...d, firstName: first, lastName: parts.join(" ") }));
          }}
          className="h-14 text-lg"
        />
      ),
      validate: () =>
        data.firstName.trim().length >= 2 ? null : gsCopy.fields.name.error,
    });


    list.push({
      id: "phone",
      title: (() => {
        const first = data.firstName.trim();
        if (!first) return gsCopy.fields.phone.label;
        const pretty = first.charAt(0).toUpperCase() + first.slice(1);
        return `${pretty}, ${gsCopy.fields.phone.label.charAt(0).toLowerCase()}${gsCopy.fields.phone.label.slice(1)}`;
      })(),
      render: () => (
        <Input
          autoFocus
          type="tel"
          inputMode="tel"
          value={data.phone}
          placeholder={gsCopy.fields.phone.placeholder}
          onChange={(e) => set("phone", formatPhone(e.target.value))}
          className="h-14 text-lg"
        />
      ),
      validate: () => (isValidPhone(data.phone) ? null : gsCopy.fields.phone.error),
    });

    list.push({
      id: "email",
      title: gsCopy.fields.email.label,
      render: () => (
        <Input
          autoFocus
          type="email"
          inputMode="email"
          value={data.email}
          placeholder={gsCopy.fields.email.placeholder}
          onChange={(e) => set("email", e.target.value)}
          className="h-14 text-lg"
        />
      ),
      validate: () => (isValidEmail(data.email) ? null : gsCopy.fields.email.error),
    });

    list.push({
      id: "address",
      title: gsCopy.fields.address.label,
      helper: gsCopy.fields.address.helper,
      render: () => (
        <AddressAutocomplete
          value={data.address}
          placeholder={gsCopy.fields.address.placeholder}
          invalid={Boolean(error)}
          onEnter={() => goNext()}
          onChange={(value, meta) =>
            setData((d) => ({
              ...d,
              address: value,
              addressVerified: meta.verified,
              city: meta.city ?? d.city,
              zip: meta.zip ?? d.zip,
            }))
          }
        />
      ),
      validate: () => {
        if (!data.address.trim()) return gsCopy.fields.address.errorEmpty;
        if (!data.addressVerified) return gsCopy.fields.address.error;
        return null;
      },
    });

    list.push(
      radioStep("leadSource", gsCopy.attribution.label, ATTRIBUTION_OPTIONS, gsCopy.attribution.error),
    );
    const pickServiceType = (value: string, scope?: string) => {
      setError(null);
      setData((d) => {
        const nextScope = value === "install-plus-refinish" ? (scope ?? d.finishScope) : "";
        return {
          ...d,
          serviceType: value,
          finishScope: nextScope,
          services: servicesFromType(value, nextScope),
        };
      });
    };

    const cardList = (
      options: readonly { value: string; label: string; hint?: string }[],
      selected: string,
      onPick: (v: string) => void,
    ) => (
      <div className="space-y-3">
        {options.map((opt) => {
          const active = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPick(opt.value)}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${
                active ? "border-accent bg-accent/10 shadow-sm" : "border-border hover:bg-muted/50"
              }`}
            >
              <span className="block font-medium leading-snug">{opt.label}</span>
              {opt.hint && <span className="mt-1 block text-sm text-muted-foreground">{opt.hint}</span>}
            </button>
          );
        })}
      </div>
    );

    list.push({
      id: "serviceType",
      title: gsCopy.service.label,
      helper: gsCopy.service.helper,
      render: () => cardList(SERVICE_TYPE_OPTIONS, data.serviceType, (v) => pickServiceType(v)),
      validate: () => (data.serviceType ? null : gsCopy.service.error),
    });

    if (data.serviceType === "install-plus-refinish") {
      list.push({
        id: "finishScope",
        title: gsCopy.finishScope.label,
        helper: gsCopy.finishScope.helper,
        render: () =>
          cardList(FINISH_SCOPE_OPTIONS, data.finishScope, (v) =>
            pickServiceType("install-plus-refinish", v),
          ),
        validate: () => (data.finishScope ? null : gsCopy.finishScope.error),
      });
    }

    // ── Quiz-parity branches (mirrors /quiz step logic) ──
    const branchKeys = (): string[] => {
      const t = data.serviceType;
      const installKeys = ["floorType", "materials", "location", "subfloorGrade", "area", "timeline", "budget"];
      const refinishKeys = ["condition", "wood", "livingDuringRefinish", "area", "colorChange", "timeline", "budget"];
      if (t === "not-sure") return ["area", "timeline", "budget"];
      if (t === "new-installation") return installKeys;
      if (t === "floor-refinish") return refinishKeys;
      if (t === "install-plus-refinish") {
        if (data.finishScope === "new-floor") return installKeys;
        if (data.finishScope === "existing") return refinishKeys;
        if (data.finishScope === "both")
          return ["floorType", "materials", "location", "subfloorGrade", "condition", "area", "timeline", "budget"];
        if (data.finishScope === "not-sure") return ["area", "timeline", "budget"];
      }
      return [];
    };

    const pick = (key: keyof GetStartedData, value: string) => {
      setError(null);
      setData((d) => ({ ...d, [key]: value }));
    };

    const simpleStep = (
      id: string,
      copy: { label: string; helper?: string; error: string },
      key: keyof GetStartedData,
      options: readonly { value: string; label: string; hint?: string }[],
    ): Step => ({
      id,
      title: copy.label,
      helper: copy.helper,
      render: () => cardList(options, String(data[key] ?? ""), (v) => pick(key, v)),
      validate: () => (String(data[key] ?? "") ? null : copy.error),
    });

    const chipRow = (
      key: keyof GetStartedData,
      options: readonly { value: string; label: string }[],
    ) => (
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => pick(key, opt.value)}
            className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
              String(data[key] ?? "") === opt.value
                ? "border-accent bg-accent/10 shadow-sm"
                : "border-border hover:bg-muted/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );

    const buildStep = (key: string): Step => {
      switch (key) {
        case "floorType":
          return simpleStep("floorType", QUIZ_COPY.floorType, "floorType", FLOOR_TYPE_OPTIONS);
        case "materials":
          return {
            id: "materials",
            title: QUIZ_COPY.materials.label,
            helper: QUIZ_COPY.materials.helper,
            render: () => (
              <div className="space-y-5">
                {cardList(MATERIALS_OPTIONS, data.materialsStatus, (v) => {
                  setError(null);
                  setData((d) => ({
                    ...d,
                    materialsStatus: v,
                    materialDelivered: v === "customer_has" ? d.materialDelivered : "",
                  }));
                })}
                {data.materialsStatus === "customer_has" && (
                  <div className="animate-in fade-in slide-in-from-top-2 space-y-3 rounded-xl border border-accent/40 bg-accent/5 p-4 duration-300">
                    <p className="font-heading font-semibold">{QUIZ_COPY.materials.deliveredLabel}</p>
                    {chipRow("materialDelivered", MATERIAL_DELIVERED_OPTIONS)}
                  </div>
                )}
              </div>
            ),
            validate: () => {
              if (!data.materialsStatus) return QUIZ_COPY.materials.error;
              if (data.materialsStatus === "customer_has" && !data.materialDelivered)
                return QUIZ_COPY.materials.deliveredError;
              return null;
            },
          };
        case "location":
          return simpleStep("location", QUIZ_COPY.location, "location", LOCATION_OPTIONS);
        case "subfloorGrade":
          return {
            id: "subfloorGrade",
            title: QUIZ_COPY.subfloorGrade.label,
            helper: QUIZ_COPY.subfloorGrade.helper,
            render: () => (
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="font-heading font-semibold">{QUIZ_COPY.subfloorGrade.subfloorLabel}</p>
                  {chipRow("subfloor", SUBFLOOR_OPTIONS)}
                </div>
                <div className="space-y-3">
                  <p className="font-heading font-semibold">{QUIZ_COPY.subfloorGrade.belowGradeLabel}</p>
                  {chipRow("belowGrade", BELOW_GRADE_OPTIONS)}
                </div>
              </div>
            ),
            validate: () => (data.subfloor && data.belowGrade ? null : QUIZ_COPY.subfloorGrade.error),
          };
        case "condition":
          return simpleStep("condition", QUIZ_COPY.condition, "currentCondition", QUIZ_CONDITION_OPTIONS);
        case "wood":
          return simpleStep("wood", QUIZ_COPY.wood, "woodType", WOOD_TYPE_OPTIONS);
        case "livingDuringRefinish":
          return simpleStep("livingDuringRefinish", QUIZ_COPY.living, "livingDuringRefinish", LIVING_OPTIONS);
        case "colorChange":
          return simpleStep("colorChange", QUIZ_COPY.colorChange, "colorChange", COLOR_CHANGE_OPTIONS);
        case "timeline":
          return simpleStep("timeline", QUIZ_COPY.timeline, "timeline", QUIZ_TIMELINE_OPTIONS);
        case "budget":
          return simpleStep("budget", QUIZ_COPY.budget, "budgetRange", QUIZ_BUDGET_OPTIONS);
        case "area":
        default:
          return {
            id: "area",
            title: QUIZ_COPY.area.label,
            helper: QUIZ_COPY.area.helper,
            render: () => (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  {AREA_PRESETS.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => pick("sqft", size.value)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        data.sqft === size.value
                          ? "border-accent bg-accent/10 shadow-sm"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <span className="block font-medium">{size.label}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{size.hint}</span>
                    </button>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">{QUIZ_COPY.area.customLabel}</p>
                  <div className="relative">
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={data.sqft}
                      onChange={(e) => set("sqft", e.target.value)}
                      className="h-14 pr-14 text-lg"
                      placeholder="Enter custom sq ft"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      sq ft
                    </span>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <p className="font-heading font-semibold">{gsCopy.qual.stairs.label}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setError(null);
                          setData((d) => ({
                            ...d,
                            stairsIncluded: opt.value,
                            stairsCount: opt.value === "no" ? "" : d.stairsCount,
                          }));
                        }}
                        className={`rounded-xl border px-4 py-4 font-medium transition-colors ${
                          data.stairsIncluded === opt.value
                            ? "border-accent bg-accent/10 shadow-sm"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {data.stairsIncluded === "yes" && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-3 rounded-xl border border-accent/40 bg-accent/5 p-4 duration-300">
                      <p className="font-heading font-semibold">{gsCopy.qual.stairs.countLabel}</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {STAIRS_COUNT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => pick("stairsCount", opt.value)}
                            className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                              data.stairsCount === opt.value
                                ? "border-accent bg-accent/15 shadow-sm"
                                : "border-border hover:bg-muted/50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ),
            validate: () => {
              if (!data.sqft || Number(data.sqft) <= 0) return QUIZ_COPY.area.error;
              if (!data.stairsIncluded) return gsCopy.qual.stairs.error;
              if (data.stairsIncluded === "yes" && !data.stairsCount) return gsCopy.qual.stairs.countError;
              return null;
            },
          };
      }
    };

    branchKeys().forEach((k) => list.push(buildStep(k)));

    list.push({
      id: "consent",
      title: gsCopy.consent.label,
      render: () => (
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4">
          <Checkbox
            checked={data.consent}
            onCheckedChange={(checked) => set("consent", Boolean(checked))}
            className="mt-1"
          />
          <span className="leading-relaxed">{gsCopy.consent.text}</span>
        </label>
      ),
      validate: () => (data.consent ? null : gsCopy.consent.error),
    });

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, set]);

  const totalScreens = steps.length + 1; // + intro
  const isIntro = step === 0;
  const current = steps[step - 1];
  const isLast = step === steps.length;
  const progress = done ? 100 : Math.round((step / totalScreens) * 100);

  const goNext = useCallback(() => {
    if (isIntro) {
      setDirection(1);
      setStep(1);
      return;
    }
    const err = current?.validate?.() ?? null;
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    if (isLast) {
      void submit();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, isIntro, isLast]);

  const goPrev = () => {
    setError(null);
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const labelOf = (
        options: readonly { value: string; label: string }[],
        value: string,
      ) => options.find((o) => o.value === value)?.label ?? "";

      const serviceLabels = [labelOf(SERVICE_TYPE_OPTIONS, data.serviceType) || data.serviceType].filter(Boolean);
      const budgetNumber =
        data.budgetRange === "10k-plus" ? 15000 :
        data.budgetRange === "5k-10k" ? 7500 :
        data.budgetRange === "2k-5k" ? 3500 :
        data.budgetRange === "under-2k" ? 2000 : null;
      const lines: string[] = [];
      // Markers: "## Title" starts a section, "- Label: value" is a row.
      // Mobile-friendly plain text; the notification template renders each
      // "##" block as a collapsible <details> section.
      const section = (title: string, rows: [string, string | null | undefined][]) => {
        const filled = rows.filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "");
        if (!filled.length) return;
        if (lines.length) lines.push("");
        lines.push(`## ${title}`);
        filled.forEach(([k, v]) => lines.push(`- ${k}: ${v}`));
      };

      section("Contact", [
        ["Name", `${data.firstName.trim()} ${data.lastName.trim()}`.trim()],
        ["Phone", data.phone],
        ["Email", data.email.trim()],
        ["Address", data.address],
        ["City", data.city],
        ["ZIP", data.zip],
      ]);

      section("Request", [
        ["Service", serviceLabels.join(", ")],
        ["Finish scope", labelOf(FINISH_SCOPE_OPTIONS, data.finishScope)],
        ["How they found us", data.leadSource],
      ]);

      section("Project", [
        ["Flooring type", labelOf(FLOOR_TYPE_OPTIONS, data.floorType)],
        ["Materials", labelOf(MATERIALS_OPTIONS, data.materialsStatus)],
        ["Material delivered", labelOf(MATERIAL_DELIVERED_OPTIONS, data.materialDelivered)],
        ["Location", labelOf(LOCATION_OPTIONS, data.location)],
        ["Subfloor", labelOf(SUBFLOOR_OPTIONS, data.subfloor)],
        ["Below grade", labelOf(BELOW_GRADE_OPTIONS, data.belowGrade)],
        ["Condition", labelOf(QUIZ_CONDITION_OPTIONS, data.currentCondition)],
        ["Wood type", labelOf(WOOD_TYPE_OPTIONS, data.woodType)],
        ["Living in home during work", labelOf(LIVING_OPTIONS, data.livingDuringRefinish)],
        ["Color change", labelOf(COLOR_CHANGE_OPTIONS, data.colorChange)],
        ["Square footage", data.sqft ? `${data.sqft} sq ft` : ""],
        [
          "Stairs",
          data.stairsIncluded === "yes"
            ? `Yes — ${STAIRS_COUNT_OPTIONS.find((o) => o.value === data.stairsCount)?.label ?? data.stairsCount}`
            : data.stairsIncluded === "no"
              ? "No"
              : "",
        ],
        ["Timeline", labelOf(QUIZ_TIMELINE_OPTIONS, data.timeline)],
        ["Budget", labelOf(QUIZ_BUDGET_OPTIONS, data.budgetRange)],
      ]);

      const utm = utmRef.current || {};
      section(
        "Attribution",
        Object.entries(utm)
          .filter(([, v]) => Boolean(v))
          .map(([k, v]) => [k, String(v)] as [string, string]),
      );

      const { error: insertError } = await supabase.from("leads").insert([
        {
          organization_id: AXO_ORG_ID,
          name: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
          email: data.email.trim(),
          phone: data.phone,
          address: data.address,
          city: data.city || null,
          zip_code: data.zip || null,
          lead_source: data.leadSource || "Website — Get Started",
          services: serviceLabels,
          budget: budgetNumber,
          room_size: data.sqft || null,
          message: null,
          notes: lines.join("\n"),
          status: "new_lead",
          priority: "high",
          contact_type: "web_form",
        } as never,
      ]);

      if (insertError) throw insertError;

      clearDraft();
      setDone(true);
    } catch (e) {
      console.error("Get Started submit failed:", e);
      toast({
        title: gsCopy.errorToast.title,
        description: `${gsCopy.errorToast.description.replace("(732) 351-8653", AXO_PHONE_DISPLAY)}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Enter advances
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || done) return;
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "TEXTAREA") return;
      e.preventDefault();
      goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, done]);

  const slideClass = direction === 1 ? "animate-gs-slide-in-right" : "animate-gs-slide-in-left";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <SEOHead
        title="Get Started — Tell Us About Your Floors | AXO Floors NJ"
        description="Answer a few quick questions about your hardwood project and the AXO Floors team will reach out with real answers — not a generic sales pitch."
      />

      {/* Progress bar */}
      <div className="h-1 w-full bg-muted">
        <div
          className="h-full gold-gradient transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-10 sm:py-16">
        {done ? (
          <div className="animate-gs-slide-in-right space-y-6 text-center">
            <h1 className="text-3xl font-bold [text-wrap:balance] sm:text-4xl">{gsCopy.thanks.headline}</h1>
            <p className="leading-relaxed text-muted-foreground">{gsCopy.thanks.body}</p>
            <Button className={`h-13 w-full py-6 text-base ${amberBtn}`} onClick={() => navigate("/")}>
              {gsCopy.thanks.cta}
            </Button>
          </div>
        ) : isIntro ? (
          <div className="animate-gs-slide-in-right space-y-6">
            <h1 className="text-3xl font-bold [text-wrap:balance] sm:text-4xl">{gsCopy.intro.headline}</h1>
            <p className="leading-relaxed text-muted-foreground">{gsCopy.intro.body}</p>
            <Button className={`w-full py-6 text-base ${amberBtn}`} onClick={goNext}>
              {gsCopy.intro.cta}
            </Button>
          </div>
        ) : (
          <div key={current?.id} className={`${slideClass} space-y-6`}>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Step {step} of {steps.length}
              </p>
              <h1 className="text-2xl font-bold [text-wrap:balance] sm:text-3xl">{current?.title}</h1>
              {current?.helper && <p className="text-sm text-muted-foreground">{current.helper}</p>}
            </div>

            {current?.render()}

            {error && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 py-6" onClick={goPrev} disabled={submitting}>
                {gsCopy.nav.previous}
              </Button>
              <Button className={`flex-1 py-6 ${amberBtn}`} onClick={goNext} disabled={submitting}>
                {isLast ? (submitting ? gsCopy.nav.submitting : gsCopy.nav.submit) : gsCopy.nav.next}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

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
  AREA_OPTIONS,
  ATTRIBUTION_OPTIONS,
  CONDITION_OPTIONS,
  CONSULT_TYPE_OPTIONS,
  CURRENT_FLOOR_OPTIONS,
  FURNISHED_OPTIONS,
  HOME_AGE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
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

  const isConsultation = data.service === "consultation";

  // ── Reusable field renderers ─────────────────────────────
  const textStep = (
    key: "firstName" | "lastName",
    copy: { label: string; placeholder: string; error: string },
  ): Step => ({
    id: key,
    title: copy.label,
    render: () => (
      <Input
        autoFocus
        value={data[key]}
        placeholder={copy.placeholder}
        onChange={(e) => set(key, e.target.value)}
        className="h-14 text-lg"
      />
    ),
    validate: () => (data[key].trim().length >= 2 ? null : copy.error),
  });

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
                active ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10" : "border-border hover:bg-muted/50"
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

    list.push(textStep("firstName", gsCopy.fields.firstName));
    list.push(textStep("lastName", gsCopy.fields.lastName));

    list.push({
      id: "phone",
      title: gsCopy.fields.phone.label,
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
    list.push(radioStep("service", gsCopy.service.label, SERVICE_OPTIONS, gsCopy.service.error));

    if (data.service === "consultation") {
      list.push(
        radioStep("consultType", gsCopy.consult.type.label, CONSULT_TYPE_OPTIONS, gsCopy.consult.type.error),
      );
      list.push({
        id: "consultantIntro",
        title: gsCopy.consult.introTitle,
        render: () => (
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent))]/20 text-lg font-bold text-[hsl(var(--accent-foreground))]">
                AXO
              </div>
              <div>
                <p className="font-semibold">{gsCopy.consult.consultantName}</p>
                <p className="text-sm text-muted-foreground">{gsCopy.consult.consultantRole}</p>
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-muted-foreground">{gsCopy.consult.bio}</p>
          </div>
        ),
      });
      list.push({
        id: "consultTopics",
        title: gsCopy.consult.topics.label,
        render: () => (
          <Textarea
            autoFocus
            rows={6}
            value={data.consultTopics}
            placeholder={gsCopy.consult.topics.placeholder}
            onChange={(e) => set("consultTopics", e.target.value)}
            className="text-base"
          />
        ),
      });
    } else if (data.service) {
      list.push({
        id: "wishlist",
        title: gsCopy.qual.wishlist.label,
        render: () => (
          <Textarea
            autoFocus
            rows={6}
            value={data.wishlist}
            placeholder={gsCopy.qual.wishlist.placeholder}
            onChange={(e) => set("wishlist", e.target.value)}
            className="text-base"
          />
        ),
      });
      list.push(radioStep("timeline", gsCopy.qual.timeline.label, TIMELINE_OPTIONS, gsCopy.qual.timeline.error));
      list.push({
        id: "budget",
        title: gsCopy.qual.budget.label,
        helper: gsCopy.qual.budget.helper,
        render: () => (
          <div className="space-y-6">
            <p className="text-4xl font-bold text-[hsl(var(--accent))]">{formatBudget(data.budget)}</p>
            <Slider
              value={[data.budget]}
              min={2000}
              max={50000}
              step={500}
              onValueChange={([v]) => set("budget", v)}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$2,000</span>
              <span>$50,000+</span>
            </div>
          </div>
        ),
      });
      list.push(
        radioStep("currentFloor", gsCopy.qual.currentFloor.label, CURRENT_FLOOR_OPTIONS, gsCopy.qual.currentFloor.error),
      );
      if (data.service === "refinishing") {
        list.push(
          radioStep("condition", gsCopy.qual.condition.label, CONDITION_OPTIONS, gsCopy.qual.condition.error),
        );
      }
      list.push({
        id: "areas",
        title: gsCopy.qual.areas.label,
        helper: gsCopy.qual.areas.helper,
        render: () => (
          <div className="space-y-3">
            {AREA_OPTIONS.map((area) => {
              const active = data.areas.includes(area);
              return (
                <label
                  key={area}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    active ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    checked={active}
                    onCheckedChange={(checked) =>
                      set("areas", checked ? [...data.areas, area] : data.areas.filter((a) => a !== area))
                    }
                  />
                  <span className="font-medium">{area}</span>
                </label>
              );
            })}
          </div>
        ),
        validate: () => (data.areas.length ? null : gsCopy.qual.areas.error),
      });
      list.push({
        id: "sqft",
        title: gsCopy.qual.sqft.label,
        render: () => (
          <div className="space-y-4">
            <div className="relative">
              <Input
                autoFocus
                type="number"
                inputMode="numeric"
                min={0}
                disabled={data.sqftNotSure}
                value={data.sqft}
                onChange={(e) => set("sqft", e.target.value)}
                className="h-14 pr-14 text-lg"
                placeholder="1200"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                ft²
              </span>
            </div>
            <label className="flex cursor-pointer items-center gap-3">
              <Checkbox
                checked={data.sqftNotSure}
                onCheckedChange={(checked) => {
                  setError(null);
                  setData((d) => ({ ...d, sqftNotSure: Boolean(checked), sqft: checked ? "" : d.sqft }));
                }}
              />
              <span>{gsCopy.qual.sqft.notSure}</span>
            </label>
          </div>
        ),
        validate: () =>
          data.sqftNotSure || Number(data.sqft) > 0 ? null : gsCopy.qual.sqft.error,
      });
      list.push(
        radioStep("propertyType", gsCopy.qual.propertyType.label, PROPERTY_TYPE_OPTIONS, gsCopy.qual.propertyType.error),
      );
      list.push(radioStep("furnished", gsCopy.qual.furnished.label, FURNISHED_OPTIONS, gsCopy.qual.furnished.error));
      list.push(radioStep("homeAge", gsCopy.qual.homeAge.label, HOME_AGE_OPTIONS, gsCopy.qual.homeAge.error));
    }

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
      const serviceLabel = SERVICE_OPTIONS.find((s) => s.value === data.service)?.label ?? data.service;
      const details: string[] = [`Service: ${serviceLabel}`];
      if (isConsultation) {
        const ct = CONSULT_TYPE_OPTIONS.find((c) => c.value === data.consultType)?.label;
        if (ct) details.push(`Consultation type: ${ct}`);
        if (data.consultTopics) details.push(`Topics to cover: ${data.consultTopics}`);
      } else {
        if (data.wishlist) details.push(`Dream floors: ${data.wishlist}`);
        if (data.timeline) details.push(`Timeline: ${data.timeline}`);
        details.push(`Budget: ${formatBudget(data.budget)}`);
        if (data.currentFloor) details.push(`Current floors: ${data.currentFloor}`);
        if (data.condition) details.push(`Condition: ${data.condition}`);
        if (data.areas.length) details.push(`Areas: ${data.areas.join(", ")}`);
        details.push(`Square footage: ${data.sqftNotSure ? "Not sure" : `${data.sqft} ft²`}`);
        if (data.propertyType) details.push(`Property type: ${data.propertyType}`);
        if (data.furnished) details.push(`Furnished: ${data.furnished}`);
        if (data.homeAge) details.push(`Home age: ${data.homeAge}`);
      }
      const utm = utmRef.current || {};
      const utmLines = Object.entries(utm)
        .filter(([, v]) => Boolean(v))
        .map(([k, v]) => `${k}=${v}`);
      if (utmLines.length) details.push(`Attribution: ${utmLines.join(" | ")}`);

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
          services: [serviceLabel],
          budget: isConsultation ? null : data.budget,
          room_size: data.sqftNotSure ? "Not sure" : data.sqft || null,
          message: isConsultation ? data.consultTopics : data.wishlist,
          notes: details.join("\n"),
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
          className="h-full bg-[hsl(var(--accent))] transition-all duration-300"
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

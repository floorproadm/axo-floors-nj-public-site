import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, CalendarIcon, Loader2, MessageSquare } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SEOHead from "@/components/shared/SEOHead";
import logo from "@/assets/axo-logo-official.png";
import { AXO_PHONE_TEL } from "@/lib/constants";
import { gsCopy, estimateCopy, SERVICE_TYPE_OPTIONS, FINISH_SCOPE_OPTIONS, FLOOR_TYPE_OPTIONS, MATERIALS_OPTIONS, MATERIAL_DELIVERED_OPTIONS, AREA_PRESETS, QUIZ_CONDITION_OPTIONS, STAIRS_COUNT_OPTIONS } from "@/features/get-started/copy";
import { captureEstimateAttribution, emptyEstimate, estimateSchema, sendEstimate, type EstimateAttribution } from "@/features/get-started/estimate";
import { emptyJourney, journeySchema, journeyServices, journeySteps, stepFields, switchJourneyService, normalizeJourney, timelineOptions, contactOptions, type Journey, type JourneyStep } from "@/features/get-started/journey";
import { saveEstimate } from "@/features/get-started/estimate.functions";
import { ProjectPhotos } from "@/features/get-started/ProjectPhotos";
import "@/features/get-started/estimate.css";

const goldButton = "gold-gradient text-accent-foreground shadow-gold transition-smooth hover:opacity-90 font-heading font-semibold";
const titles: Record<JourneyStep, string> = {
  contact: "First, Let's Get to Know You.", service: "What type of service do you need?",
  finishScope: "Is this finish for new wood we'll install, or for existing floors?",
  floorType: "What type of flooring are you interested in?", materials: "Do you already have the flooring picked out and on order?",
  condition: "What's the current condition of your floors?", area: "What's the approximate area for this project?",
  date: "When would you like to start the project?", details: "Tell Us a Little More",
  timeline: "When are you looking to start?", reach: "What's the best way to reach you?",
};
const helpers: Partial<Record<JourneyStep, string>> = {
  service: "Choose the option that best describes your project", finishScope: "This decides which checks we need to run",
  floorType: "This helps us choose the right installation method and prep.", materials: "This affects scheduling, delivery timing, and the install plan.",
  condition: "This helps us determine the best refinishing approach", area: "Choose from common sizes or enter a custom amount",
  date: "Preferred exact date (optional)", details: "Project details (optional)",
};

type Options = readonly { value: string; label: string; hint?: string }[];
function ChoiceCards({ field, value, options, onChange, error, compact = false, area = false }: { field: string; value: string; options: Options; onChange: (value: string) => void; error?: string; compact?: boolean; area?: boolean }) {
  return <RadioGroup value={value} onValueChange={onChange} aria-label={field} aria-invalid={Boolean(error)} aria-describedby={error ? `${field}-error` : undefined} className={area ? "grid grid-cols-2 gap-3 sm:grid-cols-4" : compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 gap-4 sm:grid-cols-2"}>
    {options.map((option, index) => <Label key={option.value} htmlFor={`${field}-${option.value}`} className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 text-center transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${area ? "p-3 min-h-20" : compact ? "p-4 min-h-14" : "p-6 min-h-28"} ${value === option.value ? "border-gold bg-gold/10" : "border-grey/20 bg-card hover:border-gold/50"}`}>
      <RadioGroupItem id={`${field}-${option.value}`} value={option.value} data-field={index === 0 ? field : undefined} className="sr-only" />
      <span className={`${area ? "text-sm" : "text-base"} font-semibold text-navy`}>{option.label}</span>
      {option.hint && <span className={`mt-2 font-normal text-grey ${area ? "text-xs" : "text-sm"}`}>{option.hint}</span>}
    </Label>)}
  </RadioGroup>;
}

export default function GetStarted() {
  const [form, setForm] = useState(emptyEstimate);
  const [journey, setJourney] = useState<Journey>(emptyJourney);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [notificationFailed, setNotificationFailed] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [direction, setDirection] = useState<"right" | "left">("right");
  const locked = useRef(false);
  const saved = useRef(false);
  const attribution = useRef<EstimateAttribution>({});
  const formRef = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const insert = useServerFn(saveEstimate);
  const steps = journeySteps(journey.serviceType);
  const current = steps[step - 1];
  const sms = `sms:${AXO_PHONE_TEL}?body=${encodeURIComponent("Hi AXO Floors! I'd like to discuss an estimate for my flooring project.")}`;

  // Never hydrate legacy wizard drafts or put contact data/media into URLs or analytics.
  useEffect(() => { attribution.current = captureEstimateAttribution(); }, []);
  useEffect(() => { heading.current?.focus(); window.scrollTo({ top: 0, behavior: "instant" }); }, [step, done]);
  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" })); setSubmitError("");
  }
  function updateJourney<K extends keyof Journey>(key: K, value: Journey[K]) {
    setJourney((previous) => {
      if (key === "serviceType") return switchJourneyService(previous, value as Journey["serviceType"]);
      const next = { ...previous, [key]: value };
      if (key === "areaPreset") next.customArea = "";
      if (key === "customArea") next.areaPreset = "";
      return normalizeJourney(next);
    });
    setErrors({}); setSubmitError("");
  }
  function displayErrors(next: Record<string, string>) {
    setErrors(next);
    const first = Object.keys(next)[0];
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus());
  }
  function validateStep(): boolean {
    if (!current) return false;
    const parsed = estimateSchema.safeParse({ ...form, services: journeyServices(journey.serviceType) });
    const technical = journeySchema.safeParse(journey);
    const next: Record<string, string> = {};
    for (const issue of [...(parsed.success ? [] : parsed.error.issues), ...(technical.success ? [] : technical.error.issues)]) {
      const field = String(issue.path[0]);
      if (stepFields[current].includes(field) && !next[field]) next[field] = issue.message;
    }
    displayErrors(next); return Object.keys(next).length === 0;
  }
  async function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current || saved.current || !validateStep()) return;
    if (step < steps.length) { setDirection("right"); setStep(step + 1); return; }
    const parsed = estimateSchema.safeParse({ ...form, services: journeyServices(journey.serviceType), journey });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path.at(-1))] = issue.message;
      displayErrors(next); return;
    }
    locked.current = true; setSending(true); setSubmitError("");
    try {
      const result = await sendEstimate(parsed.data, attribution.current, async (data, safe) => {
        const result = await insert({ data: { form: data, attribution: safe } });
        if (!result.saved) throw new Error("not_saved");
        saved.current = true;
      }, async (payload) => {
        const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 10000);
        try {
          const response = await fetch("/api/public/lead-notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: controller.signal });
          return response.ok;
        } finally { clearTimeout(timer); }
      });
      setNotificationFailed(!result.notificationSent); setDone(true);
      setForm(emptyEstimate); setJourney(emptyJourney);
    } catch {
      setSubmitError("We couldn't confirm your request was saved. Please text us directly before retrying.");
    } finally { setSending(false); if (!saved.current) locked.current = false; }
  }
  const errorFor = (field: string) => errors[field] ? <p id={`${field}-error`} role="alert" className="mt-2 text-sm text-destructive">{errors[field]}</p> : null;
  const inputProps = (field: string) => ({ id: field, "data-field": field, "aria-invalid": Boolean(errors[field]), "aria-describedby": errors[field] ? `${field}-error` : undefined });
  const choices = (field: keyof Journey, options: Options, compact = false, area = false) => <><ChoiceCards field={field} value={journey[field]} options={options} onChange={(value) => updateJourney(field, value as Journey[typeof field])} error={errors[field]} compact={compact} area={area} />{errorFor(field)}</>;
  const back = () => { if (sending) return; setErrors({}); setSubmitError(""); setDirection("left"); setStep(Math.max(0, step - 1)); };

  return <div className="estimate-page flex min-h-[100dvh] flex-col bg-background text-foreground">
    <SEOHead title="Get Started — Tell Us About Your Floors | AXO Floors NJ" description="Answer a few quick questions about your hardwood project and the AXO Floors team will reach out with real answers — not a generic sales pitch." />
    {step === 0 && !done ? <>
      <div className="h-1 w-full bg-muted" />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-10 sm:py-16">
        <div className="animate-gs-slide-in-right space-y-6">
          <Link to="/" aria-label="AXO Floors home" className="block w-fit rounded-md bg-navy px-4 py-3"><img src={logo} alt="AXO Floors" className="h-16 w-auto" /></Link>
          <h1 ref={heading} tabIndex={-1} className="text-3xl font-bold [text-wrap:balance] focus:outline-none sm:text-4xl">{gsCopy.intro.headline}</h1>
          <p className="leading-relaxed text-muted-foreground">{gsCopy.intro.body}</p>
          <Button type="button" className={`w-full py-6 text-base ${goldButton}`} onClick={() => { setDirection("right"); setStep(1); }}>{gsCopy.intro.cta}</Button>
        </div>
      </main>
    </> : <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-16">
      {done ? <section className="animate-gs-slide-in-right mx-auto max-w-xl space-y-6 text-center" aria-live="polite">
        <h1 ref={heading} tabIndex={-1} className="text-3xl font-bold [text-wrap:balance] focus:outline-none sm:text-4xl">Thank You — You're in Good Hands</h1>
        <p className="leading-relaxed text-muted-foreground">Thank you for considering AXO Floors. Our team will reach out to discuss your goals, answer your questions, and help you plan the next steps.</p>
        {notificationFailed && <p role="status" className="text-sm text-muted-foreground">Your request is saved, but the email notification could not be confirmed. You can text us directly; please don't submit again.</p>}
        {photoCount > 0 && <p role="status" className="text-sm text-muted-foreground">Your photos were local previews only and were not attached to this request.</p>}
        <Button asChild className={`min-h-12 w-full ${goldButton}`}><Link to="/">Return Home</Link></Button>
      </section> : current && <>
        <div className="mb-4 flex items-center justify-center gap-2" aria-hidden="true">{steps.map((item, i) => <span key={item} className={`h-1 w-8 rounded ${step >= i + 1 ? "bg-gold" : "bg-grey/30"}`} />)}</div>
        <Card className="border-2 border-gold/20 bg-card shadow-elegant">
          <CardHeader className="pb-4 text-center"><CardTitle className="font-heading text-xl text-navy">Step {step} of {steps.length}</CardTitle></CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form ref={formRef} onSubmit={advance} noValidate aria-label="Estimate request" aria-busy={sending}>
              <div key={current} className={`animate-gs-slide-in-${direction} space-y-6`}>
                <div className="mb-6 text-center"><h1 ref={heading} tabIndex={-1} className="mb-2 font-heading text-2xl font-bold text-navy focus:outline-none">{titles[current]}</h1>{helpers[current] && <p className="text-grey">{helpers[current]}</p>}</div>
                <fieldset disabled={sending} className="space-y-6">
                  {current === "contact" && <div className="grid gap-5 sm:grid-cols-2">
                    <div><Label htmlFor="name">Full Name *</Label><Input {...inputProps("name")} required autoComplete="name" maxLength={120} value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-2 h-12 text-base" />{errorFor("name")}</div>
                    <div><Label htmlFor="phone">Phone Number *</Label><Input {...inputProps("phone")} required type="tel" autoComplete="tel" maxLength={40} value={form.phone} onChange={(e) => update("phone", e.target.value)} className="mt-2 h-12 text-base" />{errorFor("phone")}</div>
                    <div><Label htmlFor="email">Email (optional)</Label><Input {...inputProps("email")} type="email" autoComplete="email" maxLength={200} value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-2 h-12 text-base" />{errorFor("email")}</div>
                    <div><Label htmlFor="location">Project City or ZIP Code *</Label><Input {...inputProps("location")} required autoComplete="off" maxLength={120} placeholder="e.g. Freehold or 07728" value={form.location} onChange={(e) => update("location", e.target.value)} className="mt-2 h-12 text-base" /><p className="mt-2 text-xs text-grey">We serve New Jersey, New York and Pennsylvania.</p>{errorFor("location")}</div>
                  </div>}
                  {current === "service" && choices("serviceType", SERVICE_TYPE_OPTIONS)}
                  {current === "finishScope" && choices("finishScope", FINISH_SCOPE_OPTIONS)}
                  {current === "floorType" && choices("floorType", FLOOR_TYPE_OPTIONS)}
                  {current === "condition" && choices("condition", QUIZ_CONDITION_OPTIONS)}
                  {current === "materials" && <>{choices("materials", MATERIALS_OPTIONS)}{journey.materials === "customer_has" && <div className="border-t border-grey/20 pt-4"><h2 className="mb-3 text-center text-base font-semibold text-navy">Is the material already delivered on-site?</h2>{choices("delivered", MATERIAL_DELIVERED_OPTIONS, true)}</div>}</>}
                  {current === "area" && <>
                    {choices("areaPreset", AREA_PRESETS, true, true)}
                    <div className="mx-auto max-w-md"><Label htmlFor="customArea">Or enter custom square footage</Label><div className="relative mt-2"><Input {...inputProps("customArea")} type="number" min="0" step="any" value={journey.customArea} onChange={(e) => updateJourney("customArea", e.target.value)} placeholder="Enter custom sq ft" className="h-12 pr-16 text-center text-lg" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-grey">sq ft</span></div></div>
                    <div className="mx-auto max-w-md pt-2"><h2 className="mb-3 text-center font-body text-base font-medium text-navy">Any stairs included in this project?</h2>{choices("stairs", [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }], true)}
                      {journey.stairs === "yes" && <div className="mt-4"><Label htmlFor="stairsCount" className="mb-2 block text-center">How many steps?</Label><Select value={journey.stairsCount} onValueChange={(value) => updateJourney("stairsCount", value as Journey["stairsCount"])}><SelectTrigger {...inputProps("stairsCount")} className="mx-auto h-12 w-full max-w-xs"><SelectValue placeholder="Select step count" /></SelectTrigger><SelectContent>{STAIRS_COUNT_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>{errorFor("stairsCount")}</div>}
                    </div>
                  </>}
                  {current === "date" && <div className="mx-auto max-w-md space-y-3">
                    <Popover><PopoverTrigger asChild><Button type="button" variant="outline" {...inputProps("startDate")} className="min-h-12 w-full justify-start text-left font-normal"><CalendarIcon className="h-4 w-4" />{journey.startDate ? format(parseISO(journey.startDate), "PPP") : "Pick a date (optional)"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="center"><Calendar mode="single" selected={journey.startDate ? parseISO(journey.startDate) : undefined} onSelect={(date) => updateJourney("startDate", date ? format(date, "yyyy-MM-dd") : "")} autoFocus className="pointer-events-auto p-3" /></PopoverContent></Popover>
                    {journey.startDate && <Button type="button" variant="link" onClick={() => updateJourney("startDate", "")}>Clear date</Button>}{errorFor("startDate")}
                  </div>}
                  {current === "details" && <><Label htmlFor="message" className="sr-only">Tell Us a Little More</Label><Textarea {...inputProps("message")} maxLength={2000} rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} className="min-h-28 resize-y text-base" />{errorFor("message")}</>}
                  {current === "timeline" && choices("timeline", timelineOptions)}
                  {current === "reach" && <>{choices("contactMethod", contactOptions)}<Label htmlFor="consent" className="flex min-h-12 cursor-pointer items-start gap-3 text-sm font-normal leading-relaxed"><Checkbox {...inputProps("consent")} checked={form.consent} onCheckedChange={(v) => update("consent", v === true)} aria-required="true" className="mt-1 shrink-0" /><span>{estimateCopy.consent}</span></Label>{errorFor("consent")}</>}
                </fieldset>
              </div>
              {/* Keep previews mounted across Back/Next, but never send media in the payload. */}
              <div hidden={current !== "details"} className="mt-5"><ProjectPhotos disabled={sending} onCountChange={setPhotoCount} /></div>
              {submitError && <p role="alert" className="mt-4 text-sm text-destructive">{submitError}</p>}
              <div className="mt-8 flex justify-between gap-3 border-t border-grey/20 pt-6">
                <Button type="button" variant="outline" onClick={back} disabled={sending} className="min-h-12 border-grey/30 text-grey hover:border-gold hover:text-gold"><ArrowLeft className="h-4 w-4" />Back</Button>
                <Button type="submit" disabled={sending} className={`min-h-12 px-4 sm:px-8 ${goldButton}`}>{sending ? <><Loader2 className="h-4 w-4 animate-spin" />Sending…</> : <>Next Step<ArrowRight className="h-4 w-4" /></>}</Button>
              </div>
              <span className="sr-only" role="status">{sending ? "Sending your estimate request." : ""}</span>
            </form>
          </CardContent>
        </Card>
      </>}
      <div className="mt-5 text-center"><Button asChild variant="link" className="h-auto min-h-12 whitespace-normal text-sm text-foreground"><a href={sms}><MessageSquare className="h-4 w-4 shrink-0" />Prefer texting? Text Us Directly</a></Button></div>
    </main>}
  </div>;
}

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import SEOHead from "@/components/shared/SEOHead";
import logo from "@/assets/axo-logo-official.png";
import { AXO_PHONE_TEL } from "@/lib/constants";
import { estimateCopy } from "@/features/get-started/copy";
import { captureEstimateAttribution, emptyEstimate, estimateSchema, estimateServices, sendEstimate, toggleEstimateService, type EstimateAttribution, type EstimateService } from "@/features/get-started/estimate";
import { saveEstimate } from "@/features/get-started/estimate.functions";
import { ProjectPhotos } from "@/features/get-started/ProjectPhotos";
import "@/features/get-started/estimate.css";

export default function GetStarted() {
  const [form, setForm] = useState(emptyEstimate);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [notificationFailed, setNotificationFailed] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [hadPhotoPreviews, setHadPhotoPreviews] = useState(false);
  const locked = useRef(false);
  const attribution = useRef<EstimateAttribution>({});
  const formRef = useRef<HTMLFormElement>(null);
  const confirmation = useRef<HTMLHeadingElement>(null);
  const insert = useServerFn(saveEstimate);
  const sms = `sms:${AXO_PHONE_TEL}?body=${encodeURIComponent("Hi AXO Floors! I'd like to discuss an estimate for my flooring project.")}`;

  // Intentionally do not load, modify or submit any legacy localStorage wizard draft.
  useEffect(() => { attribution.current = captureEstimateAttribution(); }, []);
  useEffect(() => { if (done) confirmation.current?.focus(); }, [done]);
  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
    setSubmitError("");
  }
  function updateService(service: EstimateService, checked: boolean) {
    setForm((previous) => ({ ...previous, services: toggleEstimateService(previous.services, service, checked) }));
    setErrors((previous) => ({ ...previous, services: "" }));
    setSubmitError("");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current || done) return;
    const parsed = estimateSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus());
      return;
    }
    locked.current = true;
    setSending(true);
    setSubmitError("");
    try {
      const result = await sendEstimate(parsed.data, attribution.current, async (data, safe) => {
        const saved = await insert({ data: { form: data, attribution: safe } });
        if (!saved.saved) throw new Error("not_saved");
      }, async (payload) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10000);
        try {
          const response = await fetch("/api/public/lead-notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: controller.signal });
          return response.ok;
        } finally { clearTimeout(timer); }
      });
      setNotificationFailed(!result.notificationSent);
      setHadPhotoPreviews(photoCount > 0);
      setDone(true);
      setForm(emptyEstimate);
    } catch {
      // Do not log input, payloads or provider errors.
      setSubmitError("We couldn't confirm your request was saved. Please text us directly before retrying.");
    } finally {
      setSending(false);
      // After success there is no second insert, including a failed notification.
      if (!done) locked.current = false;
    }
  }
  const errorFor = (key: string) => errors[key] ? <p id={`${key}-error`} role="alert" className="mt-2 text-sm text-destructive">{errors[key]}</p> : null;
  const inputProps = (key: string) => ({ id: key, "data-field": key, "aria-invalid": Boolean(errors[key]), "aria-describedby": errors[key] ? `${key}-error` : undefined });

  return (
    <div className="estimate-page min-h-[100dvh] bg-background text-foreground">
      <SEOHead title="Get Started — Tell Us About Your Floors | AXO Floors NJ" description="Answer a few quick questions about your hardwood project and the AXO Floors team will reach out with real answers — not a generic sales pitch." />
      <header className="bg-navy border-b border-gold">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" aria-label="AXO Floors home"><img src={logo} alt="AXO Floors" className="h-10 w-auto sm:h-12" /></Link>
          <Button asChild variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/"><ArrowLeft className="h-4 w-4" />Home</Link></Button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        {done ? (
          <section aria-live="polite" className="py-10">
            <CheckCircle2 className="mb-5 h-12 w-12 text-gold" aria-hidden="true" />
            <h1 ref={confirmation} tabIndex={-1} className="font-heading text-3xl font-bold leading-tight sm:text-4xl">{estimateCopy.thanks}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{estimateCopy.thanksBody}</p>
            {notificationFailed && <p role="status" className="mt-4 text-sm leading-relaxed text-muted-foreground">Your request is saved, but the email notification could not be confirmed. You can text us directly; please don't submit again.</p>}
            {hadPhotoPreviews && <p role="status" className="mt-4 text-sm leading-relaxed text-muted-foreground">Your photos were local previews only and were not attached to this request.</p>}
            <Button asChild className="mt-8 min-h-12 bg-gold text-accent-foreground hover:bg-gold/90"><Link to="/">Return Home<ArrowRight className="h-4 w-4" /></Link></Button>
          </section>
        ) : (
          <>
            <h1 className="max-w-xl font-heading text-3xl font-bold leading-tight sm:text-4xl">{estimateCopy.headline}</h1>
            <p className="mb-7 mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{estimateCopy.supporting}</p>
            <form ref={formRef} onSubmit={submit} noValidate aria-label="Estimate request" aria-busy={sending} className="space-y-5">
              <fieldset disabled={sending} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><Label htmlFor="name">Full Name <span aria-hidden="true">*</span></Label><Input {...inputProps("name")} required autoComplete="name" maxLength={120} value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-2 h-12 text-base" />{errorFor("name")}</div>
                  <div><Label htmlFor="phone">Phone Number <span aria-hidden="true">*</span></Label><Input {...inputProps("phone")} required type="tel" autoComplete="tel" inputMode="tel" maxLength={40} value={form.phone} onChange={(e) => update("phone", e.target.value)} className="mt-2 h-12 text-base" />{errorFor("phone")}</div>
                </div>
                <div><Label htmlFor="email">Email <span className="font-normal text-muted-foreground">(optional)</span></Label><Input {...inputProps("email")} type="email" autoComplete="email" maxLength={200} value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-2 h-12 text-base" />{errorFor("email")}</div>
                <fieldset aria-describedby={`services-caption${errors.services ? " services-error" : ""}`} aria-invalid={Boolean(errors.services)}><legend className="mb-2 text-sm font-medium">Service <span aria-hidden="true">*</span></legend>
                  <p id="services-caption" className="mb-3 text-sm text-muted-foreground">Select all that apply.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {estimateServices.map((option, i) => <Label key={option.value} htmlFor={`service-${option.value}`} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md border p-3 text-sm leading-relaxed ${form.services.includes(option.value) ? "border-gold bg-accent/10" : "border-border"}`}><Checkbox id={`service-${option.value}`} data-field={i === 0 ? "services" : undefined} value={option.value} checked={form.services.includes(option.value)} onCheckedChange={(value) => updateService(option.value, value === true)} aria-invalid={Boolean(errors.services)} aria-describedby={`services-caption${errors.services ? " services-error" : ""}`} />{option.label}</Label>)}
                  </div>{errorFor("services")}
                </fieldset>
                <div><Label htmlFor="location">Project City or ZIP Code <span aria-hidden="true">*</span></Label><Input {...inputProps("location")} required autoComplete="off" maxLength={120} placeholder="e.g. Freehold or 07728" value={form.location} onChange={(e) => update("location", e.target.value)} className="mt-2 h-12 text-base" />{errorFor("location")}</div>
                <div><Label htmlFor="message">Tell Us About Your Project <span className="font-normal text-muted-foreground">(optional)</span></Label><Textarea {...inputProps("message")} maxLength={2000} rows={3} value={form.message} onChange={(e) => update("message", e.target.value)} className="mt-2 min-h-24 resize-y text-base" />{errorFor("message")}</div>
                <ProjectPhotos disabled={sending} onCountChange={setPhotoCount} />
                <div><Label htmlFor="consent" className="flex min-h-12 cursor-pointer items-start gap-3 text-sm font-normal leading-relaxed"><Checkbox {...inputProps("consent")} checked={form.consent} onCheckedChange={(v) => update("consent", v === true)} aria-required="true" className="mt-1 shrink-0" /><span>{estimateCopy.consent}</span></Label>{errorFor("consent")}</div>
              </fieldset>
              {submitError && <p role="alert" className="text-sm leading-relaxed text-destructive">{submitError}</p>}
              {photoCount > 0 && <p role="status" className="text-sm leading-relaxed text-muted-foreground">Your estimate request will be sent without the {photoCount} locally previewed {photoCount === 1 ? "photo" : "photos"}.</p>}
              <Button type="submit" disabled={sending} className="min-h-14 w-full bg-gold px-4 text-base font-semibold text-accent-foreground hover:bg-gold/90">{sending ? <><Loader2 className="h-4 w-4 animate-spin" />Sending…</> : <>{estimateCopy.submit}<ArrowRight className="h-4 w-4" /></>}</Button>
              <span className="sr-only" role="status">{sending ? "Sending your estimate request." : ""}</span>
            </form>
          </>
        )}
        <div className="mt-5 border-t border-border pt-4 text-center"><Button asChild variant="link" className="h-auto min-h-12 whitespace-normal text-sm text-foreground"><a href={sms}><MessageSquare className="h-4 w-4 shrink-0" />Prefer texting? Text Us Directly</a></Button></div>
      </main>
    </div>
  );
}

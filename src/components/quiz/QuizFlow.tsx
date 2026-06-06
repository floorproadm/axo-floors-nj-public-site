import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AXO_ORG_ID, AXO_EMAIL, AXO_PHONE_E164 } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type Service = "not-sure" | "new-installation" | "floor-refinish" | "install-plus-refinish";

interface QuizData {
  serviceType?: Service;
  finishScope?: string;
  floorType?: string;
  currentCondition?: string;
  woodType?: string;
  location?: string;
  subfloor?: string;
  livingDuringRefinish?: string;
  squareFootage?: string;
  timeline?: string;
  budget?: string;
  colorChange?: string;
  materialsStatus?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
}

const FLOWS: Record<Service, (keyof QuizData)[]> = {
  "not-sure": ["squareFootage", "timeline", "budget"],
  "new-installation": ["floorType", "location", "subfloor", "squareFootage", "timeline", "budget"],
  "floor-refinish": ["currentCondition", "woodType", "livingDuringRefinish", "squareFootage", "colorChange", "timeline", "budget"],
  "install-plus-refinish": ["finishScope", "squareFootage", "timeline", "budget"],
};

const QUESTION_META: Record<string, { label: string; options: { value: string; label: string }[] }> = {
  finishScope: { label: "What's the scope?", options: [
    { value: "partial", label: "Partial install + refinish existing" },
    { value: "full", label: "Full house install + refinish" },
  ]},
  floorType: { label: "What type of floor?", options: [
    { value: "solid-hardwood", label: "Solid hardwood" },
    { value: "engineered", label: "Engineered hardwood" },
    { value: "vinyl-plank", label: "Luxury vinyl plank" },
    { value: "not-sure", label: "Not sure yet" },
  ]},
  currentCondition: { label: "How are the floors today?", options: [
    { value: "scratched", label: "Scratched / worn finish" },
    { value: "damaged", label: "Deeper damage / gouges" },
    { value: "good", label: "Mostly good, want a refresh" },
  ]},
  woodType: { label: "What wood type?", options: [
    { value: "oak", label: "Oak" }, { value: "maple", label: "Maple" },
    { value: "other", label: "Other / not sure" },
  ]},
  location: { label: "Where will it be installed?", options: [
    { value: "main", label: "Main living area" },
    { value: "bedrooms", label: "Bedrooms" }, { value: "whole-house", label: "Whole house" },
  ]},
  subfloor: { label: "Subfloor situation?", options: [
    { value: "plywood", label: "Plywood" }, { value: "concrete", label: "Concrete slab" },
    { value: "unknown", label: "Not sure" },
  ]},
  livingDuringRefinish: { label: "Will you be living in the home during work?", options: [
    { value: "yes", label: "Yes" }, { value: "no", label: "No" },
  ]},
  colorChange: { label: "Changing the color?", options: [
    { value: "yes", label: "Yes, restain a new color" }, { value: "no", label: "No, keep the same tone" },
  ]},
  squareFootage: { label: "Approximate square footage?", options: [
    { value: "<500", label: "Under 500 sqft" },
    { value: "500-1000", label: "500–1,000 sqft" },
    { value: "1000-2000", label: "1,000–2,000 sqft" },
    { value: "2000+", label: "2,000+ sqft" },
  ]},
  timeline: { label: "When do you want this done?", options: [
    { value: "asap", label: "ASAP (within 2 weeks)" },
    { value: "1mo", label: "Within 1 month" },
    { value: "3mo", label: "Within 3 months" },
    { value: "exploring", label: "Just exploring" },
  ]},
  budget: { label: "What's your rough budget?", options: [
    { value: "<3k", label: "Under $3,000" },
    { value: "3-7k", label: "$3,000 – $7,000" },
    { value: "7-15k", label: "$7,000 – $15,000" },
    { value: "15k+", label: "$15,000+" },
  ]},
};

export default function QuizFlow() {
  const navigate = useNavigate();
  const [data, setData] = useState<QuizData>({});
  const [step, setStep] = useState(0); // 0 = service type, then flow steps, last = contact
  const [loading, setLoading] = useState(false);

  const flow = data.serviceType ? FLOWS[data.serviceType] : [];
  const totalSteps = 1 + flow.length + 1; // service + flow + contact
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  function set<K extends keyof QuizData>(k: K, v: QuizData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function next() { setStep((s) => s + 1); }
  function back() { setStep((s) => Math.max(0, s - 1)); }

  async function submit() {
    if (!data.name || !data.email || !data.phone) {
      toast.error("Name, email, and phone are required.");
      return;
    }
    setLoading(true);
    try {
      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city || null,
          services: data.serviceType ? [data.serviceType] : null,
          message: JSON.stringify(data),
          lead_source: "quiz",
          status: "cold_lead",
          priority: "medium",
          organization_id: AXO_ORG_ID,
        })
        .select("id")
        .single();
      if (error) throw error;

      void supabase.functions.invoke("send-to-notion", { body: { lead_id: lead?.id, ...data } });
      void supabase.functions.invoke("send-follow-up", { body: { lead_id: lead?.id, email: data.email, name: data.name } });
      void supabase.functions.invoke("send-notifications", {
        body: { lead_id: lead?.id, adminEmail: AXO_EMAIL, adminPhone: AXO_PHONE_E164, ...data },
      });

      navigate({ to: "/thank-you" });
    } catch (err) {
      console.error(err);
      toast.error("Could not submit. Please call (732) 351-8653.");
    } finally {
      setLoading(false);
    }
  }

  // Step 0: service type
  if (step === 0) {
    const choices: { value: Service; label: string; sub: string }[] = [
      { value: "floor-refinish", label: "Refinish existing floors", sub: "Sand & restain what I already have" },
      { value: "new-installation", label: "Install new floors", sub: "I'm putting in new hardwood / vinyl" },
      { value: "install-plus-refinish", label: "Install + refinish", sub: "New floors in some rooms, refinish others" },
      { value: "not-sure", label: "Not sure yet", sub: "Help me figure out what I need" },
    ];
    return (
      <Card className="max-w-2xl mx-auto shadow-elegant">
        <CardHeader>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full gold-gradient transition-all" style={{ width: `${progress}%` }} />
          </div>
          <CardTitle className="font-heading text-2xl pt-3">What kind of project?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {choices.map((c) => (
            <button
              key={c.value}
              onClick={() => { set("serviceType", c.value); next(); }}
              className="text-left rounded-lg border border-border p-4 hover:border-[var(--gold-accent)] hover:shadow-gold transition-smooth"
            >
              <div className="font-semibold">{c.label}</div>
              <div className="text-sm text-muted-foreground">{c.sub}</div>
            </button>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Contact step (last)
  if (step === flow.length + 1) {
    return (
      <Card className="max-w-2xl mx-auto shadow-elegant">
        <CardHeader>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full gold-gradient" style={{ width: `100%` }} />
          </div>
          <CardTitle className="font-heading text-2xl pt-3">Almost done — where do we send your estimate?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Name *</Label><Input value={data.name || ""} onChange={(e) => set("name", e.target.value)} /></div>
            <div><Label>Phone *</Label><Input type="tel" value={data.phone || ""} onChange={(e) => set("phone", e.target.value)} /></div>
          </div>
          <div><Label>Email *</Label><Input type="email" value={data.email || ""} onChange={(e) => set("email", e.target.value)} /></div>
          <div><Label>City</Label><Input value={data.city || ""} onChange={(e) => set("city", e.target.value)} /></div>
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={back}><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
            <Button onClick={submit} disabled={loading} size="lg" className="gold-gradient text-navy font-semibold">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="mr-2 h-4 w-4" /> Get My Estimate</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mid-flow question
  const field = flow[step - 1];
  const meta = QUESTION_META[field];
  if (!meta) return null;

  return (
    <Card className="max-w-2xl mx-auto shadow-elegant">
      <CardHeader>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div className="h-full gold-gradient transition-all" style={{ width: `${progress}%` }} />
        </div>
        <CardTitle className="font-heading text-2xl pt-3">{meta.label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={(data[field] as string) || ""} onValueChange={(v) => set(field, v as never)}>
          <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
          <SelectContent>
            {meta.options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex justify-between pt-2">
          <Button variant="ghost" onClick={back}><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
          <Button onClick={next} disabled={!data[field]} className="gold-gradient text-navy font-semibold">
            Next <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

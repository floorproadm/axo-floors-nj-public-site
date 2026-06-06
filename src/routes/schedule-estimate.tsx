import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AXO_ORG_ID, AXO_PHONE_DISPLAY, AXO_PHONE_TEL } from "@/lib/constants";

const PHONE = "+17323518653";

const TIME_SLOTS = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
];
const SERVICE_TYPES = ["Refinishing", "Installation", "Staircase", "Repair", "Other"];

export const Route = createFileRoute("/schedule-estimate")({
  head: () => ({
    meta: [
      { title: "Schedule Your Free Estimate | AXO Floors NJ" },
      { name: "description", content: "Book a free in-home estimate. Eduardo will confirm your visit within 24 hours." },
      { property: "og:url", content: "/schedule-estimate" },
    ],
    links: [{ rel: "canonical", href: "/schedule-estimate" }],
  }),
  component: ScheduleEstimate,
});

function ScheduleEstimate() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "",
    service_type: "", preferred_date: "", preferred_time: "", notes: "",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.preferred_date || !form.preferred_time) {
      toast.error("Name, phone, date and time are required.");
      return;
    }
    setLoading(true);
    try {
      const { data: lead, error: leadErr } = await supabase
        .from("leads")
        .insert({
          name: form.name, email: form.email || null, phone: form.phone,
          city: null, lead_source: "schedule_estimate", status: "cold_lead",
          priority: "medium", organization_id: AXO_ORG_ID,
        })
        .select("id").single();
      if (leadErr) throw leadErr;

      const { error: apptErr } = await supabase
        .from("appointment_requests")
        .insert({
          lead_id: lead.id, organization_id: AXO_ORG_ID,
          preferred_date: form.preferred_date, preferred_time: form.preferred_time,
          service_type: form.service_type || null, address: form.address || null,
          notes: form.notes || null,
        });
      if (apptErr) throw apptErr;

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error(`Couldn't book. Please call ${AXO_PHONE_DISPLAY}.`);
    } finally { setLoading(false); }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-secondary/40">
          <div className="container mx-auto px-4 py-16 max-w-xl">
            <Card className="shadow-elegant text-center">
              <CardContent className="py-10">
                <div className="mx-auto w-16 h-16 rounded-full gold-gradient flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-navy" />
                </div>
                <h1 className="font-heading text-2xl font-bold mt-4">Estimate request received!</h1>
                <p className="text-muted-foreground mt-2">Eduardo will confirm your estimate within 24 hours by call or text.</p>
                <Button asChild className="mt-6 gold-gradient text-navy font-semibold">
                  <Link to="/">Back to home</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary/40">
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="text-center mb-6">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold">Schedule your free estimate</h1>
            <p className="text-muted-foreground mt-2">Eduardo will confirm within 24 hours by call or text.</p>
          </div>
          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Name *</Label><Input value={form.name} onChange={(e) => set("name")(e.target.value)} required /></div>
                  <div><Label>Phone *</Label><Input type="tel" value={form.phone} onChange={(e) => set("phone")(e.target.value)} required /></div>
                </div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} /></div>
                <div><Label>Address</Label><Input value={form.address} onChange={(e) => set("address")(e.target.value)} placeholder="Street, City, NJ" /></div>
                <div><Label>Service</Label>
                  <Select value={form.service_type} onValueChange={set("service_type")}>
                    <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                    <SelectContent>{SERVICE_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Preferred date *</Label><Input type="date" value={form.preferred_date} onChange={(e) => set("preferred_date")(e.target.value)} required min={new Date().toISOString().split("T")[0]} /></div>
                  <div><Label>Preferred time *</Label>
                    <Select value={form.preferred_time} onValueChange={set("preferred_time")}>
                      <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                      <SelectContent>{TIME_SLOTS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Notes</Label><Textarea rows={3} value={form.notes} onChange={(e) => set("notes")(e.target.value)} /></div>
                <Button type="submit" disabled={loading} size="lg" className="w-full gold-gradient text-navy font-semibold">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request my appointment"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Or call us directly at{" "}
                  <a href={`tel:${PHONE}`} className="inline-flex items-center gap-1 text-foreground font-semibold hover:underline">
                    <Phone className="h-3 w-3" /> {AXO_PHONE_DISPLAY}
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

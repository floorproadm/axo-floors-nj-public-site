import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AXO_ORG_ID, AXO_EMAIL, AXO_PHONE_E164 } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SERVICES = [
  "Hardwood Floor Refinishing",
  "Hardwood Floor Installation",
  "Vinyl Plank Flooring",
  "Staircase Renovation",
  "Floor Repair",
  "Baseboards & Trim",
  "Other",
];

const NJ_CITIES = [
  "Newark", "Jersey City", "Paterson", "Elizabeth", "Edison", "Woodbridge",
  "Lakewood", "Toms River", "Hamilton", "Trenton", "Clifton", "Camden",
  "Brick", "Cherry Hill", "Passaic", "Union City", "Bayonne", "East Orange",
  "Vineland", "New Brunswick", "Wayne", "Irvington", "Paramus", "Hoboken",
];

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    service: "",
    message: "",
  });

  const update = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in name, email and phone.");
      return;
    }
    setLoading(true);

    const fbp = readCookie("_fbp");
    const fbclid = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("fbclid")
      : null;

    try {
      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          name: form.name,
          email: form.email,
          phone: form.phone,
          city: form.city || null,
          services: form.service ? [form.service] : null,
          message: form.message || null,
          lead_source: "contact",
          status: "cold_lead",
          priority: "medium",
          organization_id: AXO_ORG_ID,
        })
        .select("id")
        .single();

      if (error) throw error;

      // Fire-and-forget edge functions
      void supabase.functions.invoke("send-to-notion", {
        body: { lead_id: lead?.id, ...form },
      });
      void supabase.functions.invoke("facebook-conversions", {
        body: {
          event_name: "Lead",
          email: form.email,
          phone: form.phone,
          name: form.name,
          city: form.city,
          fbp,
          fbclid,
        },
      });
      void supabase.functions.invoke("send-notifications", {
        body: {
          lead_id: lead?.id,
          adminEmail: AXO_EMAIL,
          adminPhone: AXO_PHONE_E164,
          ...form,
        },
      });

      toast.success("Thanks! We'll be in touch within 24 hours.");
      setForm({ name: "", email: "", phone: "", city: "", service: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please call (732) 351-8653.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Get Your Free Estimate</CardTitle>
        <p className="text-sm text-muted-foreground">A senior estimator replies within 24 hours.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => update("name")(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone")(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => update("email")(e.target.value)} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Select value={form.city} onValueChange={update("city")}>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>
                  {NJ_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Service</Label>
              <Select value={form.service} onValueChange={update("service")}>
                <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                <SelectContent>
                  {SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="message">Tell us about your project</Label>
            <Textarea id="message" rows={4} value={form.message} onChange={(e) => update("message")(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} size="lg" className="w-full gold-gradient text-navy font-semibold">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Send My Request</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

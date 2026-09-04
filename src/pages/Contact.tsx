import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AXO_ORG_ID } from "@/lib/constants";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sanitizeInput } from "@/utils/validation";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name and your question",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const leadData = {
        name: sanitizeInput(formData.name),
        email: formData.email.trim() ? sanitizeInput(formData.email) : null,
        phone: formData.phone.trim() ? sanitizeInput(formData.phone) : '',
        lead_source: 'contact',
        status: 'cold_lead',
        priority: 'medium',
        services: ['general_inquiry'],
        message: sanitizeInput(formData.message),
        organization_id: AXO_ORG_ID,
      };

      const { error } = await supabase.from('leads').insert([leadData]).select();
      if (error) throw error;

      // Notify the AXO team via our own site endpoint (Gmail, inbox-safe)
      void fetch('/api/public/lead-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          lead_source: 'contact',
          services: leadData.services,
          notes: `## Question\n${formData.message}`,
        }),
      }).catch(() => {});

      toast({
        title: "Thank you for contacting us!",
        description: "We'll get back to you as soon as we can."
      });

      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      toast({
        title: "Error",
        description: "Please try again or call us directly at (732) 351-8653",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = useMemo(() => {
    return formData.name.trim().length > 0 && formData.message.trim().length > 0 && !isSubmitting;
  }, [formData.name, formData.message, isSubmitting]);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero — Ready To Get Started? */}
      <section className="navy-gradient text-white relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-5">
            Ready To Get Started?
          </h1>
          <p className="text-white/85 max-w-2xl mx-auto text-base sm:text-lg mb-8">
            We're excited to hear about your project! Reach out using the link below, and let's discuss how AXO Floors can bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild className="gold-gradient hover:scale-105 transition-bounce text-base sm:text-lg px-8 py-5 h-auto min-h-[48px] text-black font-semibold w-full sm:w-auto">
              <a href="/get-started" className="flex items-center justify-center gap-2">
                Free Estimate Request
              </a>
            </Button>
            <Button asChild variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-navy text-base sm:text-lg px-8 py-5 h-auto min-h-[48px] font-semibold w-full sm:w-auto">
              <a href="tel:(732) 351-8653" className="flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                (732) 351-8653
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Simple question form */}
      <section className="py-14 sm:py-20 bg-grey-light">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-navy mb-3">
                Have A Question?
              </h2>
              <p className="text-grey text-base sm:text-lg">
                If you have a question aside from estimate inquiries, fill out this form and we'll be in touch as soon as we can!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-navy rounded-2xl p-6 sm:p-8 space-y-5 shadow-elegant">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Name <span className="text-white/60">(required)</span></Label>
                <Input
                  id="name"
                  placeholder="Full name"
                  required
                  className="h-12 bg-white/95 border-0"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="h-12 bg-white/95 border-0"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(732) 555-0123"
                    className="h-12 bg-white/95 border-0"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">How can we help? <span className="text-white/60">(required)</span></Label>
                <Textarea
                  id="message"
                  required
                  placeholder="Type your question here..."
                  className="min-h-[140px] resize-none bg-white/95 border-0"
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <Button
                type="submit"
                disabled={!isFormValid}
                className="gold-gradient text-black font-semibold px-10 h-12 text-base rounded-full hover:scale-105 transition-bounce disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

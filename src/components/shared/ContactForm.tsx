import { submitPublicLead, PUBLIC_LEAD_ERROR } from "@/lib/public-lead";
import LeadHoneypot, { usePublicLeadGuard } from "@/components/shared/LeadHoneypot";
import AdsConsentNotice from "@/components/shared/AdsConsentNotice";
import { trackEvent as trackMetaEvent } from "@/lib/metaTracking";
import { useState } from 'react';
import { AXO_ORG_ID } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Mail, Send, AlertCircle } from 'lucide-react';
import { getReferralCodeFromURL, buildReferralNotes } from '@/utils/referral';
import { 
  validateForm, 
  sanitizeInput, 
  checkRateLimit, 
  getClientIdentifier,
  formatPhoneNumber,
  useFieldValidation 
} from '@/utils/validation';

const ContactForm = () => {
  const { toast } = useToast();
  const { validateField } = useFieldValidation();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    services: [] as string[],
    budget: '',
    room_size: '',
    city: '',
    zip_code: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceOptions = [
    'Hardwood Flooring Installation',
    'Sanding & Finish',
    'Vinyl Plank Flooring',
    'Floor Repairs',
    'Custom Staining'
  ];

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, service]
        : prev.services.filter(s => s !== service)
    }));
  };

  const handleFieldChange = (field: string, value: string, rules: string[] = []) => {
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear previous error
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Validate field if it has rules
    if (rules.length > 0) {
      const error = validateField(sanitizedValue, rules);
      if (error) {
        setFormErrors(prev => ({ ...prev, [field]: error }));
      }
    }
  };

  const guard = usePublicLeadGuard();
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guard.shouldIgnore()) { setSuccess(true); return; }
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const refCode = getReferralCodeFromURL();
      const leadId = await submitPublicLead(supabase, { name: formData.name, email: formData.email, phone: formData.phone,
        services: formData.services, source: "contact", message: [formData.message, `City: ${formData.city} | ZIP: ${formData.zip_code}`, `Area: ${formData.room_size} | Budget: ${formData.budget} | Priority: ${formData.priority}`, refCode ? buildReferralNotes(null, refCode) : ""].filter(Boolean).join("\n") });
      trackMetaEvent("Lead", { content_name: "estimate-form" }, { name: formData.name, email: formData.email, phone: formData.phone, city: formData.city, zip: formData.zip_code, leadId });
      // Send to Notion
      try {
        await supabase.functions.invoke('send-to-notion', {
          body: {
            name: formData.name,
            email: formData.email || 'no-email@provided.com',
            phone: formData.phone,
            source: 'contact',
            services: formData.services,
            budget: formData.budget ? parseInt(formData.budget) : null,
            room_size: formData.room_size,
            city: formData.city,
            zip_code: formData.zip_code,
            priority: formData.priority || 'medium',
            status: 'cold_lead',
            message: formData.message,
            notes: `Contact form submission - Services: ${formData.services.join(', ')}`
          }
        });
        console.log('Contact form lead sent to Notion successfully');
      } catch (notionError) {
        console.error('Error sending contact form lead to Notion:', notionError);
        // Não falhar o processo todo por erro do Notion
      }

      // Send Facebook conversion event
      setSuccess(true);

      toast({
        title: "Message sent successfully!",
        description: "We'll contact you within 24 hours to discuss your flooring project."
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        services: [],
        budget: '',
        room_size: '',
        city: '',
        zip_code: '',
        message: '',
        priority: 'medium'
      });

    } catch (error) {
      setSubmitError(PUBLIC_LEAD_ERROR);
      toast({
        title: "Error sending message",
        description: "Please call or text (732) 351-8653.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Get Your Free Estimate
        </CardTitle>
        <p className="text-grey">Tell us about your flooring project and we'll provide a detailed quote.</p>
      </CardHeader>
      <CardContent>
        {success ? <p role="status">Thank you! Your request has been received.</p> : <form onSubmit={handleSubmit} className="space-y-6">
<LeadHoneypot guard={guard} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your.email@example.com"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Your city"
              />
            </div>
            <div>
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                placeholder="07001"
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <Label className="text-base font-medium">Services Needed</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {serviceOptions.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.services.includes(service)}
                    onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                  />
                  <Label htmlFor={service} className="text-sm font-normal cursor-pointer">
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="room_size">Approximate Square Footage</Label>
              <Input
                id="room_size"
                value={formData.room_size}
                onChange={(e) => setFormData(prev => ({ ...prev, room_size: e.target.value }))}
                placeholder="e.g., 800 sq ft"
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="2500">Under $2,500</SelectItem>
                  <SelectItem value="5000">$2,500 - $5,000</SelectItem>
                  <SelectItem value="10000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="15000">$10,000 - $15,000</SelectItem>
                  <SelectItem value="20000">$15,000 - $20,000</SelectItem>
                  <SelectItem value="25000">$20,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="priority">Project Urgency</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="low">Not urgent - planning ahead</SelectItem>
                <SelectItem value="medium">Moderate - within 2-3 months</SelectItem>
                <SelectItem value="high">Urgent - ASAP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Additional Details</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Tell us more about your project, any specific requirements, timeline, or questions you have..."
              className="min-h-[100px] resize-none"
            />
          </div>

{submitError && <p role="alert" className="text-destructive">{submitError}</p>}
<AdsConsentNotice />
          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="gold-gradient text-black w-full sm:w-auto min-w-[200px]"
              size="lg"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Get Free Estimate
                </>
              )}
            </Button>
            
            <div className="text-center sm:text-left">
              <p className="text-sm text-grey">
                Or call us directly at{' '}
                <a href="tel:+1-973-727-3545" className="text-gold font-medium hover:underline">
                  <Phone className="w-3 h-3 inline mr-1" />
                  (973) 727-3545
                </a>
              </p>
            </div>
          </div>
        </form>}
      </CardContent>
    </Card>
  );
};

export default ContactForm;
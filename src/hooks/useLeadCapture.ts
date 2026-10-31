import { submitPublicLead, PUBLIC_LEAD_ERROR } from "@/lib/public-lead";
import { usePublicLeadGuard } from "@/components/shared/LeadHoneypot";
import { trackEvent as trackMetaEvent } from "@/lib/metaTracking";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeInput, useFieldValidation } from "@/utils/validation";
import { AXO_ORG_ID } from "@/lib/constants";

export interface LeadData {
  name: string;
  email: string;
  source: string;
  category?: string;
  downloadTitle?: string;
}

export const useLeadCapture = () => {
  const guard = usePublicLeadGuard();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { validateField } = useFieldValidation();

  const captureLead = async (leadData: LeadData) => {
    if (guard.shouldIgnore()) return { success: true, lead: undefined };
    setIsLoading(true);

    try {
      // Validate inputs
      const nameError = validateField(leadData.name, ['required', 'name']);
      const emailError = validateField(leadData.email, ['required', 'email']);

      if (nameError || emailError) {
        throw new Error('Invalid form data');
      }

      // Save lead to database
      const dbData = {
        name: sanitizeInput(leadData.name),
        email: sanitizeInput(leadData.email),
        phone: "000-000-0000",
        lead_source: leadData.source,
        status: 'cold_lead',
        priority: 'high',
        services: leadData.category ? [leadData.category] : ['lead_magnet'],
        notes: leadData.downloadTitle ? `Downloaded: ${leadData.downloadTitle}` : 'Lead magnet download',
        organization_id: AXO_ORG_ID,
      };

      const leadId = await submitPublicLead(supabase, { name: dbData.name, email: dbData.email, phone: "", services: leadData.category ? [leadData.category] : [], source: "contact", message: dbData.notes });
      const savedLead = { id: leadId };
      trackMetaEvent("Lead", { content_name: "lead-capture" }, { name: leadData.name, email: leadData.email, leadId });

      // Send Gmail follow-up email
      try {
        await supabase.functions.invoke('gmail-send', {
          body: {
            template: 'lead_followup',
            data: {
              recipient_email: leadData.email,
              name: leadData.name,
              services: leadData.category || '',
              related_id: savedLead?.id,
              related_type: 'lead',
            }
          }
        });
      } catch (emailError) {
        console.warn('Failed to send Gmail follow-up:', emailError);
      }

      // Legacy follow-up (fallback)
      try {
        await supabase.functions.invoke('send-follow-up', {
          body: {
            name: leadData.name,
            email: leadData.email,
            source: leadData.source,
            leadType: 'lead_magnet',
            downloadTitle: leadData.downloadTitle
          }
        });
      } catch (emailError) {
        console.warn('Failed to send follow-up email:', emailError);
      }

      // Send admin notification
      try {
        await supabase.functions.invoke('send-notifications', {
          body: {
            leadData: dbData,
            adminEmail: 'axofloorsnj@gmail.com',
            adminPhone: '+17323518653'
          }
        });
      } catch (notificationError) {
        console.warn('Failed to send admin notification:', notificationError);
      }

      // Send to Notion
      try {
        await supabase.functions.invoke('send-to-notion', {
          body: {
            name: leadData.name,
            email: leadData.email,
            phone: dbData.phone,
            source: leadData.source,
            services: leadData.category ? [leadData.category] : ['lead_magnet'],
            notes: leadData.downloadTitle ? `Downloaded: ${leadData.downloadTitle}` : 'Lead magnet download'
          }
        });
        console.log('Lead sent to Notion successfully');
      } catch (notionError) {
        console.warn('Failed to send to Notion:', notionError);
        // Don't fail the whole process for Notion errors
      }

      toast({
        title: "Success! 🎉",
        description: "Your download should start automatically. Check your email for more resources!"
      });

      return { success: true, lead: savedLead };

    } catch (error) {
      console.error("[public-lead] capture failed");
      
      toast({
        title: "Something went wrong",
        description: "Please call or text (732) 351-8653.",
        variant: "destructive"
      });

      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDownload = (downloadUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.click();
  };

  return {
    guard,
    captureLead,
    triggerDownload,
    isLoading
  };
};
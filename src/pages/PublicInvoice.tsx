import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download, Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { exportElementToPdf } from "@/lib/estimatePdf";
import { resolveBrandLogo, safeBrandPrimary } from "@/lib/brand";
import { InvoicePrintable } from "@/components/admin/invoices/InvoicePrintable";

const ACCEPTED_METHODS = ["Check", "ACH / Wire", "Cash", "Zelle"];

export default function PublicInvoice() {
  const { token } = useParams<{ token: string }>();
  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [property, setProperty] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [resolvedLogo, setResolvedLogo] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const visibleRef = useRef<HTMLDivElement>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const { data: bundle, error: bundleErr } = await supabase.rpc(
          "public_get_invoice_bundle" as any,
          { p_token: token },
        );
        if (bundleErr) throw bundleErr;
        if (!bundle) {
          setError("Invoice not found");
          setLoading(false);
          return;
        }
        const b: any = bundle;
        if (!b.invoice) {
          setError("Invoice not found");
          setLoading(false);
          return;
        }
        setInvoice(b.invoice);
        setItems(b.items || []);
        setPhases(b.schedule || []);
        setProperty(b.property || null);
        setCustomer(b.customer || null);
        setProject(b.project || null);
        setCompany(b.company || null);

        if (!b.invoice.viewed_at) {
          await supabase.rpc("public_mark_invoice_viewed" as any, { p_token: token });
        }
      } catch (e: any) {
        setError(e.message || "Failed to load invoice");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!company) return;
    let active = true;
    (async () => {
      const url = await resolveBrandLogo(
        {
          logo_url: company.logo_url ?? null,
          email_logo_url: company.email_logo_url ?? null,
          proposal_logo_light_url: company.proposal_logo_light_url ?? null,
          proposal_logo_dark_url: company.proposal_logo_dark_url ?? null,
        } as any,
        "dark",
      );
      if (active) setResolvedLogo(url);
    })();
    return () => {
      active = false;
    };
  }, [company]);

  const handleDownload = async () => {
    const target = printableRef.current || visibleRef.current;
    if (!target || !invoice) return;
    setDownloading(true);
    try {
      await exportElementToPdf(target, `${invoice.invoice_number || "invoice"}.pdf`);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-6 text-center">
        <div>
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <h1 className="text-xl font-bold">Invoice not found</h1>
          <p className="text-muted-foreground text-sm mt-1">
            This link may be invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  const propAddr = property
    ? [property.address_line1, property.city, property.state, property.zip].filter(Boolean).join(", ")
    : "";
  const address = propAddr || project?.address || customer?.address || undefined;

  const printableData = {
    invoiceNumber: invoice.invoice_number,
    status: invoice.status,
    createdAt: new Date(invoice.created_at),
    dueDate: new Date(invoice.due_date),
    clientName: project?.customer_name || customer?.name || customer?.full_name || "—",
    clientEmail: customer?.email || project?.customer_email || undefined,
    clientPhone: customer?.phone || project?.customer_phone || undefined,
    address,
    projectType: project?.project_type || undefined,
    unitIdentifier: property?.unit_identifier || undefined,
    residentName: property?.resident_name || undefined,
    items,
    taxAmount: Number(invoice.tax_amount) || 0,
    discountAmount: Number(invoice.discount_amount) || 0,
    depositAmount: Number(invoice.deposit_amount) || 0,
    totalAmount: Number(invoice.total_amount) || 0,
    phases: invoice.show_payment_schedule !== false ? phases : [],
    notes: invoice.notes || undefined,
    acceptedMethods:
      (Array.isArray(invoice.accepted_payment_methods) && invoice.accepted_payment_methods.length > 0
        ? invoice.accepted_payment_methods
        : ACCEPTED_METHODS) as string[],
  };

  const brandingProps = {
    brandName: company?.trade_name || company?.company_name || "FloorPro",
    brandTagline: company?.tagline || "Professional Flooring Services",
    brandPhone: company?.phone || "",
    brandPrimary: safeBrandPrimary(company?.primary_color),
    brandSecondary: company?.secondary_color || "#1e3a5f",
    brandAccent: "#fcba03",
    logoUrl: resolvedLogo,
  };

  const statusColor =
    invoice.status === "paid"
      ? "bg-emerald-500/10 text-emerald-600"
      : invoice.status === "overdue"
        ? "bg-destructive/10 text-destructive"
        : invoice.status === "sent"
          ? "bg-blue-500/10 text-blue-600"
          : "bg-muted text-muted-foreground";

  return (
    <div className="min-h-screen bg-muted/20 py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-end">
          <Badge className={statusColor}>{invoice.status}</Badge>
        </div>

        <InvoicePrintable ref={visibleRef} data={printableData} branding={brandingProps} />

        <div className="pt-2 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={downloading}
              className="w-full"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download PDF
            </Button>
            {brandingProps.brandPhone && (
              <Button asChild variant="outline" className="w-full">
                <a href={`tel:${brandingProps.brandPhone.replace(/[^\d+]/g, "")}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </a>
              </Button>
            )}
            {brandingProps.brandPhone && (
              <Button asChild variant="outline" className="w-full">
                <a href={`sms:${brandingProps.brandPhone.replace(/[^\d+]/g, "")}`}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Text
                </a>
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-2">
          Questions? Reply to the email or text we sent you and we'll help right away.
        </p>
      </div>

      <div
        aria-hidden
        style={{
          position: "fixed",
          left: -100000,
          top: 0,
          width: 800,
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <InvoicePrintable
          ref={printableRef}
          printMode
          data={printableData}
          branding={brandingProps}
        />
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2, XCircle, Download, FileText, Ruler, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { exportElementToPdf } from '@/lib/estimatePdf';
import { EstimatePrintable } from '@/components/admin/estimates/EstimatePrintable';
import { resolveBrandLogo, safeBrandPrimary } from '@/lib/brand';

export default function PublicEstimate() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<any>(null);
  const [linkedMeasurements, setLinkedMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<'accept' | 'decline' | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resolvedLogo, setResolvedLogo] = useState('');
  const visibleRef = useRef<HTMLDivElement>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const { data: res, error } = await supabase.rpc('public_get_estimate_by_token' as any, {
        _token: token,
      });
      if (error) toast.error(error.message);
      setData(res);
      setLoading(false);
      const { data: linked } = await supabase.rpc(
        'public_get_linked_measurements_for_estimate' as any,
        { _token: token },
      );
      if (Array.isArray(linked)) setLinkedMeasurements(linked);
    })();
  }, [token]);

  useEffect(() => {
    const b = (data as any)?.branding;
    if (!b) return;
    let active = true;
    (async () => {
      const url = await resolveBrandLogo(
        {
          logo_url: b.logo_url ?? null,
          email_logo_url: b.email_logo_url ?? null,
          proposal_logo_light_url: b.proposal_logo_light_url ?? null,
          proposal_logo_dark_url: b.proposal_logo_dark_url ?? null,
        } as any,
        'dark',
      );
      if (active) setResolvedLogo(url);
    })();
    return () => {
      active = false;
    };
  }, [(data as any)?.branding]);

  const handleAccept = async () => {
    setBusy(true);
    const { data: ok, error } = await supabase.rpc('public_accept_estimate' as any, { _token: token });
    setBusy(false);
    if (error || !ok) return toast.error(error?.message ?? 'Could not accept');
    toast.success('Estimate accepted!');
    setData({ ...data, status: 'accepted', accepted_at: new Date().toISOString() });
    setAction(null);
  };

  const handleDecline = async () => {
    setBusy(true);
    const { data: ok, error } = await supabase.rpc('public_decline_estimate' as any, {
      _token: token,
      _reason: reason || null,
    });
    setBusy(false);
    if (error || !ok) return toast.error(error?.message ?? 'Could not decline');
    toast.success('Estimate declined');
    setData({ ...data, status: 'declined', declined_at: new Date().toISOString() });
    setAction(null);
  };

  const handleDownload = async () => {
    const target = printableRef.current || visibleRef.current;
    if (!target || !data) return;
    setDownloading(true);
    try {
      await exportElementToPdf(target, `${data.estimate_number}.pdf`);
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <h1 className="text-xl font-bold">Estimate not found</h1>
          <p className="text-muted-foreground text-sm mt-1">This link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const branding = data.branding || {};
  const isFinal = data.status === 'accepted' || data.status === 'declined';

  const printableData = {
    estimateNumber: data.estimate_number,
    validUntil: new Date(data.valid_until),
    name: data.lead_name || '',
    email: data.lead_email || undefined,
    phone: data.lead_phone || undefined,
    address: data.address || undefined,
    projectType: data.project_type || undefined,
    sqft: data.square_footage ?? undefined,
    items: Array.isArray(data.line_items) ? data.line_items : [],
    discount: Number(data.discount) || 0,
    tax: Number(data.tax) || 0,
    notes: data.notes || undefined,
  };

  const brandingProps = {
    brandName: branding.company_name || 'FloorPro',
    brandTagline: branding.tagline || 'Professional Flooring Services',
    brandPhone: branding.phone || '',
    brandPrimary: safeBrandPrimary(branding.primary_color),
    brandSecondary: branding.secondary_color || '#1e3a5f',
    brandAccent: '#fcba03',
    logoUrl: resolvedLogo,
  };

  return (
    <div className="min-h-screen bg-muted/20 py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-end">
          <Badge
            className={
              data.status === 'accepted'
                ? 'bg-emerald-500/10 text-emerald-600'
                : data.status === 'declined'
                  ? 'bg-destructive/10 text-destructive'
                  : data.status === 'viewed'
                    ? 'bg-amber-500/10 text-amber-600'
                    : 'bg-blue-500/10 text-blue-600'
            }
          >
            {data.status}
          </Badge>
        </div>

        <EstimatePrintable ref={visibleRef} data={printableData} branding={brandingProps} />

        {linkedMeasurements.length > 0 && (
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4" style={{ color: brandingProps.brandPrimary }} />
              <h3 className="text-sm font-semibold">
                {linkedMeasurements.length === 1 ? 'On-site measurement' : 'On-site measurements'}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              This estimate is based on the following measurement{linkedMeasurements.length > 1 ? 's' : ''} taken at your property. Click to review the details.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {linkedMeasurements.map((m: any) => (
                <a
                  key={m.id}
                  href={`/m/${m.share_token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2.5 hover:border-primary hover:bg-accent/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{m.label || 'Measurement'}</div>
                    <div className="text-[11px] text-muted-foreground tabular-nums">
                      {Number(m.total_sqft) > 0 && `${Number(m.total_sqft).toLocaleString()} sqft`}
                      {Number(m.total_sqft) > 0 && Number(m.total_linear_ft) > 0 && ' · '}
                      {Number(m.total_linear_ft) > 0 && `${Number(m.total_linear_ft).toLocaleString()} lf`}
                      {m.measurement_date && ` · ${format(new Date(m.measurement_date), 'MMM dd, yyyy')}`}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          {isFinal ? (
            <div className="text-center py-4">
              {data.status === 'accepted' ? (
                <div className="text-emerald-600">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-semibold">Estimate accepted</p>
                  <p className="text-xs text-muted-foreground">We'll be in touch shortly.</p>
                </div>
              ) : (
                <div className="text-destructive">
                  <XCircle className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-semibold">Estimate declined</p>
                </div>
              )}
            </div>
          ) : action === 'decline' ? (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <p className="text-sm font-medium">Let us know why (optional)</p>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setAction(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDecline} disabled={busy}>
                  {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Decline
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button variant="outline" onClick={handleDownload} disabled={downloading}>
                {downloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => setAction('decline')}>
                <XCircle className="w-4 h-4 mr-2" />
                Decline
              </Button>
              <Button
                style={{ backgroundColor: brandingProps.brandPrimary }}
                className="text-white"
                onClick={handleAccept}
                disabled={busy}
              >
                {busy ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Accept estimate
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-2">
          This is an estimate, not an invoice. Prices valid until{' '}
          {format(new Date(data.valid_until), 'MMM dd, yyyy')}.
        </p>
      </div>

      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: -100000,
          top: 0,
          width: 800,
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        <EstimatePrintable ref={printableRef} printMode data={printableData} branding={brandingProps} />
      </div>
    </div>
  );
}

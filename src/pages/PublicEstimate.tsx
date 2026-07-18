import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2, CheckCircle2, XCircle, Download, FileText, Ruler, ExternalLink,
  ShieldCheck, PenLine,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { exportElementToPdf } from '@/lib/estimatePdf';
import { EstimatePrintable } from '@/components/admin/estimates/EstimatePrintable';
import { resolveBrandLogo, safeBrandPrimary } from '@/lib/brand';
import { SignatureCanvas, type SignatureCanvasHandle } from '@/components/estimates/SignatureCanvas';
import { cn } from '@/lib/utils';

const fmt = (v: number) =>
  `$${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

async function fetchClientIp(): Promise<string | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(t);
    const j = await res.json();
    return j?.ip ?? null;
  } catch {
    return null;
  }
}

export default function PublicEstimate() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<any>(null);
  const [linkedMeasurements, setLinkedMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<'decline' | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resolvedLogo, setResolvedLogo] = useState('');

  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signatureEmpty, setSignatureEmpty] = useState(true);
  const [signSubmitting, setSignSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const sigRef = useRef<SignatureCanvasHandle>(null);

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
      setSignerName((res as any)?.lead_name ?? '');
      setSignerEmail((res as any)?.lead_email ?? '');
      setLoading(false);
      const { data: linked } = await supabase.rpc(
        'public_get_linked_measurements_for_estimate' as any,
        { _token: token },
      );
      if (Array.isArray(linked)) setLinkedMeasurements(linked);

      const ip = await fetchClientIp();
      supabase.rpc('public_track_estimate_view' as any, {
        _token: token,
        _ip: ip,
        _user_agent: navigator.userAgent,
      });
    })();
  }, [token]);

  useEffect(() => {
    const b = data?.branding;
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
    return () => { active = false; };
  }, [data?.branding]);

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

  const canSign = useMemo(() => {
    return (
      signerName.trim().length >= 2 &&
      isEmail(signerEmail) &&
      !signatureEmpty &&
      termsAccepted
    );
  }, [signerName, signerEmail, signatureEmpty, termsAccepted]);

  const handleSign = async () => {
    if (!canSign || !token) return;
    const svg = sigRef.current?.toSVG();
    if (!svg) {
      toast.error('Please add your signature');
      return;
    }
    setSignSubmitting(true);
    const ip = await fetchClientIp();
    const { data: res, error } = await supabase.rpc('public_sign_estimate' as any, {
      _token: token,
      _signer_name: signerName.trim(),
      _signer_email: signerEmail.trim(),
      _signature_svg: svg,
      _terms_version: data?.current_terms_version ?? '1.0',
      _ip: ip,
      _user_agent: navigator.userAgent,
    });
    setSignSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const r = res as any;
    if (!r?.ok) {
      const errMap: Record<string, string> = {
        already_signed: 'This estimate has already been signed.',
        expired: 'This estimate has expired.',
        not_found: 'Estimate not found.',
        invalid_status: 'This estimate is no longer available for signing.',
        signature_required: 'Please add your signature.',
        signature_too_large: 'Signature is too large — please clear and try again.',
        name_required: 'Please enter your full legal name.',
        email_required: 'Please enter your email.',
      };
      toast.error(errMap[r?.error] ?? 'Could not sign the estimate');
      return;
    }
    toast.success('Estimate signed');
    setShowConfirm(true);
    setData({
      ...data,
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      signed_at: new Date().toISOString(),
      signed_by_name: signerName.trim(),
      signed_by_email: signerEmail.trim(),
      signature_svg: svg,
    });
    supabase.functions
      .invoke('notify-estimate-signed', { body: { estimate_token: token } })
      .catch((err) => console.warn('notify-estimate-signed failed', err));
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
  const isSigned = !!data.signed_at || data.status === 'accepted';
  const isDeclined = data.status === 'declined';
  const isExpired = data.valid_until && new Date(data.valid_until) < new Date(new Date().setHours(0, 0, 0, 0));
  const canOpenSign = !isSigned && !isDeclined && !isExpired && (data.status === 'sent' || data.status === 'viewed' || data.status === 'draft');
  const signatureRequired = data.signature_required !== false;

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

  const statusBadge = (
    <Badge
      className={cn(
        isSigned
          ? 'bg-emerald-500/10 text-emerald-600'
          : isDeclined
            ? 'bg-destructive/10 text-destructive'
            : data.status === 'viewed'
              ? 'bg-amber-500/10 text-amber-600'
              : 'bg-blue-500/10 text-blue-600',
      )}
    >
      {isSigned ? 'Signed' : data.status}
    </Badge>
  );

  const currentStep = isSigned ? 3 : canOpenSign ? 2 : 1;

  return (
    <div className="min-h-screen bg-muted/20 pb-32">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground leading-none">
              Estimate
            </p>
            <p className="text-sm font-semibold tabular-nums truncate">
              {data.estimate_number}
              {data.lead_name && <span className="text-muted-foreground font-normal"> · {data.lead_name}</span>}
            </p>
          </div>
          {statusBadge}
        </div>

        {canOpenSign && signatureRequired && (
          <div className="bg-primary/5 border-t border-primary/20">
            <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
              <p className="text-xs sm:text-sm font-medium text-primary flex items-center gap-1.5">
                <PenLine className="w-3.5 h-3.5" />
                Ready to sign — valid until {format(new Date(data.valid_until), 'MMM dd, yyyy')}
              </p>
              <a
                href="#sign-block"
                className="text-xs font-semibold text-primary hover:underline whitespace-nowrap"
              >
                Sign now →
              </a>
            </div>
          </div>
        )}

        {canOpenSign && signatureRequired && (
          <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            {['Review', 'Sign', 'Confirmed'].map((label, i) => {
              const step = i + 1;
              const active = step === currentStep;
              const done = step < currentStep;
              return (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold',
                      done && 'bg-emerald-500 text-white',
                      active && 'bg-primary text-primary-foreground',
                      !active && !done && 'bg-muted text-muted-foreground',
                    )}
                  >
                    {done ? '✓' : step}
                  </span>
                  <span className={cn('font-medium', active && 'text-foreground')}>{label}</span>
                  {step < 3 && <span className="mx-1 text-muted-foreground/40">·</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-4 px-4 py-6">
        <EstimatePrintable ref={visibleRef} data={printableData} branding={brandingProps} />

        {linkedMeasurements.length > 0 && (
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4" style={{ color: brandingProps.brandPrimary }} />
              <h3 className="text-sm font-semibold">
                {linkedMeasurements.length === 1 ? 'On-site measurement' : 'On-site measurements'}
              </h3>
            </div>
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

        {isSigned && (
          <div className="rounded-lg border-2 border-emerald-500/40 bg-emerald-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-semibold text-emerald-700">Signed &amp; Accepted</h3>
            </div>
            {data.signature_svg && (
              <div
                className="mt-2 mb-3 rounded-md border border-emerald-500/30 bg-white p-3 max-w-sm"
                dangerouslySetInnerHTML={{ __html: data.signature_svg }}
              />
            )}
            <div className="text-xs sm:text-sm space-y-0.5 text-foreground/80">
              <p><span className="text-muted-foreground">Signed by:</span> <span className="font-medium">{data.signed_by_name}</span></p>
              {data.signed_by_email && <p><span className="text-muted-foreground">Email:</span> {data.signed_by_email}</p>}
              {data.signed_at && (
                <p>
                  <span className="text-muted-foreground">Signed on:</span>{' '}
                  {format(new Date(data.signed_at), 'MMM dd, yyyy · h:mm a')}
                </p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={downloading}>
                {downloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Download signed PDF
              </Button>
            </div>
          </div>
        )}

        {canOpenSign && signatureRequired && (
          <div id="sign-block" className="rounded-lg border bg-card p-5 space-y-4 scroll-mt-32">
            <div>
              <h3 className="text-base font-semibold flex items-center gap-2">
                <PenLine className="w-4 h-4 text-primary" />
                Approval &amp; Signature
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sign below to accept the scope of work and pricing in this estimate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="signer-name" className="text-xs">Full legal name *</Label>
                <Input
                  id="signer-name"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="mt-1"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <Label htmlFor="signer-email" className="text-xs">Email *</Label>
                <Input
                  id="signer-email"
                  type="email"
                  value={signerEmail}
                  onChange={(e) => setSignerEmail(e.target.value)}
                  className="mt-1"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Your signature *</Label>
              <SignatureCanvas
                ref={sigRef}
                onChange={setSignatureEmpty}
                className="mt-1.5"
              />
            </div>

            {data.terms_md && (
              <div>
                <Label className="text-xs">Terms &amp; Conditions</Label>
                <div className="mt-1.5 max-h-64 overflow-y-auto rounded-md border border-border bg-muted/20 p-4 prose prose-sm max-w-none">
                  <ReactMarkdown>{data.terms_md}</ReactMarkdown>
                </div>
              </div>
            )}

            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox
                checked={termsAccepted}
                onCheckedChange={(v) => setTermsAccepted(v === true)}
                className="mt-0.5"
              />
              <span className="text-xs text-foreground/80 leading-relaxed">
                I have read and agree to the Terms &amp; Conditions. By signing below, I,{' '}
                <span className="font-medium">{signerName || '[name]'}</span>, agree to the scope of work and pricing described in Estimate{' '}
                <span className="font-medium">{data.estimate_number}</span>, totaling{' '}
                <span className="font-medium">{fmt(Number(data.total))}</span>. This electronic signature has the same legal effect as a handwritten signature under the U.S. ESIGN Act and UETA.
              </span>
            </label>
          </div>
        )}

        {!isSigned && !isDeclined && action === 'decline' && (
          <div className="space-y-3 rounded-lg border bg-card p-4">
            <p className="text-sm font-medium">Let us know why (optional)</p>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setAction(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDecline} disabled={busy}>
                {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Decline
              </Button>
            </div>
          </div>
        )}

        {isDeclined && (
          <div className="text-center py-4 text-destructive">
            <XCircle className="w-10 h-10 mx-auto mb-2" />
            <p className="font-semibold">Estimate declined</p>
          </div>
        )}

        {!isSigned && !isDeclined && !canOpenSign && !isExpired && (
          <div className="text-center text-xs text-muted-foreground py-4">
            This estimate is not currently available for signing.
          </div>
        )}
        {isExpired && !isSigned && (
          <div className="text-center py-4 text-muted-foreground">
            <XCircle className="w-8 h-8 mx-auto mb-2 opacity-60" />
            <p className="text-sm">This estimate expired on {format(new Date(data.valid_until), 'MMM dd, yyyy')}.</p>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-2">
          This is an estimate, not an invoice. Prices valid until{' '}
          {format(new Date(data.valid_until), 'MMM dd, yyyy')}.
        </p>
      </div>

      {canOpenSign && signatureRequired && !isSigned && (
        <div className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur">
          <div className="max-w-3xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-2">
            <Button
              size="lg"
              className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              onClick={handleSign}
              disabled={!canSign || signSubmitting}
            >
              {signSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Sign &amp; Accept Estimate
            </Button>
            <div className="grid grid-cols-2 sm:flex gap-2">
              <Button variant="outline" onClick={handleDownload} disabled={downloading}>
                {downloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                PDF
              </Button>
              <Button
                variant="outline"
                className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setAction('decline')}
              >
                <XCircle className="w-4 h-4 mr-2" /> Decline
              </Button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-6">
          <div className="max-w-md text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank you, {data.signed_by_name || signerName}!</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Estimate {data.estimate_number} signed on{' '}
              {format(new Date(data.signed_at || Date.now()), 'MMM dd, yyyy · h:mm a')}. We'll be in touch shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={handleDownload} disabled={downloading}>
                {downloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Download signed PDF
              </Button>
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: -100000,
          top: 0,
          width: 800,
          pointerEvents: 'none',
          background: '#ffffff',
        }}
      >
        <EstimatePrintable
          ref={printableRef}
          printMode
          data={printableData}
          branding={brandingProps}
          signature={
            isSigned
              ? {
                  svg: data.signature_svg,
                  name: data.signed_by_name,
                  email: data.signed_by_email,
                  signedAt: data.signed_at ? new Date(data.signed_at) : null,
                  ip: data.signed_ip ?? null,
                  termsVersion: data.terms_version ?? null,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}

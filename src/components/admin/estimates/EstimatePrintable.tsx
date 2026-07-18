import { forwardRef } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { recalcTotals, type EstimateLineItem } from '@/hooks/useEstimates';
import { formatPhoneInput } from '@/utils/validation';
import { sanitizeNotesHtml } from '@/lib/sanitizeNotesHtml';

const fmtMoney = (v: number) =>
  `$${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export interface EstimatePrintableData {
  estimateNumber?: string | null;
  validUntil: Date;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  projectType?: string;
  sqft?: string | number;
  items: EstimateLineItem[];
  discount: number;
  tax: number;
  notes?: string;
}

export interface EstimatePrintableBranding {
  brandName: string;
  brandTagline: string;
  brandPhone?: string;
  brandPrimary: string;
  brandSecondary: string;
  brandAccent: string;
  logoUrl?: string;
}

export interface EstimatePrintableSignature {
  svg: string | null | undefined;
  name: string | null | undefined;
  email?: string | null;
  signedAt: Date | null;
  ip?: string | null;
  termsVersion?: string | null;
}

interface Props {
  data: EstimatePrintableData;
  branding: EstimatePrintableBranding;
  showPreviewBadge?: boolean;
  printMode?: boolean;
  signature?: EstimatePrintableSignature;
}

export const EstimatePrintable = forwardRef<HTMLDivElement, Props>(function EstimatePrintable(
  { data, branding, showPreviewBadge, printMode, signature },
  ref,
) {
  const {
    brandName,
    brandTagline,
    brandPhone,
    brandPrimary,
    brandSecondary,
    brandAccent,
    logoUrl,
  } = branding;

  const cleanItems = data.items.filter((i) => i.description.trim());
  const totals = recalcTotals(cleanItems, data.discount, data.tax);

  return (
    <div ref={ref} style={printMode ? { width: 800, background: '#ffffff' } : undefined}>
      <Card className="overflow-hidden shadow-sm relative bg-white text-foreground">
        {showPreviewBadge && (
          <span className="absolute top-4 right-4 z-10 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/10 text-white/80 border border-white/15">
            Preview
          </span>
        )}

        <div
          className="px-10 pt-10 pb-8 text-center"
          style={{ backgroundColor: brandSecondary, color: '#ffffff' }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={brandName}
              crossOrigin="anonymous"
              className="mx-auto mb-2 h-20 w-auto max-w-[240px] object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <h1
              className="font-bold text-3xl tracking-tight mb-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {brandName}
            </h1>
          )}
          <p
            className="text-sm font-semibold uppercase"
            style={{ color: brandAccent, letterSpacing: '0.2em' }}
          >
            {brandTagline}
          </p>
          {data.estimateNumber && (
            <p className="text-xs mt-2 tabular-nums" style={{ color: 'rgba(255,255,255,0.6)' }}>
              #{data.estimateNumber}
            </p>
          )}
        </div>

        <div className="h-[3px] w-full" style={{ backgroundColor: brandPrimary }} />

        <div className="px-10 pt-8">
          <h2
            className="text-lg font-semibold pb-2 mb-4 border-b-2"
            style={{ fontFamily: 'Montserrat, sans-serif', borderColor: brandPrimary }}
          >
            Prepared For
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Client</p>
              <p className="font-semibold">{data.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <p>{data.address || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contact</p>
              <p>{[data.email, data.phone ? formatPhoneInput(data.phone) : null].filter(Boolean).join(' | ') || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Project</p>
              <p>
                {data.projectType || '—'}
                {data.sqft ? ` — ${data.sqft} sqft` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="px-10 pt-6">
          <div
            className="rounded-lg px-4 py-3 text-center text-sm"
            style={{
              backgroundColor: `${brandPrimary}15`,
              color: brandPrimary,
              border: `1px solid ${brandPrimary}30`,
            }}
          >
            Valid until: <strong>{format(data.validUntil, 'MMMM d, yyyy')}</strong>
          </div>
        </div>

        <div className="px-10 pt-6 pb-6 space-y-6">
          <div>
            <div className="grid grid-cols-12 text-[10.5px] uppercase tracking-widest text-muted-foreground pb-2 border-b border-border/60">
              <div className="col-span-7">Description</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-3 text-right">Amount</div>
            </div>
            {cleanItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No line items</p>
            ) : (
              cleanItems.map((it, i) => (
                <div
                  key={i}
                  data-pdf-row
                  className="grid grid-cols-12 py-3 border-b border-border/40 text-sm"
                >
                  <div className="col-span-7">
                    <p className="font-medium">{it.description}</p>
                    {it.unit_price ? (
                      <p className="text-xs text-muted-foreground">
                        {fmtMoney(it.unit_price)} each
                      </p>
                    ) : null}
                  </div>
                  <div className="col-span-2 text-right tabular-nums">{it.quantity}</div>
                  <div className="col-span-3 text-right font-semibold tabular-nums">
                    {fmtMoney(it.amount)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div data-pdf-row className="flex justify-end">
            <div className="w-full max-w-xs space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{fmtMoney(totals.subtotal)}</span>
              </div>
              {data.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="tabular-nums">-{fmtMoney(data.discount)}</span>
                </div>
              )}
              {data.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="tabular-nums">{fmtMoney(data.tax)}</span>
                </div>
              )}
              <div
                className="flex justify-between text-lg font-bold pt-2 border-t border-border/60"
                style={{ color: brandPrimary }}
              >
                <span>Total</span>
                <span className="tabular-nums">{fmtMoney(totals.total)}</span>
              </div>
            </div>
          </div>

          {data.notes && (
            <div data-pdf-row data-pdf-section className="bg-muted/40 rounded-md p-3 text-sm">
              <p className="text-[10.5px] uppercase tracking-widest text-muted-foreground mb-1">
                Notes
              </p>
              <div
                className="estimate-notes-html text-sm whitespace-pre-wrap [&_h3]:font-bold [&_h3]:text-[15px] [&_h3]:mt-1 [&_h3]:mb-1 [&_h4]:font-bold [&_h4]:text-[15px] [&_h4]:mt-1 [&_h4]:mb-1 [&_p]:my-1 [&_strong]:font-bold [&_b]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-primary"
                dangerouslySetInnerHTML={{
                  __html: sanitizeNotesHtml(String(data.notes)),
                }}
              />
            </div>
          )}

          {signature?.svg && (
            <div
              data-pdf-row
              data-pdf-section
              className="rounded-xl border-2 p-5 text-sm relative overflow-hidden"
              style={{ borderColor: '#059669', backgroundColor: '#ecfdf5' }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                style={{ opacity: 0.08 }}
              >
                <span
                  className="text-6xl font-black tracking-widest"
                  style={{ color: '#059669', transform: 'rotate(-18deg)' }}
                >
                  SIGNED
                </span>
              </div>
              <p
                className="text-[10.5px] uppercase tracking-widest mb-2 font-semibold"
                style={{ color: '#047857' }}
              >
                Customer Approval
              </p>
              <div
                className="bg-white rounded-md border border-emerald-200 p-3 max-w-md"
                dangerouslySetInnerHTML={{ __html: signature.svg }}
              />
              <div className="mt-3 space-y-0.5 text-[12px] text-foreground/80">
                <p style={{ fontFamily: 'cursive', fontSize: 18, color: '#065f46' }}>
                  {signature.name}
                </p>
                {signature.signedAt && (
                  <p>
                    Signed electronically on{' '}
                    <span className="font-medium">
                      {format(signature.signedAt, 'MMM dd, yyyy')} at{' '}
                      {format(signature.signedAt, 'h:mm a')}
                    </span>
                  </p>
                )}
                {signature.email && <p>Email: {signature.email}</p>}
                {signature.ip && <p>IP: {signature.ip} · Verified via E-Sign</p>}
                {signature.termsVersion && (
                  <p className="text-muted-foreground">Terms version accepted: v{signature.termsVersion}</p>
                )}
              </div>
              <p className="mt-3 text-[10px] text-muted-foreground leading-snug">
                This document was signed electronically in compliance with the U.S. ESIGN Act (15 U.S.C. §7001) and UETA.
              </p>
            </div>
          )}

          <div
            data-pdf-row
            data-pdf-section
            className="rounded-xl px-6 py-6 text-center"
            style={{ backgroundColor: brandSecondary, color: '#ffffff' }}
          >
            <h3
              className="text-lg font-semibold mb-1"
              style={{ fontFamily: 'Montserrat, sans-serif', color: brandAccent }}
            >
              Ready to move forward?
            </h3>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Contact us to approve this estimate and schedule your project.
            </p>
            {brandPhone && (
              <p
                className="text-xl font-bold mt-2 tabular-nums"
                style={{ color: brandAccent }}
              >
                {brandPhone}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
});

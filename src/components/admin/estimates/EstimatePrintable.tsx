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

interface Props {
  data: EstimatePrintableData;
  branding: EstimatePrintableBranding;
  showPreviewBadge?: boolean;
  printMode?: boolean;
}

export const EstimatePrintable = forwardRef<HTMLDivElement, Props>(function EstimatePrintable(
  { data, branding, showPreviewBadge, printMode },
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
                <div key={i} className="grid grid-cols-12 py-3 border-b border-border/40 text-sm">
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

          <div className="flex justify-end">
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
            <div className="bg-muted/40 rounded-md p-3 text-sm">
              <p className="text-[10.5px] uppercase tracking-widest text-muted-foreground mb-1">
                Notes
              </p>
              <div
                className="rich-notes-content text-sm [&_h3]:font-bold [&_h3]:text-base [&_h3]:mt-2 [&_h3]:mb-1 [&_h4]:font-bold [&_h4]:text-[15px] [&_h4]:mt-2 [&_h4]:mb-1 [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_a]:text-primary [&_a]:underline [&_a]:break-words [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: sanitizeNotesHtml(data.notes) }}
              />
            </div>
          )}

          <div
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

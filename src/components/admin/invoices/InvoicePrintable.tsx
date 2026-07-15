import { forwardRef } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { sanitizeNotesHtml } from '@/lib/sanitizeNotesHtml';

const fmtMoney = (v: number) =>
  `$${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export interface InvoicePrintableItem {
  id?: string;
  description: string;
  detail?: string | null;
  quantity: number;
  unit_price: number;
}

export interface InvoicePrintablePhase {
  id?: string;
  phase_label: string;
  percentage: number;
  timing?: string | null;
}

export interface InvoicePrintableData {
  invoiceNumber?: string | null;
  status?: string;
  createdAt: Date;
  dueDate: Date;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  address?: string;
  projectType?: string;
  unitIdentifier?: string;
  residentName?: string;
  items: InvoicePrintableItem[];
  taxAmount: number;
  discountAmount: number;
  depositAmount: number;
  totalAmount: number;
  phases: InvoicePrintablePhase[];
  notes?: string;
  acceptedMethods: string[];
}

export interface InvoicePrintableBranding {
  brandName: string;
  brandTagline: string;
  brandPhone?: string;
  brandPrimary: string;
  brandSecondary: string;
  brandAccent: string;
  logoUrl?: string;
}

interface Props {
  data: InvoicePrintableData;
  branding: InvoicePrintableBranding;
  printMode?: boolean;
}

export const InvoicePrintable = forwardRef<HTMLDivElement, Props>(function InvoicePrintable(
  { data, branding, printMode },
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

  const subtotal = data.items.reduce(
    (s, i) => s + Number(i.quantity || 0) * Number(i.unit_price || 0),
    0,
  );
  const total = Number(data.totalAmount) || subtotal + data.taxAmount - data.discountAmount;
  const balanceDue = total - Number(data.depositAmount || 0);
  const hasDetail = data.items.some((i) => i.detail);

  return (
    <div ref={ref} style={printMode ? { width: 800, background: '#ffffff' } : undefined}>
      <Card className="overflow-hidden shadow-sm relative bg-white text-foreground">
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
          {data.invoiceNumber && (
            <p className="text-xs mt-2 tabular-nums" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Invoice #{data.invoiceNumber}
            </p>
          )}
        </div>

        <div className="h-[3px] w-full" style={{ backgroundColor: brandPrimary }} />

        <div className="px-10 pt-8">
          <h2
            className="text-lg font-semibold pb-2 mb-4 border-b-2"
            style={{ fontFamily: 'Montserrat, sans-serif', borderColor: brandPrimary }}
          >
            Bill To
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Client</p>
              <p className="font-semibold">{data.clientName || '—'}</p>
              {(data.unitIdentifier || data.residentName) && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {data.unitIdentifier}
                  {data.unitIdentifier && data.residentName ? ' · ' : ''}
                  {data.residentName}
                </p>
              )}
              {data.clientEmail && (
                <p className="text-xs text-muted-foreground mt-0.5">{data.clientEmail}</p>
              )}
              {data.clientPhone && (
                <p className="text-xs text-muted-foreground">{data.clientPhone}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Project</p>
              <p className="font-semibold">{data.projectType || '—'}</p>
              {data.address && <p className="text-xs text-muted-foreground mt-0.5">{data.address}</p>}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Invoice date</p>
              <p className="font-semibold">{format(data.createdAt, 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Due date</p>
              <p className="font-semibold">{format(data.dueDate, 'MMMM d, yyyy')}</p>
            </div>
          </div>
        </div>

        {data.notes && (
          <div className="px-10 pt-6">
            <div
              className="rounded-lg px-4 py-3 text-sm invoice-notes-html [&_h3]:font-bold [&_h3]:text-[15px] [&_h3]:mt-1 [&_h3]:mb-1 [&_h4]:font-bold [&_h4]:text-[15px] [&_h4]:mt-1 [&_h4]:mb-1 [&_p]:my-1 [&_strong]:font-bold [&_b]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2"
              style={{
                backgroundColor: `${brandPrimary}15`,
                color: brandPrimary,
                border: `1px solid ${brandPrimary}30`,
              }}
              dangerouslySetInnerHTML={{ __html: sanitizeNotesHtml(String(data.notes)) }}
            />
          </div>
        )}

        <div className="px-10 pt-6 pb-6 space-y-6">
          <div>
            <div className="grid grid-cols-12 text-[10.5px] uppercase tracking-widest text-muted-foreground pb-2 border-b border-border/60">
              <div className={hasDetail ? 'col-span-5' : 'col-span-7'}>Description</div>
              {hasDetail && <div className="col-span-2">Detail</div>}
              <div className="col-span-1 text-right">Qty</div>
              <div className="col-span-2 text-right">Unit</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            {data.items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No line items</p>
            ) : (
              data.items.map((it, i) => (
                <div
                  key={it.id || i}
                  data-pdf-row
                  className="grid grid-cols-12 py-3 border-b border-border/40 text-sm"
                >
                  <div className={hasDetail ? 'col-span-5' : 'col-span-7'}>
                    <p className="font-medium">{it.description}</p>
                  </div>
                  {hasDetail && (
                    <div className="col-span-2 text-xs text-muted-foreground italic">
                      {it.detail || ''}
                    </div>
                  )}
                  <div className="col-span-1 text-right tabular-nums">{it.quantity}</div>
                  <div className="col-span-2 text-right tabular-nums">
                    {fmtMoney(Number(it.unit_price))}
                  </div>
                  <div className="col-span-2 text-right font-semibold tabular-nums">
                    {fmtMoney(Number(it.quantity) * Number(it.unit_price))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div data-pdf-row className="flex justify-end">
            <div className="w-full max-w-xs space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{fmtMoney(subtotal)}</span>
              </div>
              {data.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="tabular-nums">{fmtMoney(data.taxAmount)}</span>
                </div>
              )}
              {data.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="tabular-nums">-{fmtMoney(data.discountAmount)}</span>
                </div>
              )}
              <div
                className="flex justify-between text-lg font-bold pt-2 border-t border-border/60"
                style={{ color: brandPrimary }}
              >
                <span>Total</span>
                <span className="tabular-nums">{fmtMoney(total)}</span>
              </div>
              {data.depositAmount > 0 && (
                <>
                  <div className="flex justify-between text-emerald-600">
                    <span>Deposit paid</span>
                    <span className="tabular-nums">-{fmtMoney(data.depositAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold">
                    <span>Balance due</span>
                    <span className="tabular-nums">{fmtMoney(balanceDue)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {data.phases.length > 0 && (
            <div data-pdf-row data-pdf-section>
              <p className="text-[10.5px] uppercase tracking-widest text-muted-foreground mb-2">
                Payment schedule
              </p>
              <div
                className={`grid gap-3 grid-cols-1 ${
                  data.phases.length === 2
                    ? 'sm:grid-cols-2'
                    : data.phases.length === 3
                      ? 'sm:grid-cols-3'
                      : data.phases.length >= 4
                        ? 'sm:grid-cols-2 lg:grid-cols-4'
                        : ''
                }`}
              >
                {data.phases.map((p, i) => (
                  <div
                    key={p.id || i}
                    className="rounded-lg p-3 text-center border"
                    style={{ borderColor: `${brandPrimary}30` }}
                  >
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {p.phase_label}
                    </p>
                    <p
                      className="text-xl font-extrabold mt-1"
                      style={{ color: brandPrimary }}
                    >
                      {p.percentage}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {fmtMoney((total * p.percentage) / 100)}
                    </p>
                    {p.timing && (
                      <p className="text-[10px] text-muted-foreground mt-1">{p.timing}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.acceptedMethods.length > 0 && (
            <div data-pdf-row>
              <p className="text-[10.5px] uppercase tracking-widest text-muted-foreground mb-2">
                Accepted payment methods
              </p>
              <div className="flex gap-2 flex-wrap">
                {data.acceptedMethods.map((m) => (
                  <span
                    key={m}
                    className="px-3 py-1 rounded-full text-xs font-semibold border"
                    style={{
                      backgroundColor: `${brandPrimary}10`,
                      color: brandPrimary,
                      borderColor: `${brandPrimary}30`,
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
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
              Questions about this invoice?
            </h3>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Reach out and we'll walk you through it.
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

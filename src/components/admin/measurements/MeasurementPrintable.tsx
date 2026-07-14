import { forwardRef } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import type { ProjectMeasurement, MeasurementArea } from '@/hooks/useMeasurements';
import { parseMeasurementDate } from '@/hooks/useMeasurements';

export interface MeasurementPrintableBranding {
  brandName: string;
  brandTagline: string;
  brandPhone?: string;
  brandPrimary: string;
  brandSecondary: string;
  brandAccent: string;
  logoUrl?: string;
}

interface Props {
  measurement: ProjectMeasurement;
  branding: MeasurementPrintableBranding;
  printMode?: boolean;
}

const UNIT: Record<string, string> = {
  floor: 'sqft',
  staircase: 'degraus',
  baseboard: 'linear ft',
  handrail: 'linear ft',
  posts: 'posts',
  other: 'sqft',
};

function areaValue(a: MeasurementArea): string {
  if (a.area_type === 'baseboard' || a.area_type === 'handrail') {
    return `${Number(a.linear_ft || 0).toLocaleString()} linear ft`;
  }
  return `${Number(a.area_sqft || 0).toLocaleString()} ${UNIT[a.area_type] || 'sqft'}`;
}

export const MeasurementPrintable = forwardRef<HTMLDivElement, Props>(function MeasurementPrintable(
  { measurement: m, branding, printMode },
  ref,
) {
  const { brandName, brandTagline, brandPhone, brandPrimary, brandSecondary, brandAccent, logoUrl } =
    branding;

  const groups: { header: MeasurementArea | null; items: MeasurementArea[] }[] = [];
  let current: { header: MeasurementArea | null; items: MeasurementArea[] } = {
    header: null,
    items: [],
  };
  for (const a of m.areas || []) {
    if (a.area_type === 'section') {
      if (current.header || current.items.length) groups.push(current);
      current = { header: a, items: [] };
    } else {
      current.items.push(a);
    }
  }
  if (current.header || current.items.length) groups.push(current);

  const sumLinear = (type: MeasurementArea['area_type']) =>
    m.areas?.filter((a) => a.area_type === type).reduce((s, a) => s + Number(a.linear_ft || 0), 0) || 0;
  const stairs =
    m.areas?.filter((a) => a.area_type === 'staircase').reduce((s, a) => s + Number(a.area_sqft || 0), 0) || 0;
  const posts =
    m.areas?.filter((a) => a.area_type === 'posts').reduce((s, a) => s + Number(a.area_sqft || 0), 0) || 0;
  const baseboardLf = sumLinear('baseboard');
  const handrailLf = sumLinear('handrail');

  const renderAreaRow = (a: MeasurementArea, markPdfRow = true) => (
    <div
      key={a.id}
      {...(markPdfRow ? { 'data-pdf-row': true } : {})}
      {...(markPdfRow ? { 'data-pdf-section': true } : {})}
      className="grid grid-cols-12 py-2.5 border-b border-border/40 text-sm"
    >
      <div className="col-span-7">
        <p className="font-medium">{a.room_name || '—'}</p>
        {a.notes && (
          <p className="text-xs text-muted-foreground">{a.notes}</p>
        )}
      </div>
      <div className="col-span-2 text-right tabular-nums text-muted-foreground text-xs">
        {a.dimensions || '—'}
      </div>
      <div className="col-span-3 text-right font-semibold tabular-nums">
        {areaValue(a)}
      </div>
    </div>
  );

  return (
    <div ref={ref} style={printMode ? { width: 800, background: '#ffffff' } : undefined}>
      <Card className="overflow-hidden shadow-sm bg-white text-foreground">
        <div
          data-pdf-section
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
          <p className="text-xs mt-2 tabular-nums" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Measurement Report {m.label ? `— ${m.label}` : ''}
          </p>
        </div>

        <div data-pdf-section className="h-[3px] w-full" style={{ backgroundColor: brandPrimary }} />

        <div data-pdf-section className="px-10 pt-8">
          <h2
            className="text-lg font-semibold pb-2 mb-4 border-b-2"
            style={{ fontFamily: 'Montserrat, sans-serif', borderColor: brandPrimary }}
          >
            Project
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Client</p>
              <p className="font-semibold">{m.project?.customer_name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <p>
                {m.project?.address || '—'}
                {m.project?.city ? `, ${m.project.city}` : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Service</p>
              <p>{m.service_type || m.project?.project_type || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Measured</p>
              <p>
                {m.measurement_date
                  ? format(parseMeasurementDate(m.measurement_date)!, 'MMMM d, yyyy')
                  : '—'}
                {m.measured_by ? ` · ${m.measured_by}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div data-pdf-section className="px-10 pt-6">
          <div>
            <p className="text-[10.5px] uppercase tracking-widest text-muted-foreground mb-2">
              Summary
            </p>
            <div
              className="rounded-lg px-4 py-4 flex flex-wrap justify-center gap-6 text-sm"
              style={{
                backgroundColor: `${brandPrimary}15`,
                color: brandPrimary,
                border: `1px solid ${brandPrimary}30`,
              }}
            >
              {m.total_sqft > 0 && (
                <span>
                  <strong className="tabular-nums">{m.total_sqft.toLocaleString()}</strong> sqft
                </span>
              )}
              {baseboardLf > 0 && (
                <span>
                  <strong className="tabular-nums">{baseboardLf.toLocaleString()}</strong> lf baseboard
                </span>
              )}
              {handrailLf > 0 && (
                <span>
                  <strong className="tabular-nums">{handrailLf.toLocaleString()}</strong> lf handrail
                </span>
              )}
              {stairs > 0 && (
                <span>
                  <strong className="tabular-nums">{stairs}</strong> steps
                </span>
              )}
              {posts > 0 && (
                <span>
                  <strong className="tabular-nums">{posts}</strong> posts
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-10 pt-6 pb-6 space-y-6">
          <div>
            <div data-pdf-section className="grid grid-cols-12 text-[10.5px] uppercase tracking-widest text-muted-foreground pb-2 border-b border-border/60">
              <div className="col-span-7">Area</div>
              <div className="col-span-2 text-right">Dim</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            {groups.length === 0 && (
              <p data-pdf-section className="text-sm text-muted-foreground text-center py-6">No areas recorded</p>
            )}

            {groups.map((g, gi) => {
              const [firstItem, ...remainingItems] = g.items;

              return (
                <div key={gi} data-pdf-section>
                  {g.header && firstItem ? (
                    <div data-pdf-section data-pdf-group data-pdf-row>
                      <div
                        className="mt-4 mb-1 px-2 py-1.5 text-xs font-bold uppercase tracking-widest rounded"
                        style={{
                          color: brandPrimary,
                          backgroundColor: `${brandPrimary}0d`,
                        }}
                      >
                        {g.header.room_name || 'Section'}
                      </div>
                      {renderAreaRow(firstItem, false)}
                    </div>
                  ) : g.header ? (
                    <div data-pdf-section data-pdf-row>
                      <div
                        className="mt-4 mb-1 px-2 py-1.5 text-xs font-bold uppercase tracking-widest rounded"
                        style={{
                          color: brandPrimary,
                          backgroundColor: `${brandPrimary}0d`,
                        }}
                      >
                        {g.header.room_name || 'Section'}
                      </div>
                    </div>
                  ) : firstItem ? (
                    renderAreaRow(firstItem)
                  ) : null}

                  {remainingItems.map((a) => renderAreaRow(a))}
                </div>
              );
            })}
          </div>

          {(m.service_type || m.material || m.finish_type) && (
            <div data-pdf-section className="bg-muted/40 rounded-md p-4 text-sm grid grid-cols-3 gap-3">
              {m.service_type && (
                <div>
                  <p className="text-[10.5px] uppercase tracking-widest text-muted-foreground">Service</p>
                  <p className="font-medium">{m.service_type}</p>
                </div>
              )}
              {m.material && (
                <div>
                  <p className="text-[10.5px] uppercase tracking-widest text-muted-foreground">Material</p>
                  <p className="font-medium">{m.material}</p>
                </div>
              )}
              {m.finish_type && (
                <div>
                  <p className="text-[10.5px] uppercase tracking-widest text-muted-foreground">Finish</p>
                  <p className="font-medium">{m.finish_type}</p>
                </div>
              )}
            </div>
          )}

          {m.notes && (
            <div data-pdf-section className="bg-muted/40 rounded-md p-3 text-sm">
              <p className="text-[10.5px] uppercase tracking-widest text-muted-foreground mb-1">
                Notes
              </p>
              <p className="whitespace-pre-wrap">{m.notes}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
});

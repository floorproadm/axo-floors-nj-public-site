import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Ruler } from 'lucide-react';
import { toast } from 'sonner';
import { exportElementToPdf } from '@/lib/estimatePdf';
import { MeasurementPrintable } from '@/components/admin/measurements/MeasurementPrintable';
import { resolveBrandLogo, safeBrandPrimary } from '@/lib/brand';
import type { ProjectMeasurement, MeasurementArea } from '@/hooks/useMeasurements';

export default function PublicMeasurement() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedLogo, setResolvedLogo] = useState('');
  const [downloading, setDownloading] = useState(false);
  const visibleRef = useRef<HTMLDivElement>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const { data: res, error } = await supabase.rpc(
        'public_get_measurement_by_token' as any,
        { _token: token },
      );
      if (error) toast.error(error.message);
      setData(res);
      setLoading(false);
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

  const handleDownload = async () => {
    const target = printableRef.current || visibleRef.current;
    if (!target || !data) return;
    setDownloading(true);
    try {
      const slug = (data.project?.customer_name || 'measurement')
        .replace(/[^a-z0-9]+/gi, '-')
        .toLowerCase();
      await exportElementToPdf(target, `measurement-${slug}.pdf`);
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
          <Ruler className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <h1 className="text-xl font-bold">Measurement not found</h1>
          <p className="text-muted-foreground text-sm mt-1">This link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const branding = data.branding || {};
  const brandingProps = {
    brandName: branding.company_name || 'FloorPro',
    brandTagline: branding.tagline || 'Professional Flooring Services',
    brandPhone: branding.phone || '',
    brandPrimary: safeBrandPrimary(branding.primary_color),
    brandSecondary: branding.secondary_color || '#1e3a5f',
    brandAccent: '#fcba03',
    logoUrl: resolvedLogo,
  };

  const areas: MeasurementArea[] = (Array.isArray(data.areas) ? data.areas : []).map((a: any) => ({
    id: a.id,
    measurement_id: data.id,
    room_name: a.room_name ?? '',
    area_sqft: Number(a.area_sqft) || 0,
    linear_ft: Number(a.linear_ft) || 0,
    dimensions: a.dimensions ?? null,
    area_type: a.area_type ?? 'floor',
    notes: a.notes ?? null,
    display_order: Number(a.display_order) || 0,
    created_at: '',
  }));

  const measurement: ProjectMeasurement = {
    id: data.id,
    project_id: '',
    label: data.label ?? null,
    status: data.status ?? 'completed',
    measurement_date: data.measurement_date ?? null,
    measured_by: data.measured_by ?? null,
    total_sqft: Number(data.total_sqft) || 0,
    total_linear_ft: Number(data.total_linear_ft) || 0,
    service_type: data.service_type ?? null,
    material: data.material ?? null,
    finish_type: data.finish_type ?? null,
    notes: data.notes ?? null,
    created_at: '',
    updated_at: '',
    areas,
    project: {
      customer_name: data.project?.customer_name ?? '',
      address: data.project?.address ?? null,
      city: data.project?.city ?? null,
      project_type: data.project?.project_type ?? '',
    },
  };

  return (
    <div className="min-h-screen bg-muted/20 py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <MeasurementPrintable ref={visibleRef} measurement={measurement} branding={brandingProps} />

        <div className="flex justify-center">
          <Button variant="outline" onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download PDF
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Measurement details for reference. Contact us if you have any questions.
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
        <MeasurementPrintable ref={printableRef} measurement={measurement} branding={brandingProps} printMode />
      </div>
    </div>
  );
}

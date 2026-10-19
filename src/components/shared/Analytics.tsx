import { useEffect } from 'react';
import { getAnalyticsMeasurementId } from '@/lib/analytics.functions';
import { initializeAnalytics } from '@/lib/analytics';

export default function Analytics() {
  useEffect(() => {
    let cancelled = false;
    void getAnalyticsMeasurementId().then((id) => {
      if (!cancelled && id) initializeAnalytics(id);
    }).catch(() => {
      // Tracking failures must never interfere with browsing or submitting forms.
      console.warn('AXO page analytics could not initialize.');
    });
    return () => { cancelled = true; };
  }, []);
  return null;
}
import { createServerFn } from '@tanstack/react-start';

// A GA4 measurement ID is intentionally public; no other configuration is exposed.
export const getAnalyticsMeasurementId = createServerFn({ method: 'GET' }).handler(() => {
  const id = process.env['GOOGLE_ANALYTICS_MEASUREMENT_ID']?.trim();
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
  return id;
});
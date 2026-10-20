// @ts-nocheck -- vitest is run via bunx, matching existing project tests.
import { describe, expect, it } from 'vitest';
import { createEventDispatcher, safeAnalyticsEvent, trackEstimateStep1Completed } from './analytics';

const prod = 'https://axofloorsnj.com/get-started';
const setup = () => { const sent: unknown[] = []; return { sent, d: createEventDispatcher((n, p) => sent.push([n, p])) }; };

describe('GA4 event rules', () => {
  it('sends generate_lead once per submission (no double counting)', () => {
    const { sent, d } = setup();
    const p = { form_location: 'get_started', service_path: 'not-sure' };
    d('generate_lead', p, prod, 'sub-1'); d('generate_lead', p, prod, 'sub-1');
    expect(sent).toEqual([['generate_lead', p]]);
  });
  it('drops unknown events, unknown values and any extra parameters', () => {
    expect(safeAnalyticsEvent('form_submit', {})).toBeNull();
    expect(safeAnalyticsEvent('generate_lead', { form_location: 'get_started', service_path: 'jane@example.com' })).toBeNull();
    expect(safeAnalyticsEvent('sms_click', { link_location: 'gallery', email: 'jane@example.com', phone: '7323518653' })).toEqual({ link_location: 'gallery' });
  });
  it('sends nothing from preview hosts or private/unknown pages', () => {
    const { sent, d } = setup();
    const p = { link_location: 'get_started' };
    d('sms_click', p, 'https://id-preview--x.lovable.app/get-started');
    d('sms_click', p, 'http://localhost:8080/get-started');
    d('sms_click', p, 'https://axofloorsnj.com/invoice/token');
    expect(sent).toEqual([]);
  });
  it('step 1 event stays off and requires durable server confirmation', () => {
    expect(trackEstimateStep1Completed({ durable: true, captureId: 'c1' })).toBe(false);
    expect(trackEstimateStep1Completed(null, true)).toBe(false);
    expect(trackEstimateStep1Completed({ durable: false, captureId: 'c1' }, true)).toBe(false);
  });
});

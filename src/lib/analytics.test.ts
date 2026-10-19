// @ts-nocheck -- vitest is run via bunx, matching existing project tests.
import { describe, expect, it } from 'vitest';
import { createPageViewTracker, safeAnalyticsPage, safeAnalyticsReferrer } from './analytics';

describe('GA4 page measurement rules', () => {
  it('counts the initial visit and each navigation once, including back navigation', () => {
    const events: unknown[] = [];
    const track = createPageViewTracker((page) => events.push(page));
    ['/', '/', '/gallery', '/gallery?email=customer@example.com', '/gallery#photos', '/contact', '/gallery'].forEach((path) => track('https://axofloorsnj.com' + path));
    expect(events.map((page) => page.page_path)).toEqual(['/', '/gallery', '/contact', '/gallery']);
  });
  it('retains safe UTM attribution across subsequent pages', () => {
    const events: unknown[] = [];
    const track = createPageViewTracker((page) => events.push(page));
    track('https://axofloorsnj.com/?utm_source=instagram&utm_medium=bio');
    track('https://axofloorsnj.com/contact');
    expect(events[1]).toMatchObject({ campaign_source: 'instagram', campaign_medium: 'bio' });
  });
  it('never includes names, email, phone, address, arbitrary queries or fragments', () => {
    const page = safeAnalyticsPage('https://axofloorsnj.com/contact?name=Jane+Smith&email=jane@example.com&phone=7323518653&address=12+Main+St&utm_source=jane@example.com&utm_medium=Jane+Smith&utm_campaign=12+Main+St#jane');
    expect(page).toEqual({ page_location: 'https://axofloorsnj.com/contact', page_path: '/contact', page_title: 'Contact | AXO Floors NJ' });
  });
  it('does not measure private token links or unknown paths', () => {
    for (const path of ['/invoice/private-token', '/estimate/private-token', '/m/private-token', '/portal/private-token', '/proposal/private-token', '/auth', '/customer-jane']) {
      expect(safeAnalyticsPage('https://axofloorsnj.com' + path)).toBeNull();
    }
  });
  it('removes dynamic path values and referrer customer details', () => {
    expect(safeAnalyticsPage('https://axofloorsnj.com/blog/customer-name')?.page_path).toBe('/blog/article');
    expect(safeAnalyticsPage('https://axofloorsnj.com/service-areas/new-jersey/customer-name')?.page_path).toBe('/service-areas/new-jersey/city');
    expect(safeAnalyticsReferrer('https://example.com/Jane?email=jane@example.com')).toBe('https://example.com/');
  });
});
import { afterEach, describe, expect, it, vi } from "vitest";
const report = vi.hoisted(() => vi.fn(async () => ({ sent: true })));
vi.mock("@/lib/meta-capi.functions", () => ({ reportMetaConversion: report }));
vi.mock("@/lib/meta-pixel", () => ({ isMetaTrackingActive: () => true }));
vi.mock("@/lib/analytics", () => ({ safeAnalyticsPage: () => ({ page_location: "https://axofloorsnj.com/contact" }) }));
import { trackEvent } from "./metaTracking";
describe("Confirmed Meta Lead only", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });
  it("fires neither browser nor server Lead without a returned UUID", () => {
    const fbq = vi.fn();
    vi.stubGlobal("window", { fbq });
    trackEvent("Lead", {}, { leadId: undefined });
    trackEvent("Lead", {}, { leadId: "not-a-uuid" });
    expect(fbq).not.toHaveBeenCalled();
    expect(report).not.toHaveBeenCalled();
  });
  it("passes the returned UUID only as server matching data with a shared event ID", () => {
    const fbq = vi.fn();
    vi.stubGlobal("window", { fbq, location: { href: "https://axofloorsnj.com/contact", origin: "https://axofloorsnj.com", search: "" } });
    vi.stubGlobal("document", { cookie: "" });
    const leadId = "55555555-5555-4555-8555-555555555555";
    trackEvent("Lead", { content_name: "contact" }, { leadId });
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(report).toHaveBeenCalledTimes(1);
    const browserId = fbq.mock.calls[0]?.[3]?.eventID;
    expect(report.mock.calls[0]?.[0]?.data).toMatchObject({ event_name: "Lead", event_id: browserId, match: { lead_id: leadId } });
    expect(JSON.stringify(fbq.mock.calls)).not.toContain(leadId);
  });
});
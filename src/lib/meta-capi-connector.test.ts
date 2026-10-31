import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
const requestHeaders = vi.hoisted(() => ({ current: {} as Record<string, string> }));

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    inputValidator: () => ({ handler: (handler: unknown) => handler }),
  }),
}));
vi.mock("@tanstack/react-start/server", () => ({
  getRequest: () => new Request("https://axofloorsnj.com/", { headers: requestHeaders.current }),
}));
import { reportMetaConversion } from "./meta-capi.functions";

// Mock only the RPC wrapper; exercise the real handler and transport logic.
const invoke = reportMetaConversion as unknown as (input: { data: {
  event_name: "Lead"; event_id: string; event_source_url: string;
  fbp?: string; fbc?: string;
  match?: { email?: string; phone?: string; name?: string; zip?: string; lead_id?: string };
} }) => Promise<{ sent: boolean; status?: number; response?: unknown }>;
const input = { data: {
  event_name: "Lead" as const,
  event_id: "08a4cc4a-13c9-48ce-adc7-322c494846ed",
  event_source_url: "https://axofloorsnj.com/contact",
} };

describe("Meta connector server transport", () => {
  beforeEach(() => {
    requestHeaders.current = { "user-agent": "Synthetic validation", "cf-connecting-ip": "192.0.2.1" };
    vi.stubEnv("LOVABLE_API_KEY", "synthetic-gateway-key");
    vi.stubEnv("META_ADS_API_KEY", "synthetic-connection-key");
    vi.stubEnv("META_TEST_EVENT_CODE", "TEST87766");
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it("sends exactly one Lead to the specified pixel with the same event_id and test code", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ events_received: 1, fbtrace_id: "synthetic_trace" }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await invoke(input);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://connector-gateway.lovable.dev/meta_ads/v26.0/403151700983838/events");
    expect(options.headers).toMatchObject({ Authorization: "Bearer synthetic-gateway-key", "X-Connection-Api-Key": "synthetic-connection-key" });
    const body = JSON.parse(options.body);
    expect(body.test_event_code).toBe("TEST87766");
    expect(body.data).toHaveLength(1);
    expect(body.data[0]).toMatchObject({ event_name: "Lead", event_id: input.data.event_id });
    expect(result).toEqual({ sent: true, status: 200, response: { events_received: 1, fbtrace_id: "synthetic_trace" } });
  });

  it("exposes only non-PII receipt fields on a provider rejection", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: { code: 100, type: "OAuthException", message: "sensitive echoed input", fbtrace_id: "test_trace" } }, { status: 400 })));
    const result = await invoke(input);
    expect(result).toEqual({ sent: false, status: 400, response: { error: { code: 100, type: "OAuthException", fbtrace_id: "test_trace" } } });
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain("sensitive echoed input");
  });

  it("does not send anything when connector credentials are missing", async () => {
    vi.stubEnv("META_ADS_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await invoke(input)).toEqual({ sent: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("includes request IP, UA, available cookies and hashed Lead fields", async () => {
    requestHeaders.current = { "user-agent": "Synthetic validation", "cf-connecting-ip": " ", "x-forwarded-for": "192.0.2.2, 192.0.2.3" };
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ events_received: 1 }));
    vi.stubGlobal("fetch", fetchMock);
    await invoke({ data: { ...input.data, fbp: "synthetic_fbp", fbc: "synthetic_fbc", match: { email: "synthetic@example.invalid", phone: "2025550100", name: "Synthetic Person", zip: "00000", lead_id: input.data.event_id } } });
    const userData = JSON.parse(fetchMock.mock.calls[0][1].body).data[0].user_data;
    expect(userData).toMatchObject({ client_ip_address: "192.0.2.2", client_user_agent: "Synthetic validation", fbp: "synthetic_fbp", fbc: "synthetic_fbc" });
    for (const field of ["em", "ph", "fn", "ln", "zp", "external_id"]) expect(userData[field]).toMatch(/^[a-f0-9]{64}$/);
  });

  it("skips empty user_data with the exact requested non-PII log", async () => {
    requestHeaders.current = {};
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await invoke(input)).toEqual({ sent: false });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(console.info).toHaveBeenCalledWith("[capi] skipped: no user_data");
  });

  it.each(["cf-connecting-ip", "user-agent"])("skips when required request header %s is missing", async (header) => {
    delete requestHeaders.current[header];
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await invoke(input)).toEqual({ sent: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
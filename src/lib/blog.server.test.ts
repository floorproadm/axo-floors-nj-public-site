import { afterEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { __setBlogFetch, getPublishedPost, isPubliclyVisible, listPublishedPosts, listSitemapEntries } from "./blog.server";
import { ArticleMarkdown } from "@/components/blog/BlogChrome";

const NOW = new Date("2026-09-27T00:00:00Z");
const base = {
  slug: "how-to-refinish", title: "How to Refinish", excerpt: "Guide", body_markdown: "## Step one\n\nSand it.",
  cover_image_url: "axo/covers/a.jpg", cover_alt: "Oak floor", category: "Guides", tags: ["oak"],
  author_display_name: "Eduardo", seo_title: null, seo_description: null, status: "published",
  published_at: "2026-09-01T00:00:00Z", updated_at: "2026-09-02T00:00:00Z",
};
const calls: string[] = [];
function mock(rows: unknown[]) {
  __setBlogFetch((async (url: string, init?: RequestInit) => {
    calls.push(String(url));
    if (String(url).includes("/storage/v1/object/sign/")) {
      expect(init?.method).toBe("POST");
      return new Response(JSON.stringify({ signedURL: "/object/sign/blog-media/axo/covers/a.jpg?token=t" }));
    }
    return new Response(JSON.stringify(rows));
  }) as typeof fetch);
}
afterEach(() => { __setBlogFetch(null); calls.length = 0; });

describe("blog public reader", () => {
  it("filters org/status/due in query and re-checks rows", async () => {
    mock([base, { ...base, slug: "draft", status: "draft" }, { ...base, slug: "future", published_at: "2027-01-01T00:00:00Z" }]);
    const list = await listPublishedPosts(NOW);
    expect(list.map((p) => p.slug)).toEqual(["how-to-refinish"]);
    expect(calls[0]).toContain("organization_id=eq.a0000000-0000-0000-0000-000000000001");
    expect(calls[0]).toContain("status=eq.published");
    expect(calls[0]).toContain("published_at=lte.");
    expect(calls[0]).toContain("order=published_at.desc");
  });
  it("signs cover only for resolved published post, never exposes raw path", async () => {
    mock([base]);
    const p = await getPublishedPost("how-to-refinish", NOW);
    expect(p?.coverUrl).toMatch(/^https:\/\/dcfmrqrbsfxvqhihpamd\.supabase\.co\/storage\/v1\/object\/sign\/blog-media\//);
    expect(JSON.stringify(p)).not.toContain('"cover_image_url"');
  });
  it("returns null (404) for draft/future/unknown without signing", async () => {
    mock([{ ...base, status: "draft" }]);
    expect(await getPublishedPost("how-to-refinish", NOW)).toBeNull();
    mock([]);
    expect(await getPublishedPost("nope", NOW)).toBeNull();
    expect(calls.some((c) => c.includes("/storage/"))).toBe(false);
  });
  it("distinguishes outage from empty", async () => {
    __setBlogFetch((async () => new Response("x", { status: 503 })) as typeof fetch);
    await expect(listPublishedPosts(NOW)).rejects.toThrow(/503/);
    mock([]);
    expect(await listPublishedPosts(NOW)).toEqual([]);
  });
  it("sitemap entries public only", async () => {
    mock([base, { ...base, slug: "x", status: "draft" }]);
    expect((await listSitemapEntries(NOW)).map((e) => e.slug)).toEqual(["how-to-refinish"]);
  });
  it("visibility helper", () => {
    expect(isPubliclyVisible({ status: "published", published_at: null }, NOW)).toBe(false);
  });
  it("markdown: raw HTML dropped, unsafe links stripped, headings rendered", () => {
    const html = renderToStaticMarkup(createElement(ArticleMarkdown, {
      source: "## Heading\n\n<script>alert(1)</script>\n\n[bad](javascript:alert(1)) [ok](https://example.com)\n\n![i](http://insecure/x.png)",
    }));
    expect(html).toContain("<h2");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("javascript:");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('rel="noopener noreferrer nofollow"');
    expect(html).not.toContain("insecure");
  });
});

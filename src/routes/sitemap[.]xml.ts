import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PUBLIC_SITE_URL } from "@/lib/constants";

const BASE_URL = PUBLIC_SITE_URL;

const paths = [
  "/", "/installation", "/refinishing", "/vinyl-plank-flooring",
  "/gallery", "/stain-gallery", "/about", "/contact", "/get-started", "/schedule-estimate",
  "/campaign", "/referral-program", "/builders", "/realtors", "/builder-offer",
  "/partner-program", "/wow-pack", "/hub", "/blog",
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = paths.map((p) =>
          `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : "0.8"}</priority></url>`
        );
        try {
          const { listSitemapEntries } = await import("@/lib/blog.server");
          for (const e of await listSitemapEntries()) {
            const lastmod = (e.updated_at ?? e.published_at ?? "").slice(0, 10);
            urls.push(
              `  <url><loc>${esc(`${BASE_URL}/blog/${e.slug}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<changefreq>monthly</changefreq><priority>0.7</priority></url>`
            );
          }
        } catch (err) {
          console.error("sitemap: blog entries unavailable", err);
        }
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=300" },
        });
      },
    },
  },
});

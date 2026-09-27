# AXO Public Site (Project B) — Blog Frontend Implementation Report

Date: 2026-09-27 (UTC)

## HEAD
- Brief stated base: `410c2b76dd8d5dd9ec0de6c06a23224b69dbb879`.
- Actual HEAD at preflight: `9efda8a7a9061def568d2214df45fcca25b552a1` (differs from brief; proceeded on actual HEAD). HEAD observed mid-run: `f61eca84…` (platform auto-commits). Final commit is recorded by the platform.

## Architecture
- `src/lib/blog.server.ts` — server-only reader using plain `fetch` to PostgREST/Storage with the **public anon key** only (no supabase-js browser client, no localStorage, no service role). Query filters: `organization_id=eq.AXO`, `status=eq.published`, `published_at not null`, `published_at<=now`, plus in-code re-check (defense in depth on top of RLS). Backend failure throws `BlogBackendError` (→ error component), empty table returns `[]` (→ empty state).
- Private covers: `POST /storage/v1/object/sign/blog-media/<path>` with anon key, TTL 3600 s, executed **only after** a published post is resolved. Raw storage path is stripped from returned data and never rendered. Absolute-URL values in `cover_image_url` are rejected (fallback). Sign failure → branded fallback.
- `src/lib/blog.functions.ts` — `createServerFn` wrappers (handlers dynamic-import the server module).
- `src/routes/blog.index.tsx` (`/blog`) and `src/routes/blog.$slug.tsx` (`/blog/$slug`) — SSR TanStack routes (not the `/$` SPA catch-all). Unknown/draft/future/other-org → `notFound()` → real HTTP 404 + `noindex`.
- Caching: `Cache-Control: public, max-age=60, s-maxage=300` on both pages (5 min < 1 h URL TTL); every render re-signs. New A publishes appear after cache expiry, no redeploy.
- `src/components/blog/BlogChrome.tsx` — uses SSR-safe `HeaderSSR`/`FooterSSR`; `react-markdown` with `skipHtml`, URL allow-list (http/https/mailto/tel/relative), external links `noopener noreferrer nofollow`, images only `https:`.
- SEO: canonical `https://axofloorsnj.com/blog` and `/blog/{slug}`; dynamic title/description (seo_* fallback to title/excerpt); OG/Twitter incl. signed cover when present; JSON-LD `BlogPosting` + `BreadcrumbList`.
- Sitemap route now emits absolute URLs via `PUBLIC_SITE_URL`, adds `/blog` and published AXO articles with `lastmod`. **Finding:** static `public/sitemap.xml` was shadowing the route entirely, so it was removed and its 21 service-area URLs are now generated from `getPublishedLocations()` (indexable only). All previous paths preserved (40 URLs total with empty blog).
- Nav: "Blog" added to desktop `Header.tsx`, mobile `AppSidebar.tsx` (plain `<a>` — /blog is outside BrowserRouter), and `HeaderSSR` desktop+mobile. Existing targets untouched.

## Not touched
Gallery page/code, gallery tables, media buckets, Feed, Project A, DB schema/RLS/storage. Zero DB writes.

## Tests (all passed)
- `bunx vitest run src/lib/blog-reader.test.ts` — 7/7 with mocked fetch fixture: public filter params in query, draft/future rows dropped, cover signed only for resolved published post with raw path absent from output, draft/unknown → null with no sign call, 503 outage vs empty distinguished, sitemap entries public-only, markdown strips `<script>`, `javascript:` links and `http:` images.
- Live dev: `GET /blog` 200 with empty state + canonical + Cache-Control; `GET /blog/does-not-exist` **404** with noindex; `/sitemap.xml` 200 with absolute URLs incl. `/blog`.
- Playwright 390px: /blog renders, no page errors; mobile sidebar on home shows Blog link.
- Errors encountered: vitest ignored `*.server.test.ts` name → renamed test file; static sitemap shadowing (fixed above); TS2556 on fetch-injection typing (fixed); test file marked ts-nocheck because vitest types are not a project dependency. `tsgo` clean for blog files.

## UNVERIFIED
- End-to-end publish in A → appearance in B, real signed cover from live `blog-media`, and full SSR article render against live data (live table has 0 rows; no sample articles created). Article SSR/head/JSON-LD was verified only via unit fixture logic, not a live row.

## Files
- Added: `src/lib/blog.server.ts`, `src/lib/blog.functions.ts`, `src/lib/blog-reader.test.ts`, `src/components/blog/BlogChrome.tsx`, `src/routes/blog.index.tsx`, `src/routes/blog.$slug.tsx`, this report.
- Modified: `src/routes/sitemap[.]xml.ts`, `src/components/shared/Header.tsx`, `src/components/shared/AppSidebar.tsx`, `src/components/locations/ssr/HeaderSSR.tsx`.
- Removed: `public/sitemap.xml` (superseded by dynamic route).

## Follow-up: Blog moved directly below Gallery in all menus

Requested after the initial build (mobile menu screenshot).

- `src/components/shared/AppSidebar.tsx` — Blog now renders inside the `mainNavigation`
  map immediately after the Gallery entry (wrapped in a `Fragment`), so the drawer reads
  Contact → About → Gallery → **Blog** → Stain Colors → Builders. Still a plain
  `<a href="/blog">` (server-rendered route outside the SPA router).
- `src/components/shared/Header.tsx` — Blog anchor moved from the end of the desktop nav
  into the `navigation` map right after Gallery: Services | Gallery | **Blog** | Contact |
  Smart Estimate. The trailing hard-coded separator + anchor were removed so no duplicate
  `|` remains.
- `src/components/locations/ssr/HeaderSSR.tsx` — desktop and mobile navs on the SSR
  service-area/hub pages reordered the same way (Gallery | **Blog** | Contact).

### Verification
- `build-errors.log`: latest entries `build OK` (a transient `Cannot find name 'Fragment'`
  between the two edits cleared once the import landed).
- Playwright 393x800, mobile drawer link order:
  `['Contact', 'About', 'Gallery', 'Blog', 'Stain Colors', 'Builders', 'SMART ESTIMATE', 'CONTACT US']`;
  screenshot confirms Blog directly below Gallery, no layout defects.
- Playwright 1280x900, desktop nav text: `Services | Gallery | Blog | Contact Smart Estimate`.

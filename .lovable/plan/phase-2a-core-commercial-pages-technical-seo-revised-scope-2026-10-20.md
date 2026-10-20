# Phase 2A — Core Commercial Pages Technical SEO (revised scope)

## Scope freeze
- City / service-area pages (`/service-areas/**`) are FROZEN: no edits to their content, indexability, redirects, structured data or sitemap entries. They are frozen because their copy is still waiting for the owner's approval. That does not mean Google is penalizing them.
- The blog is untouched.
- FloorPRO (Project A), the forms' backend, the partial Step 1 email and the GA4 setup stay unchanged.
- No redesign: same visuals, copy blocks, buttons and links.

## Order
1. `/refinishing` pilot (must pass every check before anything else)
2. `/` homepage
3. `/installation`, `/stairs`, `/vinyl-plank-flooring`
4. `/gallery`, `/about`, `/contact`
5. `/get-started` last, with its own extra protection checks

Each page ships as its own preview step and needs owner approval before the next one starts.

## Pilot: /refinishing
1. Add a dedicated route file `src/routes/refinishing.tsx`. It server-renders the existing `src/pages/Refinishing.tsx` content, so Google gets the full text in the first HTML response instead of the empty browser-only page.
2. Move the page's metadata into that route's `head()`: a unique title, description, og:title/og:description, og:type, twitter:card, `og:url` and a self-canonical of `https://axofloorsnj.com/refinishing`. No og:image, because the hero is a bundled asset; the hosting adds a preview image.
3. On this route, stop the old `SEOHead` from changing the head in the browser, so no duplicate or conflicting tags appear. Every other page keeps using it.
4. Structured data, using verified facts only: `HomeAndConstructionBusiness` (name, phone (732) 351-8653, NJ service area, URL) plus a `Service` for "Hardwood Floor Refinishing". No aggregateRating or review data. FAQPage is optional and only if the visible FAQ matches it word for word.
5. `/sanding-and-refinish` gets a permanent 301 redirect to `/refinishing`, done on the server and not in the browser.
6. Shared header, footer, sticky CTA and links keep working. The links currently use the old router; they get a small adapter or the existing SSR-safe link pattern (`SafeLink`, `HeaderSSR`) so the page still works when the server renders it.
7. GA4: exactly one page view per visit or navigation, through the existing shared tracking. Nothing new is added.

## Claims needing owner verification (no copy changes until confirmed)
- "10-year warranty": is it real, what does it cover, and is it written down anywhere?
- "500+ floors restored / 500+ homes": does the owner have a source for this number?
- Prices ($3.50–$6.00/sq ft, $1,800 minimum; installation $9–$15, $3,500 minimum): are they still current?
- "Dustless" vs "dust control" wording, and the Bona/Loba finishes.
- The exact business address or service-area model (storefront or service-area business) for the structured data.

Any claim the owner doesn't confirm gets softened or removed from the copy and is never put into structured data.

## Tests (preview only, no real leads or emails)
- Fetch `/refinishing` without running JavaScript. The HTML must contain the H1, the FAQ text, a unique title, one canonical, the og tags and valid JSON-LD.
- Rich Results / schema validator shows no errors, and there is no rating data.
- `/sanding-and-refinish` returns 301 with Location `/refinishing`. Unknown URLs still behave as they do today (the known soft-404 problem is logged, not fixed in this step).
- Playwright at 375px and 1280px: screenshots match the current design, there are no hydration or console errors, and every CTA leads to `/get-started`, `tel:` or `sms:`.
- GA4: one page_view on load and one per Back/forward navigation, with no PII and no extra events.
- Regression: the full test suite and the build pass. `/get-started`, `/quiz`, the city pages and the blog give the same HTML as before (compared), and the sitemap is unchanged except for the canonical refinishing entry.
- Rollback: remove the route file and the redirect, and the page goes back to the old browser-only version.

## Later pages
- They repeat the pilot pattern. The homepage also gets the main business structured data.
- `/get-started` comes last and changes only head and server rendering. Its form logic, Step 1 capture, generate_lead and the estimate_step_1_completed events are covered by the existing tests plus a fake-data check that sends nothing.

## Technical notes
- Today's pages live inside the old router (`src/App.tsx` behind the `src/routes/$.tsx` catch-all) and read browser-only APIs. Each migrated page must not touch `window` or `document` while rendering on the server; code that needs them moves into effects.
- Per-route canonicals live only on the page routes (leaf routes), never on root.
- Nothing is published. Each step waits for owner approval.

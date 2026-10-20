# Get Started guided journey — preview validation

## Scope and baseline
- Starting HEAD matched `6d17cdcfbc97b58fce425be1a98b64d93950021d`, with no intervening conflicts or working changes.
- Preview: https://id-preview--c137fb77-3417-4cb2-a730-37b10e153e82.lovable.app/get-started
- Nothing published. Owner visual approval is required before production release.

## Implementation
- Archived Welcome layout and exact intro copy, existing official white AXO logo on navy for legibility.
- Existing Quiz card/progress/typography treatment, accessible single-choice controls, visible Back and Next Step on every form page.
- Installation and combination: 10 steps, both include finish scope. Refinishing: 7 steps. Guidance: 5 steps.
- Required contact information, optional email, typed city/ZIP only, original area presets/custom area and conditional stair ranges.
- Optional Shadcn exact-date picker is separate from required general timeline. Required contact method and consent.
- Same anonymous server-validated estimate save remains in use. Canonical services derived from service type; all relevant details appear in structured notes on one lead and its notification. Combination always saves installation + refinishing, regardless of finish scope.
- Hidden branch fields are normalized away; technical answers reset on service switches, while contact information/common preferences remain.
- No fake budget/exact 1200 value: Whole Floor notes explicitly say 1200+ sq ft; room_size and budget remain null.
- Photos persist in memory during Back/Next and never enter payloads or analytics.

## Changed files
- `src/pages/GetStarted.tsx`
- `src/features/get-started/journey.ts`
- `src/features/get-started/journey.test.ts`
- `src/features/get-started/estimate.ts`
- `src/features/get-started/ProjectPhotos.tsx`
- `src/routes/index.tsx` and `src/routes/$.tsx`: required leaf head metadata, with fixed public titles/descriptions only.
- `AGENTS.md`
- `roadmap.md`
- This validation report.

The existing `/quiz` sources, recovery archive, estimate server function/insert implementation, notification handler, Gallery, FloorPRO, shared styles, dependencies, schema/policies and GA4 code are unchanged.

## Verification completed
- 87 passing tests across journey, estimate, estimate server boundary, photo validation and analytics privacy suites.
- 34 new journey tests cover branch steps, exact service mapping, required fields, optional date/email, conditional delivery/stairs, valid dates, positive mutually exclusive area, hidden-answer normalization, structured notes and server rejection before insertion.
- Playwright exercised all four branches at 375px and 1280px: eight simulated successful requests, each exactly one intercepted save and one intercepted notification; success shown, notification-failure notice shown without reinsertion.
- Installation failure path: save request aborted, no success shown, actionable error retained.
- Checked validation error focus, purchased-material delivery requirement, stair-count requirement, timeline/contact/consent errors, preset/custom exclusion, stairs clearing, optional calendar selection/clearing, media previews and persistence, Back navigation and service switching with updated totals.
- No horizontal overflow in tested step screens. Mobile/desktop screenshots reviewed.
- Existing `/quiz` rendered its service question; source and archive unchanged against baseline.
- Automated preview build passed after edits; no manual production build was run.

## Not run / media blocker
- No real leads, emails or uploads were submitted. Browser success and notification tests intercepted requests; database boundary tests mocked the provider.
- Live email delivery and durable save/readback are intentionally unverified without permission for a real submission.
- Existing private, lead-scoped media authorization and authorized staff retrieval could not be verified. Existing public project/chat uploads are unsuitable; private project documents do not establish lead attachment permissions. Existing estimate save exposes no upload capability or authorized lead attachment mechanism.
- Photos remain LOCAL PREVIEWS ONLY: five JPEG/PNG/WebP photos, 10 MB each, HEIC rejected with guidance. The details page and confirmation disclose that photos are not submitted. Video upload is unavailable until a secure pipeline is separately approved; no bucket, policy, schema or credential changes were made.
- No new analytics events. Existing analytics privacy tests pass; live Google ingestion was not revalidated for this change.

Commit is supplied in the completion reply after the editor saves this report.
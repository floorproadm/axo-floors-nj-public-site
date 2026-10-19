# Existing long Get Started questionnaire — recovery archive

Archive date: 2026-10-19. Original source commit: `f40ac41a1d2902a441b321ce5d64a41d57de3bd9`.

This is Project B's backup-only Step A, before any replacement. The source HEAD matched the requested commit and the working tree was clean before archiving. Each snapshot is the complete original file, copied as bytes and compared against both the working source and the source commit. No runtime source, route, configuration, dependency, database or Project A FloorPRO file was changed for this backup. No form was submitted and nothing was published.

These files are recovery documentation, NOT a public page. They live outside `src/` and `public/`, use `.snapshot.txt` extensions, and must never be imported, routed, linked publicly or copied into public assets. The existing TypeScript include patterns cover `src/**/*.ts` and `src/**/*.tsx`, not these text snapshots. This archive contains source code only: no customer records, stored visitor drafts, credentials, or environment values. Environment variable names already present in original source are retained without their values.

## Snapshot manifest

All archive filenames below are relative to this directory. SHA-256 checksums cover raw file bytes, including original line endings and final newline.

| Original source path | Archive filename | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `src/pages/GetStarted.tsx` | `GetStarted.tsx.snapshot.txt` | 29330 | `d0035b102c1c64ce8d4ad65ad3d5cce6fa77e1bca48b2860e7e73c3dcd28b2a3` |
| `src/features/get-started/copy.ts` | `copy.ts.snapshot.txt` | 13682 | `5cc4d5f7e105cc9da701665e6eb7c7365f26a77d826c77c0dbc400075ebef34e` |
| `src/features/get-started/state.ts` | `state.ts.snapshot.txt` | 5001 | `4f77db31321d47f0ee4bcd268456eef114e09cfa754bb82d50f43ce5b8e0b92f` |
| `src/features/get-started/AddressAutocomplete.tsx` | `AddressAutocomplete.tsx.snapshot.txt` | 6928 | `9cc1e30868790752319762d7b14dbb92aed0256c6d8eeb31110986aadcbf3953` |

## Active flow and screen order

The authoritative active flow is the `steps` assembly in `GetStarted.tsx`; `copy.ts` also retains older, unused options. Intro screen 0 shows “Let's Bring Your Floors Back to Life”, the introductory copy and Start. Start advances to the first question. Questions do not advance automatically on selection.

Every branch begins with these six required screens, in order:

1. **Name** — “What's your Name?” One input splits leading-trimmed text into `firstName` (first space-delimited segment) and `lastName` (remaining segments). Only a trimmed first name of at least two characters is required; last name is not independently required.
2. **Phone** — “What's the best phone number to reach you?” The title is personalized with a capitalized first name. Non-digits are stripped, input is limited to ten digits and formatted as a US phone number. Validation requires exactly ten digits.
3. **Email** — “What's your email address?” Required; trimmed input must match `/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i`.
4. **Address** — “Where is the project located?” Required nonblank address and `addressVerified === true`; city and ZIP are populated from selection metadata where available. Helper states service in New Jersey, New York and Pennsylvania. See address behavior below.
5. **Attribution** — “How did you find us?” Required radio selection: Instagram, Facebook, TikTok, YouTube, Pinterest, Google Search, Nextdoor, Referral (friend/family), Contractor / Builder referral, Yard Sign, Vehicle Wrap, Other. Stored as `leadSource`.
6. **Service** — “What type of service do you need?” Required single selection: `new-installation` / New Installation; `floor-refinish` / Refinishing (Sand & Finish); `install-plus-refinish` / Installation + Refinishing; `not-sure` / Not sure / Need guidance. Copy includes each option's original hint.

Only `install-plus-refinish` adds a required **finishScope** screen immediately after service: “Is this finish for new wood we'll install, or for existing floors?” Options: `new-floor` / For the new floor being installed; `existing` / For existing floors; `both` / Both; `not-sure` / Not sure.

### Exact conditional branch sequences

Every sequence below ends with the required consent screen. Technical check and area screens contain multiple questions but count as one screen each.

| Selected service / finish scope | Screens after service/scope, before consent | Required question screens, including consent (excluding intro) |
| --- | --- | ---: |
| New Installation | floorType → materials → location → subfloorGrade → area → timeline → budget | 14 |
| Refinishing (Sand & Finish) | condition → wood → livingDuringRefinish → area → colorChange → timeline → budget | 14 |
| Installation + Refinishing / new-floor | floorType → materials → location → subfloorGrade → area → timeline → budget | 15 |
| Installation + Refinishing / existing | condition → wood → livingDuringRefinish → area → colorChange → timeline → budget | 15 |
| Installation + Refinishing / both | floorType → materials → location → subfloorGrade → condition → area → timeline → budget | 16 |
| Installation + Refinishing / not-sure | area → timeline → budget | 11 |
| Not sure / Need guidance | area → timeline → budget | 10 |

If service/scope is not yet selected, the assembled branch can temporarily be empty; validation still blocks forward movement at the required service/scope screen. `servicesFromType()` maps new-installation to `[installation]`, floor-refinish to `[refinishing]`, combined/new-floor to `[installation]`, combined/existing to `[refinishing]`, other combined scopes to `[installation, refinishing]`, and not-sure to `[consultation]`. The `isConsultation` variable does not activate a separate consultation questionnaire.

### All active branch questions, options and validation

- **floorType:** “What type of flooring are you interested in?” Required: `hardwood` / Hardwood; `laminate` / Laminate; `vinyl` / Vinyl; `custom` / Custom.
- **materials:** “Do you already have the flooring picked out and on order?” Required `materialsStatus`: `customer_has` / Yes — I already bought it; `axo_supply` / Not yet — I want AXO to supply it; `needs_help` / Not sure — I need help choosing. If and only if `customer_has`, show and require “Is the material already delivered on-site?” (`materialDelivered`): `yes` / Yes; `no` / No; `not_sure` / Not sure. Selecting another materials status clears `materialDelivered`.
- **location:** “Where will this flooring be installed?” Required: `residential` / Residential Home; `apartment` / Apartment; `commercial` / Commercial Space.
- **subfloorGrade:** “Quick technical check.” Both answers required on one screen: “What's under this floor?” (`subfloor`): `concrete` / Concrete slab; `wood` / Plywood / wood; `not-sure` / Not sure. “Is this space below grade (basement)?” (`belowGrade`): `yes` / Yes; `no` / No; `not-sure` / Not sure. No compatibility rejection is implemented here.
- **condition:** “What's the current condition of your floors?” Required `currentCondition`: `light-wear` / Light Wear; `moderate-wear` / Moderate Wear; `heavy-wear` / Heavy Wear; `damaged` / Damaged.
- **wood:** “What type of wood flooring do you currently have?” Required `woodType`: `oak` / Oak; `maple` / Maple; `pine` / Pine; `not-sure` / Not Sure.
- **livingDuringRefinish:** “Will you be living in the home during the refinishing?” Required: `yes` / Yes; `no` / No; `not-sure` / Not sure.
- **area:** “What's the approximate area for this project?” `sqft` presets: `200` / Small Room (~200 sq ft); `400` / Medium Room (~400 sq ft); `600` / Large Room (~600 sq ft); `1200` / Whole Floor (1200+ sq ft). Custom numeric input uses `min={0}` and the same `sqft` state. Exact validation rejects a missing value or `Number(sqft) <= 0`; it does not separately test finiteness or integer size. On this same screen require “Any stairs included in this project?” (`stairsIncluded`): `yes` / Yes or `no` / No. If yes, show and require “How many steps?” (`stairsCount`): `1-5` / 1 – 5 steps; `6-11` / 6 – 11 steps; `12-20` / 12 – 20 steps; `20-plus` / 20+ steps. Selecting no clears count. There is no active square-footage “Not sure” checkbox.
- **colorChange:** “Are you planning to change the color of your floors?” Required: `keep-same` / Keep Same Color; `go-lighter` / Go Lighter; `go-darker` / Go Darker; `need-consultation` / Need Consultation.
- **timeline:** “When would you like to start the project?” Required: `asap` / As soon as possible; `1-month` / Within 1 month; `3-months` / Within 3 months; `planning` / Just planning.
- **budget:** “What's your budget range for this project?” Required `budgetRange`: `under-2k` / Up to $2,000; `2k-5k` / $2,000 - $5,000; `5k-10k` / $5,000 - $10,000; `10k-plus` / $10,000+. Submission maps these to numeric budget 2000, 3500, 7500, and 15000 respectively (otherwise null). This is a discrete choice, not the unused budget slider copy.
- **consent:** “Almost done.” Checkbox must be true. Exact text: “I consent to being contacted by AXO Floors by phone, text, or email regarding my project.” Validation blocks submission without it. Consent is used as a UI gate; the current payload does not include a separate consent column or timestamp.

All simple required choices validate a nonempty stored string, not membership in their option list. Full labels, hints, helpers and error text are preserved in `copy.ts.snapshot.txt`. Unused retained definitions include `SERVICE_OPTIONS`, `CONSULT_TYPE_OPTIONS`, `TIMELINE_OPTIONS`, `CURRENT_FLOOR_OPTIONS`, `CONDITION_OPTIONS`, `AREA_OPTIONS`, `PROPERTY_TYPE_OPTIONS`, `FURNISHED_OPTIONS`, `HOME_AGE_OPTIONS`, and older consultation/wishlist/budget/square-footage copy. They are not active extra screens. Some UI imports and formatting helpers are likewise unused; the archive deliberately preserves them unchanged.

## Navigation, progress, errors and completion

Steps are recomputed with answer changes. Previous goes back one numeric screen (minimum 0), clears the visible error, and does not erase answers. Changing service resets finish scope unless it is still the combined service; other hidden branch answers are generally retained and can appear in submitted notes. Progress is `Math.round(step / (steps.length + 1) * 100)` until success; the extra count is the intro. The consent screen therefore does not show 100% before submission. Success sets progress to 100% and displays the thank-you copy and Return Home button linking to `/`.

The current screen displays “Step N of M.” Next validates only the current screen; the last screen's button submits. Invalid input stays on its screen with a `role="alert"` message. Buttons are disabled while submitting; submission also has a re-entry guard. Direction selects left/right entry animation. Global Enter advances except from TEXTAREA and after completion; address input has its own Enter handler, selecting the first open fallback suggestion or calling the next handler. These existing handlers are preserved, not redesigned in this archive.

## Address autocomplete dependencies and behavior

`AddressAutocomplete.tsx` loads Google Places in the browser if a configured public Maps/Places key is available, reusing a module-level loader promise. No key values are archived. Google autocomplete requests US addresses and only formatted address/address components. A selection is verified only with a formatted address and NJ, NY or PA state code. Typing while Google is ready marks the address unverified until selection.

Otherwise it uses Photon at `https://photon.komoot.io/api/` for OpenStreetMap suggestions: queries begin at four trimmed characters, debounce 300 ms, request up to six suggestions, and bias toward the regional coordinates in source. Responses reject explicitly non-US country codes and explicitly disallowed states; absent state/country metadata is not rejected. Choosing a fallback suggestion sets verified true and supplies city/ZIP. Without Google, typing more than five trimmed characters also sets verified true, even if suggestions fail or are unavailable. Escape closes fallback suggestions; blur closes after 150 ms; abort handles superseded fetches. This describes existing behavior, not stricter geographical enforcement.

## Draft persistence and attribution

- After mount, `loadDraft()` reads localStorage key `axo_get_started_draft` as JSON `{ data, step }`. It merges data over `emptyData`, migrates an older nonempty string `service` to the `services` array and removes that legacy property. A numeric stored step is accepted as-is; there is no expiry, schema validation or step-range clamp. Parse/storage failure returns no draft.
- `emptyData` contains empty strings for all text/choice fields, empty `services`, and false `addressVerified`/`consent`. Once hydrated, every data/step change saves the draft unless done. Storage failure is nonfatal. Visitor drafts can contain personal information in their own browser; **none were collected or included in this archive**.
- `captureUtms()` runs once on mount. It reads sessionStorage key `axo_get_started_utm`, merges fresh query values for `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid` (each fresh value sliced to 200 characters), keeps the first stored referrer or `document.referrer`, and first landing path or pathname plus query. Attribution is preserved across step navigation in a ref/sessionStorage, not sent by this wizard directly to GA4.
- After a successful lead insert, `clearDraft()` removes both the local draft and session attribution. Failed inserts retain the draft. Existing draft/schema and analytics behavior must not be silently changed as part of restoring this backup.

## Existing lead storage and notification boundary

This page submits directly through the generated browser `supabase` client from `src/integrations/supabase/client.ts`; it does **not** use `useLeadCapture` or `QuizFlow`.

`submit()` in `GetStarted.tsx` awaits `.from("leads").insert([leadPayload])`. The payload contains:

- `organization_id`: existing `AXO_ORG_ID` constant (value not reproduced here).
- `name`: trimmed first and last name combined; `email`: trimmed; `phone`: formatted field; `address`; nullable `city`; nullable `zip_code`.
- `lead_source`: selected discovery channel, or `Website — Get Started`; `services`: selected service display label array (not the internal `data.services` mapping); `budget`: the numeric mapping above; `room_size`: square-footage string or null.
- `message: null`; `notes`: plain-text `## Request`, `## Project`, and `## Attribution` sections with `- Label: value` rows, skipping empty values. Request includes service, finish scope and discovery channel. Project includes selected floor/material/delivery/location/subfloor/grade/condition/wood/living/color/area/stair/timeline/budget answers. Attribution includes populated captured values. Contact fields are omitted from notes to avoid duplication.
- `status: "new_lead"`, `priority: "high"`, `contact_type: "web_form"`.

Insert errors throw into the destructive toast/error path and stop completion. Only after successful insertion does it initiate a fire-and-forget JSON POST with the same payload to `/api/public/lead-notify`. Fetch rejection is caught and ignored; the HTTP response is not checked or awaited. Then it clears the draft and shows success. A saved lead therefore does not prove email delivery.

The existing notification implementation is `src/routes/api/public/lead-notify.ts`; it validates the notification payload and sends a Gmail notification through the existing server gateway to the team recipient. It does not insert the lead. Its server credentials, recipient configuration, security boundary and existing behavior are dependencies, not part of these snapshots, and must remain unchanged. This archive adds no schema, policy, integration, or notification changes.

## Route and existing entry points

- `src/App.tsx` imports the page and registers `/get-started` in the existing legacy client router inside the TanStack application. `/floor-diagnostic` redirects to `/get-started`.
- Homepage `src/pages/Index.tsx` configures its `Hero` primary estimate CTA to `/get-started` and has a further estimate CTA to the same destination. Shared `src/components/shared/Hero.tsx` also defaults its primary destination to `/get-started`.
- Shared desktop `src/components/shared/Header.tsx` links “Smart Estimate” to `/get-started`. The mobile menu is the existing `AppSidebar` overlay; no menu is changed by this archive.
- Shared `src/components/shared/MobileStickyCTA.tsx` links “Get My Estimate” to `/get-started`. It displays only on its existing core marketing path list (`/`, `/installation`, `/refinishing`, `/vinyl-plank-flooring`, `/stairs`, `/stain-gallery`, `/gallery`, `/about`, `/contact`), not on `/get-started`, `/quiz` or `/schedule-estimate`.
- **The separate `/quiz` route is NOT part of this replacement and must remain untouched.** It renders `src/pages/Quiz.tsx` with `src/components/quiz/QuizFlow.tsx`, Header and Footer. It has independent validation, lead submission, attribution/partner handling and completion behavior; similar question options do not make it the same flow.

## Precise restore instructions (future separately approved action only)

1. Obtain owner approval for restoration. Preserve any newer work before proceeding and review the current versions of the four destinations and their dependencies. Do not roll back the whole project or Project A to the baseline commit.
2. Verify all four archive byte counts and SHA-256 checksums against the manifest. When original history is available, also compare each snapshot to `git show f40ac41a1d2902a441b321ce5d64a41d57de3bd9:<original-source-path>`. If any comparison fails, STOP; do not restore partial files.
3. From the Project B repository root, restore only these four files with binary-safe copies (these commands are documentation, **not executed for this backup**):

   ```sh
   cp docs/archive/get-started-long-quiz-2026-10-19/GetStarted.tsx.snapshot.txt src/pages/GetStarted.tsx
   cp docs/archive/get-started-long-quiz-2026-10-19/copy.ts.snapshot.txt src/features/get-started/copy.ts
   cp docs/archive/get-started-long-quiz-2026-10-19/state.ts.snapshot.txt src/features/get-started/state.ts
   cp docs/archive/get-started-long-quiz-2026-10-19/AddressAutocomplete.tsx.snapshot.txt src/features/get-started/AddressAutocomplete.tsx
   ```

4. Confirm each restored destination is byte-identical to its snapshot (for example `cmp <snapshot> <destination>` for each mapping). Preserve the original source filenames/extensions only at their original destinations; keep the archive as `.snapshot.txt`.
5. Check the existing `/get-started` import/route still points to this page. If a later approved replacement changed that wiring, review a separately scoped restoration of only that necessary mapping; do not migrate routers or expose an archive route. Leave `/quiz`, `Quiz.tsx`, `QuizFlow.tsx`, `/contact`, `/schedule-estimate`, FloorPRO and shared integration code untouched.
6. Retain the current generated browser client, organization/phone constants, UI components (`Button`, `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Label`, `Slider`), toast provider/hook, `SEOHead`, React, existing router dependencies, CSS fonts/tokens and `animate-gs-slide-in-*` styles. Do not restore `.env`, install/roll back packages, change database columns/policies, or alter server notification/gateway credentials. Review stale draft compatibility without deleting visitors' stored data automatically.
7. Review the exact diff to ensure only explicitly approved restore destinations changed. Use the normal automated preview checks and verify all branch screens, validation, progress and completion in an approved test context. Any real submission/email test needs separate authorization; it was not performed for this archive. Publication is a separate owner-approved action.

## Archive verification and commit provenance

Backup verification compares all four snapshots to their unchanged source files and original Git blobs, and checks that all baseline-tracked repository files remain byte-identical. Only this archive directory is intended to be added. The application flow is intentionally unchanged; no short form is implemented.

The source SHA above is the verified baseline, not a claim about the later archive commit. Lovable manages commits automatically after the editing turn; the agent does not create a manual Git commit. Obtain the final archive commit SHA from the resulting Lovable History entry and confirm its changed-file list contains only this README and the four snapshots. The final commit SHA is not knowable in advance and is deliberately not fabricated or embedded here.
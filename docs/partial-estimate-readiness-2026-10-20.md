# Phase 1B partial-estimate readiness review

Date: 2026-10-20 UTC. Project B baseline: `cc7bd3329ae358bdfa1dff6ec8b6513c16e07ecb`.

## Decision: HOLD — do not activate or publish

Project B alone cannot guarantee suppression of false abandonment emails while preserving a nonblocking canonical lead save under a total intake outage. No runtime, lead table, notification, schema, policy, switch, scheduler or Project A changes were made. No customer records were read; no leads or partial requests were created; no emails or SMS were sent.

## Configuration evidence

- Project B configured-secret listing includes `PARTIAL_ESTIMATE_INTAKE_SECRET`.
- Server-side environment check returned only `partial_secret_present=true`; no value, fragment, length or hash was displayed or persisted.
- A server-only signed request containing an **invalid operation**, no contact fields, and no usable request identity returned HTTP 401 with `unauthorized`. The expected response after successful authentication was 400 `invalid_op`. Authentication between projects is therefore **not verified**. The response alone does not identify whether the rejection came from gateway settings or intake signature verification.
- No valid capture, touch, begin, release or complete operation was sent to the live endpoint. Those operations can write even without contact fields and were intentionally avoided.
- The fresh read-only Project A snapshot is commit `f0588885`. Its switch defaults OFF; this is not proof of live switch, scheduler, deployed migration or Project A secret presence. Project A must independently confirm those settings, boolean-only. Its secrets cannot be inspected from this project.

## Contract review

The bridge matches the source HMAC contract: POST to the fixed intake endpoint, Unix timestamp in seconds, lowercase hex HMAC-SHA256 of `timestamp + '.' + exactRawBody`, and the `x-pe-timestamp` / `x-pe-signature` headers. Project A accepts timestamps within 300 seconds; Project B generates opaque 43-character session keys accepted by Project A's 32–128-character allowlist. Tenant and recipient are fixed by Project A, not supplied by the website. Secrets are read inside server handlers, never exposed as browser configuration.

Capture requires validated name, US phone, optional email and city/ZIP. Cookies use HttpOnly, Secure, SameSite=Strict, path `/`, with 14-day expiry. The explicit origin guard rejects missing origins and different hosts, but compares host only rather than protocol plus host; this is not a complete same-origin comparison. Framework CSRF protection is present in the installed server-handler source; the explicit helper should be hardened and tested before activation. Per-isolate throttling is best-effort, not a durable distributed limiter.

## Blocking failure paths

1. **Begin unavailable, lead saved, complete unavailable:** the single insert succeeds; three completion retries fail; `pending` is returned. No suppression was durably acknowledged. Project A may still see an incomplete request and later send an alert. The existing comment implying a finalizing guard always remains is conditional, not a guarantee.
2. **Browser retry is not durable reconciliation:** pending completion exists only in cookies and is retried when Get Started mounts. Closing the browser, losing cookies, or never returning leaves no independent retry worker. Worker memory, additional immediate retries and browser storage do not close this gap.
3. **Capture response loss / late capture:** session cookies are set only after capture acknowledgement. Fire-and-forget capture can commit remotely without a usable cookie or race with the final save. A cookieless final save cannot identify that partial request. This is a separate hazard even when normal completion retries work.
4. **Project A concurrent absent-row completion:** `pe_complete` reads no row, inserts a completed tombstone with `ON CONFLICT DO NOTHING`, then unconditionally reports `completed`. If concurrent capture wins the insertion, completion can acknowledge success while leaving an incomplete row and its alert intact. Sequential tombstones alone do not fix this race.
5. **Already-authorized notification:** the bridge parses `notification_already_authorized` but does not act on it. Authorization and external delivery are separate boundaries; completion cannot retract an email already handed to the provider.

Confirmed `finalizing` in Project A suppresses alert authorization until explicit release, completion or 14-day expiry; its five-minute recheck is not automatic release. This protects **acknowledged** guards only.

## Expected coordination with Project A

This report is a handoff, not a change or message delivered into Project A's chat.

Before enabling, Project A must:

1. Verify boolean secret presence, the live OFF switch, deployed contract and gateway authentication settings. Investigate the signed probe's 401 without logging signatures or secrets.
2. Serialize capture/begin/complete for a session even when no row exists; never acknowledge `completed` unless the conflicting captured row is completed/redacted and its outbox canceled. Add concurrent transaction regression tests.
3. Agree durable feature-local, idempotent finalization outcomes and independent retry/reconciliation keyed only to the partial session/attempt, **not** linked to canonical FloorPRO leads. Unknown outcomes must remain suppressed.
4. Resolve the total-outage guarantee explicitly: either approve durable Project B outcome persistence and scheduled retry, or approve requiring acknowledged suppression before final lead insertion. The latter changes the current nonblocking behavior and is not approved. A new Project A status RPC by itself cannot resolve an outage before any begin write succeeds.
5. Define safe ordering for lost/late capture acknowledgements and the already-authorized/delivery boundary. Retain service-only access, feature-local storage, retention and no prospect messaging.

New persistence, reconciliation services/schedules, Project A function/RPC fixes, any behavior that delays or blocks the full form, switch activation and publication all require separate approval. No canonical lead-table changes or lead linking are proposed.

## Verification performed

Existing tests were run with synthetic data and mocked network/database boundaries only:

`bunx vitest run src/features/get-started/partial.test.ts src/features/get-started/estimate.test.ts src/features/get-started/estimate-backend.test.ts src/features/get-started/journey.test.ts src/lib/analytics-events.test.ts`

**93 tests passed across five files:** partial bridge 11, estimate 33, backend estimate 10, journey 35, analytics events 4. These establish existing validation, HMAC construction, missing-secret/OFF fallback, sequencing and one mocked insert; they do **not** prove durable suppression or multi-transaction safety. The backend-down test accepts `pending`, which must not be mistaken for confirmed suppression.

Playwright at 1280×1800 opened preview Get Started, clicked Start and submitted an empty contact step: three validation errors, contact step retained, focus on the name field, zero browser runtime errors. No valid contact submission or production write was performed.

Build evidence: the harness subsequently reported **build OK at 2026-10-20T20:32:10Z**, checked after the documentation edits. No manual build was run. This verifies the current preview compilation, not published-domain behavior or durable cross-project suppression.

## Changed paths

- `docs/partial-estimate-readiness-2026-10-20.md` — this review and Project A handoff.
- `roadmap.md` — records the verified presence and replaces the unsafe activation prerequisite with the blocking safety conditions.

Runtime source and existing tests are unchanged. Feature activation remains blocked; no publication was attempted.
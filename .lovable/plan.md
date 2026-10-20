# Phase 1B — Partial-lead capture: plan and risk assessment

Status: planning only. Nothing implemented, migrated, published or emailed.

## Bottom line

The site has no database of its own. It writes leads to the **same backend FloorPRO uses** (project ref `dcfmrqrbsfxvqhihpamd`), connected through the public anonymous key. A safe, server-only partial-record store and a 60-minute timer both need new objects in that shared backend. That is a cross-project change, so **work stops here until you approve it separately** (Section F). Nothing in the approved scope can be built durably without it.

## A. Current architecture (from Project B code)

- **Step flow:** `src/pages/GetStarted.tsx` runs all steps in the browser. `journey.ts` defines the steps and checks each one. Only the final step calls the server.
- **Full save:** `saveEstimate` (`estimate.functions.ts`) checks the input again with Zod. Then `insertEstimate` (`estimate.server.ts`) inserts one row into `leads` through an anonymous client created inside the handler. RLS on the shared backend decides whether the insert is allowed. The function returns only `{saved}`, with no lead id.
- **Notifications:** the website Gmail notice (`/api/public/lead-notify`, Gmail connector, sends to axofloorsnj@gmail.com) was removed from all three forms. It is still deployed as a public route. FloorPRO's `notify-new-lead` (noreply@floorpro.app) fires on its own whenever a row is inserted into `leads`. That is why a partial must never touch `leads`.
- **Analytics:** GA4 Phase 1A sends page views only, through the privacy allowlist. The site sends no `form_start` or `generate_lead` today.
- **Access boundaries:** no service-role key or admin client exists in Project B. Only `LOVABLE_API_KEY`, `GOOGLE_MAIL_API_KEY` and the GA Measurement ID are available on the server. Anonymous RLS is the only write path.
- **Scheduling:** none in Project B. Workers are stateless, with no cron or durable timer, and the site has no backend of its own to run pg_cron.

## B. Recommended storage, authorization and scheduler

Table `public.estimate_drafts`, in its own schema area and never joined into FloorPRO lead KPIs:
- `id uuid` (the opaque draft id, generated on the server), `organization_id`, `name`, `phone_e164`, `email` (nullable), `city_zip`
- `status` (`partial` | `completed` | `abandoned`), `created_at`, `last_activity_at`, `completed_at`, `completed_lead_id` (nullable), `notified_at`, `notify_attempts`, `expires_at` (created_at + 30 days)
- Unique dedupe key: (organization_id, phone_e164) where status = 'partial'.
- **Grants and RLS:** no `anon` or `authenticated` grants at all. Only `service_role` can access it. Writes go through `SECURITY DEFINER` RPCs that `anon` may execute:
  - `upsert_estimate_draft(...)` returns only the id
  - `touch_estimate_draft(id)`
  - `complete_estimate_draft(id, lead_id)`

  Anonymous callers can never read rows. FloorPRO staff get no access unless you approve it.
- **Scheduler:** pg_cron runs every 5 minutes and selects drafts where `status = 'partial'`, `last_activity_at < now() - 60 min`, and `notified_at` is null. It claims each row atomically by setting `notified_at` and incrementing attempts, then calls one Project B server route with pg_net. A daily job purges or anonymizes expired rows.
- **Fallback if you reject the cron:** none that stays reliable. A browser timer or Worker memory would miss tabs that were closed. Not recommended.

## C. Events and idempotency

- `estimate_step_1_completed`: sent once per draft id, after the server confirms the upsert. The browser keeps a sessionStorage flag holding only the opaque id, so Back/Next, reloads and returning visitors do not send it again. Parameters are a fixed allowlist (`form_id: get_started`, `service_branch`: none at this step). No PII.
- `form_start`: **do not add it.** It would count the same business step twice. GA4 automatic form events are already off.
- `generate_lead`: sent once, after `saveEstimate` returns `saved: true`, guarded by a per-submission flag. No values or PII.
- Activity: the browser calls `touch` (throttled) on each Next Step, so active prospects are never notified. On a full save, `complete_estimate_draft` sets the status to completed, which stops any pending email.
- Linking: to link the draft to the real lead, `insertEstimate` must return the new lead id, or do the insert and the completion in one RPC. Today the anonymous insert cannot read the row back, so this needs a small RPC or a `draft_id` column on `leads`. Both are shared-backend changes (Section F). Without them, the draft is marked completed without a link.

## D. The internal email

- New server route `/api/public/draft-abandoned` in Project B. pg_net calls it with a shared secret header (a new secret, compared in constant time). The route takes **only a draft id**.
- The route then:
  1. Re-reads the draft through an RPC restricted to `service_role`. Project B has no service key, so the RPC verifies the shared secret instead.
  2. Checks that the status is still `partial` and that 60 minutes have passed.
  3. Sends one Gmail message through the existing connector to axofloorsnj@gmail.com. The subject is "Incomplete estimate — Step 1 completed" and the body holds Step 1 fields only.
  4. Marks the draft `abandoned` with the time it was notified.
- Retries go up to 3 attempts. The atomic claim means a draft can produce at most one email. The prospect never gets an email or SMS.

## E. What can be done without the production database or Project A

- Browser-side wiring: a server call on the Step 1 → Step 2 click, the touch calls, the completion hook, and the two GA4 events, all behind a feature flag that is off.
- The server functions and the email route coded against mocked RPCs, plus the email template.
- Unit and Playwright tests with mocked network calls and synthetic data.
- An optional, non-interactive notice on Step 1 (copy for your approval; the form stays unchanged).

None of this saves real partial records until Section F is approved and applied.

## F. Needs separate, explicit approval (the shared backend that FloorPRO also uses)

1. A migration creating `estimate_drafts`, its grants and RLS, and the three or four RPCs.
2. Turning on pg_cron and pg_net and scheduling the two jobs. This affects the shared backend's resources.
3. A way to link the draft to the real lead: an RPC that returns the lead id, or a nullable `draft_id` on `leads` (which touches a FloorPRO table).
4. A new shared-secret value, stored in both the backend and Project B.
5. Confirming that FloorPRO dashboards and triggers ignore the new table. This needs a read of the FloorPRO code.
6. A retention period (30 days proposed) and whether staff may view drafts.

If FloorPRO's owner refuses any change to the shared backend, the scope cannot be delivered safely. Moving the site to its own backend would be a separate project.

## G. Phases and Preview-only tests

1. **Approval gate:** decide on items F1–F6.
2. **Shared-backend objects:** migration applied first to a test branch, if one is available. Check that anonymous users cannot SELECT, cannot insert into `leads` through the draft path, and cannot call the service-only RPC.
3. **Project B code:** the draft call and touches, completion and linking, the email route, and the GA4 events, behind the flag.
4. **Tests (synthetic names like "TESTE PARTIAL", fake 555 numbers, Gmail sending mocked):**
   - Step 1 invalid: no server call.
   - Valid Next Step: exactly one draft and one event.
   - Back/Next and reload: no new draft and no new event.
   - Full save: one lead, draft completed, one `generate_lead`, no abandonment email.
   - 60 minutes simulated with the clock moved forward: exactly one internal email, and a second run sends none.
   - An active prospect gets no email.
   - Requests to GA4 contain no PII.
   - `leads` gets no row and FloorPRO gets no notification for a partial.
   - Phase 1A page views unchanged; /quiz unchanged.
5. Report to you, wait for your visual approval, no deployment.

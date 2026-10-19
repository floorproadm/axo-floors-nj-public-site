# Compact estimate photo attachments — blocked pending verification

## Preview implementation
- Optional Email follows Name and Phone, before Service. Existing validation and lead submission remain unchanged.
- The optional photo section supports **local-only previews**, selection/removal, five-photo limit, 10 MB per image, JPEG/PNG/WebP, and explicit HEIC/iPhone feedback. It creates only short-lived browser object URLs, released on removal and unmount. No filenames, files, URLs, or image data enter submission or analytics.
- Notices before selection, before submitting, and in confirmation explicitly state that photos are **not attached**. The form can be completed with no photos.

## Read-only findings
- Lovable read-only bucket/policy access is unavailable for this project's existing external connection: the tool reports no managed backend in the requested environment. This does not prove that the external backend has no buckets or policies.
- Existing compact insert returns only `{saved}`, not an authorized lead identifier/upload capability. It has no existing upload/association path.
- Generated types expose possible attachments on `lead_notes` (`lead_id`, `organization_id`, `attachment_name`, `attachment_url`); types cannot establish live permissions or staff access.
- Existing project-photo code uses public URLs and is not suitable for private customer-floor photos. Existing signed media helpers do not by themselves prove privacy or lead-scoped authorization.
- No storage, schema, policy, configuration, dependency, notification, analytics, or FloorPRO changes were made. No actual uploads or leads were created.

## Explicit approval required before enabling uploads
1. Obtain read-only access to the existing backend's bucket privacy/limits/MIME configuration, `storage.objects` policies, lead attachment policies, and authorized AXO staff retrieval flow. Do not inspect customer records.
2. If an existing private, correctly protected lead-attachment mechanism is verified, propose its exact reuse for approval. Never use broad anonymous upload permissions or a lead ID alone as authorization.
3. If existing protections are insufficient, request separate owner approval for the **specific** private bucket/policy/association changes needed. No changes to FloorPRO are authorized here; if staff retrieval requires them, seek separate approval first.
4. Design a server-validated, short-lived, per-lead upload capability with server-generated object names; enforce maximum five images, 10 MB each and actual file content JPEG/PNG/WebP (not merely extension). Ensure only AXO-authorized staff can read, no anonymous listing/public URLs, and no photos in GA4 or notification body.
5. Preserve one successful lead insert and one notification; attach only to that lead. Report partial photo failures separately without reinserting the lead, delete failed/unassociated objects safely, and make retries idempotent and ownership-scoped.
6. Mock successful/failed uploads, association, cleanup, limits, and staff permissions before any separately authorized real-data verification. Until then the preview picker remains local-only, not a functioning upload feature.

## Recovery archive
The four snapshots in `docs/archive/get-started-long-quiz-2026-10-19/` remain byte-faithful to source commit `f40ac41a1d2902a441b321ce5d64a41d57de3bd9`. Existing README restore instructions remain unchanged. The separate `/quiz` is outside this change.
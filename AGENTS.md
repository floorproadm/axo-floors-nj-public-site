# Architecture rules
- Initialize GA4 in the root shell through a browser effect and a public server function exposing only the validated Measurement ID, so server-held configuration never leaks unrelated secrets.
- Observe the shared browser-history boundary for page measurement across existing routers; do not migrate rendering or edit form logic for analytics.
- Build page telemetry through the analytics privacy allowlist, using fixed titles, token-free paths, origin-only referrers and recognized campaign channels; never pass arbitrary URL values or document titles to Google.
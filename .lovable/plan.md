# Editorial blog redesign

## Scope
- Preserve the current public blog routes, publication/date guards, legacy article URL/content, private storage, sitemap, and navigation.
- Add strict runtime validation for the version 1 rich-body contract and resolve private inline figures only after a post is confirmed public.
- Render rich articles server-side with polished typography, figures, FAQs, calls to action, optional heading-based contents, related posts, and secure links.
- Redesign the blog index for one featured article or a featured-plus-grid layout, with compact empty state and responsive presentation.
- Improve article SEO using real stored content, including body-derived descriptions and FAQ structured data only when explicit FAQ blocks exist.

## Security and compatibility
- Use the existing anonymous reader and signer only; no privileged credentials, schema changes, writes, proxy endpoints, or Project A changes.
- Fail closed on malformed rich JSON and preserve the existing Markdown renderer for `body_blocks = null`.
- Never expose storage paths; figure signing failures render a branded placeholder.

## Verification
- Extend focused fixture tests for validation, unsafe links, rich SSR output, signed figures, legacy Markdown, filtering, related posts, and listing layouts.
- Check production build output, HTTP SSR/404/head/sitemap behavior, and 375px article/list rendering.
- Record changed files, checks, observations, the exact contract, and unverified live rich-upload coverage in the requested report.

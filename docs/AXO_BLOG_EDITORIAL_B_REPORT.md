# AXO Public Site (Project B) — Editorial Blog + Rich Reader Report

Date: 2026-09-27 (UTC). HEAD before this fix: `636c5651625d905f491a979f3a0e27beb0717674` (the platform records the final commit).

## Files involved in the editorial redesign (already in HEAD)
- `src/lib/blogBlocks.ts` — strict zod v1 contract, safe URL policy, typed public figure (no path/media_id).
- `src/lib/blog.server.ts` — anon-only reader, publish/date re-check, rich body resolution, related posts, body summary.
- `src/lib/blog.functions.ts` — server function wrappers.
- `src/components/blog/BlogBlocks.tsx`, `src/components/blog/BlogChrome.tsx` — SSR rich renderer, legacy Markdown renderer, fallback cover.
- `src/routes/blog.index.tsx`, `src/routes/blog.$slug.tsx` — featured/grid listing, editorial article, TOC, FAQ, CTA, related reads, SEO.
- `src/lib/blog-reader.test.ts` — focused fixture tests.

## Files changed in this narrow fix
- `src/lib/blog.server.ts` — `resolveDocument()` rewritten; added `isFigurePathForPost()`.
- `src/lib/blog-reader.test.ts` — rich test corrected; new denial/fallback test.
- `docs/AXO_BLOG_EDITORIAL_B_REPORT.md` — this report (it was missing from HEAD before).

## Privacy bug and fix
- **Bug:** `resolveDocument()` queried `/rest/v1/blog_post_media` with the anon key. That table has no anon SELECT policy, so the query returned `[]`, the allow-map stayed empty and every legitimate inline figure got `signedUrl = null`. The old test mocked that private table as readable by anon, so it passed wrongly.
- **Fix:** B never requests `blog_post_media`. After the exact AXO post is fetched with `publicFilter` and re-checked by `isPubliclyVisible`, the body is validated by `parseRichBlogDocument`. For each figure, B checks locally that the path is `org-{AXO_ORG_ID}/posts/{post.id}/<file>` (no subfolders, no `..`, extension jpg/jpeg/png/webp/gif/avif). Only then does it call the existing anon `signCover()`. Storage RLS (`blog_media_is_public(name)`) is the authoritative check: published, due, and actually referenced by the published body. Any denial or error gives `signedUrl = null` and the branded placeholder. `path` and `media_id` are stripped before data leaves the server.
- No service role, no new endpoint, no RLS/storage/schema change, zero DB writes.

## Rich body contract (v1)
`{ version: 1, blocks: Block[] }`, at most 500 blocks and 512 KB serialized. Unknown keys are rejected (strict).
- Inline: `{ text, marks?: ("bold"|"italic")[], href?: SafeUrl }`
- `paragraph {content}`, `heading {level: 2|3, id (unique), content}`, `bulletList|orderedList {items: Inline[][]}`, `quote {content}`, `divider`, `figure {media_id: uuid, path: org-{org}/posts/{post}/file, alt, caption?}`, `faq {question, answer: Inline[]}`, `cta {text, href: SafeUrl}`.
- SafeUrl: `http(s)://`, `mailto:`, `/relative` or `#anchor`. `javascript:`, `data:` and `vbscript:` are rejected.
- `body_blocks = null` means the legacy `body_markdown` renders through the unchanged `ArticleMarkdown` (raw HTML skipped, links allow-listed).
- Malformed rich JSON fails closed with a readable article error. The stored body is never altered.

## Checks run in this fix
- `bunx vitest run src/lib/blog-reader.test.ts`: **11/11 passed**, including:
  - Rich article: `blog_post_media` returns 403 if requested, and the test asserts it is **never** requested. The figure path is signed directly, the signed URL is rendered, and the path and media_id are absent from the output.
  - Storage denies signing: unreferenced same-post image falls back to null; cross-post path and non-image extension are never sent to signing.
  - Unsafe link and unknown block rejected; draft/unknown slug → null (404) without signing; outage vs empty; sitemap public-only; legacy Markdown unchanged when `body_blocks` is null; Markdown sanitization.
- Typecheck (`tsgo`): 0 errors.
- Production build (`bun run build`): success.
- Scope: only the three files above changed in this fix. No Gallery/Feed, Project A, schema or storage files were touched.

## Not re-done in this fix
- No browser/Playwright or 375px visual check ran in this fix. The rendering code is unchanged.
- The legacy published article keeps its original `/blog/{slug}` URL and stored content. This fix changes only figure signing in rich bodies, which does not apply to legacy (null `body_blocks`) articles. It was not re-fetched live in this fix.

## UNVERIFIED
- End-to-end rich article with a real uploaded inline image signed live from `blog-media`. No rich article exists live, and A's `blog_rich_publish_enabled()` stays FALSE. It was not unlocked here.

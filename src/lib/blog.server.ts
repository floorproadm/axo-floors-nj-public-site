// Server-only public reader for AXO's published blog content.
// Uses the public anon key only. RLS remains the authority; every row is also
// re-checked for organization, status, and publication date before media signs.
import { z } from "zod";
import { AXO_ORG_ID } from "@/lib/constants";

const SUPABASE_URL = "https://dcfmrqrbsfxvqhihpamd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZm1ycXJic2Z4dnFoaWhwYW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjE5MTEsImV4cCI6MjA4NTYzNzkxMX0.TKL0qDwIrg9pXLewjpg1YmF_Pw5tCwUK7zdj7vho8A8";

export const BLOG_BUCKET = "blog-media";
export const COVER_URL_TTL_SECONDS = 3600;
const MAX_BLOCK_BYTES = 512 * 1024;
const mediaPathPattern = new RegExp(`^org-${AXO_ORG_ID}/posts/[0-9a-f-]{36}/[^/]+$`, "i");

const safeUrlSchema = z.string().max(2048).refine((value) => isSafeBlogUrl(value), "Unsafe URL");
const markSchema = z.enum(["bold", "italic"]);
const inlineSchema = z.object({
  text: z.string().max(20000),
  marks: z.array(markSchema).max(2).optional(),
  href: safeUrlSchema.optional(),
}).strict();
const inlineArraySchema = z.array(inlineSchema).max(1000);

const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), content: inlineArraySchema }).strict(),
  z.object({ type: z.literal("heading"), level: z.union([z.literal(2), z.literal(3)]), id: z.string().regex(/^[a-z0-9][a-z0-9-_]{0,119}$/i), content: inlineArraySchema }).strict(),
  z.object({ type: z.literal("bulletList"), items: z.array(inlineArraySchema).max(500) }).strict(),
  z.object({ type: z.literal("orderedList"), items: z.array(inlineArraySchema).max(500) }).strict(),
  z.object({ type: z.literal("quote"), content: inlineArraySchema }).strict(),
  z.object({ type: z.literal("divider") }).strict(),
  z.object({ type: z.literal("figure"), media_id: z.string().uuid(), path: z.string().max(1024).refine((value) => mediaPathPattern.test(value), "Invalid media path"), alt: z.string().min(1).max(500), caption: z.string().max(1000).optional() }).strict(),
  z.object({ type: z.literal("faq"), question: z.string().min(1).max(500), answer: inlineArraySchema }).strict(),
  z.object({ type: z.literal("cta"), text: z.string().min(1).max(300), href: safeUrlSchema }).strict(),
]);
const documentSchema = z.object({ version: z.literal(1), blocks: z.array(blockSchema).max(500) }).strict();

export type BlogInline = z.infer<typeof inlineSchema>;
export type RichBlogBlock = z.infer<typeof blockSchema>;
export type RichBlogDocument = z.infer<typeof documentSchema>;
export type PublicRichBlogBlock = RichBlogBlock extends infer B ? B : never;
export type PublicRichBlogDocument = { version: 1; blocks: Array<RichBlogBlock | (Extract<RichBlogBlock, { type: "figure" }> & { signedUrl: string | null })> };

export interface BlogPostRow {
  slug: string;
  title: string;
  excerpt: string | null;
  body_markdown: string | null;
  body_blocks: unknown | null;
  cover_image_url: string | null;
  cover_alt: string | null;
  category: string | null;
  tags: string[] | null;
  author_display_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
  published_at: string | null;
  updated_at: string | null;
}

export interface PublicBlogPost extends Omit<BlogPostRow, "cover_image_url" | "body_blocks"> {
  coverUrl: string | null;
  bodyBlocks: PublicRichBlogDocument | null;
}

export class BlogBackendError extends Error {}
export class InvalidBlogBodyError extends Error {}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;
const defaultFetch: FetchLike = (input, init) => fetch(input, init);
let fetchImpl: FetchLike = defaultFetch;
export function __setBlogFetch(f: FetchLike | typeof fetch | null) { fetchImpl = (f as FetchLike) ?? defaultFetch; }

const headers = () => ({ apikey: SUPABASE_ANON_KEY, Accept: "application/json" });
const LIST_COLS = "slug,title,excerpt,cover_image_url,cover_alt,category,tags,author_display_name,status,published_at,updated_at";
const FULL_COLS = `${LIST_COLS},body_markdown,body_blocks,seo_title,seo_description`;

export function isSafeBlogUrl(value: string) {
  const url = value.trim();
  return /^(https?:\/\/|mailto:|\/|#)/i.test(url) && !/^(javascript|data|vbscript):/i.test(url);
}

function publicFilter(now: Date) {
  return `organization_id=eq.${AXO_ORG_ID}&status=eq.published&published_at=not.is.null&published_at=lte.${encodeURIComponent(now.toISOString())}`;
}
export function isPubliclyVisible(r: Pick<BlogPostRow, "status" | "published_at">, now = new Date()) {
  if (r.status !== "published" || !r.published_at) return false;
  const t = Date.parse(r.published_at);
  return Number.isFinite(t) && t <= now.getTime();
}

async function rest<T>(table: string, query: string): Promise<T> {
  let res: Response;
  try { res = await fetchImpl(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: headers() }); }
  catch (error) { throw new BlogBackendError(`Blog backend unreachable: ${(error as Error).message}`); }
  if (!res.ok) throw new BlogBackendError(`Blog backend error ${res.status}`);
  return (await res.json()) as T;
}

export async function signCover(path: string | null): Promise<string | null> {
  if (!path || /^https?:\/\//i.test(path)) return null;
  const clean = path.replace(/^\/+/, "").replace(new RegExp(`^${BLOG_BUCKET}/`), "");
  const encoded = clean.split("/").map(encodeURIComponent).join("/");
  try {
    const res = await fetchImpl(`${SUPABASE_URL}/storage/v1/object/sign/${BLOG_BUCKET}/${encoded}`, {
      method: "POST", headers: { ...headers(), Authorization: `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: COVER_URL_TTL_SECONDS }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { signedURL?: string; signedUrl?: string };
    const relative = json.signedURL ?? json.signedUrl;
    return relative ? (relative.startsWith("http") ? relative : `${SUPABASE_URL}/storage/v1${relative.startsWith("/") ? "" : "/"}${relative}`) : null;
  } catch { return null; }
}

export function parseRichBlogDocument(value: unknown): RichBlogDocument {
  let bytes: number;
  try { bytes = new TextEncoder().encode(JSON.stringify(value)).length; }
  catch { throw new InvalidBlogBodyError("Rich article body is not serializable"); }
  if (bytes > MAX_BLOCK_BYTES) throw new InvalidBlogBodyError("Rich article body exceeds 512KB");
  const result = documentSchema.safeParse(value);
  if (!result.success) throw new InvalidBlogBodyError("Rich article body does not match version 1");
  const ids = result.data.blocks.filter((block) => block.type === "heading").map((block) => block.id);
  if (new Set(ids).size !== ids.length) throw new InvalidBlogBodyError("Rich article heading IDs must be unique");
  return result.data;
}

async function validateFigureLinks(postSlug: string, document: RichBlogDocument) {
  const figures = document.blocks.filter((block): block is Extract<RichBlogBlock, { type: "figure" }> => block.type === "figure");
  if (!figures.length) return new Set<string>();
  const ids = [...new Set(figures.map((figure) => figure.media_id))];
  const encodedIds = ids.map((id) => `"${id}"`).join(",");
  const rows = await rest<Array<{ id: string; storage_path?: string; path?: string; blog_post_slug?: string; post_slug?: string }>>(
    "blog_post_media",
    `select=id,storage_path,path,blog_post_slug,post_slug&id=in.(${encodeURIComponent(encodedIds)})`,
  );
  const allowed = new Set<string>();
  for (const row of rows) {
    const path = row.storage_path ?? row.path;
    const slug = row.blog_post_slug ?? row.post_slug;
    const figure = figures.find((item) => item.media_id === row.id);
    if (figure && path === figure.path && (!slug || slug === postSlug)) allowed.add(row.id);
  }
  return allowed;
}

async function resolveDocument(postSlug: string, value: unknown | null): Promise<PublicRichBlogDocument | null> {
  if (value === null) return null;
  const document = parseRichBlogDocument(value);
  const allowed = await validateFigureLinks(postSlug, document);
  const blocks = await Promise.all(document.blocks.map(async (block) => {
    if (block.type !== "figure") return block;
    return { ...block, signedUrl: allowed.has(block.media_id) ? await signCover(block.path) : null };
  }));
  return { version: 1, blocks };
}

async function toPublic(row: BlogPostRow, includeBody: boolean): Promise<PublicBlogPost> {
  const { cover_image_url, body_blocks, ...safe } = row;
  return {
    ...safe,
    body_markdown: includeBody ? safe.body_markdown : null,
    bodyBlocks: includeBody ? await resolveDocument(row.slug, body_blocks) : null,
    coverUrl: await signCover(cover_image_url),
  };
}

export async function listPublishedPosts(now = new Date()): Promise<PublicBlogPost[]> {
  const rows = await rest<BlogPostRow[]>("blog_posts", `select=${LIST_COLS}&${publicFilter(now)}&order=published_at.desc&limit=100`);
  return Promise.all(rows.filter((row) => isPubliclyVisible(row, now)).map((row) => toPublic({ ...row, body_markdown: null, body_blocks: null, seo_title: null, seo_description: null }, false)));
}

export async function getPublishedPost(slug: string, now = new Date()): Promise<PublicBlogPost | null> {
  if (!/^[a-z0-9][a-z0-9-]{0,200}$/i.test(slug)) return null;
  const rows = await rest<BlogPostRow[]>("blog_posts", `select=${FULL_COLS}&slug=eq.${encodeURIComponent(slug)}&${publicFilter(now)}&limit=1`);
  const row = rows[0];
  if (!row || !isPubliclyVisible(row, now)) return null;
  return toPublic(row, true);
}

export async function getPublishedPostPage(slug: string, now = new Date()) {
  const [post, allPosts] = await Promise.all([getPublishedPost(slug, now), listPublishedPosts(now)]);
  if (!post) return null;
  const others = allPosts.filter((candidate) => candidate.slug !== slug);
  const sameCategory = post.category ? others.filter((candidate) => candidate.category === post.category) : [];
  return { post, related: [...sameCategory, ...others.filter((candidate) => !sameCategory.some((same) => same.slug === candidate.slug))].slice(0, 3) };
}

export async function listSitemapEntries(now = new Date()) {
  const rows = await rest<Array<Pick<BlogPostRow, "slug" | "status" | "published_at" | "updated_at">>>("blog_posts", `select=slug,status,published_at,updated_at&${publicFilter(now)}&order=published_at.desc&limit=1000`);
  return rows.filter((row) => isPubliclyVisible(row, now));
}

export function plainTextFromInlines(inlines: BlogInline[]) { return inlines.map((inline) => inline.text).join(""); }
export function summarizePublishedBody(post: Pick<PublicBlogPost, "bodyBlocks" | "body_markdown">, limit = 160) {
  const rich = post.bodyBlocks?.blocks.flatMap((block) => {
    if ("content" in block) return plainTextFromInlines(block.content);
    if (block.type === "bulletList" || block.type === "orderedList") return block.items.map(plainTextFromInlines).join(" ");
    if (block.type === "faq") return `${block.question} ${plainTextFromInlines(block.answer)}`;
    return "";
  }).filter(Boolean).join(" ");
  const legacy = post.body_markdown?.replace(/[#*_>`\[\]()!-]/g, " ").replace(/\s+/g, " ").trim();
  const text = (rich || legacy || "").replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;
}

// Server-only, SSR-safe public-anon reader for Project A's public.blog_posts.
// Uses plain fetch against PostgREST / Storage with the PUBLIC anon key only
// (never service role). RLS on blog_posts + blog-media enforces visibility;
// we additionally filter by org, status, and published_at <= now.
import { AXO_ORG_ID } from "@/lib/constants";

const SUPABASE_URL = "https://dcfmrqrbsfxvqhihpamd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZm1ycXJic2Z4dnFoaWhwYW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjE5MTEsImV4cCI6MjA4NTYzNzkxMX0.TKL0qDwIrg9pXLewjpg1YmF_Pw5tCwUK7zdj7vho8A8";

export const BLOG_BUCKET = "blog-media";
/** Signed cover TTL (1h). Page HTML is cached far shorter (5 min). */
export const COVER_URL_TTL_SECONDS = 3600;

export interface BlogPostRow {
  slug: string;
  title: string;
  excerpt: string | null;
  body_markdown: string | null;
  cover_image_url: string | null; // PRIVATE storage path
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

export interface PublicBlogPost extends Omit<BlogPostRow, "cover_image_url"> {
  coverUrl: string | null; // short-lived signed URL, never the raw path
}

export class BlogBackendError extends Error {}

type FetchLike = typeof fetch;
let fetchImpl: FetchLike = (...a) => fetch(...a);
/** Test hook: inject a mock fetch (fixtures only, no network). */
export function __setBlogFetch(f: FetchLike | null) {
  fetchImpl = f ?? ((...a) => fetch(...a));
}

const headers = () => ({ apikey: SUPABASE_ANON_KEY, Accept: "application/json" });

const LIST_COLS =
  "slug,title,excerpt,cover_image_url,cover_alt,category,tags,author_display_name,status,published_at,updated_at";
const FULL_COLS = `${LIST_COLS},body_markdown,seo_title,seo_description`;

function publicFilter(now: Date) {
  return (
    `organization_id=eq.${AXO_ORG_ID}` +
    `&status=eq.published&published_at=not.is.null` +
    `&published_at=lte.${encodeURIComponent(now.toISOString())}`
  );
}

/** Defense in depth: re-check visibility client-side of RLS. */
export function isPubliclyVisible(r: Pick<BlogPostRow, "status" | "published_at">, now = new Date()) {
  if (r.status !== "published" || !r.published_at) return false;
  const t = Date.parse(r.published_at);
  return Number.isFinite(t) && t <= now.getTime();
}

async function rest<T>(query: string): Promise<T> {
  let res: Response;
  try {
    res = await fetchImpl(`${SUPABASE_URL}/rest/v1/blog_posts?${query}`, { headers: headers() });
  } catch (e) {
    throw new BlogBackendError(`Blog backend unreachable: ${(e as Error).message}`);
  }
  if (!res.ok) throw new BlogBackendError(`Blog backend error ${res.status}`);
  return (await res.json()) as T;
}

/** Signs a PRIVATE blog-media path. Returns null on any failure (fallback art). */
export async function signCover(path: string | null): Promise<string | null> {
  if (!path || /^https?:\/\//i.test(path)) return null; // contract: path only
  const clean = path.replace(/^\/+/, "").replace(new RegExp(`^${BLOG_BUCKET}/`), "");
  const encoded = clean.split("/").map(encodeURIComponent).join("/");
  try {
    const res = await fetchImpl(`${SUPABASE_URL}/storage/v1/object/sign/${BLOG_BUCKET}/${encoded}`, {
      method: "POST",
      headers: {
        ...headers(),
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn: COVER_URL_TTL_SECONDS }),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { signedURL?: string; signedUrl?: string };
    const rel = j.signedURL ?? j.signedUrl;
    if (!rel) return null;
    return rel.startsWith("http") ? rel : `${SUPABASE_URL}/storage/v1${rel.startsWith("/") ? "" : "/"}${rel}`;
  } catch {
    return null;
  }
}

async function toPublic(r: BlogPostRow): Promise<PublicBlogPost> {
  const { cover_image_url, ...rest } = r;
  return { ...rest, coverUrl: await signCover(cover_image_url) };
}

export async function listPublishedPosts(now = new Date()): Promise<PublicBlogPost[]> {
  const rows = await rest<BlogPostRow[]>(
    `select=${LIST_COLS}&${publicFilter(now)}&order=published_at.desc&limit=100`,
  );
  const visible = rows.filter((r) => isPubliclyVisible(r, now));
  return Promise.all(visible.map((r) => toPublic({ ...r, body_markdown: null } as BlogPostRow)));
}

export async function getPublishedPost(slug: string, now = new Date()): Promise<PublicBlogPost | null> {
  if (!/^[a-z0-9][a-z0-9-]{0,200}$/i.test(slug)) return null;
  const rows = await rest<BlogPostRow[]>(
    `select=${FULL_COLS}&slug=eq.${encodeURIComponent(slug)}&${publicFilter(now)}&limit=1`,
  );
  const row = rows[0];
  if (!row || !isPubliclyVisible(row, now)) return null;
  return toPublic(row); // cover signed ONLY after published resolution
}

export async function listSitemapEntries(now = new Date()) {
  const rows = await rest<Pick<BlogPostRow, "slug" | "status" | "published_at" | "updated_at">[]>(
    `select=slug,status,published_at,updated_at&${publicFilter(now)}&order=published_at.desc&limit=1000`,
  );
  return rows.filter((r) => isPubliclyVisible(r, now));
}

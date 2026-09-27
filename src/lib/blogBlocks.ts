import { z } from "zod";
import { AXO_ORG_ID } from "@/lib/constants";

const MAX_BLOCK_BYTES = 512 * 1024;
const mediaPathPattern = new RegExp(`^org-${AXO_ORG_ID}/posts/[0-9a-f-]{36}/[^/]+$`, "i");

export function isSafeBlogUrl(value: string) {
  const url = value.trim();
  return /^(https?:\/\/|mailto:|\/|#)/i.test(url) && !/^(javascript|data|vbscript):/i.test(url);
}

const safeUrlSchema = z.string().max(2048).refine(isSafeBlogUrl, "Unsafe URL");
const inlineSchema = z.object({
  text: z.string().max(20000),
  marks: z.array(z.enum(["bold", "italic"])).max(2).optional(),
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
export type PublicRichBlogDocument = { version: 1; blocks: Array<RichBlogBlock | (Extract<RichBlogBlock, { type: "figure" }> & { signedUrl: string | null })> };
export class InvalidBlogBodyError extends Error {}

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

export function plainTextFromInlines(inlines: BlogInline[]) { return inlines.map((inline) => inline.text).join(""); }

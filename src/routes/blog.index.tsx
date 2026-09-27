import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Clock3 } from "lucide-react";
import { fetchBlogList } from "@/lib/blog.functions";
import { PUBLIC_SITE_URL } from "@/lib/constants";
import type { PublicBlogPost } from "@/lib/blog.server";
import { BlogShell, CoverFallback, formatDate } from "@/components/blog/BlogChrome";

const TITLE = "Flooring Blog | AXO Floors NJ";
const DESC = "Expert hardwood flooring guides, finish comparisons and real project insights from AXO Floors in New Jersey.";
const URL = `${PUBLIC_SITE_URL}/blog`;

export const Route = createFileRoute("/blog/")({
  loader: () => fetchBlogList(),
  headers: () => ({ "Cache-Control": "public, max-age=60, s-maxage=300" }),
  head: () => ({ meta: [
    { title: TITLE }, { name: "description", content: DESC }, { name: "robots", content: "index, follow" },
    { property: "og:title", content: TITLE }, { property: "og:description", content: DESC }, { property: "og:url", content: URL },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: TITLE }, { name: "twitter:description", content: DESC },
  ], links: [{ rel: "canonical", href: URL }] }),
  component: BlogIndex,
  errorComponent: BlogError,
});

function BlogError() { return <BlogShell><section className="container mx-auto px-4 py-24 text-center"><h1 className="mb-4 text-3xl font-bold text-navy">Our journal is temporarily unavailable</h1><p className="mb-8 text-grey">Please try again in a few minutes.</p><a href="/" className="inline-flex rounded-md bg-navy px-5 py-3 font-semibold text-white">Return home</a></section></BlogShell>; }

function ArticleImage({ post, eager = false }: { post: PublicBlogPost; eager?: boolean }) {
  return post.coverUrl ? <img src={post.coverUrl} alt={post.cover_alt ?? post.title} loading={eager ? "eager" : "lazy"} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" /> : <CoverFallback className="h-full w-full" />;
}
function Meta({ post }: { post: PublicBlogPost }) {
  return <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase text-grey">{post.category && <span className="text-gold-warm">{post.category}</span>}<time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />5 min read</span></div>;
}
function FeaturedPost({ post }: { post: PublicBlogPost }) {
  return <article data-testid="featured-post" className="group grid overflow-hidden rounded-md border border-border bg-card shadow-elegant lg:grid-cols-[1.35fr_1fr]">
    <a href={`/blog/${post.slug}`} className="block min-h-64 overflow-hidden lg:min-h-[430px]" aria-label={`Read ${post.title}`}><ArticleImage post={post} eager /></a>
    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10"><span className="mb-5 text-xs font-bold uppercase text-gold-warm">Featured story</span><Meta post={post} /><h2 className="mt-4 text-3xl font-bold leading-tight text-navy md:text-4xl"><a href={`/blog/${post.slug}`} className="transition-colors hover:text-gold-warm">{post.title}</a></h2>{post.excerpt && <p className="mt-5 text-base leading-7 text-grey md:text-lg">{post.excerpt}</p>}<a href={`/blog/${post.slug}`} className="mt-7 inline-flex items-center gap-2 font-bold text-navy">Read the story <ArrowRight className="h-4 w-4 text-gold-warm" /></a></div>
  </article>;
}
function PostCard({ post }: { post: PublicBlogPost }) {
  return <article className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card"><a href={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden"><ArticleImage post={post} /></a><div className="flex flex-1 flex-col p-6"><Meta post={post} /><h2 className="mt-3 text-2xl font-bold leading-tight text-navy"><a href={`/blog/${post.slug}`} className="hover:text-gold-warm">{post.title}</a></h2>{post.excerpt && <p className="mt-3 flex-1 text-sm leading-6 text-grey">{post.excerpt}</p>}<a href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy">Read article <ArrowRight className="h-4 w-4 text-gold-warm" /></a></div></article>;
}
function BlogIndex() {
  const posts = Route.useLoaderData();
  const [featured, ...remaining] = posts;
  return <BlogShell>
    <section className="border-b border-border bg-navy text-white"><div className="container mx-auto px-4 py-10 md:py-14"><p className="mb-2 text-xs font-bold uppercase text-gold">AXO JOURNAL</p><h1 className="text-3xl font-bold md:text-5xl">Craft, care & beautiful floors</h1><p className="mt-4 max-w-3xl text-base leading-7 text-white/80 md:text-lg">{DESC}</p></div></section>
    <section className="container mx-auto px-4 py-10 md:py-16">
      {!featured ? <div className="mx-auto max-w-2xl border-y border-border py-14 text-center" data-testid="blog-empty"><p className="mb-3 text-xs font-bold uppercase text-gold-warm">The journal is taking shape</p><h2 className="text-2xl font-bold text-navy md:text-3xl">Our first articles are on the way</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-grey">We're preparing practical guides on hardwood refinishing, installation and care. In the meantime, explore our recent work.</p><a href="/gallery" className="mt-7 inline-flex rounded-md bg-navy px-6 py-3 font-bold text-white">View our work</a></div> : <><FeaturedPost post={featured} />{remaining.length > 0 && <div className="mt-12 md:mt-16"><div className="mb-7 flex items-end justify-between border-b border-border pb-4"><div><p className="text-xs font-bold uppercase text-gold-warm">More from AXO</p><h2 className="mt-1 text-2xl font-bold text-navy md:text-3xl">Latest insights</h2></div></div><div data-testid="post-grid" className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{remaining.map((post) => <PostCard key={post.slug} post={post} />)}</div></div>}</>}
    </section>
  </BlogShell>;
}

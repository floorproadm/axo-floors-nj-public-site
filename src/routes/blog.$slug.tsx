import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { fetchBlogPost } from "@/lib/blog.functions";
import { PUBLIC_SITE_URL } from "@/lib/constants";
import { ArticleMarkdown, BlogShell, CoverFallback, formatDate, readingTime } from "@/components/blog/BlogChrome";
import { BlogBlocks, richFaqs, richHeadings } from "@/components/blog/BlogBlocks";

function summarize(post: NonNullable<Awaited<ReturnType<typeof fetchBlogPost>>>["post"]) {
  const rich = post.bodyBlocks?.blocks.flatMap((block) => {
    if ("content" in block) return block.content.map((inline) => inline.text).join("");
    if (block.type === "bulletList" || block.type === "orderedList") return block.items.flat().map((inline) => inline.text).join(" ");
    if (block.type === "faq") return `${block.question} ${block.answer.map((inline) => inline.text).join("")}`;
    return "";
  }).filter(Boolean).join(" ");
  const legacy = post.body_markdown?.replace(/[#*_>`\[\]()!-]/g, " ").replace(/\s+/g, " ").trim();
  const text = (rich || legacy || "").replace(/\s+/g, " ").trim();
  return text.length > 160 ? `${text.slice(0, 159).trimEnd()}…` : text;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => { const page = await fetchBlogPost({ data: { slug: params.slug } }); if (!page) throw notFound(); return page; },
  headers: () => ({ "Cache-Control": "public, max-age=60, s-maxage=300" }),
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Article not found | AXO Floors NJ" }, { name: "description", content: "The requested AXO Floors article is unavailable." }, { property: "og:title", content: "Article not found | AXO Floors NJ" }, { property: "og:description", content: "The requested AXO Floors article is unavailable." }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex, follow" }] };
    const url = `${PUBLIC_SITE_URL}/blog/${post.slug}`;
    const title = post.seo_title || `${post.title} | AXO Floors NJ`;
    const description = post.seo_description || post.excerpt || summarize(post) || post.title;
    const author = post.author_display_name || "AXO Floors";
    const faqs = richFaqs(post.bodyBlocks);
    const meta: Array<Record<string, string>> = [
      { title }, { name: "description", content: description }, { name: "robots", content: "index, follow" },
      { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: url }, { property: "og:type", content: "article" },
      { property: "article:published_time", content: post.published_at ?? "" }, { property: "article:modified_time", content: post.updated_at ?? post.published_at ?? "" },
      { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: title }, { name: "twitter:description", content: description },
    ];
    if (post.coverUrl) { meta.push({ property: "og:image", content: post.coverUrl }, { name: "twitter:image", content: post.coverUrl }); if (post.cover_alt) meta.push({ property: "og:image:alt", content: post.cover_alt }); }
    const scripts = [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description, datePublished: post.published_at, dateModified: post.updated_at ?? post.published_at, author: { "@type": "Person", name: author }, publisher: { "@type": "Organization", name: "AXO Floors NJ", url: PUBLIC_SITE_URL }, mainEntityOfPage: { "@type": "WebPage", "@id": url }, url, ...(post.coverUrl ? { image: post.coverUrl } : {}), ...(post.category ? { articleSection: post.category } : {}), ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}) }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${PUBLIC_SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Blog", item: `${PUBLIC_SITE_URL}/blog` }, { "@type": "ListItem", position: 3, name: post.title, item: url }] }) },
    ];
    if (faqs.length) scripts.push({ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer.map((inline) => inline.text).join("") } })) }) });
    return { meta, links: [{ rel: "canonical", href: url }], scripts };
  },
  component: BlogArticle,
  notFoundComponent: ArticleNotFound,
  errorComponent: ArticleError,
});

function ArticleNotFound() { return <BlogShell><section className="container mx-auto px-4 py-24 text-center"><p className="mb-4 text-sm font-bold uppercase text-gold-warm">404</p><h1 className="mb-4 text-3xl font-bold text-navy md:text-4xl">This article isn't available.</h1><p className="mb-8 text-grey">It may have moved or hasn't been published yet.</p><a href="/blog" className="inline-flex rounded-md bg-navy px-5 py-3 font-semibold text-white">Back to the journal</a></section></BlogShell>; }
function ArticleError() { return <BlogShell><section className="container mx-auto px-4 py-24 text-center"><h1 className="mb-4 text-3xl font-bold text-navy">This article is temporarily unavailable</h1><p className="mb-8 text-grey">Please try again in a few minutes.</p><a href="/blog" className="inline-flex rounded-md bg-navy px-5 py-3 font-semibold text-white">Back to the journal</a></section></BlogShell>; }

function BlogArticle() {
  const { post, related } = Route.useLoaderData();
  const author = post.author_display_name || "AXO Floors";
  const headings = richHeadings(post.bodyBlocks);
  const minutes = readingTime(post.body_markdown) ?? (post.bodyBlocks ? `${Math.max(1, Math.ceil(JSON.stringify(post.bodyBlocks).split(/\s+/).length / 220))} min read` : null);
  return <BlogShell>
    <article>
      <header className="border-b border-border bg-secondary"><div className="container mx-auto max-w-5xl px-4 py-10 md:py-16"><a href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-gold-warm"><ArrowLeft className="h-4 w-4" /> AXO Journal</a><div className="mt-8 max-w-4xl">{post.category && <p className="text-xs font-bold uppercase text-gold-warm">{post.category}</p>}<h1 className="mt-3 text-4xl font-extrabold leading-[1.08] text-navy sm:text-5xl md:text-6xl">{post.title}</h1>{post.excerpt && <p className="mt-6 max-w-3xl text-lg leading-8 text-grey md:text-xl">{post.excerpt}</p>}<div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-grey"><span>By <strong className="text-navy">{author}</strong></span><span aria-hidden="true">•</span><time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>{minutes && <><span aria-hidden="true">•</span><span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" />{minutes}</span></>}</div></div></div></header>
      <div className="container mx-auto max-w-6xl px-4 pt-8 md:pt-12">{post.coverUrl ? <img src={post.coverUrl} alt={post.cover_alt ?? post.title} className="aspect-[16/9] w-full rounded-md object-cover shadow-elegant" /> : <CoverFallback className="aspect-[16/9] w-full rounded-md" />}</div>
      <div className={`container mx-auto grid max-w-6xl gap-12 px-4 py-12 md:py-16 ${headings.length ? "lg:grid-cols-[minmax(0,800px)_210px]" : "lg:max-w-[820px]"}`}>
        <div data-testid="blog-body" className="min-w-0">{post.bodyBlocks ? <BlogBlocks document={post.bodyBlocks} /> : <ArticleMarkdown source={post.body_markdown ?? ""} />}{post.tags?.length ? <ul className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6">{post.tags.map((tag) => <li key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-grey">#{tag}</li>)}</ul> : null}</div>
        {headings.length > 0 && <aside className="hidden lg:block"><nav aria-label="On this page" className="sticky top-28 border-l-2 border-gold pl-5"><p className="mb-4 text-xs font-bold uppercase text-grey">In this article</p><ol className="space-y-3">{headings.map((heading) => <li key={heading.id}><a href={`#${heading.id}`} className="text-sm font-medium leading-5 text-grey transition-colors hover:text-navy">{heading.label}</a></li>)}</ol></nav></aside>}
      </div>
    </article>
    <section className="bg-navy text-white"><div className="container mx-auto max-w-4xl px-4 py-14 text-center md:py-16"><p className="text-xs font-bold uppercase text-gold">Your floor, done right</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Ready to transform your floors?</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-white/75">Tell us about your project and get a clear, no-pressure estimate from AXO Floors.</p><a href="/get-started" className="mt-7 inline-flex min-h-12 items-center rounded-md bg-gold px-7 py-3 font-bold text-navy">Get my estimate</a></div></section>
    {related.length > 0 && <section className="container mx-auto max-w-6xl px-4 py-14 md:py-20"><div className="mb-8 border-b border-border pb-4"><p className="text-xs font-bold uppercase text-gold-warm">Continue reading</p><h2 className="mt-1 text-3xl font-bold text-navy">Related stories</h2></div><div className="grid gap-7 md:grid-cols-3">{related.map((item) => <article key={item.slug} className="group"><a href={`/blog/${item.slug}`} className="block aspect-[16/10] overflow-hidden rounded-md">{item.coverUrl ? <img src={item.coverUrl} alt={item.cover_alt ?? item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <CoverFallback className="h-full w-full" />}</a><p className="mt-4 text-xs font-bold uppercase text-gold-warm">{item.category || "AXO Journal"}</p><h3 className="mt-2 text-xl font-bold leading-tight text-navy"><a href={`/blog/${item.slug}`}>{item.title}</a></h3><a href={`/blog/${item.slug}`} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-navy">Read article <ArrowRight className="h-4 w-4 text-gold-warm" /></a></article>)}</div></section>}
  </BlogShell>;
}

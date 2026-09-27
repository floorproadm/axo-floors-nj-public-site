import { createFileRoute, notFound } from "@tanstack/react-router";
import { fetchBlogPost } from "@/lib/blog.functions";
import { PUBLIC_SITE_URL } from "@/lib/constants";
import { ArticleMarkdown, BlogShell, CoverFallback, formatDate } from "@/components/blog/BlogChrome";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await fetchBlogPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  // HTML cached 5 min max; signed cover URL lives 1h, re-signed on each render.
  headers: () => ({ "Cache-Control": "public, max-age=60, s-maxage=300" }),
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Article not found | AXO Floors NJ" }, { name: "robots", content: "noindex, follow" }] };
    }
    const url = `${PUBLIC_SITE_URL}/blog/${post.slug}`;
    const title = post.seo_title || `${post.title} | AXO Floors NJ`;
    const desc = post.seo_description || post.excerpt || `${post.title} — AXO Floors NJ blog.`;
    const author = post.author_display_name || "AXO Floors";
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: desc },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { property: "article:published_time", content: post.published_at ?? "" },
      { property: "article:modified_time", content: post.updated_at ?? post.published_at ?? "" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ];
    if (post.coverUrl) {
      meta.push({ property: "og:image", content: post.coverUrl }, { name: "twitter:image", content: post.coverUrl });
      if (post.cover_alt) meta.push({ property: "og:image:alt", content: post.cover_alt });
    }
    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: desc,
            datePublished: post.published_at,
            dateModified: post.updated_at ?? post.published_at,
            author: { "@type": "Person", name: author },
            publisher: { "@type": "Organization", name: "AXO Floors NJ", url: PUBLIC_SITE_URL },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            url,
            ...(post.coverUrl ? { image: post.coverUrl } : {}),
            ...(post.category ? { articleSection: post.category } : {}),
            ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${PUBLIC_SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${PUBLIC_SITE_URL}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: BlogArticle,
  notFoundComponent: ArticleNotFound,
  errorComponent: ArticleError,
});

function ArticleNotFound() {
  return (
    <BlogShell>
      <section className="container mx-auto px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold mb-4">404</p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-navy mb-4">This article isn't available.</h1>
        <p className="text-grey mb-8">It may have moved or hasn't been published yet.</p>
        <a href="/blog" className="inline-flex px-5 py-2.5 rounded-md bg-navy text-white font-semibold">Back to the blog</a>
      </section>
    </BlogShell>
  );
}

function ArticleError() {
  return (
    <BlogShell>
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-heading font-bold text-navy mb-4">This article is temporarily unavailable</h1>
        <p className="text-grey mb-8">Please try again in a few minutes.</p>
        <a href="/blog" className="inline-flex px-5 py-2.5 rounded-md bg-navy text-white font-semibold">Back to the blog</a>
      </section>
    </BlogShell>
  );
}

function BlogArticle() {
  const { post } = Route.useLoaderData();
  const author = post.author_display_name || "AXO Floors";
  return (
    <BlogShell>
      <article>
        <header className="container mx-auto px-4 pt-10 md:pt-14 max-w-3xl">
          <a href="/blog" className="text-sm text-navy hover:text-gold font-semibold">← All articles</a>
          {post.category && <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-gold">{post.category}</p>}
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-navy leading-tight">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-lg text-grey">{post.excerpt}</p>}
          <p className="mt-4 text-sm text-grey">
            By <span className="font-semibold text-foreground">{author}</span> ·{" "}
            <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
          </p>
        </header>
        <div className="container mx-auto px-4 max-w-4xl mt-8">
          {post.coverUrl ? (
            <img src={post.coverUrl} alt={post.cover_alt ?? post.title} className="w-full rounded-xl aspect-[16/9] object-cover" />
          ) : (
            <CoverFallback className="w-full rounded-xl aspect-[16/9]" />
          )}
        </div>
        <div className="container mx-auto px-4 max-w-3xl py-10" data-testid="blog-body">
          <ArticleMarkdown source={post.body_markdown ?? ""} />
          {post.tags && post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-8">
              {post.tags.map((t) => (
                <li key={t} className="text-xs px-3 py-1 rounded-full bg-muted text-foreground/70">#{t}</li>
              ))}
            </ul>
          )}
        </div>
      </article>
      <section className="bg-navy text-white">
        <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">Ready to transform your floors?</h2>
          <p className="text-white/80 mb-6">Tell us about your project and get a free estimate from AXO Floors.</p>
          <a href="/get-started" className="inline-flex px-6 py-3 rounded-md gold-gradient text-black font-semibold">Get my estimate</a>
        </div>
      </section>
    </BlogShell>
  );
}

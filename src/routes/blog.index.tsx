import { createFileRoute } from "@tanstack/react-router";
import { fetchBlogList } from "@/lib/blog.functions";
import { PUBLIC_SITE_URL } from "@/lib/constants";
import { BlogShell, CoverFallback, formatDate } from "@/components/blog/BlogChrome";

const TITLE = "Flooring Blog | AXO Floors NJ";
const DESC =
  "Hardwood flooring tips, refinishing guides and project stories from AXO Floors, serving New Jersey homeowners.";
const URL = `${PUBLIC_SITE_URL}/blog`;

export const Route = createFileRoute("/blog/")({
  loader: () => fetchBlogList(),
  headers: () => ({ "Cache-Control": "public, max-age=60, s-maxage=300" }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: BlogIndex,
  errorComponent: BlogError,
});

function BlogError() {
  return (
    <BlogShell>
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-heading font-bold text-navy mb-4">Our blog is temporarily unavailable</h1>
        <p className="text-grey mb-8">Please try again in a few minutes.</p>
        <a href="/" className="inline-flex px-5 py-2.5 rounded-md bg-navy text-white font-semibold">Return home</a>
      </section>
    </BlogShell>
  );
}

function BlogIndex() {
  const posts = Route.useLoaderData();
  return (
    <BlogShell>
      <section className="bg-navy text-white">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold mb-3">AXO Floors Journal</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Flooring Blog</h1>
          <p className="text-white/80 max-w-2xl text-lg">{DESC}</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 md:py-16">
        {posts.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-12" data-testid="blog-empty">
            <h2 className="text-2xl font-heading font-bold text-navy mb-3">Our first articles are on the way</h2>
            <p className="text-grey mb-8">
              We're preparing practical guides on hardwood refinishing, installation and care. In the meantime, see our
              work or get a free estimate.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/gallery" className="inline-flex px-5 py-2.5 rounded-md border border-navy text-navy font-semibold hover:bg-navy hover:text-white transition-smooth">View our work</a>
              <a href="/get-started" className="inline-flex px-5 py-2.5 rounded-md gold-gradient text-black font-semibold">Get my estimate</a>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article key={p.slug} className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-elegant transition-smooth flex flex-col">
                <a href={`/blog/${p.slug}`} className="block aspect-[16/9] overflow-hidden">
                  {p.coverUrl ? (
                    <img src={p.coverUrl} alt={p.cover_alt ?? p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                  ) : (
                    <CoverFallback className="w-full h-full" />
                  )}
                </a>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs mb-2">
                    {p.category && <span className="uppercase tracking-wide font-semibold text-gold">{p.category}</span>}
                    <time dateTime={p.published_at ?? undefined} className="text-grey">{formatDate(p.published_at)}</time>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-navy mb-2">
                    <a href={`/blog/${p.slug}`} className="hover:text-gold">{p.title}</a>
                  </h2>
                  {p.excerpt && <p className="text-grey text-sm leading-relaxed mb-4 flex-1">{p.excerpt}</p>}
                  <a href={`/blog/${p.slug}`} className="text-navy font-semibold text-sm hover:text-gold">Read article →</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </BlogShell>
  );
}

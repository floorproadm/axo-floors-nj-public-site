import { CircleHelp, Quote } from "lucide-react";
import type { BlogInline, PublicRichBlogDocument, RichBlogBlock } from "@/lib/blogBlocks";
import { isSafeBlogUrl } from "@/lib/blogBlocks";
import { CoverFallback } from "./BlogChrome";

type PublicBlock = PublicRichBlogDocument["blocks"][number];

export function InlineContent({ content }: { content: BlogInline[] }) {
  return <>{content.map((inline, index) => {
    let node: React.ReactNode = inline.text;
    if (inline.marks?.includes("italic")) node = <em>{node}</em>;
    if (inline.marks?.includes("bold")) node = <strong>{node}</strong>;
    if (inline.href && isSafeBlogUrl(inline.href)) {
      const external = /^https?:\/\//i.test(inline.href) && !inline.href.startsWith("https://axofloorsnj.com");
      node = <a href={inline.href} className="font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-gold" {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}>{node}</a>;
    }
    return <span key={`${index}-${inline.text.slice(0, 16)}`}>{node}</span>;
  })}</>;
}

export function richHeadings(document: PublicRichBlogDocument | null) {
  return document?.blocks.filter((block): block is Extract<RichBlogBlock, { type: "heading" }> => block.type === "heading" && block.level === 2).map((block) => ({ id: block.id, label: block.content.map((inline) => inline.text).join("") })).filter((heading) => heading.label) ?? [];
}

export function richFaqs(document: PublicRichBlogDocument | null) {
  return document?.blocks.filter((block): block is Extract<RichBlogBlock, { type: "faq" }> => block.type === "faq") ?? [];
}

function FigureBlock({ block }: { block: Extract<PublicBlock, { type: "figure" }> & { signedUrl?: string | null } }) {
  return <figure className="my-10 md:-mx-16 md:my-14">
    {block.signedUrl ? <img src={block.signedUrl} alt={block.alt} loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover shadow-elegant md:aspect-[16/10]" /> : <CoverFallback className="aspect-[4/3] w-full rounded-md md:aspect-[16/10]" />}
    {block.caption && <figcaption className="mt-3 border-l-2 border-gold pl-3 text-sm leading-6 text-grey">{block.caption}</figcaption>}
  </figure>;
}

export function BlogBlocks({ document }: { document: PublicRichBlogDocument }) {
  return <div className="editorial-body">
    {document.blocks.map((block, index) => {
      const key = block.type === "heading" ? block.id : `${block.type}-${index}`;
      if (block.type === "paragraph") return <p key={key}><InlineContent content={block.content} /></p>;
      if (block.type === "heading") return block.level === 2
        ? <h2 id={block.id} key={key} className="scroll-mt-28"><InlineContent content={block.content} /></h2>
        : <h3 id={block.id} key={key} className="scroll-mt-28"><InlineContent content={block.content} /></h3>;
      if (block.type === "bulletList" || block.type === "orderedList") {
        const List = block.type === "bulletList" ? "ul" : "ol";
        return <List key={key}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineContent content={item} /></li>)}</List>;
      }
      if (block.type === "quote") return <blockquote key={key}><Quote className="mb-4 h-7 w-7 text-gold" aria-hidden="true" /><InlineContent content={block.content} /></blockquote>;
      if (block.type === "divider") return <hr key={key} />;
      if (block.type === "figure") return <FigureBlock key={key} block={block} />;
      if (block.type === "faq") return <section key={key} className="my-6 rounded-md border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-navy"><CircleHelp className="h-5 w-5" aria-hidden="true" /></span><div><h3 className="!mt-0 !text-xl">{block.question}</h3><p className="!mb-0 !mt-3"><InlineContent content={block.answer} /></p></div></div></section>;
      if (block.type === "cta") return <aside key={key} className="my-10 border-l-4 border-gold bg-navy p-6 text-white md:p-8"><p className="!mb-5 !text-xl !font-semibold !text-white">{block.text}</p><a href={block.href} className="inline-flex min-h-12 items-center rounded-md bg-gold px-6 py-3 font-bold text-navy transition-transform hover:-translate-y-0.5">Get a free estimate</a></aside>;
      return null;
    })}
  </div>;
}

import type { ReactNode } from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import HeaderSSR from "@/components/locations/ssr/HeaderSSR";
import FooterSSR from "@/components/locations/ssr/FooterSSR";
import axoLogo from "@/assets/axo-logo-official.png";

export function BlogShell({ children }: { children: ReactNode }) { return <><HeaderSSR /><main className="min-h-[60vh] bg-background">{children}</main><FooterSSR /></>; }
export function formatDate(iso: string | null) { return iso ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "America/New_York" }) : ""; }
export function readingTime(markdown: string | null) { const words = markdown?.trim().split(/\s+/).filter(Boolean).length ?? 0; return words ? `${Math.max(1, Math.ceil(words / 220))} min read` : null; }
export function CoverFallback({ className = "" }: { className?: string }) { return <div className={`relative flex items-center justify-center overflow-hidden bg-navy ${className}`} aria-hidden="true"><div className="absolute inset-x-0 bottom-0 h-1 bg-gold" /><img src={axoLogo} alt="" className="h-10 w-auto opacity-80" /></div>; }
export function safeUrl(url: string) { const transformed = defaultUrlTransform(url); return transformed && /^(https?:|mailto:|\/|#)/i.test(transformed) ? transformed : ""; }
export function ArticleMarkdown({ source }: { source: string }) {
  return <div className="editorial-body"><ReactMarkdown skipHtml urlTransform={safeUrl} components={{
    h1: ({ children }) => <h2>{children}</h2>, h2: ({ children }) => <h2>{children}</h2>, h3: ({ children }) => <h3>{children}</h3>, h4: ({ children }) => <h3>{children}</h3>,
    a: ({ href, children }) => href ? <a href={href} {...(/^https?:/i.test(href) && !href.startsWith("https://axofloorsnj.com") ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}>{children}</a> : <span>{children}</span>,
    img: ({ src, alt }) => typeof src === "string" && /^https:\/\//i.test(src) ? <img src={src} alt={alt ?? ""} loading="lazy" referrerPolicy="no-referrer" /> : null,
  }}>{source}</ReactMarkdown></div>;
}

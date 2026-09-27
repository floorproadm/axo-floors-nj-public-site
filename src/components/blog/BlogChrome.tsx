import type { ReactNode } from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import HeaderSSR from "@/components/locations/ssr/HeaderSSR";
import FooterSSR from "@/components/locations/ssr/FooterSSR";
import axoLogo from "@/assets/axo-logo-official.png";

export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderSSR />
      <main className="bg-background min-h-[60vh]">{children}</main>
      <FooterSSR />
    </>
  );
}

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

export function CoverFallback({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-navy ${className}`} aria-hidden="true">
      <img src={axoLogo} alt="" className="h-10 w-auto opacity-80" />
    </div>
  );
}

/** Allow only http(s)/mailto/tel/relative; everything else is dropped. */
export function safeUrl(url: string) {
  const u = defaultUrlTransform(url);
  if (!u) return "";
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(u)) return u;
  return "";
}

export function ArticleMarkdown({ source }: { source: string }) {
  return (
    <ReactMarkdown
      skipHtml
      urlTransform={safeUrl}
      components={{
        h1: ({ children }) => <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy mt-10 mb-4">{children}</h2>,
        h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy mt-10 mb-4">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl md:text-2xl font-heading font-semibold text-navy mt-8 mb-3">{children}</h3>,
        h4: ({ children }) => <h4 className="text-lg font-heading font-semibold text-navy mt-6 mb-2">{children}</h4>,
        p: ({ children }) => <p className="text-base md:text-lg leading-relaxed text-foreground/85 mb-5">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-foreground/85">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-foreground/85">{children}</ol>,
        blockquote: ({ children }) => <blockquote className="border-l-4 border-gold pl-4 italic my-6 text-foreground/75">{children}</blockquote>,
        a: ({ href, children }) => {
          if (!href) return <span>{children}</span>;
          const external = /^https?:/i.test(href) && !href.startsWith("https://axofloorsnj.com");
          return (
            <a
              href={href}
              className="text-navy underline decoration-gold underline-offset-4 hover:text-gold"
              {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
            >
              {children}
            </a>
          );
        },
        img: ({ src, alt }) =>
          typeof src === "string" && /^https:\/\//i.test(src) ? (
            <img src={src} alt={alt ?? ""} loading="lazy" referrerPolicy="no-referrer" className="rounded-lg my-6 w-full h-auto" />
          ) : null,
      }}
    >
      {source}
    </ReactMarkdown>
  );
}

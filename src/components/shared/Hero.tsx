import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, Star } from "lucide-react";
import { AXO_PHONE_TEL } from "@/lib/constants";

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryHref?: string;
  trustLine?: string;
  showReviews?: boolean;
}

export default function Hero({
  title,
  subtitle,
  description,
  image,
  ctaPrimary = "Get Free Quote",
  ctaSecondary = "Call Now",
  ctaPrimaryHref = "/quiz",
  ctaSecondaryHref = AXO_PHONE_TEL,
  trustLine,
  showReviews,
}: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 hero-gradient" aria-hidden />

      <div className="container mx-auto px-4 py-20 sm:py-28 lg:py-36 text-white">
        <div className="max-w-3xl">
          {subtitle && (
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--gold-accent)]/40 bg-[var(--gold-accent)]/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase text-[var(--gold-accent)]">
              {subtitle}
            </p>
          )}
          <h1 className="mt-4 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-lg text-white/85 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}

          {showReviews && (
            <div className="mt-6 flex items-center gap-2 text-sm text-white/85">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[var(--gold-accent)] text-[var(--gold-accent)]" />
                ))}
              </div>
              <span>500+ Homes Transformed • 10+ Years Experience</span>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gold-gradient text-navy font-semibold shadow-gold hover:opacity-95">
              {ctaPrimaryHref.startsWith("/") ? (
                <Link to={ctaPrimaryHref}>{ctaPrimary} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              ) : (
                <a href={ctaPrimaryHref}>{ctaPrimary} <ArrowRight className="ml-1 h-4 w-4" /></a>
              )}
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/5 border-white/30 text-white hover:bg-white/15">
              <a href={ctaSecondaryHref}><Phone className="mr-2 h-4 w-4" />{ctaSecondary}</a>
            </Button>
          </div>

          {trustLine && (
            <p className="mt-6 text-xs uppercase tracking-wider text-white/70">{trustLine}</p>
          )}
        </div>
      </div>
    </section>
  );
}

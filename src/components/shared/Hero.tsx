import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryHref?: string;
  trustLine?: string;
  showReviews?: boolean;
}

const Hero = ({ 
  title, 
  subtitle, 
  description, 
  image, 
  ctaPrimary = "Get Free Quote", 
  ctaSecondary = "Call Now",
  ctaPrimaryHref = "/get-started",
  ctaSecondaryHref = "tel:(732) 351-8653",
  trustLine,
  showReviews = true 
}: HeroProps) => {
  const isSecondaryTel = ctaSecondaryHref.startsWith("tel:");
  const isSecondaryExternal = /^https?:\/\//.test(ctaSecondaryHref);
  const isPrimaryTel = ctaPrimaryHref.startsWith("tel:");
  const isPrimaryExternal = /^https?:\/\//.test(ctaPrimaryHref);
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt="AXO Floors Premium Service" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-5 sm:px-4 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl font-medium text-gold mb-4 sm:mb-4 font-heading tracking-wide uppercase sm:normal-case">
            {subtitle}
          </p>

          {/* Main Title */}
          <h1 className="text-[1.75rem] leading-[1.2] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-heading mb-5 sm:mb-6 sm:leading-tight whitespace-pre-line [text-wrap:balance]">
            {title}
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-8 max-w-md sm:max-w-3xl mx-auto leading-relaxed [text-wrap:pretty]">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-sm sm:max-w-none mx-auto">
            <Button asChild className="gold-gradient hover:scale-105 transition-bounce text-base sm:text-lg w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 h-auto min-h-[52px] text-black font-semibold">
              {isPrimaryTel || isPrimaryExternal ? (
                <a href={ctaPrimaryHref} className="flex items-center justify-center gap-2 text-black">
                  {ctaPrimary}
                </a>
              ) : (
                <Link to={ctaPrimaryHref} className="flex items-center justify-center gap-2 text-black">
                  {ctaPrimary}
                </Link>
              )}
            </Button>
            <Button variant="outline" asChild className="border-white text-black bg-white hover:bg-white hover:text-black text-base sm:text-lg w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 h-auto min-h-[52px] font-semibold">
              {isSecondaryTel || isSecondaryExternal ? (
                <a href={ctaSecondaryHref} className="flex items-center justify-center gap-2 text-black">
                  {ctaSecondary}
                </a>
              ) : (
                <Link to={ctaSecondaryHref} className="flex items-center justify-center gap-2 text-black">
                  {ctaSecondary}
                </Link>
              )}
            </Button>
          </div>

          {trustLine && (
            <p className="mt-7 sm:mt-8 text-xs sm:text-sm text-white/80 font-medium tracking-wide [text-wrap:balance]">
              {trustLine}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
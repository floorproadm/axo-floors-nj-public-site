import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectStripProps {
  photos: { src: string; alt: string }[];
  className?: string;
}

const ProjectStrip = ({ photos, className = "mt-8" }: ProjectStripProps) => {
  const strip = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = () => {
    const el = strip.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  };

  useEffect(sync, []);

  const shift = (direction: number) => {
    const el = strip.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.innerWidth < 640) {
      // Mobile: land each photo exactly centered, on its snap point.
      const items = Array.from(el.children) as HTMLElement[];
      const elRect = el.getBoundingClientRect();
      const targets = items.map((item) => {
        const r = item.getBoundingClientRect();
        return el.scrollLeft + r.left - elRect.left - (el.clientWidth - r.width) / 2;
      });
      let index = 0;
      let best = Infinity;
      targets.forEach((t, i) => {
        const d = Math.abs(t - el.scrollLeft);
        if (d < best) {
          best = d;
          index = i;
        }
      });
      const next = Math.max(0, Math.min(items.length - 1, index + direction));
      if (next === index) return;
      el.scrollTo({ left: targets[next], behavior: reduce ? "auto" : "smooth" });
      return;
    }
    el.scrollBy({ left: direction * Math.round(el.clientWidth * 0.8), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={className}>
      <div className="relative -mx-5 md:mx-0">
        <div
          ref={strip}
          onScroll={sync}
          tabIndex={0}
          aria-label="AXO Floors project photos"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[7vw] pb-2 outline-none focus-visible:ring-2 focus-visible:ring-gold sm:px-5 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="aspect-[16/10] w-[80vw] shrink-0 snap-center rounded-lg object-cover shadow-md sm:w-[45%] sm:snap-start md:w-[31%]"
            />
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-secondary to-transparent md:hidden" />
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <Button type="button" variant="ghost" size="icon" aria-label="Previous photos" disabled={atStart} onClick={() => shift(-1)} className="h-11 w-11 rounded-full border border-border/70 text-muted-foreground hover:border-gold hover:text-navy disabled:opacity-30">
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Next photos" disabled={atEnd} onClick={() => shift(1)} className="h-11 w-11 rounded-full border border-border/70 text-muted-foreground hover:border-gold hover:text-navy disabled:opacity-30">
          <ChevronRight className="h-5 w-5" aria-hidden />
        </Button>
      </div>
    </div>
  );
};

export default ProjectStrip;

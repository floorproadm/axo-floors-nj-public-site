import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import beforeAfter from "@/assets/before-after-kitchen-refinish.png.asset.json";
import photo1 from "@/assets/refinish-project-1-2.png.asset.json";
import photo4 from "@/assets/refinish-project-4-2.png.asset.json";
import photo5 from "@/assets/refinish-project-5.png.asset.json";
import photo8 from "@/assets/refinish-project-8.png.asset.json";
import photo9 from "@/assets/refinish-project-9.png.asset.json";
import photo11 from "@/assets/refinish-project-11.png.asset.json";

const photos = [
  { src: beforeAfter.url, alt: "Before and after of an AXO Floors kitchen hardwood refinishing project" },
  { src: photo1.url, alt: "Before and after of hardwood flooring beside a curved staircase" },
  { src: photo4.url, alt: "Before and after of worn hardwood flooring beside kitchen cabinets" },
  { src: photo5.url, alt: "Before and after of hardwood flooring in a room with large windows" },
  { src: photo8.url, alt: "Before and after of hardwood flooring through adjoining rooms" },
  { src: photo9.url, alt: "Before and after of hardwood flooring beside a carpeted staircase" },
  { src: photo11.url, alt: "Before and after of worn hardwood flooring in a room with baseboard heating" },
];

export default function RefinishProjectViewer() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const touchStart = useRef<number | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const move = (direction: number) => setIndex((current) => (current + direction + photos.length) % photos.length);

  useEffect(() => {
    if (open) strip.current?.children[index]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  }, [index, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <figure className="mt-8 overflow-hidden rounded-lg shadow-lg">
        <DialogTrigger asChild>
          <Button variant="ghost" className="block h-auto w-full rounded-lg p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-gold" aria-label="Open AXO project photos" onClick={() => setIndex(0)}>
            <img src={beforeAfter.url} alt={photos[0].alt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
          </Button>
        </DialogTrigger>
      </figure>
      <DialogContent
        aria-describedby={undefined}
        className="z-[200] flex h-[100dvh] max-w-none flex-col gap-0 rounded-none border-0 bg-navy-dark p-0 text-primary-foreground sm:rounded-none [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center motion-reduce:animate-none"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        <DialogTitle className="sr-only">AXO Floors project photos</DialogTitle>
        <p aria-live="polite" aria-atomic="true" className="shrink-0 px-5 py-6 text-sm">{index + 1} / {photos.length}</p>
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 sm:px-16"
          onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => {
            const end = event.changedTouches[0]?.clientX;
            if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 50) move(end < touchStart.current ? 1 : -1);
            touchStart.current = null;
          }}
        >
          <Button variant="ghost" size="icon" aria-label="Previous photo" className="absolute left-1 h-11 w-11 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground sm:left-3" onClick={() => move(-1)}><ChevronLeft /></Button>
          <img src={photos[index].src} alt={photos[index].alt} className="max-h-full max-w-full select-none object-contain" draggable={false} />
          <Button variant="ghost" size="icon" aria-label="Next photo" className="absolute right-1 h-11 w-11 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground sm:right-3" onClick={() => move(1)}><ChevronRight /></Button>
        </div>
        <div ref={strip} className="flex shrink-0 gap-3 overflow-x-auto px-5 py-5 sm:justify-center">
          {photos.map((photo, i) => (
            <Button key={photo.src} variant="ghost" aria-label={`Go to photo ${i + 1}`} aria-pressed={index === i} onClick={() => setIndex(i)} className={`h-16 w-16 shrink-0 overflow-hidden p-0 focus-visible:ring-gold ${index === i ? "ring-2 ring-gold" : "opacity-50 hover:opacity-100"}`}>
              <img src={photo.src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
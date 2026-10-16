import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BlogShell } from "@/components/blog/BlogChrome";
import { PUBLIC_SITE_URL } from "@/lib/constants";
import supra from "@/assets/finishes/supra.png";
import megaone from "@/assets/finishes/megaone.png";
import amberseal from "@/assets/finishes/amberseal.png";
import amberSwatch from "@/assets/finishes/amberseal_swatch.png";

const TITLE = "Hardwood Floor Finishes & Sealers | AXO Floors NJ";
const DESC = "Compare the professional LOBA and Bona water-based finishes and sealers AXO Floors applies on hardwood floors in New Jersey.";
const URL = `${PUBLIC_SITE_URL}/finishes`;

export const Route = createFileRoute("/finishes")({
  head: () => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESC },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
      { property: "og:url", content: URL }, { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: FinishesPage,
});

function Chips({ label, items }: { label: string; items: string[] }) {
  return <div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-grey">{label}</p><div className="flex flex-wrap gap-2">{items.map((i) => <span key={i} className="rounded-full border border-border px-3 py-1 text-xs text-navy">{i}</span>)}</div></div>;
}

function Card({ img, brand, name, pill, desc, children }: { img: string; brand: string; name: string; pill: string; desc: string; children: React.ReactNode }) {
  return <article className="grid overflow-hidden rounded-xl border border-border bg-card md:grid-cols-[240px_1fr]">
    <div className="flex items-center justify-center border-b border-border bg-background p-6 md:border-b-0 md:border-r"><img src={img} alt={name} loading="lazy" className="max-h-56 w-auto object-contain" /></div>
    <div className="p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-grey">{brand}</p>
      <h3 className="mt-1 text-2xl font-bold text-navy">{name}</h3>
      <span className="mt-2 inline-block rounded-full bg-navy px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">{pill}</span>
      <p className="mt-4 leading-7 text-grey">{desc}</p>
      <div className="mt-5 space-y-5 border-t border-border pt-5">{children}</div>
    </div>
  </article>;
}

function SectionLabel({ children }: { children: string }) {
  return <div className="mb-5 mt-12 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-grey first:mt-0">{children}<span className="h-px flex-1 bg-border" /></div>;
}

function FinishesPage() {
  return <BlogShell>
    <section className="bg-navy text-white"><div className="container mx-auto px-4 py-10 md:py-14">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-gold">Water-Based Finishes & Sealers</p>
      <h1 className="text-3xl font-bold md:text-5xl">Finishes</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-white/80 md:text-lg">Professional hardwood flooring products by LOBA and Bona, selected and applied by AXO Floors.</p>
      <div className="mt-6 h-1 w-16 bg-gold" />
    </div></section>

    <section className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
      <SectionLabel>LOBA · 2-Component</SectionLabel>
      <Card img={supra} brand="LOBA" name="2K Supra A.T." pill="2K · Ceramic-Reinforced" desc="LOBA's most resistant finish. Ceramic-reinforced polyurethane gives exceptional scratch resistance for the highest demands — floors are ready for full use after 12 hours.">
        <div className="grid gap-5 sm:grid-cols-2"><Chips label="Available sheens (US)" items={["Satin", "Semi-Gloss", "Gloss"]} /><Chips label="Recommended for" items={["Commercial Traffic", "Extreme Wear"]} /></div>
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-grey">LOBA Stress Level</p>
          <div className="flex items-center gap-4"><div className="grid flex-1 grid-cols-10 gap-1">{Array.from({ length: 10 }).map((_, i) => <span key={i} className="h-3 rounded-sm bg-gold" />)}</div><span className="text-2xl font-extrabold text-navy">10<small className="text-sm text-grey">/10</small></span></div>
          <div className="mr-16 mt-1 flex justify-between text-[10px] uppercase tracking-wider text-grey"><span>Residential</span><span>Commercial</span><span>Extreme</span></div>
        </div>
      </Card>

      <SectionLabel>Bona · Finish</SectionLabel>
      <Card img={megaone} brand="Bona" name="Bona Mega ONE®" pill="1K · One-Component" desc="A crystal-clear, fast-drying finish with high build for superior protection. Easy to apply and fully cured in five days.">
        <div className="grid gap-5 sm:grid-cols-2"><Chips label="Available sheens (US)" items={["Extra Matte", "Satin", "Semi-Gloss"]} /><Chips label="Recommended for" items={["Active Households", "Light Commercial"]} /></div>
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-grey">Bona Traffic Classification</p>
          <p className="flex items-center gap-2 font-bold text-navy"><span className="h-2.5 w-2.5 rounded-full bg-gold" />Heavy-Traffic Residential</p>
          <p className="mt-1 text-xs text-grey">Kitchens, entryways, family rooms, homes with pets and children; also commercial.</p>
        </div>
      </Card>

      <SectionLabel>Bona · Sealer</SectionLabel>
      <Card img={amberseal} brand="Bona" name="Bona AmberSeal®" pill="Sealer · Warm Amber" desc="Gives a warm, rich, oil-modified undertone with the benefits of a waterborne system — and it won't yellow or darken with age.">
        <div className="grid gap-5 sm:grid-cols-2"><Chips label="Visual effect" items={["Warm / Golden Amber"]} /><Chips label="Best for" items={["Traditional interiors", "Oiled look"]} /></div>
        <div className="flex items-center gap-4"><img src={amberSwatch} alt="Bona AmberSeal appearance sample" loading="lazy" className="h-20 w-20 rounded-md object-cover" /><p className="text-xs italic text-grey">Final appearance varies by wood species, preparation, and application. On-floor samples should be approved before finishing.</p></div>
      </Card>

      <div className="mt-14 rounded-xl bg-navy p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Not sure which finish fits your home?</h2>
        <p className="mt-2 text-white/80">We'll recommend the right system for your traffic, look and budget.</p>
        <a href="/get-started" className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 font-bold text-navy">Get My Estimate <ArrowRight className="h-4 w-4" /></a>
      </div>
    </section>
  </BlogShell>;
}

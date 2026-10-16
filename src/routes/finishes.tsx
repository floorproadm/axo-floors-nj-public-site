import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BlogShell } from "@/components/blog/BlogChrome";
import { PUBLIC_SITE_URL } from "@/lib/constants";
import { CATALOG, type Product } from "@/lib/finishesCatalog";

const TITLE = "Hardwood Floor Finishes, Sealers & Additives | AXO Floors NJ";
const DESC = "Compare the professional LOBA and Bona water-based finishes, sealers and additives AXO Floors applies on hardwood floors in New Jersey.";
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
  return <div className="mb-6 flex items-center gap-4"><span className="h-9 w-1.5 shrink-0 rounded-full bg-gold" /><p className="text-lg font-extrabold uppercase tracking-[0.2em] text-navy md:text-xl">{children}</p><span className="h-px flex-1 bg-gold/50" /></div>;
}

function Stress({ level }: { level: number }) {
  return <div>
    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-grey">LOBA Stress Level</p>
    <div className="flex items-center gap-4"><div className="grid flex-1 grid-cols-10 gap-1">{Array.from({ length: 10 }).map((_, i) => <span key={i} className={`h-3 rounded-sm ${i < level ? "bg-gold" : "bg-border"}`} />)}</div><span className="text-2xl font-extrabold text-navy">{level}<small className="text-sm text-grey">/10</small></span></div>
    <div className="mr-16 mt-1 flex justify-between text-[10px] uppercase tracking-wider text-grey"><span>Residential</span><span>Commercial</span><span>Extreme</span></div>
  </div>;
}

function ProductCard({ p }: { p: Product }) {
  return <Card img={p.img} brand={p.brand} name={p.name} pill={p.pill} desc={p.desc}>
    <div className="grid gap-5 sm:grid-cols-2">{p.chips.map((c) => <Chips key={c.label} label={c.label} items={c.items} />)}</div>
    {p.stress != null && <Stress level={p.stress} />}
    {p.traffic && <div>
      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-grey">Bona Traffic Classification</p>
      <p className="flex items-center gap-2 font-bold text-navy"><span className="h-2.5 w-2.5 rounded-full bg-gold" />{p.traffic.label}</p>
      {p.traffic.detail && <p className="mt-1 text-xs text-grey">{p.traffic.detail}</p>}
    </div>}
    {p.note && <p className="text-xs italic text-grey">{p.note}</p>}
    {p.swatch && <div className="flex items-center gap-4"><img src={p.swatch} alt={`${p.name} appearance sample`} loading="lazy" className="h-20 w-20 rounded-md object-cover" /><p className="text-xs italic text-grey">Final appearance varies by wood species, preparation, and application. On-floor samples should be approved before finishing.</p></div>}
  </Card>;
}

function CategoryHeading({ num, title }: { num: string; title: string }) {
  return <h2 className="flex items-baseline gap-3 text-xl font-bold uppercase tracking-[0.12em] text-navy md:text-2xl"><span className="text-gold">{num}</span>{title}</h2>;
}

function FinishesPage() {
  return <BlogShell>
    <section className="bg-navy text-white"><div className="container mx-auto px-4 py-10 md:py-14">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-gold">Hardwood Finishing Guide</p>
      <h1 className="text-3xl font-bold md:text-5xl">Finishes, Sealers & Additives</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-white/80 md:text-lg">A complete guide to the professional LOBA and Bona water-based products AXO Floors selects and applies on hardwood floors.</p>
      <div className="mt-6 h-1 w-16 bg-gold" />
    </div></section>

    <section className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
      {CATALOG.map((cat) => <div key={cat.num} id={cat.id} className="mt-16 scroll-mt-28 first:mt-0">
        <CategoryHeading num={cat.num} title={cat.title} />
        {cat.brands.map((b) => <div key={b.brand} className="mt-8">
          <SectionLabel>{b.brand}</SectionLabel>
          <div className="space-y-6">{b.products.map((p) => <ProductCard key={p.name} p={p} />)}</div>
        </div>)}
      </div>)}

      <div className="mt-14 rounded-xl bg-navy p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Not sure which finish fits your home?</h2>
        <p className="mt-2 text-white/80">We'll recommend the right system for your traffic, look and budget.</p>
        <a href="/get-started" className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 font-bold text-navy">Get My Estimate <ArrowRight className="h-4 w-4" /></a>
      </div>
    </section>
  </BlogShell>;
}

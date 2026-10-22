import { Link } from "react-router-dom";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Check, Dumbbell, Grid3x3, Layers, Leaf, MessageSquare, Phone, ShieldCheck } from "lucide-react";
import hero from "@/assets/installation-hero-materials.jpg.asset.json";
import whyCrewPhoto from "@/assets/why-axo-crew-install.jpg.asset.json";
import straightLayPhoto from "@/assets/straight-lay-floor-hq.jpg.asset.json";
import chevronPhoto from "@/assets/chevron-floor-hq.jpg.asset.json";
import herringbonePhoto from "@/assets/herringbone-floor-hq.jpg.asset.json";
import { CarpetTile, FloorPattern, RubberFlooring, VinylPlank, WoodConstruction, type FloorLayout } from "@/features/installation-preview/WoodIllustrations";

const container = "mx-auto max-w-6xl px-5 md:px-10";
const heading = "preview-heading mt-4 font-heading text-3xl font-bold leading-tight md:text-4xl";
const primary = "preview-button bg-gold px-6 py-3 font-heading font-bold text-navy hover:bg-gold/90";
const outline = "preview-button border-primary-foreground/50 bg-transparent px-6 py-3 font-heading font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground";
const finalPrimary = "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 font-heading text-sm font-bold text-navy transition hover:bg-gold-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 motion-reduce:transition-none";
const finalGhost = "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary-foreground/40 px-6 py-3 font-heading text-sm font-semibold text-primary-foreground transition hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold motion-reduce:transition-none";
function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`font-heading text-xs font-semibold uppercase ${light ? "text-gold" : "text-muted-foreground"}`}><span aria-hidden="true" className="mr-3 inline-block h-px w-7 align-middle bg-gold" />{children}</p>;
}
function EstimateButton({ children = "Get My Free Estimate" }: { children?: React.ReactNode }) {
  return <Button asChild className={primary}><Link to="/get-started">{children}<ArrowRight aria-hidden="true" /></Link></Button>;
}
const layouts: FloorLayout[] = ["Straight Lay", "Herringbone", "Chevron", "Diagonal Lay"];
const layoutPhotos: Partial<Record<FloorLayout, { src: string; alt: string }>> = {
  "Straight Lay": { src: straightLayPhoto.url, alt: "Freshly finished hardwood floor laid in a straight lay pattern with staggered plank joints" },
  "Herringbone": { src: herringbonePhoto.url, alt: "Hardwood floor laid in a herringbone pattern, with staggered planks forming interlocking zigzag columns" },
  "Chevron": { src: chevronPhoto.url, alt: "Hardwood floor laid in a chevron pattern, with angled planks meeting in straight V seams" },
};
const steps = [
  ["Consultation", "We learn about your project and goals."],
  ["Material Selection", "We help you choose the right floor."],
  ["Site Preparation", "We check and prepare the work area and subfloor."],
  ["Professional Installation", "We install the flooring with careful alignment and transitions."],
  ["Finish & Details", "We complete the finishing details included in your project."],
  ["Final Walkthrough", "We review the finished work and discuss floor care."],
];
const faqs = [
  ["Solid or engineered hardwood?", "Both use real wood. The right choice depends on your subfloor, room conditions, and finish preferences."],
  ["Can you remove existing flooring?", "Yes, when removal is included in the estimate. We review the existing floor and any preparation needed before work begins."],
  ["Do you install prefinished and unfinished wood?", "Yes. Prefinished flooring has its finish applied at the factory. Unfinished wood can be sanded, stained, and finished after installation."],
  ["How long does installation take?", "It depends on the area, selected material, site preparation, and finishing requirements. We provide an expected schedule with your project plan."],
];

type Material = { kind: "solid" | "engineered" | "vinyl" | "carpet" | "rubber"; title: string; text: string; href?: string };
const materials: Material[] = [
  { kind: "solid", title: "Solid Hardwood", text: "Classic, natural, and timeless." },
  { kind: "engineered", title: "Engineered Hardwood", text: "Real wood with added versatility." },
  { kind: "vinyl", title: "Luxury Vinyl Plank", text: "A durable, stylish alternative.", href: "/vinyl-plank-flooring" },
  { kind: "carpet", title: "Carpet Tile", text: "Modular tiles for flexible, easy-to-update spaces." },
  { kind: "rubber", title: "Rubber Flooring", text: "A resilient surface for gyms, playrooms, and utility areas." },
];

export default function Installation() {
  return <div className="installation-preview min-h-screen bg-background font-body text-navy">
    <Header />
    <main>
      <section className="relative isolate overflow-hidden bg-navy-dark text-primary-foreground">
        <img src={hero.url} alt="Bundles of unfinished oak planks with a digital moisture meter and humidity probe resting on top" fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-dark/70 md:bg-gradient-to-r md:from-navy-dark/90 md:via-navy-dark/70 md:to-navy-dark/40" />
        <div className={`${container} pb-14 pt-16 md:pb-20 md:pt-24`}>
          <div className="max-w-2xl">
            <Eyebrow light>FLOOR INSTALLATION IN NEW JERSEY</Eyebrow>
            <h1 className="preview-heading mt-5 font-heading text-4xl font-bold leading-[1.12] md:text-6xl">Beautiful Floors <span className="text-gold">Start Here.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">From classic hardwood to custom layouts, we install floors with precision, care, and respect for your home.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><EstimateButton /><Button asChild variant="outline" className={outline}><Link to="/gallery">See Our Work</Link></Button></div>
            <p className="mt-7 text-center text-xs leading-relaxed text-primary-foreground/90 sm:text-left">Solid Hardwood • Engineered Hardwood • Custom Layouts</p>
          </div>
        </div>
      </section>

      <section className="pb-8 pt-16 md:py-24">
        <div className={`${container} grid items-center gap-10 md:grid-cols-2 md:gap-16`}>
          <div><Eyebrow>Hardwood Installation</Eyebrow><h2 className={heading}>The Right Installation Makes the Difference.</h2><p className="mt-5 leading-relaxed text-muted-foreground">A beautiful floor starts long before the final board is in place. We help you choose the right material, prepare the space properly, and install with attention to every detail.</p></div>
          <div>
            <ul className="space-y-3">
              {[[Leaf, "Solid Hardwood", "Natural beauty and lasting value."], [Layers, "Engineered Hardwood", "Real wood with added versatility."], [ShieldCheck, "Luxury Vinyl Plank", "A durable, stylish alternative."], [Grid3x3, "Carpet Tile", "Modular tiles for flexible, easy-to-update spaces."], [Dumbbell, "Rubber Flooring", "A resilient surface for gyms, playrooms, and utility areas."]].map(([Icon, title, text]) => {
                const I = Icon as typeof Leaf;
                return <li key={title as string} className="flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-5"><I aria-hidden="true" className="h-6 w-6 shrink-0 text-gold-warm" /><div><h3 className="font-heading text-base font-bold">{title === "Luxury Vinyl Plank" ? <Link to="/vinyl-plank-flooring">{title as string}</Link> : title as string}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text as string}</p></div></li>;
              })}
            </ul>
            <div className="mt-6 flex justify-center md:justify-start"><EstimateButton>Let's Plan Your Project</EstimateButton></div>
          </div>
        </div>
      </section>

      <section aria-labelledby="style-heading" className="bg-secondary pb-8 pt-10 md:pb-10 md:pt-24">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="max-w-2xl"><Eyebrow>Choose Your Style</Eyebrow><h2 id="style-heading" className={heading}>See the Difference.</h2><p className="mt-5 leading-relaxed text-muted-foreground">From timeless straight lay to eye-catching patterns, we create a look that fits your home.</p></div>
          <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:mx-auto md:grid md:max-w-4xl md:grid-cols-2 md:gap-6" tabIndex={0} aria-label="Floor layout illustrations">
            {layouts.map(layout => <figure key={layout} className="relative w-[86%] shrink-0 snap-center overflow-hidden rounded-xl border border-border bg-card shadow-elegant md:w-auto"><div className="aspect-[4/5] overflow-hidden">{layoutPhotos[layout] ? <img src={layoutPhotos[layout]!.src} alt={layoutPhotos[layout]!.alt} loading="lazy" className="h-full w-full object-cover" /> : <FloorPattern layout={layout} />}</div><div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-dark/30 to-transparent" /><figcaption className="absolute inset-x-0 bottom-0 flex justify-center pb-4"><h3 className="rounded-full bg-gold px-4 py-2 font-heading text-sm font-bold text-navy shadow-md">{layout}</h3></figcaption></figure>)}
          </div>
        </div>
      </section>

      <section aria-labelledby="types-heading" className="pb-16 pt-10 md:pb-24 md:pt-12">
        <div className={container}>
          <div className="text-center"><Eyebrow>MATERIAL TYPES</Eyebrow><h2 id="types-heading" className={heading}>Pick the Right Fit.</h2><p className="mt-4 leading-relaxed text-muted-foreground">Choose the material that matches your space, style, and needs.</p></div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl px-5 md:px-10 lg:px-4">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 sm:gap-6 lg:grid lg:grid-cols-5 lg:gap-3 xl:gap-4" tabIndex={0} aria-label="Flooring materials">
            {materials.map(material => <figure key={material.title} className="w-[78%] shrink-0 snap-center overflow-hidden rounded-lg border border-border bg-card lg:w-auto"><div className="wood-stage aspect-[1.4] sm:aspect-[1.8]">{material.kind === "vinyl" ? <VinylPlank /> : material.kind === "carpet" ? <CarpetTile /> : material.kind === "rubber" ? <RubberFlooring /> : <WoodConstruction engineered={material.kind === "engineered"} />}</div><figcaption className="border-t border-border p-4 sm:p-6 lg:p-3 xl:p-4"><h3 className="font-heading text-base font-bold sm:text-xl lg:text-sm xl:text-base">{material.href ? <Link to={material.href}>{material.title}</Link> : material.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{material.text}</p></figcaption></figure>)}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">Illustrations of flooring materials.</p>
        </div>
        <div className={container}>
          <div className="mx-auto mt-10 max-w-3xl border-y border-border py-7 text-center">
            <h3 className="font-heading text-lg font-bold">Popular Wood Species</h3><p className="mt-1 text-sm text-muted-foreground">Popular species to explore</p>
            <ul className="mx-auto mt-6 grid max-w-xl grid-cols-4 gap-2">
              {[["Red Oak", ""], ["White Oak", "species-white-oak"], ["Maple", "species-maple"], ["Hickory", "species-hickory"]].map(([name, tone]) => <li key={name}><span aria-hidden="true" className={`species-swatch ${tone} mx-auto block h-12 w-12 rounded-full sm:h-16 sm:w-16`} /><span className="mt-3 block font-heading text-xs font-semibold sm:text-sm">{name}</span></li>)}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Wood tones shown for illustration; species and finish vary.</p>
          </div>
          <div className="mx-auto mt-7 max-w-3xl text-center"><h3 className="font-heading text-base font-bold">Prefinished or Site-Finished?</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Factory-finished boards or a custom finish applied on-site. We'll help you compare.</p></div>
        </div>
      </section>

      <section className="bg-navy py-16 text-primary-foreground md:py-24">
        <div className={container}><Eyebrow light>How We Work</Eyebrow><h2 className={heading}>A Clear Installation Process.</h2>
          <ol className="mt-10 grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">{steps.map(([title, text], i) => <li key={title} className="flex gap-5 border-t border-primary-foreground/20 py-7"><span className="font-heading text-3xl font-bold text-gold">{String(i + 1).padStart(2, "0")}</span><div><h3 className="font-heading text-base font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">{text}</p></div></li>)}</ol>
          <p className="mt-6 border-l-2 border-gold pl-4 text-xs leading-relaxed text-primary-foreground/75">Removal, repairs, and furniture moving are included only when separately specified in your estimate.</p>
        </div>
      </section>

      <section className="pb-8 pt-16 md:pb-12 md:pt-24"><div className={`${container} grid items-center gap-10 md:grid-cols-2 md:gap-16`}>
        <figure className="overflow-hidden rounded-lg"><img src={whyCrewPhoto.url} alt="AXO Floors crew member installing wood-look flooring planks in a home" loading="lazy" className="aspect-[4/3] w-full object-cover object-bottom" /></figure>
        <div><Eyebrow>Why AXO Floors</Eyebrow><h2 className={heading}>Your Home Deserves Respect.</h2><p className="mt-5 leading-relaxed text-muted-foreground">Good work starts with listening. It continues with careful preparation and attention to every detail.</p><ul className="mt-7 divide-y divide-border">{[[Check, "Professional craftsmanship"], [MessageSquare, "Clear communication"], [ShieldCheck, "Respect for your home"]].map(([Icon, title]) => { const I = Icon as typeof Check; return <li key={title as string} className="flex items-center gap-3 py-4 font-heading text-sm font-semibold"><I aria-hidden="true" className="h-5 w-5 text-gold-warm" />{title as string}</li>; })}</ul></div>
      </div></section>

      <section className="bg-secondary pb-16 pt-8 md:pb-24 md:pt-12"><div className={`${container} max-w-3xl`}><div className="text-center"><Eyebrow>Good Questions. Clear Answers.</Eyebrow><h2 className={heading}>Before We Begin.</h2></div><Accordion type="single" collapsible className="mt-8 border-t border-border">{faqs.map(([q, a], i) => <AccordionItem key={q} value={`installation-${i}`}><AccordionTrigger className="text-left font-heading text-base font-semibold">{q}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{a}</AccordionContent></AccordionItem>)}</Accordion></div></section>

      <section className="bg-navy-dark py-16 text-center text-primary-foreground md:py-24"><div className="mx-auto max-w-2xl px-5"><p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold"><span aria-hidden="true" className="mr-3 inline-block h-px w-8 align-middle bg-gold" />Let's Get Started</p><h2 className="mt-5 font-heading text-3xl font-bold leading-tight md:text-5xl">Ready to Upgrade <span className="text-gold">Your Floors?</span></h2><p className="mt-6 leading-relaxed text-primary-foreground/80">Tell us about your project. We'll help you understand your options and plan the next step.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/get-started" className={finalPrimary}>Get My Free Estimate <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link><a href="tel:+17323518653" className={finalGhost}><Phone className="h-4 w-4" aria-hidden="true" /> Call (732) 351-8653</a></div></div></section>
    </main>
    <Footer />
  </div>;
}
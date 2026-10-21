import { Link } from "react-router-dom";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Check, Droplets, Layers, Palette, Phone, ScanLine, ShieldCheck, Sparkles, SunMedium } from "lucide-react";
import heroImg from "@/assets/sanding-hero.jpg";
import crewImg from "@/assets/service-sanding-crew-cropped.jpg";
import stainImg from "@/assets/stain-process-work.jpg";
import beforeAfter from "@/assets/before-after-kitchen-refinish.png.asset.json";

const Eyebrow = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <p className={`font-heading text-xs font-semibold uppercase tracking-[0.22em] ${light ? "text-gold" : "text-gold-warm"}`}>
    <span aria-hidden className="mr-3 inline-block h-px w-8 align-middle bg-gold" />
    {children}
  </p>
);

const primaryBtn =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 font-heading text-sm font-bold text-navy transition hover:bg-gold-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 motion-reduce:transition-none";
const ghostLight =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary-foreground/40 px-6 py-3 font-heading text-sm font-semibold text-primary-foreground transition hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold motion-reduce:transition-none";
const textLink =
  "inline-flex items-center gap-2 font-heading text-sm font-bold text-navy underline decoration-gold decoration-2 underline-offset-8 hover:text-gold-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

const steps = [
  ["Jobsite Protection", "We protect nearby surfaces and prepare the work area with professional dust-control measures."],
  ["Rough Sanding", "We remove the old finish and surface wear to prepare the wood."],
  ["Edging & Detail Work", "We carefully sand edges, corners, and hard-to-reach areas."],
  ["Surface Refinement", "When suitable, we use advanced equipment such as the Lägler TRIO or Bona Power Drive to refine the surface."],
  ["Final Preparation", "We complete detailed sanding and clean the floor before finishing."],
  ["Stain or Natural Finish", "We help you select a natural look or approve stain samples on the floor."],
  ["Professional Finish", "We apply the selected finish system using the appropriate preparation and drying procedures."],
  ["Final Inspection", "We inspect the result and explain the recommended care and curing precautions."],
];

const faqs = [
  ["Can my hardwood floors be refinished?", "Many hardwood floors can be refinished, but it depends on the type, thickness, and condition of the wood. We inspect your floors and explain your options."],
  ["How much does refinishing cost?", "Pricing depends on the floor area, condition, preparation, and finish system. We provide a written estimate based on your project."],
  ["How long does the process take?", "The timeline depends on the project size, stain selection, and finish products. We explain the expected schedule before work begins."],
  ["Is the sanding process dust-free?", "No sanding process is completely dust-free. We use professional dust-collection equipment and work-area protection to reduce dust."],
  ["Can I stay in my home during refinishing?", "Sometimes. It depends on the work area, home layout, and products used. We'll discuss access and precautions before starting."],
  ["Can I change my floor color?", "In many cases, yes. We can review natural and stain options, including samples on your floor when appropriate."],
  ["What's the difference between Standard and Premium?", "Both include professional sanding. Premium adds advanced surface refinement where suitable and a selected high-performance finishing system."],
  ["When can I walk on my floors again?", "It depends on the finish and curing conditions. We provide care instructions for foot traffic, furniture, and rugs."],
  ["Will refinishing remove all damage?", "Refinishing removes many surface marks. Deep stains, dents, or damaged boards may need additional repairs."],
];

const plans = [
  {
    name: "Standard Finish",
    tag: "Timeless. Durable. Beautiful.",
    text: "A practical refinishing option for everyday residential use.",
    items: ["Professional sanding and preparation", "Edge and corner detailing", "Natural wood or custom stain", "Professional water-based finish", "Final inspection"],
    close: "Beautiful hardwood, professionally restored.",
    dark: false,
  },
  {
    name: "Premium Finish",
    tag: "Enhanced Protection. A Refined Result.",
    text: "Advanced surface preparation paired with a high-performance finishing system.",
    items: ["Everything in Standard preparation", "Advanced surface refinement where suitable", "Natural wood or custom stain", "Selected two-component finish system", "Premium final finish protection", "Final inspection"],
    close: "A refined finish designed for active homes.",
    dark: true,
  },
];

export default function RefinishV2() {
  return (
    <div className="min-h-screen bg-background font-body text-navy">
      <Header />
      <main>
        {/* 01 HERO */}
        <section className="relative isolate overflow-hidden bg-navy-dark text-primary-foreground">
          <img src={heroImg} alt="AXO Floors crew sanding a hardwood floor" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-dark via-navy-dark/85 to-navy-dark/30" />
          <div className="mx-auto max-w-7xl px-5 pb-20 pt-20 md:px-10 md:pb-28 md:pt-28">
            <div className="max-w-2xl">
              <h1 className="font-heading text-4xl font-bold leading-[1.08] md:text-6xl">
                Bring Your Hardwood Floors <span className="text-gold">Back to Life.</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-primary-foreground/90">
                Scratches, worn finish, or an outdated color? Your hardwood floors may not need to be replaced.
              </p>
              <p className="mt-3 text-base leading-relaxed text-primary-foreground/75">
                We restore existing hardwood with professional sanding, dust-control measures, and carefully selected finishes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/get-started" className={primaryBtn}>Get My Free Estimate <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                <Link to="/gallery" className={ghostLight}>See Our Work</Link>
              </div>
              <p className="mt-8 font-heading text-xs uppercase tracking-[0.18em] text-primary-foreground/70">
                Expert Sanding <span className="text-gold">•</span> Custom Stains <span className="text-gold">•</span> Quality Finishes
              </p>
            </div>
          </div>
        </section>

        {/* 02 IS REFINISHING RIGHT */}
        <section className="bg-background py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:px-10">
            <div className="md:col-span-5">
              <Eyebrow>Restore What You Already Have</Eyebrow>
              <h2 className="mt-5 font-heading text-3xl font-bold leading-tight md:text-4xl">Worn Floors Don't Always Need Replacing.</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">Scratches, dull spots, and worn finish can make good hardwood look old.</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">Professional refinishing can restore its appearance without replacing the boards.</p>
            </div>
            <div className="md:col-span-7">
              <ul className="grid gap-4 sm:grid-cols-3">
                {[
                  [ScanLine, "Surface Scratches & Wear", "Remove worn finish and many surface marks."],
                  [Palette, "Outdated Floor Color", "Explore a new stain or restore a natural wood look."],
                  [SunMedium, "Dull & Uneven Finish", "Renew the surface for a more consistent appearance."],
                ].map(([Icon, t, d]) => {
                  const I = Icon as typeof ScanLine;
                  return (
                    <li key={t as string} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                      <I className="h-6 w-6 text-gold-warm" aria-hidden />
                      <h3 className="mt-4 font-heading text-base font-bold">{t as string}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d as string}</p>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-8 leading-relaxed">Not every floor needs the same solution. We evaluate its condition and recommend the right approach.</p>
              <Link to="/get-started" className={`${textLink} mt-6`}>Find Out What Your Floors Need <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </section>

        {/* 03 BEFORE & AFTER */}
        <section className="bg-secondary py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-5 md:px-10">
            <Eyebrow>Real Work. Real Results.</Eyebrow>
            <h2 className="mt-5 font-heading text-3xl font-bold md:text-4xl">See the Difference.</h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">A professional refinish can change the look and feel of an entire room.</p>
            <p className="mt-3 leading-relaxed text-muted-foreground">Explore real AXO Floors projects, from worn hardwood to renewed surfaces and custom finishes.</p>
            <figure className="mt-8 overflow-hidden rounded-lg shadow-lg">
              <img src={beforeAfter.url} alt="Before and after of an AXO Floors kitchen hardwood refinishing project" loading="lazy" className="aspect-[16/10] w-full object-cover" />
            </figure>
            <div className="mt-8 flex justify-center sm:justify-start">
              <Link to="/gallery" className={primaryBtn}>Explore Our Projects <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">Results depend on the wood's condition, species, and selected finish.</p>
          </div>
        </section>

        {/* 04 PROCESS */}
        <section className="bg-navy py-20 text-primary-foreground md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="max-w-2xl">
              <Eyebrow light>How We Work</Eyebrow>
              <h2 className="mt-5 font-heading text-3xl font-bold md:text-4xl">The Refinishing Process.</h2>
              <p className="mt-3 font-heading text-lg text-gold">Where the Final Result Begins.</p>
              <p className="mt-6 leading-relaxed text-primary-foreground/80">A beautiful finish starts with proper preparation.</p>
              <p className="mt-2 leading-relaxed text-primary-foreground/80">Our process focuses on the details that make a difference.</p>
            </div>
            <ol className="mt-14 grid gap-px overflow-hidden rounded-lg bg-primary-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(([t, d], i) => (
                <li key={t} className="bg-navy p-6 md:p-8">
                  <span className="font-heading text-3xl font-bold text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-heading text-base font-bold">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">{d}</p>
                </li>
              ))}
            </ol>
            <p className="mt-12 text-center font-heading text-sm font-semibold uppercase tracking-[0.18em] text-gold">Precision in Every Step. Quality in Every Detail.</p>
          </div>
        </section>

        {/* 05 PROTECTION */}
        <section className="bg-background py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-10">
            <div className="order-2 md:order-1">
              <Eyebrow>Your Home Matters</Eyebrow>
              <h2 className="mt-5 font-heading text-3xl font-bold md:text-4xl">Your Home Deserves Respect.</h2>
              <div className="mt-6 space-y-3 leading-relaxed text-muted-foreground">
                <p>A flooring project should improve your home, not create unnecessary stress.</p>
                <p>We prepare the work area, protect nearby surfaces, and use professional dust-collection equipment.</p>
                <p>We also pay close attention to edges, corners, and finishing details.</p>
              </div>
              <p className="mt-6 flex gap-3 rounded-lg border-l-4 border-gold bg-secondary p-5 text-sm leading-relaxed">
                <ShieldCheck className="h-5 w-5 shrink-0 text-gold-warm" aria-hidden />
                No sanding process is completely dust-free, but careful preparation helps keep the work area clean and organized.
              </p>
              <p className="mt-8 font-heading text-sm font-semibold">Clean Work Areas. Careful Workmanship. Clear Communication.</p>
            </div>
            <figure className="order-1 overflow-hidden rounded-lg shadow-lg md:order-2">
              <img src={crewImg} alt="AXO Floors team sanding hardwood with professional equipment" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </figure>
          </div>
        </section>

        {/* 06 STANDARD VS PREMIUM */}
        <section className="bg-secondary py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5 md:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Two Ways to Finish Your Floors</Eyebrow>
              <h2 className="mt-5 font-heading text-3xl font-bold md:text-4xl">Same Craftsmanship. Two Finish Options.</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">Choose the finish system that fits your home, lifestyle, and expectations.</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {plans.map((p) => (
                <article key={p.name} className={`flex flex-col rounded-lg p-8 shadow-md md:p-10 ${p.dark ? "bg-navy-dark text-primary-foreground ring-2 ring-gold" : "bg-card"}`}>
                  <div className="flex items-center gap-3">
                    {p.dark ? <Sparkles className="h-5 w-5 text-gold" aria-hidden /> : <Layers className="h-5 w-5 text-gold-warm" aria-hidden />}
                    <h3 className="font-heading text-sm font-bold uppercase tracking-[0.2em]">{p.name}</h3>
                  </div>
                  <p className={`mt-5 font-heading text-xl font-bold ${p.dark ? "text-gold" : ""}`}>{p.tag}</p>
                  <p className={`mt-3 text-sm leading-relaxed ${p.dark ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{p.text}</p>
                  <ul className="mt-6 space-y-3">
                    {p.items.map((it) => (
                      <li key={it} className="flex gap-3 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-warm" aria-hidden />{it}</li>
                    ))}
                  </ul>
                  <p className={`mt-auto pt-8 font-heading text-sm italic ${p.dark ? "text-primary-foreground/90" : ""}`}>{p.close}</p>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center">
              <p className="font-heading text-lg font-bold">Not sure which option fits your floors?</p>
              <p className="mt-2 text-muted-foreground">We'll explain the differences and recommend a system based on your project.</p>
              <Link to="/get-started" className={`${primaryBtn} mt-6`}>Explore My Finish Options <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </section>

        {/* 07 COLOR & FINISH */}
        <section className="bg-background py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:px-10">
            <figure className="overflow-hidden rounded-lg shadow-lg md:col-span-5">
              <img src={stainImg} alt="Stain being applied to a sanded hardwood floor by AXO Floors" loading="lazy" className="h-full min-h-72 w-full object-cover" />
            </figure>
            <div className="md:col-span-7">
              <Eyebrow>Find Your Look</Eyebrow>
              <h2 className="mt-5 font-heading text-3xl font-bold md:text-4xl">The Right Finish Makes the Difference.</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">The color and sheen of your hardwood can change the feel of your entire home.</p>
              <ul className="mt-8 divide-y divide-border border-y border-border">
                {[
                  [Layers, "Natural Hardwood", "Bring out the wood's original color and grain."],
                  [Palette, "Custom Stain Colors", "Explore different tones and review on-floor samples when staining is selected."],
                  [Droplets, "Finish Sheen", "Choose from the sheen options available for your finishing system."],
                ].map(([Icon, t, d]) => {
                  const I = Icon as typeof Layers;
                  return (
                    <li key={t as string} className="flex gap-4 py-5">
                      <I className="mt-1 h-5 w-5 shrink-0 text-gold-warm" aria-hidden />
                      <div><h3 className="font-heading font-bold">{t as string}</h3><p className="mt-1 text-sm text-muted-foreground">{d as string}</p></div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 text-sm leading-relaxed">We work with professional products from LOBA and Bona to help you achieve the look you want.</p>
              <Link to="/stain-gallery" className={`${textLink} mt-6`}>Explore Colors & Finishes <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </section>

        {/* 08 FAQ */}
        <section className="bg-secondary py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-5 md:px-10">
            <div className="text-center">
              <Eyebrow>Good Questions. Clear Answers.</Eyebrow>
              <h2 className="mt-5 font-heading text-3xl font-bold md:text-4xl">What Homeowners Want to Know.</h2>
            </div>
            <Accordion type="single" collapsible className="mt-10 rounded-lg bg-card px-5 shadow-sm md:px-8">
              {faqs.map(([q, a], i) => (
                <AccordionItem key={q} value={`q${i}`}>
                  <AccordionTrigger className="text-left font-heading text-base font-semibold">{q}</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* 09 FINAL CTA */}
        <section className="bg-navy-dark py-20 text-center text-primary-foreground md:py-28">
          <div className="mx-auto max-w-2xl px-5">
            <Eyebrow light>Let's Get Started</Eyebrow>
            <h2 className="mt-5 font-heading text-3xl font-bold md:text-5xl">Your Floors Deserve a <span className="text-gold">Second Look.</span></h2>
            <div className="mt-6 space-y-2 leading-relaxed text-primary-foreground/80">
              <p>You don't need to know which sanding process, stain, or finish your floors need.</p>
              <p className="font-heading font-semibold text-primary-foreground">That's what we're here for.</p>
              <p>Tell us about your project. We'll help you understand your options and plan the next step.</p>
            </div>
            <p className="mt-6 font-heading text-sm italic text-primary-foreground/90">Professional craftsmanship. Clear communication. Respect for your home.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/get-started" className={primaryBtn}>Get My Free Estimate <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <a href="tel:+17323518653" className={ghostLight}><Phone className="h-4 w-4" aria-hidden /> Call (732) 351-8653</a>
            </div>
            <p className="mt-10 font-heading text-lg text-gold">Let's bring your hardwood floors back to life.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

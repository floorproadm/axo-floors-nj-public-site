import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Check, MessageSquare, Phone, ShieldCheck } from "lucide-react";
import foyer from "@/assets/axo-hardwood-foyer-staircase.jpg.asset.json";
import refinished from "@/assets/service-staircase-refinished.jpg.asset.json";
import stairRefinishing from "@/assets/stair-refinishing-job.jpg.asset.json";
import workmanship from "@/assets/stairs-railings.jpg.asset.json";
import treadsRisers from "@/assets/treads-risers-job.jpg.asset.json";
import handrailNewel from "@/assets/handrail-newel-job.jpg.asset.json";
import railingStyles from "@/assets/railing-styles-job.jpg.asset.json";

const container = "mx-auto max-w-6xl px-5 md:px-10";
const heading = "mt-4 font-heading text-3xl font-bold leading-tight md:text-4xl";
const primary = "h-auto min-h-12 whitespace-normal bg-gold px-6 py-3 font-heading font-bold text-navy hover:bg-gold/90";
const secondary = "h-auto min-h-12 whitespace-normal border-primary-foreground/50 bg-transparent px-6 py-3 font-heading font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground";
function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`font-heading text-xs font-semibold uppercase leading-relaxed ${light ? "text-gold" : "text-muted-foreground"}`}><span aria-hidden="true" className="mr-3 inline-block h-px w-7 bg-gold align-middle" />{children}</p>;
}
function EstimateButton({ children = "Get My Free Estimate" }: { children?: ReactNode }) {
  return <Button asChild className={primary}><Link to="/get-started">{children}<ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" /></Link></Button>;
}
const services = [
  { title: "Stair Refinishing", text: "Restore worn hardwood stairs with professional sanding, stain, and finish.", src: stairRefinishing.url, alt: "AXO Floors worker in a branded shirt refinishing a hardwood staircase with black iron balusters", position: "object-center" },
  { title: "Treads & Risers", text: "Replace worn or carpeted steps with beautiful hardwood.", src: treadsRisers.url, alt: "Hardwood staircase treads in a warm brown stain with white-painted risers, oak base rail and black iron balusters", position: "object-bottom" },
  { title: "Handrails & Newel Posts", text: "Refinish or upgrade the details that bring your staircase together.", src: handrailNewel.url, alt: "Turned wooden newel post with its cap and a wooden handrail section on a staircase with black iron balusters during a refinishing job", position: "object-center" },
  { title: "Wood & Iron Balusters", text: "Refresh your railing design with wood or iron options.", src: workmanship.url, alt: "AXO Floors craftsman working beside decorative iron staircase balusters", position: "object-center" },
];
const styles = [
  { title: "Natural Wood", text: "Highlight the natural color and grain of your hardwood.", src: foyer.url, alt: "Light natural wood staircase and matching entryway floor" },
  { title: "Custom Stain", text: "Explore colors that complement your existing floors.", src: refinished.url, alt: "Rich wood tones on a staircase and entryway floor" },
  { title: "Railing Styles", text: "Choose handrail and baluster details that complete the look.", src: railingStyles.url, alt: "Stained wood handrail with black iron balusters featuring twisted bars and a decorative basket ornament, mounted beside white wainscoting" },
];
const projects = [
  { src: foyer.url, alt: "Hardwood staircase with light wood treads, white risers and iron balusters" },
  { src: refinished.url, alt: "View from above of a finished wood staircase and coordinated entryway floor" },
  { src: workmanship.url, alt: "AXO Floors craftsman working on a wood staircase with iron railings" },
];
const steps = [
  ["Consultation", "We assess your staircase and discuss your goals."],
  ["Preparation", "We protect the work area and prepare for the approved work."],
  ["Professional Workmanship", "We refinish or install each component with care and precision."],
  ["Final Walkthrough", "We review the finished work and explain the recommended care."],
];
const faqs = [
  ["Can you refinish my existing stairs?", "Many hardwood stairs can be refinished. We inspect their condition and explain your options."],
  ["Can you match my stairs to my hardwood floors?", "We can review stain and finish options to create a coordinated look. Natural wood variations may remain."],
  ["Can you replace carpeted stairs with hardwood?", "Yes. We can remove existing carpet and install hardwood treads and risers when included in your project scope."],
  ["Do you install new handrails and balusters?", "Yes. We offer handrail, newel post, and baluster upgrades based on your staircase and project requirements."],
  ["How long does the project take?", "It depends on the number of steps, the work required, and the finishing system. We'll discuss the expected schedule before starting."],
];

export default function Stairs() {
  return <div className="stairs-page min-h-screen bg-background font-body text-foreground">
    <Header />
    <main>
      <section className="relative isolate overflow-hidden bg-navy-dark text-primary-foreground">
        <img src={foyer.url} alt="Light hardwood staircase with white risers and decorative iron railings" fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover object-[center_45%] md:object-[center_55%]" />
        <div aria-hidden="true" className="stairs-hero-shade absolute inset-0 -z-10" />
        <div className={`${container} py-14 md:py-20`}><div className="max-w-2xl">
          <h1 className="font-heading text-4xl font-bold leading-[1.12] md:text-6xl">Give Your Staircase <span className="text-gold">a Fresh Start.</span></h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">Worn steps, outdated railings, or a staircase that no longer matches your floors? From refinishing existing stairs to installing new treads and railings, we help create a look that fits your home.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><EstimateButton /><Button asChild variant="outline" className={secondary}><Link to="/gallery">See Our Work</Link></Button></div>
          <p className="mt-7 text-xs leading-relaxed text-primary-foreground/90">Stair Refinishing • Hardwood Treads • Handrails & Balusters</p>
        </div></div>
      </section>

      <section aria-labelledby="solutions-heading" className="py-14 md:py-20"><div className={container}>
        <Eyebrow>STAIRCASE SOLUTIONS</Eyebrow><h2 id="solutions-heading" className={heading}>What Would You Like to Change?</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{services.map(service => <figure key={service.title} className="overflow-hidden rounded-lg border border-border bg-card"><img src={service.src} alt={service.alt} loading="lazy" className={`aspect-[4/3] w-full object-cover ${service.position}`} /><figcaption className="p-5"><h3 className="font-heading text-lg font-bold">{service.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.text}</p></figcaption></figure>)}</div>
        <div className="mt-8 flex justify-center"><EstimateButton>Plan My Staircase Project</EstimateButton></div>
      </div></section>

      <section aria-labelledby="styles-heading" className="bg-secondary py-14 md:py-20"><div className={container}>
        <Eyebrow>MAKE IT YOURS</Eyebrow><h2 id="styles-heading" className={heading}>Find the Look That Fits Your Home.</h2>
        <div className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3" tabIndex={0} role="region" aria-label="Staircase styles">{styles.map(style => <figure key={style.title} className="w-[85%] shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-card md:w-auto"><img src={style.src} alt={style.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" /><figcaption className="p-5"><h3 className="font-heading text-lg font-bold">{style.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{style.text}</p></figcaption></figure>)}</div>
        <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground md:text-left">Available options depend on your staircase and project scope.</p>
      </div></section>

      <section aria-labelledby="projects-heading" className="py-14 md:py-20"><div className={container}>
        <div className="max-w-2xl"><Eyebrow>REAL WORK. REAL RESULTS.</Eyebrow><h2 id="projects-heading" className={heading}>See What's Possible.</h2><p className="mt-5 leading-relaxed text-muted-foreground">A staircase can change the look of an entire entryway. Explore real AXO Floors projects and discover what professional refinishing and thoughtful upgrades can achieve.</p></div>
        <div className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4" role="region" tabIndex={0} aria-label="AXO staircase project photos">{projects.map(photo => <figure key={photo.src} className="w-[85%] shrink-0 snap-start overflow-hidden rounded-lg md:w-[42%]"><img src={photo.src} alt={photo.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" /></figure>)}</div>
        <div className="mt-6 flex justify-center"><Button asChild className={primary}><Link to="/gallery">Explore Our Stair Projects<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></Button></div>
      </div></section>

      <section className="bg-navy py-14 text-primary-foreground md:py-20"><div className={container}>
        <Eyebrow light>HOW WE WORK</Eyebrow><h2 className={heading}>From Planning to the Final Detail.</h2>
        <ol className="mt-9 grid gap-x-12 md:grid-cols-2">{steps.map(([title, text], i) => <li key={title} className="flex gap-5 border-t border-primary-foreground/20 py-7"><span className="font-heading text-4xl font-bold text-gold">{String(i + 1).padStart(2, "0")}</span><div><h3 className="font-heading text-base font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">{text}</p></div></li>)}</ol>
        <p className="mt-5 border-l-2 border-gold pl-4 font-heading text-sm font-semibold">Careful Preparation. Quality Workmanship.</p>
      </div></section>

      <section className="py-14 md:py-20"><div className={`${container} grid items-center gap-9 md:grid-cols-2 md:gap-16`}>
        <figure className="overflow-hidden rounded-lg"><img src={workmanship.url} alt="AXO Floors craftsman working on a staircase with wood handrails and iron balusters" loading="lazy" className="aspect-[4/3] w-full object-cover" /></figure>
        <div><Eyebrow>CRAFTSMANSHIP WITH CARE</Eyebrow><h2 className={heading}>Your Home Is in Good Hands.</h2><p className="mt-5 leading-relaxed text-muted-foreground">Every staircase is different. We pay attention to the wood, the finish, and the details that connect everything.</p><ul className="mt-6 divide-y divide-border">{[[Check, "Professional craftsmanship"], [MessageSquare, "Clear communication"], [ShieldCheck, "Respect for your home"]].map(([Icon, text]) => { const I = Icon as typeof Check; return <li key={text as string} className="flex items-center gap-3 py-4 font-heading text-sm font-semibold"><I aria-hidden="true" className="h-5 w-5 shrink-0 text-gold-warm" />{text as string}</li>; })}</ul></div>
      </div></section>

      <section className="bg-secondary py-14 md:py-20"><div className="mx-auto max-w-3xl px-5 md:px-10">
        <div className="text-left md:text-center"><Eyebrow>BEFORE WE BEGIN</Eyebrow><h2 className={heading}>Good Questions. Clear Answers.</h2></div>
        <Accordion type="single" collapsible className="mt-8 border-t border-border">{faqs.map(([question, answer], i) => <AccordionItem key={question} value={`stairs-${i}`}><AccordionTrigger className="gap-4 text-left font-heading text-base font-semibold">{question}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion>
      </div></section>

      <section className="bg-navy-dark py-14 text-center text-primary-foreground md:py-20"><div className="mx-auto max-w-3xl px-5 md:px-10">
        <Eyebrow light>LET'S GET STARTED</Eyebrow><h2 className="mt-5 font-heading text-3xl font-bold leading-tight md:text-5xl">Let's Give Your Staircase <span className="text-gold">a New Look.</span></h2>
        <p className="mt-6 leading-relaxed text-primary-foreground/80">Whether you want to restore existing stairs or upgrade their design, we're here to help. Tell us what you have in mind. We'll help you plan the next step.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><EstimateButton /><Button asChild variant="outline" className={secondary}><a href="tel:+17323518653"><Phone aria-hidden="true" className="h-4 w-4" />Call (732) 351-8653</a></Button></div>
        <p className="mt-7 font-heading text-sm font-semibold text-primary-foreground/90">Beautiful floors deserve a staircase to match.</p>
      </div></section>
    </main>
    <Footer />
  </div>;
}

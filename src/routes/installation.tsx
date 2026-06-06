import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Layers, Wrench, Sparkles } from "lucide-react";
import { AXO_PHONE_DISPLAY, AXO_PHONE_TEL } from "@/lib/constants";

const HERO = "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=1920&q=80";

export const Route = createFileRoute("/installation")({
  head: () => ({
    meta: [
      { title: "Hardwood Floor Installation in NJ | AXO Floors" },
      { name: "description", content: "Solid & engineered hardwood installation across NJ, NY & PA. 10-year warranty. Licensed & insured." },
      { property: "og:title", content: "Hardwood Floor Installation in NJ | AXO Floors" },
      { property: "og:url", content: "/installation" },
    ],
    links: [{ rel: "canonical", href: "/installation" }],
  }),
  component: Installation,
});

const features = [
  { icon: Layers, title: "Solid & engineered", desc: "Oak, maple, walnut, or engineered — pick the right wood for your subfloor and lifestyle." },
  { icon: Wrench, title: "Master craftsmanship", desc: "Tight seams, level transitions, perfectly mitered borders. Detail you'll see up close." },
  { icon: Sparkles, title: "Bona or Loba finish", desc: "Premium waterborne finishes for clarity, durability, and low VOCs." },
];

function Installation() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero
          image={HERO}
          subtitle="Hardwood installation"
          title="New hardwood floors, installed once and right."
          description="From subfloor prep to the final coat of finish — we own every step. NJ, NY & PA."
          ctaPrimary="Get My Estimate"
          ctaSecondary={`Or call ${AXO_PHONE_DISPLAY}`}
          ctaSecondaryHref={AXO_PHONE_TEL}
          trustLine="500+ Homes • 10-Year Warranty • Licensed & Insured"
        />

        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title}>
                <CardContent className="p-6">
                  <f.icon className="h-8 w-8 text-[var(--gold-warm)]" />
                  <h3 className="font-heading font-bold text-lg mt-3">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-secondary">
          <div className="container mx-auto px-4 py-16 max-w-3xl">
            <h2 className="font-heading text-3xl font-bold">Frequently asked</h2>
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="cost">
                <AccordionTrigger>How much does hardwood installation cost?</AccordionTrigger>
                <AccordionContent>
                  Typically $9 – $15 per square foot installed, materials included for standard oak. Our minimum project is $3,500. Custom species, intricate patterns, and stairs are quoted separately.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="finish">
                <AccordionTrigger>What finish do you use?</AccordionTrigger>
                <AccordionContent>We standardize on Bona or Loba waterborne finishes — low odor, fast cure, and exceptional durability.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="timeline">
                <AccordionTrigger>How long does a project take?</AccordionTrigger>
                <AccordionContent>Most full-house installs run 3–5 working days, including acclimation, install, sanding, and finishing.</AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-8">
              <Button asChild size="lg" className="gold-gradient text-navy font-semibold">
                <Link to="/quiz">Start your estimate <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

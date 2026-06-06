import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Wind, Hammer, Sparkles, Check } from "lucide-react";
import { AXO_PHONE_DISPLAY, AXO_PHONE_TEL } from "@/lib/constants";

const HERO = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1920&q=80";

export const Route = createFileRoute("/refinishing")({
  head: () => ({
    meta: [
      { title: "Hardwood Floor Refinishing in NJ | AXO Floors" },
      { name: "description", content: "Dustless sanding + premium waterborne finishes. Restore tired hardwood for a fraction of replacement." },
      { property: "og:url", content: "/refinishing" },
    ],
    links: [{ rel: "canonical", href: "/refinishing" }],
  }),
  component: Refinishing,
});

const steps = [
  { icon: Wind, title: "Dustless sanding", desc: "Professional dust-containment equipment keeps your home clean." },
  { icon: Hammer, title: "Repairs & stain", desc: "Fill, level, and restain to the color you love — over 75 options." },
  { icon: Sparkles, title: "Bona or Loba", desc: "Premium waterborne finish for clarity, depth, and durability." },
];

function Refinishing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero
          image={HERO}
          subtitle="Sand & Refinish"
          title="Bring tired hardwood back to life."
          description="A dustless process and premium finishes for a fraction of replacement cost."
          ctaPrimary="Get My Estimate"
          ctaSecondary={`Or call ${AXO_PHONE_DISPLAY}`}
          ctaSecondaryHref={AXO_PHONE_TEL}
          trustLine="500+ Floors Restored • 10-Year Warranty • Dustless Process"
        />

        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <Card key={s.title}>
                <CardContent className="p-6">
                  <s.icon className="h-8 w-8 text-[var(--gold-warm)]" />
                  <h3 className="font-heading font-bold text-lg mt-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-secondary">
          <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h2 className="font-heading text-3xl font-bold">Refinish vs Replace — 1,000 sqft example</h2>
            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg">Refinish</h3>
                  <p className="text-3xl font-heading font-extrabold text-[var(--gold-warm)] mt-2">$3,500 – $6,000</p>
                  <ul className="mt-4 space-y-1 text-sm">
                    {["Keeps your original wood", "3–5 day turnaround", "No demolition", "Restain to any color"].map((x) => (
                      <li key={x} className="flex gap-2"><Check className="h-4 w-4 text-[var(--gold-warm)]" /> {x}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg">Replace</h3>
                  <p className="text-3xl font-heading font-extrabold mt-2">$9,000 – $15,000+</p>
                  <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                    {["Tear-out & disposal", "1–2 weeks", "Subfloor work likely", "Lose original character"].map((x) => (
                      <li key={x} className="flex gap-2">— {x}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Accordion type="single" collapsible className="mt-10">
              <AccordionItem value="cost">
                <AccordionTrigger>How much does refinishing cost?</AccordionTrigger>
                <AccordionContent>$3.50 – $6.00 per square foot depending on condition, color change, and finish. Minimum project: $1,800.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="dustless">
                <AccordionTrigger>Is it really dustless?</AccordionTrigger>
                <AccordionContent>We use HEPA-vacuumed sanders that capture 95%+ of dust at the source. You'll see why our clients love refinishing in occupied homes.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="live">
                <AccordionTrigger>Can we live in the home during the job?</AccordionTrigger>
                <AccordionContent>Often yes — we section off work areas. We'll walk you through the schedule on the estimate call.</AccordionContent>
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

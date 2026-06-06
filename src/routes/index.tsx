import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Award, Shield, Clock, CheckCircle, Phone } from "lucide-react";
import { AXO_PHONE_DISPLAY, AXO_PHONE_TEL } from "@/lib/constants";

const HERO_IMG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80";
const SANDING_IMG = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80";
const HARDWOOD_IMG = "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=800&q=80";
const VINYL_IMG = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80";
const STAIR_IMG = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AXO Floors NJ — Hardwood Installation & Refinishing" },
      { name: "description", content: "Expert hardwood flooring services in New Jersey. Free estimates. Call (732) 351-8653." },
      { property: "og:title", content: "AXO Floors NJ — Hardwood Installation & Refinishing" },
      { property: "og:description", content: "Father-and-son team. 500+ homes transformed. NJ, NY & PA." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const services = [
  { title: "Sanding & Refinish", desc: "Restore worn floors with a dustless process and a flawless new finish.", img: SANDING_IMG, to: "/refinishing" },
  { title: "Hardwood Installation", desc: "Solid and engineered hardwood, installed by craftsmen.", img: HARDWOOD_IMG, to: "/installation" },
  { title: "Vinyl Plank Flooring", desc: "Waterproof, durable, beautiful — perfect for busy homes.", img: VINYL_IMG, to: "/vinyl-plank-flooring" },
  { title: "Staircase Refinishing", desc: "Custom treads, risers, and stain-matched railings.", img: STAIR_IMG, to: "/staircase" },
] as const;

const testimonials = [
  { name: "Michelle Allen", loc: "Ocean County, NJ", text: "Outstanding experience overall! The workmanship was superb, we highly recommend AXO Floors to everyone!" },
  { name: "Richard Davis", loc: "Monmouth County, NJ", text: "We hired AXO Floors and they did amazing work. Professional from start to finish." },
  { name: "David Nakano", loc: "Middlesex County, NJ", text: "Professional and quality work! The floors came out better than we imagined." },
];

const trust = [
  { icon: Award, label: "10+ Years" },
  { icon: Shield, label: "Licensed & Insured" },
  { icon: Clock, label: "Same-Day Quotes" },
  { icon: CheckCircle, label: "500+ Homes" },
];

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero
          image={HERO_IMG}
          subtitle="A father-and-son team"
          title="Hardwood floors, restored & installed with craft."
          description="Over a decade of hands-on experience across NJ, NY, and PA. Real homes. Real results. No shortcuts."
          ctaPrimary="Get My Estimate"
          ctaPrimaryHref="/quiz"
          ctaSecondary={`Or Call ${AXO_PHONE_DISPLAY}`}
          ctaSecondaryHref={AXO_PHONE_TEL}
          showReviews
        />

        {/* Trust bar */}
        <section className="bg-secondary border-y border-border">
          <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {trust.map((t) => (
              <div key={t.label} className="flex items-center gap-3">
                <t.icon className="h-6 w-6 text-[var(--gold-warm)]" />
                <span className="text-sm font-semibold">{t.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-[var(--gold-warm)]">What we do</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-2">
              Floors that <span className="text-gradient-gold">last decades</span>, not seasons.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <Link key={s.to} to={s.to} className="group">
                <Card className="overflow-hidden h-full transition-smooth hover:shadow-elegant hover:-translate-y-1">
                  <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${s.img})` }} />
                  <CardContent className="p-5">
                    <h3 className="font-heading font-bold text-lg">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                    <div className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--gold-warm)] mt-3 group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="navy-gradient text-white">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--gold-accent)]">Reviews</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-2">What homeowners say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <Card key={t.name} className="bg-white/5 border-white/10 text-white backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[var(--gold-accent)] text-[var(--gold-accent)]" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed mt-3 text-white/90">"{t.text}"</p>
                    <div className="mt-4">
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-white/60">{t.loc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold max-w-2xl mx-auto">
            Get a real budget range in <span className="text-gradient-gold">60 seconds</span>.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            7 quick questions. No call required to start. NJ licensed & insured installers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            <Button asChild size="lg" className="gold-gradient text-navy font-semibold shadow-gold">
              <Link to="/quiz">Start Smart Estimate <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={AXO_PHONE_TEL}><Phone className="mr-2 h-4 w-4" /> Or call {AXO_PHONE_DISPLAY}</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

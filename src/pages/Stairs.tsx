import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
import SEOHead from "@/components/shared/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Hammer, Palette, Shield, Sparkles } from "lucide-react";
import stairsHero from "@/assets/service-staircase.jpg";
import stairsRefinished from "@/assets/service-staircase-refinished.jpg.asset.json";

const Stairs = () => {
  const services = [
    {
      icon: Hammer,
      title: "Treads & Risers",
      description: "New hardwood treads and risers installed over carpeted or worn stairs.",
    },
    {
      icon: Sparkles,
      title: "Stair Refinishing",
      description: "Sanding and refinishing to erase years of wear and scuffs.",
    },
    {
      icon: Shield,
      title: "Railings & Newel Posts",
      description: "Repair, replacement, or full upgrade of handrails and posts.",
    },
    {
      icon: Palette,
      title: "Balusters & Iron Spindles",
      description: "Swap dated wood spindles for modern iron or custom profiles.",
    },
  ];

  const benefits = [
    "Perfect stain match to your existing floors",
    "Dustless sanding system",
    "Carpet removal and disposal included",
    "Custom stain and finish options",
    "Safe, code-conscious railing work",
    "Most staircases completed in 2–4 days",
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Stairs & Railings | AXO Floors New Jersey"
        description="Staircase refinishing, hardwood treads, railings and baluster upgrades across New Jersey. Restore your staircase or transform it completely."
      />
      <Header />

      <Hero
        title="Stairs & Railings"
        subtitle="Restore Your Staircase — Or Transform It Completely"
        description="Treads, refinishing, railings and balusters. We rebuild and refinish staircases to match your floors perfectly."
        image={stairsHero}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-navy mb-6">
              Complete Staircase Services
            </h2>
            <p className="text-lg text-grey max-w-3xl mx-auto">
              From a simple refresh to a full staircase rebuild, every detail is finished to match your home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group transition-smooth hover:shadow-gold hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-gold/10 group-hover:bg-gold transition-bounce">
                    <service.icon className="w-6 h-6 text-gold group-hover:text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-navy group-hover:text-gold mb-2 transition-smooth">
                    {service.title}
                  </h3>
                  <p className="text-grey text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-grey-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-navy mb-6">
                Why Homeowners Choose <span className="text-gradient-gold">AXO for Stairs</span>
              </h2>
              <p className="text-lg text-grey mb-8 leading-relaxed">
                Stairs are the hardest-working surface in your home — and the first thing guests see. We treat them
                with the same precision we bring to your floors.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-grey">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button asChild className="gold-gradient hover:scale-105 transition-bounce">
                <Link to="/get-started" className="flex items-center gap-2">
                  Get My Estimate
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={stairsRefinished.url}
                alt="Refinished hardwood staircase with custom railing by AXO Floors"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-navy mb-6">
            Ready to Upgrade Your Staircase?
          </h2>
          <p className="text-lg text-grey mb-8 max-w-2xl mx-auto">
            Tell us about your stairs in under 2 minutes. We'll get back to you within 24 hours with the next step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="gold-gradient hover:scale-105 transition-bounce text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 h-auto min-h-[48px] text-black font-semibold">
              <Link to="/get-started" className="flex items-center gap-2">
                Get My Estimate
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 h-auto min-h-[48px] font-semibold">
              <a href="tel:(732) 351-8653">Call (732) 351-8653</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Stairs;

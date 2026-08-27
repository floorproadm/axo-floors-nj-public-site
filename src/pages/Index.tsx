// @ts-nocheck
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
import Portfolio from "@/components/shared/Portfolio";

import ReviewsSection from "@/components/shared/ReviewsSection";
import GoogleBusinessIntegration from "@/components/shared/GoogleBusinessIntegration";
import SEOHead from "@/components/shared/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle, Star, ArrowRight, Award, Users, Clock, Shield, Sparkles, BookOpen, Calculator, Palette, Wind, Zap, Home, Trophy, ClipboardList, FileText, Hammer, BadgeCheck } from "lucide-react";
import homeHero from "@/assets/home-hero.jpg";
import serviceSandingAsset from "@/assets/service-sanding-crew.jpg.asset.json";
import serviceInstallAsset from "@/assets/axo-vinyl-plank-install.jpg.asset.json";
import serviceStaircase from "@/assets/service-staircase.jpg";
import { useState, useEffect, useRef } from "react";
import LeadMagnetGate from "@/components/shared/LeadMagnetGate";
const Index = () => {
  const [activeServiceIndex, setActiveServiceIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    if (!isMobile) {
      setActiveServiceIndex(null);
      return;
    }
    const observers = serviceRefs.current.map((ref, index) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          setActiveServiceIndex(index);
        }
      }, {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      });
      observer.observe(ref);
      return observer;
    });
    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, [isMobile]);
  const services = [{
    title: "Sanding & Refinishing",
    description: "Bring worn hardwood back to life without replacing it.",
    href: "/sanding-and-refinish",
    features: ["Dustless sanding", "Custom stain options", "Professional finish"],
    cta: "Explore Refinishing",
    image: serviceSandingAsset.url,
    imagePosition: "object-[50%_30%]"
  }, {
    title: "Flooring Installation",
    description: "The right floor. Installed the right way.",
    href: "/hardwood-flooring",
    features: ["Hardwood Flooring", "Vinyl · Laminate", "Custom Patterns"],
    cta: "Explore Flooring",
    image: serviceInstallAsset.url,
    imagePosition: "object-[60%_50%]"
  }, {
    title: "Stairs & Railings",
    description: "Restore your staircase or transform it completely.",
    href: "/stairs",
    features: ["S&F or Refinish", "Treads & Risers", "Railings & Balusters"],
    cta: "Explore Stair Services",
    image: serviceStaircase
  }];
  const benefits = [{
    icon: Users,
    title: "Expert Craftsmen",
    description: "A father-and-son team with over a decade of hands-on experience.",
    stat: "10+ Years"
  }, {
    icon: Clock,
    title: "Quick Turnaround",
    description: "Most projects completed in 2–5 days — without compromising quality.",
    stat: "2–5 Days"
  }, {
    icon: Shield,
    title: "10-Year Warranty",
    description: "Backed by our written guarantee on workmanship and finish.",
    stat: "10 Years"
  }];
  const differentials = [{
    icon: Wind,
    title: "Dustless Process",
    description: "No mess, no cleanup nightmare."
  }, {
    icon: Zap,
    title: "Fast Turnaround",
    description: "Most projects completed in 2–5 days."
  }, {
    icon: Trophy,
    title: "Limited Weekly Projects",
    description: "We prioritize quality over volume."
  }];
  const processSteps = [{
    icon: ClipboardList,
    step: "01",
    title: "In-Home Assessment",
    description: "We visit your home, measure precisely, and listen to what you actually want."
  }, {
    icon: FileText,
    step: "02",
    title: "Custom Plan & Transparent Quote",
    description: "A clear scope and a fixed price. No surprises, no hidden fees."
  }, {
    icon: Hammer,
    step: "03",
    title: "Precision Execution",
    description: "Our craftsmen deliver the work on schedule, with daily updates."
  }, {
    icon: BadgeCheck,
    step: "04",
    title: "Final Walkthrough & Approval",
    description: "We don't leave until every detail meets your standard — and ours."
  }];
  const testimonials = [{
    name: "Michelle Allen",
    text: "Outstanding experience overall! The workmanship was superb, we highly recommend AXO Floors to everyone!",
    rating: 5,
    location: "Ocean County, NJ"
  }, {
    name: "Richard Davis",
    text: "We hired AXO Floors and they did amazing work! It was done fast, we had all the work completed. We would highly recommend to anyone! Thank you once again!",
    rating: 5,
    location: "Monmouth County, NJ"
  }, {
    name: "David Nakano",
    text: "Professional and quality work! They transformed our home and we couldn't be happier with the results.",
    rating: 5,
    location: "Middlesex County, NJ"
  }];
  return <div className="min-h-screen">
      <SEOHead title="AXO Floors NJ - #1 Hardwood Flooring Experts in New Jersey" description="Transform your home with AXO Floors NJ. Expert hardwood installation, refinishing & restoration. 4.9★ rating, licensed & insured. Free estimates - Call (732) 351-8653" keywords="hardwood flooring NJ, floor refinishing New Jersey, flooring installation Newark, wood floor restoration Jersey City, AXO Floors, professional flooring contractors" />
      <Header />
      
      {/* Hero Section */}
      <Hero
        title={"Beautiful Floors.\u00a0\nWithout the Dust, Delays, or Guesswork."}
        subtitle="Premium Flooring Solutions in New Jersey"
        description="Hardwood refinishing and flooring installation across New Jersey, completed with precision and a process built around your home."
        image={homeHero}
        ctaPrimary="Get My Estimate"
        ctaSecondary="See Our Work"
        ctaPrimaryHref="/quiz"
        ctaSecondaryHref="/gallery"
        trustLine="1000+ Homes Transformed • 15+ Years Hands-On Experience"
        showReviews={true}
      />




      {/* Services Section */}
      <section className="spacing-mobile-md bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-mobile-3xl font-bold font-heading mb-4 md:mb-6 [text-wrap:balance] px-2 leading-tight">
              What Does Your Home Need?
            </h2>
            <p className="text-mobile-base text-muted-foreground max-w-3xl mx-auto leading-relaxed [text-wrap:balance] px-2">
              Every service is delivered with the precision and care your home deserves.
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => <Card key={index} ref={el => serviceRefs.current[index] = el} className={`group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-4 hover:scale-[1.02] ${isMobile && activeServiceIndex === index ? 'shadow-2xl shadow-accent/20 -translate-y-4 scale-[1.02]' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent transition-opacity duration-500 ${isMobile && activeServiceIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                
                <CardContent className="relative p-6 text-center h-full flex flex-col">
                  <div className="relative mb-6 overflow-hidden rounded-xl aspect-[4/3]">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      width={512}
                      height={384}
                      className={`absolute inset-0 h-full w-full object-cover ${(service as any).imagePosition ?? 'object-center'} transition-all duration-500 ${isMobile && activeServiceIndex === index ? 'scale-110' : 'group-hover:scale-110'}`}
                    />
                  </div>
                  
                  <h3 className={`text-lg font-heading font-bold mb-3 transition-all duration-300 leading-tight ${isMobile && activeServiceIndex === index ? 'text-accent' : 'group-hover:text-accent'}`}>
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm flex-grow">
                    {service.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, i) => <div key={i} className="flex items-center gap-3 text-sm group/feature">
                        <div className="relative">
                          <CheckCircle className="w-4 h-4 text-accent relative z-10 group-hover/feature:scale-110 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-accent/20 rounded-full blur-sm opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300" />
                        </div>
                        <span className="font-medium text-foreground group-hover/feature:text-accent transition-colors duration-300">{feature}</span>
                      </div>)}
                  </div>
                  
                  <Button asChild variant="outline" className={`w-full transition-all duration-300 font-semibold relative overflow-hidden ${isMobile && activeServiceIndex === index ? 'bg-accent text-accent-foreground border-accent' : 'group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent'}`}>
                    <Link to={service.href} className="flex items-center justify-center gap-2 relative z-10">
                      <span className={`transition-transform duration-300 ${isMobile && activeServiceIndex === index ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>{(service as { cta?: string }).cta ?? "Learn More"}</span>
                      <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isMobile && activeServiceIndex === index ? 'translate-x-2' : 'group-hover:translate-x-2'}`} />
                      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ${isMobile && activeServiceIndex === index ? 'translate-x-[100%]' : 'translate-x-[-100%] group-hover:translate-x-[100%]'}`} />
                    </Link>
                  </Button>
                </CardContent>
              </Card>)}
          </div>


        </div>
      </section>




      {/* Portfolio Section (Section 5 — Proof) */}
      <Portfolio />

      {/* Authority Section */}
      <section className="spacing-mobile-md bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-mobile-3xl font-bold font-heading mb-6">
              Crafted by Experts Who <span className="text-gradient-gold">Treat Every Floor Like Their Own</span>
            </h2>
            <p className="text-mobile-base text-muted-foreground leading-relaxed mb-4">
              AXO Floors is led by a father-and-son team with over a decade of hands-on experience delivering premium flooring results across NJ, NY, and PA.
            </p>
            <p className="text-mobile-base text-foreground leading-relaxed">
              When you hire AXO, you're not hiring a crew — you're trusting craftsmen who take pride in every detail.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="spacing-mobile-md bg-secondary/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-mobile-3xl font-bold font-heading mb-4">
              Simple. Clear. <span className="text-gradient-gold">Done Right.</span>
            </h2>
            <p className="text-mobile-base text-muted-foreground max-w-2xl mx-auto">
              Four steps from first call to finished floor. No surprises along the way.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <Card key={index} className="relative border-0 shadow-elegant bg-card hover:shadow-gold transition-all duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl">
                      <step.icon className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-3xl font-bold font-heading text-accent/30">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-heading font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Magnets Section */}
      

      {/* Google Business Integration */}
      <GoogleBusinessIntegration />
      

      {/* Testimonials Section */}
      <section className="spacing-mobile-md navy-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 lg:mb-16">
            <div className="inline-flex items-center gap-1 mb-3 sm:mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-accent text-accent" />)}
            </div>
            <h2 className="text-mobile-3xl font-bold font-heading mb-4 sm:mb-6 px-2 [text-wrap:balance] leading-tight">
              Hear From Our <span className="block sm:inline text-accent">HAPPY CUSTOMERS</span>
            </h2>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-smooth">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                  </div>
                  <p className="text-white/90 mb-6 leading-relaxed text-lg">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="text-accent font-semibold text-lg">
                      {testimonial.name}
                    </p>
                    <p className="text-white/60 text-sm">
                      {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>



      {/* Project Wizard CTA */}
      <section className="spacing-mobile-md bg-gradient-subtle border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Personalized Estimate</span>
            </div>
            <h2 className="text-mobile-3xl font-bold font-heading mb-4">
              Ready to Transform Your Floors — <span className="text-gradient-gold">The Right Way?</span>
            </h2>
            <p className="text-mobile-base text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Tell us about your project in under 2 minutes.

We'll review it and get back to you within 24 hours with the next step.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button asChild size="lg" className="gold-gradient hover:scale-105 transition-bounce text-base sm:text-lg px-8 py-5 h-auto min-h-[52px] text-black font-semibold w-full sm:w-auto">
                <Link to="/quiz" className="flex items-center justify-center gap-2 text-black">
                  Get My Estimate
                  <ArrowRight className="w-5 h-5 text-black" />
                </Link>
              </Button>
              <a href="tel:(732) 351-8653" className="text-base sm:text-sm py-2 text-muted-foreground hover:text-accent transition-colors">
                Or Call <span className="font-semibold underline">(732) 351-8653</span>
              </a>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>;
};
export default Index;
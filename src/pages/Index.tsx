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
import { CheckCircle, Star, ArrowRight, ExternalLink, Award, Users, Clock, Shield, BookOpen, Calculator, Palette, Wind, Zap, Home, Trophy, ClipboardList, FileText, Hammer, BadgeCheck, MessageSquare } from "lucide-react";
import homeHero from "@/assets/home-hero.jpg";
import serviceSandingImg from "@/assets/service-sanding-crew-cropped.jpg";
import serviceInstallAsset from "@/assets/axo-vinyl-plank-install.jpg.asset.json";
import stairsRailingsImg from "@/assets/stairs-railings.jpg.asset.json";
import { useState, useEffect, useRef } from "react";
import { AXO_PHONE_TEL } from "@/lib/constants";
import LeadMagnetGate from "@/components/shared/LeadMagnetGate";
const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
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
    description: "Restore worn hardwood with professional sanding, dust-control measures, and carefully selected finishes.",
    href: "/refinishing",
    features: ["Dust-controlled sanding", "Custom stain options\n", "Premium finish"],
    cta: "Explore Refinishing",
    image: serviceSandingImg,
    imagePosition: "object-center"
  }, {
    title: "Flooring Installation",
    description: "From hardwood to luxury vinyl plank, we focus on proper preparation, precise installation, and clean finishing details.",
    href: "/hardwood-flooring",
    features: ["Solid, Engineered Hardwood and LVP", "Straight • Herringbone • Chevron", "Custom transitions & details"],
    cta: "Explore Flooring",
    image: serviceInstallAsset.url,
    imagePosition: "object-[60%_50%]"
  }, {
    title: "Stairs & Railings",
    description: "Restore existing stairs or update your staircase with new treads, handrails, and balusters.",
    href: "/stairs",
    features: ["S&F or Stair Refinish", "Treads & Risers", "Railings & Balusters"],
    cta: "Explore Stair Services",
    image: stairsRailingsImg.url,
    imagePosition: "object-[55%_45%]"
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
    title: "In-Home Consultation",
    description: "We listen to your goals, assess your floors, and discuss the right approach."
  }, {
    icon: FileText,
    step: "02",
    title: "Clear Scope & Estimate",
     description: "You receive a written estimate with the recommended process, project scope, and pricing clearly defined."
  }, {
    icon: Hammer,
    step: "03",
    title: "Precision Execution",
    description: "We protect the space, prepare every detail, and complete the work with care from start to finish."
  }, {
    icon: BadgeCheck,
    step: "04",
    title: "Final Walkthrough & Approval",
    description: "We don't leave until every detail meets your standard — and ours."
  }];
  const testimonials = [{
    name: "Becky Cordero",
    text: "This is the first time I use this company. I'm so happy with the results! They gave us exactly what we envisioned and asked for. Our staircase looks so beautiful and they brought our old tired floors back to life! They also work super neat and went beyond what they offered. We most definitely highly recommend! We feel as though we have a new house!",
    rating: 5,
    location: "Google review",
    href: "https://maps.app.goo.gl/nCpYcktkT9A73EcB6"
  }, {
    name: "Tim Hochrun",
    text: "Eduardo and his crew did an amazing job with our flooring project. They were prompt, professional and knowledgeable from start to finish. His prices are very fair and the quality of work is second to none. Will be using him again",
    rating: 5,
    location: "Google review",
    href: "https://maps.app.goo.gl/ETC2gjD6QyPuBqc18"
  }, {
    name: "Diana Bastidas",
    text: "Excellent work on my floors! He was punctual, professional, and did a fantastic job polishing them. They look brand new. Highly recommended",
    rating: 5,
    location: "Google review",
    href: "https://maps.app.goo.gl/qSyCberyp3AYXVp1A"
  }, {
    name: "Thomas Wohanka",
    text: "They do a great job!! Very professional and they pay attention to detail. I would highly recommend them!!",
    rating: 5,
    location: "Google review",
    href: "https://maps.app.goo.gl/Sbe1fMc6NKsCBn9q6"
  }, {
    name: "Natanael",
    text: "These guys are amazing!! I hired them to sand and refinish the floors in my house, and everything went better than I expected. The price was fair, they were on time, and the quality of work was excellent. They paid attention to every detail and really brought my floors back to life. On top of that, they respected my home and kept everything clean and organized. I’d definitely hire them again and highly recommend them!",
    rating: 5,
    location: "Google review",
    href: "https://maps.app.goo.gl/WoU2CTPnX6BZ6BTB8"
  }];
  return <div className="min-h-screen">
      <SEOHead title="AXO Floors NJ - #1 Hardwood Flooring Experts in New Jersey" description="Transform your home with AXO Floors NJ. Expert hardwood installation, refinishing & restoration. 4.9★ rating, licensed & insured. Free estimates - Call (732) 351-8653" keywords="hardwood flooring NJ, floor refinishing New Jersey, flooring installation Newark, wood floor restoration Jersey City, AXO Floors, professional flooring contractors" />
      <Header />
      
      {/* Hero Section */}
      <Hero
        title={"Bring Out the Best in Your Floors\n"}
        subtitle="FLOORING SOLUTIONS IN NEW JERSEY"
        description="Whether you're restoring existing hardwood or starting with something new, we'll help you create floors that feel right for your home."
        image={homeHero}
        ctaPrimary="Get My Estimate"
        ctaSecondary="See Our Work"
        ctaPrimaryHref="/get-started"
        ctaSecondaryHref="/gallery"
        trustLine="FAMILY-OWNED. CRAFTSMANSHIP-DRIVEN."
        showReviews={true}
      />




      {/* Services Section */}
      <section id="services" className="spacing-mobile-md pt-8 pb-8 sm:pt-10 sm:pb-10 lg:pt-14 lg:pb-14 bg-secondary/30 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-mobile-3xl font-bold font-heading mb-4 md:mb-6 [text-wrap:balance] px-2 leading-tight">
              What Does Your Home Need?
            </h2>
            <p className="text-mobile-base text-muted-foreground max-w-3xl mx-auto leading-relaxed [text-wrap:balance] px-2">
              Every service is delivered with the precision and care your project deserves.
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
          <div className="text-center mb-10 lg:mb-14">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GoogleLogo />
              <span className="text-xs font-medium tracking-wider text-white/70 uppercase">Google Reviews</span>
            </div>
            <h2 className="text-mobile-3xl font-bold font-heading mb-4 sm:mb-6 px-2 [text-wrap:balance] leading-tight">
              What Homeowners <span className="block sm:inline text-accent">Say About AXO</span>
            </h2>
          </div>

          <div className="flex gap-5 md:gap-6 max-w-6xl mx-auto overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 xl:mx-auto xl:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {testimonials.map((testimonial, index) => {
              const timeAgo: Record<string, string> = { "Becky Cordero": "2 years ago", "Tim Hochrun": "3 weeks ago", "Diana Bastidas": "a month ago", "Thomas Wohanka": "5 months ago", "Natanael": "5 months ago" };
              const avatarColors = ["bg-accent", "bg-primary", "bg-secondary-foreground", "bg-accent", "bg-primary"];
              return <div key={index} className="w-[85vw] sm:w-[360px] shrink-0 snap-start bg-card text-card-foreground rounded-2xl p-6 border border-border shadow-elegant flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-primary-foreground font-bold text-sm`}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold leading-tight">{testimonial.name}</p>
                      <p className="text-muted-foreground text-xs">{timeAgo[testimonial.name]}</p>
                    </div>
                  </div>
                  <GoogleLogo />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">"{testimonial.text}"</p>
                <a href={testimonial.href} target="_blank" rel="noopener noreferrer" className="text-accent text-xs font-semibold hover:underline inline-flex items-center gap-1">
                  Read on Google <ExternalLink className="w-3 h-3" />
                </a>
              </div>;
            })}
          </div>
        </div>
      </section>



      {/* Project Wizard CTA */}
      <section className="spacing-mobile-md bg-gradient-subtle border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-mobile-3xl font-bold font-heading mb-4">
              Ready to Transform Your Floors — <span className="text-gradient-gold">The Right Way?</span>
            </h2>
            <p className="text-mobile-base text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Tell us about your project in under 2 minutes.

We'll review it and get back to you within 24 hours with the next step.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button asChild size="lg" className="gold-gradient hover:scale-105 transition-bounce text-base sm:text-lg px-8 py-5 h-auto min-h-[52px] text-black font-semibold w-full sm:w-auto">
                <Link to="/get-started" className="flex items-center justify-center gap-2 text-black">
                  Get My Estimate
                  <ArrowRight className="w-5 h-5 text-black" />
                </Link>
              </Button>
              <a href={`sms:${AXO_PHONE_TEL}?body=${encodeURIComponent("Hi AXO Floors! I'd like to discuss an estimate for my flooring project.")}`} className="inline-flex items-center justify-center gap-2 py-2 text-base sm:text-sm font-semibold text-navy hover:text-accent transition-colors">
                <MessageSquare aria-hidden="true" className="h-4 w-4 shrink-0" /> Prefer texting? Text Us Directly
              </a>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>;
};
export default Index;
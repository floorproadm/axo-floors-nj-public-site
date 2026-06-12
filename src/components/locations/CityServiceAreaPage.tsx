import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Calendar, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import SEOHead from "@/components/shared/SEOHead";
import LocationStructuredData from "@/components/locations/LocationStructuredData";
import { AXO_PHONE_DISPLAY, AXO_PHONE_TEL, PUBLIC_SITE_URL } from "@/lib/constants";
import { njLocations, type NJLocation } from "@/data/njLocations";

interface Props {
  location: NJLocation;
}

const services = [
  {
    name: "Hardwood Floor Refinishing",
    description:
      "Sanding and refinishing existing hardwood floors — dust-contained process and modern water-based finishes.",
    href: "/refinishing",
  },
  {
    name: "Hardwood Floor Installation",
    description:
      "New solid and engineered hardwood installation, including wide-plank white oak and custom stains.",
    href: "/installation",
  },
  {
    name: "Floor Repairs",
    description:
      "Board replacement, weave-in repairs around removed walls, and recoats where a full sand is not appropriate.",
    href: "/refinishing",
  },
  {
    name: "Stairs and Railings",
    description:
      "Converting carpeted stairs to hardwood treads, refinishing existing stairs, and matching first-floor stain.",
    href: "/staircase",
  },
];

const buildFaq = (cityName: string) => [
  {
    q: `Do you provide hardwood floor estimates in ${cityName}, NJ?`,
    a: `Yes. AXO Floors offers free, no-pressure on-site estimates in ${cityName}. You can schedule online or call ${AXO_PHONE_DISPLAY}.`,
  },
  {
    q: "Can existing hardwood floors be refinished?",
    a: "In most cases, yes. We assess remaining board thickness and the type of finish currently on the floor, then recommend either a full sand-and-refinish or a buff-and-recoat if a full sand is not appropriate.",
  },
  {
    q: "Do you install new hardwood flooring?",
    a: "Yes. We install both solid and engineered hardwood, including wide-plank white oak with custom stains. We confirm subfloor condition and acclimation before installation.",
  },
  {
    q: "Do you work on stairs and railings?",
    a: "Yes. We convert carpeted stairs to hardwood, refinish existing stair treads and risers, and work on handrail systems — matched to the first-floor stain when needed.",
  },
  {
    q: "How do I schedule an estimate?",
    a: `You can request an estimate through our Schedule Estimate page, take the Smart Estimate quiz, or call us directly at ${AXO_PHONE_DISPLAY}.`,
  },
];

const CityServiceAreaPage = ({ location }: Props) => {
  const path = `/service-areas/new-jersey/${location.slug}`;
  const canonicalUrl = `${PUBLIC_SITE_URL}${path}`;
  const faq = buildFaq(location.cityName);

  // Robots meta: indexable === false → noindex, follow.
  // When `indexable` is later flipped to true on a city, this auto-switches.
  useEffect(() => {
    const robotsContent = location.indexable ? "index, follow" : "noindex, follow";
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", robotsContent);
    return () => {
      // Restore site default on unmount so other routes are not affected.
      if (meta) meta.setAttribute("content", "index, follow");
    };
  }, [location.indexable]);

  const publishedNearby = location.nearbyCitySlugs
    .map((slug) => njLocations.find((l) => l.slug === slug))
    .filter((l): l is NJLocation => !!l && l.published);

  return (
    <>
      <SEOHead
        title={location.metaTitle}
        description={location.metaDescription}
        canonical={canonicalUrl}
      />
      <Header />

      <main className="bg-background">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 text-sm">
          <ol className="flex flex-wrap items-center gap-1.5 text-grey">
            <li>
              <Link to="/" className="hover:text-navy transition-smooth">Home</Link>
            </li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li>Service Areas</li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li className="text-navy font-medium" aria-current="page">
              {location.cityName}, {location.stateCode}
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center gap-2 text-gold mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide">
              {location.cityName}, {location.stateCode} · {location.county} County
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-navy mb-5 leading-tight">
            {location.h1}
          </h1>
          <p className="text-base sm:text-lg text-grey max-w-3xl leading-relaxed mb-7">
            {location.introduction}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-navy text-white hover:bg-navy/90">
              <Link to="/schedule-estimate">
                <Calendar className="mr-2 h-5 w-5" /> Schedule Free Estimate
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`tel:${AXO_PHONE_TEL}`}>
                <Phone className="mr-2 h-5 w-5" /> {AXO_PHONE_DISPLAY}
              </a>
            </Button>
          </div>
        </section>

        {/* Services */}
        <section className="container mx-auto px-4 py-10 md:py-14 border-t border-grey-light">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-3">
            Flooring Services in {location.cityName}
          </h2>
          <p className="text-grey max-w-2xl mb-8">
            AXO Floors provides the following services throughout {location.cityName} and the surrounding area:
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((s) => (
              <Link
                key={s.name}
                to={s.href}
                className="block rounded-lg border border-grey-light bg-card p-5 hover:border-gold hover:shadow-soft transition-smooth"
              >
                <h3 className="text-lg font-semibold text-navy mb-1.5">{s.name}</h3>
                <p className="text-sm text-grey leading-relaxed">{s.description}</p>
                <span className="inline-flex items-center text-sm font-medium text-gold mt-3">
                  Learn more <ChevronRight className="ml-0.5 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Local information */}
        <section className="container mx-auto px-4 py-10 md:py-14 border-t border-grey-light">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-4">
            Local Flooring Notes for {location.cityName}
          </h2>
          <p className="text-grey max-w-3xl leading-relaxed mb-6">
            {location.localFlooringInformation}
          </p>
          <p className="text-grey max-w-3xl leading-relaxed">
            AXO Floors provides service throughout {location.cityName} and surrounding areas.
          </p>

          {(location.neighborhoods.length > 0 || location.zipCodes.length > 0) && (
            <div className="grid gap-6 sm:grid-cols-2 mt-8">
              {location.neighborhoods.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-navy mb-3">Areas Served</h3>
                  <ul className="flex flex-wrap gap-2">
                    {location.neighborhoods.map((n) => (
                      <li
                        key={n}
                        className="text-sm px-3 py-1.5 rounded-full bg-grey-light/40 text-navy"
                      >
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {location.zipCodes.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-navy mb-3">ZIP Codes</h3>
                  <ul className="flex flex-wrap gap-2">
                    {location.zipCodes.map((z) => (
                      <li
                        key={z}
                        className="text-sm px-3 py-1.5 rounded-full bg-grey-light/40 text-navy font-mono"
                      >
                        {z}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Process */}
        <section className="container mx-auto px-4 py-10 md:py-14 border-t border-grey-light">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-8">
            How It Works
          </h2>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: 1, t: "Schedule an estimate", d: "Book online or call. We'll confirm a time that fits your schedule." },
              { n: 2, t: "Review the floor", d: "We assess floor condition, subfloor, and project scope on-site." },
              { n: 3, t: "Recommendations and pricing", d: "You receive clear recommendations and an itemized written estimate." },
              { n: 4, t: "Complete the work", d: "Once approved, our crew completes the work cleanly and on schedule." },
            ].map((step) => (
              <li
                key={step.n}
                className="rounded-lg border border-grey-light bg-card p-5"
              >
                <div className="w-8 h-8 rounded-full bg-gold text-black font-bold flex items-center justify-center mb-3">
                  {step.n}
                </div>
                <h3 className="font-semibold text-navy mb-1.5">{step.t}</h3>
                <p className="text-sm text-grey leading-relaxed">{step.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Nearby cities (only published, crawlable) */}
        {publishedNearby.length > 0 && (
          <section className="container mx-auto px-4 py-10 md:py-14 border-t border-grey-light">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-6">
              Nearby Areas We Serve
            </h2>
            <ul className="flex flex-wrap gap-3">
              {publishedNearby.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/service-areas/new-jersey/${c.slug}`}
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-grey-light text-navy font-medium hover:border-gold hover:bg-grey-light/30 transition-smooth"
                  >
                    {c.cityName}, {c.stateCode}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        <section className="container mx-auto px-4 py-10 md:py-14 border-t border-grey-light">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-6">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="max-w-3xl">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-navy font-semibold">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-grey leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t border-grey-light">
          <div className="rounded-xl bg-navy text-white p-8 md:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-3">
              Ready to start your {location.cityName} project?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-7">
              Get a free, no-pressure in-home estimate from AXO Floors. We respond quickly and treat every home with care.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90">
                <Link to="/schedule-estimate">
                  <Calendar className="mr-2 h-5 w-5" /> Schedule Free Estimate
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <a href={`tel:${AXO_PHONE_TEL}`}>
                  <Phone className="mr-2 h-5 w-5" /> {AXO_PHONE_DISPLAY}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CityServiceAreaPage;

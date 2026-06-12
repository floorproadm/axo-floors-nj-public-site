import { Link } from "react-router-dom";
import { Phone, MapPin, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import SEOHead from "@/components/shared/SEOHead";
import StructuredData from "./StructuredData";
import {
  AXO_PHONE_DISPLAY,
  AXO_PHONE_TEL,
  AXO_EMAIL,
  PUBLIC_SITE_URL,
} from "@/lib/constants";
import type { NJLocation } from "@/data/njLocations";
import { getLocationBySlug } from "@/data/njLocations";

interface Props {
  location: NJLocation;
}

const CityServiceAreaPage = ({ location }: Props) => {
  const path = `/service-areas/new-jersey/${location.slug}`;
  const url = `${PUBLIC_SITE_URL}${path}`;
  const robots = location.indexable ? "index, follow" : "noindex, follow";

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${PUBLIC_SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Service Areas",
        item: `${PUBLIC_SITE_URL}/service-areas/new-jersey`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${location.county} County`,
        item: `${PUBLIC_SITE_URL}/service-areas/new-jersey/${location.countySlug}-county`,
      },
      { "@type": "ListItem", position: 4, name: location.cityName, item: url },
    ],
  };

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Hardwood Flooring Installation and Refinishing",
    provider: {
      "@type": "LocalBusiness",
      name: "AXO Floors NJ",
      telephone: AXO_PHONE_TEL,
      email: AXO_EMAIL,
      url: PUBLIC_SITE_URL,
      areaServed: {
        "@type": "City",
        name: location.cityName,
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: `${location.county} County, ${location.state}`,
        },
      },
    },
    areaServed: {
      "@type": "City",
      name: location.cityName,
      address: {
        "@type": "PostalAddress",
        addressLocality: location.cityName,
        addressRegion: location.stateCode,
        postalCode: location.zipCodes[0],
        addressCountry: "US",
      },
    },
    offers: {
      "@type": "Offer",
      url: `${PUBLIC_SITE_URL}/schedule-estimate`,
      availability: "https://schema.org/InStock",
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: location.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  // Resolve nearby cities to actual published records
  const nearby = location.nearbyCities
    .map((slug) => getLocationBySlug(slug))
    .filter((l): l is NJLocation => Boolean(l));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={location.metaTitle}
        description={location.metaDescription}
        canonical={url}
      />
      {/* Override robots when needed */}
      {!location.indexable && (
        <meta name="robots" content={robots} />
      )}
      <StructuredData id={`breadcrumb-${location.slug}`} data={breadcrumbLd} />
      <StructuredData id={`service-${location.slug}`} data={serviceLd} />
      <StructuredData id={`faq-${location.slug}`} data={faqLd} />

      <Header />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 text-sm text-grey">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="hover:text-navy">Home</Link></li>
          <li>/</li>
          <li><Link to="/service-areas/new-jersey" className="hover:text-navy">Service Areas</Link></li>
          <li>/</li>
          <li>
            <Link
              to={`/service-areas/new-jersey/${location.countySlug}-county`}
              className="hover:text-navy"
            >
              {location.county} County
            </Link>
          </li>
          <li>/</li>
          <li className="text-navy font-medium" aria-current="page">{location.cityName}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-10 sm:py-14">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-gold mb-3">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              {location.cityName}, {location.stateCode} · {location.county} County
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-navy mb-4">
            {location.h1}
          </h1>
          <p className="text-lg text-grey leading-relaxed mb-6">
            {location.introduction}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-navy text-white hover:bg-navy/90">
              <Link to="/schedule-estimate">
                <Calendar className="w-5 h-5 mr-2" /> Schedule Free Estimate
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`tel:${AXO_PHONE_TEL}`}>
                <Phone className="w-5 h-5 mr-2" /> {AXO_PHONE_DISPLAY}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-grey-light/30 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-8">
            Our Flooring Services in {location.cityName}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-navy mb-3">
                  Hardwood Floor Refinishing
                </h3>
                <p className="text-grey mb-4">
                  Full sand-and-refinish of existing hardwood in {location.cityName} homes — including stain matching, custom colors, and modern low-VOC finishes. Dust-contained process keeps your home livable during the work.
                </p>
                <Link to="/refinishing" className="text-navy font-semibold hover:text-gold">
                  Learn about refinishing →
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-navy mb-3">
                  Hardwood Floor Installation
                </h3>
                <p className="text-grey mb-4">
                  New solid and engineered hardwood installations throughout {location.cityName} — red oak, white oak, walnut, hickory and wide-plank options. Subfloor leveling and prep included.
                </p>
                <Link to="/installation" className="text-navy font-semibold hover:text-gold">
                  Learn about installation →
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-navy mb-3">
                  Repairs, Stairs &amp; Railings
                </h3>
                <p className="text-grey mb-4">
                  Board replacement, water-damage repairs, staircase rebuilds and railing systems for {location.cityName} homes. We match stain and finish to existing flooring.
                </p>
                <Link to="/staircase" className="text-navy font-semibold hover:text-gold">
                  Learn about staircase work →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-8">
          Recent {location.cityName} Projects
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {location.projectGallery.map((p, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <h3 className="font-bold text-navy mb-2">{p.title}</h3>
                <p className="text-grey text-sm">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/gallery" className="text-navy font-semibold hover:text-gold">
            See more AXO Floors projects →
          </Link>
        </div>
      </section>

      {/* Local Information */}
      <section className="bg-grey-light/30 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-6">
            Hardwood Flooring in {location.cityName}
          </h2>
          <p className="text-lg text-grey leading-relaxed">
            {location.localFlooringInformation}
          </p>
        </div>
      </section>

      {/* Neighborhoods & ZIPs */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold font-heading text-navy mb-4">
              Neighborhoods We Serve in {location.cityName}
            </h2>
            <ul className="space-y-2">
              {location.neighborhoods.map((n) => (
                <li key={n} className="flex items-center gap-2 text-grey">
                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-navy mb-4">
              ZIP Codes Served
            </h2>
            <div className="flex flex-wrap gap-2">
              {location.zipCodes.map((z) => (
                <span
                  key={z}
                  className="px-3 py-1 rounded-full bg-navy text-white text-sm font-medium"
                >
                  {z}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {location.testimonial && (
        <section className="bg-navy text-white py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <blockquote className="text-xl sm:text-2xl italic leading-relaxed mb-4">
              &ldquo;{location.testimonial.quote}&rdquo;
            </blockquote>
            <p className="text-gold font-semibold">
              — {location.testimonial.author}, {location.testimonial.location}
            </p>
          </div>
        </section>
      )}

      {/* Nearby Service Areas */}
      {nearby.length > 0 && (
        <section className="container mx-auto px-4 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-6">
            Nearby Service Areas
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link
                  to={`/service-areas/new-jersey/${n.slug}`}
                  className="block px-4 py-3 rounded-lg border border-grey-light hover:border-gold hover:bg-grey-light/30 text-navy font-medium transition-colors"
                >
                  {n.cityName}, {n.stateCode}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-grey-light/30 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-6">
            {location.cityName} Hardwood Flooring FAQs
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {location.faq.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-navy font-semibold">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-grey leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="bg-gradient-to-br from-navy to-navy/90 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-4">
            Ready to start your {location.cityName} project?
          </h2>
          <p className="text-white/85 mb-6 max-w-2xl mx-auto">
            Book a free in-home estimate. We&apos;ll measure, recommend the right products for your home, and give you transparent pricing — no pressure.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-gold text-navy hover:bg-gold/90">
              <Link to="/schedule-estimate">
                <Calendar className="w-5 h-5 mr-2" /> Schedule Free Estimate
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-navy">
              <a href={`tel:${AXO_PHONE_TEL}`}>
                <Phone className="w-5 h-5 mr-2" /> {AXO_PHONE_DISPLAY}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CityServiceAreaPage;

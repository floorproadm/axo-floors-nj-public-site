import { Link } from "react-router-dom";
import { MapPin, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import SEOHead from "@/components/shared/SEOHead";
import StructuredData from "@/components/locations/StructuredData";
import {
  AXO_PHONE_DISPLAY,
  AXO_PHONE_TEL,
  PUBLIC_SITE_URL,
} from "@/lib/constants";
import { getCounties, getPublishedLocations } from "@/data/njLocations";

const NewJerseyHub = () => {
  const counties = getCounties();
  const locations = getPublishedLocations();
  const path = "/service-areas/new-jersey";
  const url = `${PUBLIC_SITE_URL}${path}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${PUBLIC_SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Service Areas — New Jersey", item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="New Jersey Service Areas | AXO Floors Hardwood Flooring"
        description="AXO Floors provides hardwood installation, sanding and refinishing throughout New Jersey — Monmouth, Ocean and beyond. Find your town and book a free estimate."
        canonical={url}
      />
      <StructuredData id="breadcrumb-nj-hub" data={breadcrumbLd} />

      <Header />

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-gold mb-3">
          <MapPin className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase tracking-wide">
            New Jersey
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-navy mb-4">
          Hardwood Flooring Service Areas in New Jersey
        </h1>
        <p className="text-lg text-grey max-w-3xl leading-relaxed mb-6">
          AXO Floors is a New Jersey hardwood flooring contractor serving homeowners across Monmouth, Ocean and surrounding counties. Find your town below — every page includes the services we offer, neighborhoods covered, and how to book a free in-home estimate.
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
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-6">
          Browse by County
        </h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {counties.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/service-areas/new-jersey/${c.slug}-county`}
                className="block p-5 rounded-xl border border-grey-light hover:border-gold transition-colors"
              >
                <h3 className="text-lg font-bold text-navy">{c.name} County</h3>
                <p className="text-sm text-grey mt-1">
                  {c.count} {c.count === 1 ? "city" : "cities"} served
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-6">
          All Service Areas
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {locations
            .slice()
            .sort((a, b) => a.cityName.localeCompare(b.cityName))
            .map((l) => (
              <li key={l.slug}>
                <Link
                  to={`/service-areas/new-jersey/${l.slug}`}
                  className="block px-4 py-3 rounded-lg border border-grey-light hover:border-gold hover:bg-grey-light/30 text-navy font-medium transition-colors"
                >
                  {l.cityName}
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
};

export default NewJerseyHub;

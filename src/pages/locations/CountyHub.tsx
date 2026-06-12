import { Link, useParams, Navigate } from "react-router-dom";
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
import { getLocationsByCounty } from "@/data/njLocations";

const CountyHub = () => {
  const { slug, countyParam } = useParams<{ slug?: string; countyParam?: string }>();
  const raw = slug ?? countyParam ?? "";
  // route param is e.g. "monmouth-county" — strip suffix
  const countySlug = raw.replace(/-county$/, "");
  const cities = getLocationsByCounty(countySlug);

  if (!raw.endsWith("-county") || cities.length === 0) {
    return <Navigate to="/service-areas/new-jersey" replace />;
  }

  const countyName = cities[0].county;
  const path = `/service-areas/new-jersey/${countySlug}-county`;
  const url = `${PUBLIC_SITE_URL}${path}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${PUBLIC_SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Service Areas", item: `${PUBLIC_SITE_URL}/service-areas/new-jersey` },
      { "@type": "ListItem", position: 3, name: `${countyName} County`, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${countyName} County, NJ Hardwood Flooring | AXO Floors`}
        description={`Hardwood installation, sanding & refinishing throughout ${countyName} County, NJ. ${cities.length} cities served. Free estimates — call ${AXO_PHONE_DISPLAY}.`}
        canonical={url}
      />
      <StructuredData id={`breadcrumb-${countySlug}-county`} data={breadcrumbLd} />

      <Header />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 text-sm text-grey">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="hover:text-navy">Home</Link></li>
          <li>/</li>
          <li><Link to="/service-areas/new-jersey" className="hover:text-navy">Service Areas</Link></li>
          <li>/</li>
          <li className="text-navy font-medium" aria-current="page">{countyName} County</li>
        </ol>
      </nav>

      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-gold mb-3">
          <MapPin className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase tracking-wide">
            {countyName} County, NJ
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-navy mb-4">
          Hardwood Flooring in {countyName} County, NJ
        </h1>
        <p className="text-lg text-grey max-w-3xl leading-relaxed mb-6">
          AXO Floors serves {cities.length} {cities.length === 1 ? "city" : "cities"} across {countyName} County with hardwood installation, sanding, refinishing, and staircase work. Pick your town below to see services, neighborhoods covered and recent project examples.
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
          Cities We Serve in {countyName} County
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {cities
            .slice()
            .sort((a, b) => a.cityName.localeCompare(b.cityName))
            .map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/service-areas/new-jersey/${c.slug}`}
                  className="block px-4 py-3 rounded-lg border border-grey-light hover:border-gold hover:bg-grey-light/30 text-navy font-medium transition-colors"
                >
                  {c.cityName}
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
};

export default CountyHub;

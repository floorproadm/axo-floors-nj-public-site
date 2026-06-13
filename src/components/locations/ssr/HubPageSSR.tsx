import { Phone, Calendar, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SafeLink from "./SafeLink";
import HeaderSSR from "./HeaderSSR";
import FooterSSR from "./FooterSSR";
import ImageLightbox from "./ImageLightbox";
import { AXO_PHONE_DISPLAY, AXO_PHONE_TEL } from "@/lib/constants";
import { getPublishedLocations } from "@/data/njLocations";
import heroAsset from "@/assets/axo-hardwood-foyer-staircase.jpg.asset.json";
import ba1 from "@/assets/before-after/before-after-1.png";
import ba2 from "@/assets/before-after/before-after-2.png";
import ba3 from "@/assets/before-after/before-after-3.png";
import ba4 from "@/assets/before-after/before-after-4.png";
import ba5 from "@/assets/before-after/before-after-5.png";
import ba6 from "@/assets/before-after/before-after-6.png";

const heroImage = heroAsset.url;

const transformationImages = [
  { src: ba1, alt: "AXO Floors hardwood refinishing transformation — before and after" },
  { src: ba2, alt: "Restored red oak hardwood floor by AXO Floors" },
  { src: ba3, alt: "Sand-and-refinish project completed by AXO Floors" },
  { src: ba4, alt: "Hardwood floor restoration — AXO Floors craftsmanship" },
  { src: ba5, alt: "Refinished hardwood with modern stain by AXO Floors" },
  { src: ba6, alt: "Wide-plank hardwood installation by AXO Floors" },
];

/**
 * SSR-renderable NJ service-area hub. Same visual contract as
 * NewJerseyServiceAreasPage but free of react-router-dom and SEOHead —
 * head, canonical, robots and BreadcrumbList JSON-LD are emitted by the
 * TanStack route head().
 */
const services = [
  { name: "Hardwood Floor Refinishing", href: "/refinishing", description: "Sanding and refinishing existing hardwood floors using a dust-contained process and modern finishes." },
  { name: "Hardwood Floor Installation", href: "/installation", description: "New solid and engineered hardwood installation, including wide-plank white oak with custom stains." },
  { name: "Floor Repairs", href: "/refinishing", description: "Board replacement, weave-in repairs and recoats where a full sand is not appropriate." },
  { name: "Stairs and Railings", href: "/staircase", description: "Converting carpeted stairs to hardwood, refinishing existing stairs, and matching first-floor stain." },
];

const HubPageSSR = () => {
  const published = getPublishedLocations();

  return (
    <>
      <HeaderSSR />

      <main className="bg-background">
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 text-sm">
          <ol className="flex flex-wrap items-center gap-1.5 text-grey">
            <li><SafeLink to="/" className="hover:text-navy transition-smooth">Home</SafeLink></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li className="text-navy font-medium" aria-current="page">New Jersey Service Areas</li>
          </ol>
        </nav>

        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-gold mb-3">
                <MapPin className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide">New Jersey</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-navy mb-5 leading-tight">
                Hardwood Flooring Services Across New Jersey
              </h1>
              <p className="text-base sm:text-lg text-grey max-w-3xl leading-relaxed mb-7">
                AXO Floors provides hardwood floor installation, refinishing, repairs, and stairs and railings work
                in selected New Jersey service areas. Each project starts with a free in-home estimate so we can
                review the existing floors and recommend the right approach.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-navy text-white hover:bg-navy/90 shadow-elegant">
                  <a href="/schedule-estimate">
                    <Calendar className="mr-2 h-5 w-5" /> Schedule Free Estimate
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                  <a href={`tel:${AXO_PHONE_TEL}`}>
                    <Phone className="mr-2 h-5 w-5" /> {AXO_PHONE_DISPLAY}
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-2xl overflow-hidden shadow-elegant border-4 border-gold/20 aspect-[4/3] lg:aspect-[5/4]">
                <img
                  src={heroImage}
                  alt="Refinished red oak hardwood foyer and staircase by AXO Floors NJ"
                  width={1200}
                  height={900}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-14 border-t border-grey-light">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-3">Services We Provide</h2>
          <p className="text-grey max-w-2xl mb-8">
            The same core services are available throughout our New Jersey service areas:
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((s) => (
              <SafeLink key={s.name} to={s.href} className="block rounded-lg border border-grey-light bg-card p-5 hover:border-gold hover:shadow-soft transition-smooth">
                <h3 className="text-lg font-semibold text-navy mb-1.5">{s.name}</h3>
                <p className="text-sm text-grey leading-relaxed">{s.description}</p>
                <span className="inline-flex items-center text-sm font-medium text-gold mt-3">
                  Learn more <ChevronRight className="ml-0.5 h-4 w-4" />
                </span>
              </SafeLink>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-14 border-t border-grey-light">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-3">
            New Jersey Locations We Serve
          </h2>
          <p className="text-grey max-w-2xl mb-8">
            Explore service-area pages for the New Jersey cities and towns we currently serve.
          </p>
          {published.length === 0 ? (
            <p className="text-grey">Location pages are being added. Call {AXO_PHONE_DISPLAY} to confirm availability in your area.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {published.map((c) => (
                <li key={c.slug}>
                  <SafeLink to={`/service-areas/new-jersey/${c.slug}`} className="flex items-center justify-between gap-3 rounded-lg border border-grey-light bg-card px-4 py-3 text-navy font-medium hover:border-gold hover:bg-grey-light/30 transition-smooth">
                    <span className="truncate">{c.cityName}, {c.stateCode}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gold" />
                  </SafeLink>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="container mx-auto px-4 py-10 md:py-14 border-t border-grey-light">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-6">
            How Service-Area Projects Work
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 max-w-4xl">
            <li className="rounded-lg border border-grey-light bg-card p-5">
              <h3 className="font-semibold text-navy mb-1.5">Estimates are scheduled at the property</h3>
              <p className="text-sm text-grey leading-relaxed">We come on-site so we can see the actual floors, subfloor and surrounding rooms.</p>
            </li>
            <li className="rounded-lg border border-grey-light bg-card p-5">
              <h3 className="font-semibold text-navy mb-1.5">Floor condition and scope are reviewed</h3>
              <p className="text-sm text-grey leading-relaxed">We check existing finish, wear, board thickness and any transitions or repair work needed.</p>
            </li>
            <li className="rounded-lg border border-grey-light bg-card p-5">
              <h3 className="font-semibold text-navy mb-1.5">Recommendations depend on the existing flooring</h3>
              <p className="text-sm text-grey leading-relaxed">We recommend installation, refinishing, repairs or a recoat based on what each floor and project actually needs.</p>
            </li>
            <li className="rounded-lg border border-grey-light bg-card p-5">
              <h3 className="font-semibold text-navy mb-1.5">Availability may vary by location and scope</h3>
              <p className="text-sm text-grey leading-relaxed">Scheduling and lead times depend on the service area and the size of the project.</p>
            </li>
          </ul>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-16 border-t border-grey-light">
          <div className="rounded-xl bg-navy text-white p-8 md:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-3">Get a Free New Jersey Estimate</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-7">
              Schedule a free, no-pressure on-site estimate from AXO Floors.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90">
                <a href="/schedule-estimate">
                  <Calendar className="mr-2 h-5 w-5" /> Schedule Free Estimate
                </a>
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

      <FooterSSR />
    </>
  );
};

export default HubPageSSR;

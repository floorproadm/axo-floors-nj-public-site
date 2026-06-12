import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLocationBySlug } from "@/data/njLocations";
import { PUBLIC_SITE_URL } from "@/lib/constants";
import CityPageSSR from "@/components/locations/ssr/CityPageSSR";
import NotFoundShell from "@/components/locations/ssr/NotFoundShell";


/**
 * SSR city route. Owns the HTTP status code, initial <head>, and the
 * full server-rendered body for /service-areas/new-jersey/:slug:
 *   - Unknown or unpublished slug -> throws notFound() -> server responds
 *     404 with NotFoundShell.
 *   - Published slug -> server responds 200 with the full CityPageSSR
 *     markup (Header, hero, services, local content, FAQ, nearby links,
 *     CTA, Footer) plus city-specific metadata, canonical, robots,
 *     and JSON-LD (BreadcrumbList + Service).
 */

export const Route = createFileRoute("/service-areas/new-jersey/$slug")({
  loader: ({ params }) => {
    const loc = getLocationBySlug(params.slug);
    if (!loc || !loc.published) {
      throw notFound();
    }
    return { loc };
  },
  head: ({ loaderData }) => {
    const loc = loaderData?.loc;
    if (!loc) {
      // Not-found path: emit a minimal noindex head so crawlers do not
      // index the 404 body.
      return {
        meta: [
          { title: "Page not found | AXO Floors NJ" },
          { name: "robots", content: "noindex, follow" },
        ],
      };
    }
    const url = `${PUBLIC_SITE_URL}/service-areas/new-jersey/${loc.slug}`;
    const robots = loc.indexable ? "index, follow" : "noindex, follow";
    return {
      meta: [
        { title: loc.metaTitle },
        { name: "description", content: loc.metaDescription },
        { name: "robots", content: robots },
        { property: "og:title", content: loc.metaTitle },
        { property: "og:description", content: loc.metaDescription },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${PUBLIC_SITE_URL}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "New Jersey Service Areas",
                item: `${PUBLIC_SITE_URL}/service-areas/new-jersey`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `${loc.cityName}, ${loc.stateCode}`,
                item: url,
              },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Hardwood Flooring Services in ${loc.cityName}, ${loc.stateCode}`,
            serviceType: "Hardwood floor installation and refinishing",
            url,
            provider: {
              "@type": "LocalBusiness",
              "@id": PUBLIC_SITE_URL,
              name: "AXO Floors NJ",
              url: PUBLIC_SITE_URL,
            },
            areaServed: {
              "@type": "City",
              name: loc.cityName,
              containedInPlace: {
                "@type": "State",
                name: loc.state,
              },
            },
          }),
        },
      ],
    };
  },
  component: CityComponent,
  notFoundComponent: NotFoundShell,
});

function CityComponent() {
  const { loc } = Route.useLoaderData();
  return <CityPageSSR location={loc} />;
}


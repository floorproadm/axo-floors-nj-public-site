import { useEffect } from "react";
import { PUBLIC_SITE_URL } from "@/lib/constants";
import type { NJLocation } from "@/data/njLocations";

/**
 * Reusable JSON-LD injector for city service-area pages.
 *
 * Emits TWO schemas:
 *   1. BreadcrumbList — Home > Service Areas > <City, ST>
 *      (the "Service Areas" item is intentionally non-clickable / has no URL
 *      because the NJ hub does not exist yet.)
 *   2. Service — references the existing global LocalBusiness
 *      (declared in src/routes/__root.tsx with @id = PUBLIC_SITE_URL)
 *      as `provider`, so we do not introduce a second business entity.
 *
 * Cleans up the script tags on unmount so stale schema cannot leak onto
 * other routes.
 */
interface Props {
  location: NJLocation;
}

const LocationStructuredData = ({ location }: Props) => {
  useEffect(() => {
    const path = `/service-areas/new-jersey/${location.slug}`;
    const pageUrl = `${PUBLIC_SITE_URL}${path}`;

    const breadcrumb = {
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
          name: `${location.cityName}, ${location.stateCode}`,
          item: pageUrl,
        },
      ],
    };

    const service = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Hardwood Flooring Services in ${location.cityName}, ${location.stateCode}`,
      serviceType: "Hardwood floor installation and refinishing",
      url: pageUrl,
      provider: {
        // Reference the global LocalBusiness declared in __root.tsx
        // via its canonical @id; do not redeclare the business here.
        "@type": "LocalBusiness",
        "@id": PUBLIC_SITE_URL,
        name: "AXO Floors NJ",
        url: PUBLIC_SITE_URL,
      },
      areaServed: {
        "@type": "City",
        name: location.cityName,
        containedInPlace: {
          "@type": "State",
          name: location.state,
        },
      },
    };

    const mountScript = (id: string, payload: unknown) => {
      let el = document.getElementById(id) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement("script");
        el.id = id;
        el.type = "application/ld+json";
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(payload);
      return el;
    };

    const breadcrumbEl = mountScript(`ld-breadcrumb-${location.slug}`, breadcrumb);
    const serviceEl = mountScript(`ld-service-${location.slug}`, service);

    return () => {
      breadcrumbEl?.remove();
      serviceEl?.remove();
    };
  }, [location.slug, location.cityName, location.stateCode, location.state]);

  return null;
};

export default LocationStructuredData;

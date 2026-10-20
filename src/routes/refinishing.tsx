import { createFileRoute } from "@tanstack/react-router";
import { Router } from "react-router-dom";
import Refinishing from "@/pages/Refinishing";
import MobileStickyCTA from "@/components/shared/MobileStickyCTA";

const URL = "https://axofloorsnj.com/refinishing";
// Must match the SEOHead props in src/pages/Refinishing.tsx so the client effect never conflicts.
const TITLE = "Hardwood Floor Refinishing in NJ | AXO Floors";
const DESCRIPTION =
  "Don't replace your hardwood floors — refinish them for half the cost. Dustless sanding, 10-year warranty, 2–4 day turnaround. Free estimate in 24 hours.";

export const Route = createFileRoute("/refinishing")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Hardwood Floor Refinishing",
          serviceType: "Hardwood floor sanding and refinishing",
          url: URL,
          areaServed: { "@type": "State", name: "New Jersey" },
          provider: {
            "@type": "HomeAndConstructionBusiness",
            "@id": "https://axofloorsnj.com",
            name: "AXO Floors NJ",
            telephone: "+1-732-351-8653",
            url: "https://axofloorsnj.com",
          },
        }),
      },
    ],
  }),
  component: RefinishingRoute,
});

const toHref = (to: unknown) =>
  typeof to === "string"
    ? to
    : `${(to as { pathname?: string }).pathname ?? ""}${(to as { search?: string }).search ?? ""}${(to as { hash?: string }).hash ?? ""}`;

// Server-rendered shell for the existing page. Its links do normal full page loads
// into the rest of the site, so analytics sees exactly one page load per visit.
const navigator = {
  createHref: toHref,
  push: (to: unknown) => window.location.assign(toHref(to)),
  replace: (to: unknown) => window.location.replace(toHref(to)),
  go: (n: number) => window.history.go(n),
  back: () => window.history.back(),
  forward: () => window.history.forward(),
};

function RefinishingRoute() {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Router location="/refinishing" navigator={navigator as any}>
      <Refinishing />
      <MobileStickyCTA />
    </Router>
  );
}

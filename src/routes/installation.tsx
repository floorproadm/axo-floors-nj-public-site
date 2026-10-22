import { createFileRoute } from "@tanstack/react-router";
import { Router, type To } from "react-router-dom";
import Installation from "@/pages/Installation";

const title = "Hardwood Floor Installation in NJ | AXO Floors";
const description = "Hardwood floor installation in New Jersey by AXO Floors. Explore solid and engineered hardwood, straight lay, herringbone and chevron layouts. Request an estimate.";
const url = "https://axofloorsnj.com/installation";

export const Route = createFileRoute("/installation")({
  ssr: true,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Hardwood Floor Installation",
        serviceType: "Hardwood floor installation",
        url,
        areaServed: { "@type": "State", name: "New Jersey" },
        provider: {
          "@type": "HomeAndConstructionBusiness",
          name: "AXO Floors",
          telephone: "+1-732-351-8653",
          url: "https://axofloorsnj.com",
        },
      }),
    }],
  }),
  component: InstallationRoute,
});

const href = (to: To) => typeof to === "string" ? to : `${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}`;
const navigator = {
  createHref: href,
  push: (to: To) => window.location.assign(href(to)),
  replace: (to: To) => window.location.replace(href(to)),
  go: (n: number) => window.history.go(n),
};

// Same full-page navigation boundary as /refinishing, with no second App shell.
function InstallationRoute() {
  return <Router location="/installation" navigator={navigator}><Installation /></Router>;
}
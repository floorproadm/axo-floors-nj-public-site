import { createFileRoute } from "@tanstack/react-router";
import { Router, type To } from "react-router-dom";
import Stairs from "@/pages/Stairs";

const title = "Stair Refinishing & Installation NJ | AXO Floors";
const description = "Stair refinishing and installation in New Jersey. Hardwood treads, risers, handrails, newel posts, and baluster upgrades by AXO Floors.";
const url = "https://axofloorsnj.com/stairs";

export const Route = createFileRoute("/stairs")({
  ssr: true,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
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
        name: "Stair Refinishing & Installation",
        serviceType: "Stair refinishing, treads, risers, handrails, newel posts and baluster upgrades",
        url,
        areaServed: { "@type": "State", name: "New Jersey" },
        provider: { "@type": "HomeAndConstructionBusiness", name: "AXO Floors", telephone: "+1-732-351-8653", url: "https://axofloorsnj.com" },
      }),
    }],
  }),
  component: StairsRoute,
});

const href = (to: To) => typeof to === "string" ? to : `${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}`;
const navigator = {
  createHref: href,
  push: (to: To) => window.location.assign(href(to)),
  replace: (to: To) => window.location.replace(href(to)),
  go: (n: number) => window.history.go(n),
};

function StairsRoute() {
  return <Router location="/stairs" navigator={navigator}><Stairs /></Router>;
}
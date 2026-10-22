import { createFileRoute } from "@tanstack/react-router";
import { Router } from "react-router-dom";
import type { To } from "react-router-dom";
import InstallationPreview from "@/features/installation-preview/InstallationPreview";

const title = "Hardwood Floor Installation NJ — AXO Floors (Preview)";
const description = "Explore hardwood installation with AXO Floors in New Jersey: solid and engineered wood, layout illustrations, material options, and a clear project process.";
const url = "https://axofloorsnj.com/installation-v2";

export const Route = createFileRoute("/installation-v2")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: InstallationPreviewRoute,
});

const href = (to: To) => typeof to === "string" ? to : `${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}`;
const navigator = {
  createHref: href,
  push: (to: To) => window.location.assign(href(to)),
  replace: (to: To) => window.location.replace(href(to)),
  go: (n: number) => window.history.go(n),
};

function InstallationPreviewRoute() {
  return <Router location="/installation-v2" navigator={navigator}><InstallationPreview /></Router>;
}
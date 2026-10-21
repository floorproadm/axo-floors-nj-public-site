import { createFileRoute } from "@tanstack/react-router";
import { Router } from "react-router-dom";
import RefinishV2 from "@/pages/RefinishV2";

// UNAPPROVED V2 experiment: noindex, not in sitemap, not linked anywhere. /refinishing stays canonical.
const TITLE = "Hardwood Floor Refinishing in NJ | AXO Floors — Preview";
const DESCRIPTION =
  "Restore worn hardwood floors with AXO Floors in New Jersey. Professional sanding, dust control, custom stains, and quality finishes. Request an estimate.";

export const Route = createFileRoute("/refinish")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RefinishRoute,
});

const toHref = (to: unknown) =>
  typeof to === "string"
    ? to
    : `${(to as { pathname?: string }).pathname ?? ""}${(to as { search?: string }).search ?? ""}${(to as { hash?: string }).hash ?? ""}`;

const navigator = {
  createHref: toHref,
  push: (to: unknown) => window.location.assign(toHref(to)),
  replace: (to: unknown) => window.location.replace(toHref(to)),
  go: (n: number) => window.history.go(n),
  back: () => window.history.back(),
  forward: () => window.history.forward(),
};

function RefinishRoute() {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Router location="/refinish" navigator={navigator as any}>
      <RefinishV2 />
    </Router>
  );
}

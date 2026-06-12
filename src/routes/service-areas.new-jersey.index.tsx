import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import App from "../App";
import { PUBLIC_SITE_URL } from "@/lib/constants";

const url = `${PUBLIC_SITE_URL}/service-areas/new-jersey`;
const title = "New Jersey Hardwood Flooring Service Areas | AXO Floors";
const description =
  "Hardwood flooring installation, sanding and refinishing across New Jersey. See the AXO Floors NJ service-area hub for cities we cover.";

export const Route = createFileRoute("/service-areas/new-jersey/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: HubShell,
});

function HubShell() {
  return (
    <ClientOnly fallback={<div style={{ minHeight: "100vh" }} />}>
      <App />
    </ClientOnly>
  );
}

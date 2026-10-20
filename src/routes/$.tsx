import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/$")({
  ssr: false,
  head: ({ params }) => {
    const isEstimate = params._splat === "get-started";
    const title = isEstimate ? "Get Started — Tell Us About Your Floors | AXO Floors NJ" : "AXO Floors NJ — Flooring Services & Projects";
    const description = isEstimate ? "Answer a few quick questions about your flooring project and the AXO Floors team will reach out to discuss your goals and next steps." : "Explore AXO Floors services, completed flooring projects and contact options.";
    return { meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: AppRoute,
});

function AppRoute() {
  return (
    <ClientOnly fallback={<div style={{ minHeight: "100vh" }} />}>
      <App />
    </ClientOnly>
  );
}

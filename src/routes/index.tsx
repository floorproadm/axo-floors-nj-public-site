import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({ meta: [
    { title: "AXO Floors NJ — Hardwood Installation & Refinishing" },
    { name: "description", content: "Hardwood flooring installation, sanding and refinishing by AXO Floors in New Jersey, New York and Pennsylvania." },
    { property: "og:title", content: "AXO Floors NJ — Hardwood Installation & Refinishing" },
    { property: "og:description", content: "Hardwood flooring installation, sanding and refinishing by AXO Floors in New Jersey, New York and Pennsylvania." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AppRoute,
});

function AppRoute() {
  return (
    <ClientOnly fallback={<div style={{ minHeight: "100vh" }} />}>
      <App />
    </ClientOnly>
  );
}

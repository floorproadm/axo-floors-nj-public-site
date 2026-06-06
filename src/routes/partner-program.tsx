import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/partner-program")({
  head: () => ({ meta: [{ title: "AXO Alliance — Strategic Partnerships" }, { property: "og:url", content: "/partner-program" }], links: [{ rel: "canonical", href: "/partner-program" }] }),
  component: () => <PagePlaceholder title="AXO Alliance" description="A curated network of GCs, builders, realtors, architects, and property managers. Eduardo Oliveira responds within 24 hours." ctaLabel="Apply" ctaTo="/contact" />,
});

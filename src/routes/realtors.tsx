import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/realtors")({
  head: () => ({ meta: [{ title: "Realtor Partnerships | AXO Floors" }, { property: "og:url", content: "/realtors" }], links: [{ rel: "canonical", href: "/realtors" }] }),
  component: () => <PagePlaceholder title="List-Ready Floors, Fast" description="Pre-listing refinishes that close faster and sell higher across NJ, NY & PA." ctaLabel="Partner with us" ctaTo="/contact" />,
});

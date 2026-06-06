import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/builders")({
  head: () => ({ meta: [{ title: "Builder Partnerships | AXO Floors" }, { property: "og:url", content: "/builders" }], links: [{ rel: "canonical", href: "/builders" }] }),
  component: () => <PagePlaceholder title="Built for Builders" description="Reliable flooring crew, transparent SLAs, and clean turnover for your jobsites." ctaLabel="Become a partner" ctaTo="/contact" />,
});

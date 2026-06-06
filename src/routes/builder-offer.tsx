import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/builder-offer")({
  head: () => ({ meta: [{ title: "GC Partner Pack | AXO Floors" }, { property: "og:url", content: "/builder-offer" }], links: [{ rel: "canonical", href: "/builder-offer" }] }),
  component: () => <PagePlaceholder title="GC Partner Pack" description="Eduardo manages every project directly — 24h quote turnaround, 48h punch list, 10-year warranty." ctaLabel="Send your specs" ctaTo="/contact" />,
});

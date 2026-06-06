import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/stain-gallery")({
  head: () => ({ meta: [{ title: "Stain Color Gallery | AXO Floors NJ" }, { property: "og:url", content: "/stain-gallery" }], links: [{ rel: "canonical", href: "/stain-gallery" }] }),
  component: () => <PagePlaceholder title="75+ Stain Colors" description="See White Oak and Red Oak stains side by side, then book a free in-home test." />,
});

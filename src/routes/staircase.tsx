import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/staircase")({
  head: () => ({ meta: [{ title: "Staircase Refinishing in NJ | AXO Floors" }, { property: "og:url", content: "/staircase" }], links: [{ rel: "canonical", href: "/staircase" }] }),
  component: () => <PagePlaceholder title="Staircase Refinishing" description="Custom treads, risers, and stain-matched railings." />,
});

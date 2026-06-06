import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [{ title: "Project Gallery | AXO Floors NJ" }, { name: "description", content: "Real homes. Real transformations. Browse our before-and-afters." }, { property: "og:url", content: "/gallery" }], links: [{ rel: "canonical", href: "/gallery" }] }),
  component: () => <PagePlaceholder title="Real Homes. Real Transformations." description="Every photo is a real NJ home we've worked in. No stock images." ctaTo="/quiz" ctaLabel="Start your project" />,
});

import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/vinyl-plank-flooring")({
  head: () => ({ meta: [{ title: "Vinyl Plank Flooring in NJ | AXO Floors" }, { property: "og:url", content: "/vinyl-plank-flooring" }], links: [{ rel: "canonical", href: "/vinyl-plank-flooring" }] }),
  component: () => <PagePlaceholder title="Vinyl Plank Flooring" description="Waterproof, durable LVP installed across NJ, NY & PA." />,
});

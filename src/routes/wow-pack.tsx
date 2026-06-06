import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/wow-pack")({
  head: () => ({ meta: [{ title: "Your Pre-Visit Guide | AXO Floors NJ" }, { name: "description", content: "Everything you need to know before your free site visit." }] }),
  component: () => <PagePlaceholder title="Your Pre-Visit Guide" description="Everything you need to know before your free in-home site visit with Eduardo." />,
});

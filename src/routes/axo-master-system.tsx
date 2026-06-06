import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/axo-master-system")({
  head: () => ({ meta: [{ title: "AXO Master System" }, { name: "robots", content: "noindex" }] }),
  component: () => <PagePlaceholder title="AXO Master System" description="The visual map of how we deliver consistent, high-end results across every project." />,
});

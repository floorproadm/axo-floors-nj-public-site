import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/base-boards")({
  head: () => ({ meta: [{ title: "Baseboards & Trim in NJ | AXO Floors" }, { property: "og:url", content: "/base-boards" }], links: [{ rel: "canonical", href: "/base-boards" }] }),
  component: () => <PagePlaceholder title="Baseboards & Trim" description="Crisp baseboards, quarter-round, and trim — installed in a day." />,
});

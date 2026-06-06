import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/campaign")({
  head: () => ({ meta: [{ title: "Get Ready for the Holidays — Premium Floor Transformation | AXO Floors" }, { property: "og:url", content: "/campaign" }], links: [{ rel: "canonical", href: "/campaign" }] }),
  component: () => <PagePlaceholder title="From Worn to WOW in 72 Hours" description="Limited January slots available for full floor transformations in NJ, NY & PA." note="LIMITED JANUARY SLOTS AVAILABLE" />,
});

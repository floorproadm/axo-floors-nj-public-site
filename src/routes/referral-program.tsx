import { createFileRoute } from "@tanstack/react-router";
import PagePlaceholder from "@/components/shared/PagePlaceholder";

export const Route = createFileRoute("/referral-program")({
  head: () => ({ meta: [{ title: "Earn $100 for Every Referral | AXO Floors" }, { property: "og:url", content: "/referral-program" }], links: [{ rel: "canonical", href: "/referral-program" }] }),
  component: () => <PagePlaceholder title="Earn $100 for Every Referral" description="Love AXO Floors? Share us with friends and get a $100 gift card for every new project." ctaLabel="Refer a friend" ctaTo="/contact" />,
});

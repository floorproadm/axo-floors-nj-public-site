import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/floor-diagnostic")({
  beforeLoad: () => { throw redirect({ to: "/quiz" }); },
});

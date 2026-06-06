import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sanding-and-refinish")({
  beforeLoad: () => { throw redirect({ to: "/refinishing" }); },
});

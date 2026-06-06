import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hardwood-flooring")({
  beforeLoad: () => { throw redirect({ to: "/installation" }); },
});

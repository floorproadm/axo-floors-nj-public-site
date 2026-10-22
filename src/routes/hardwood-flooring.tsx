import { createFileRoute } from "@tanstack/react-router";
import { installationRedirect } from "@/lib/installation-redirect";

export const Route = createFileRoute("/hardwood-flooring")({
  server: { handlers: { GET: installationRedirect } },
});
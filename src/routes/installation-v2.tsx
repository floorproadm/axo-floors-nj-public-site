import { createFileRoute } from "@tanstack/react-router";
import { installationRedirect } from "@/lib/installation-redirect";

export const Route = createFileRoute("/installation-v2")({
  server: { handlers: { GET: installationRedirect } },
});
import { createFileRoute } from "@tanstack/react-router";
import { vinylPageHidden } from "@/lib/vinyl-page-hidden";

// Temporarily hidden at the owner's request; the page source stays in src/pages/VinylPlankFlooring.tsx.
export const Route = createFileRoute("/vinyl-plank-flooring")({
  server: { handlers: { GET: vinylPageHidden } },
});

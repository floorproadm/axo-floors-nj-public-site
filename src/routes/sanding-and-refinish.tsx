import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sanding-and-refinish")({
  server: {
    handlers: {
      GET: () => new Response(null, { status: 301, headers: { Location: "/refinishing" } }),
    },
  },
});

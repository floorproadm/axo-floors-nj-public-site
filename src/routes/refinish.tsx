import { createFileRoute } from "@tanstack/react-router";

// Former preview URL for the new refinishing page; now permanently redirects to the live page.
export const Route = createFileRoute("/refinish")({
  server: {
    handlers: {
      GET: () => new Response(null, { status: 301, headers: { Location: "/refinishing" } }),
    },
  },
});

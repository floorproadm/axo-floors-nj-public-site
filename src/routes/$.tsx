import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/$")({
  ssr: false,
  component: AppRoute,
});

function AppRoute() {
  return (
    <ClientOnly fallback={<div style={{ minHeight: "100vh" }} />}>
      <App />
    </ClientOnly>
  );
}

import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Unit-test the server handler without Vite's generated RPC transformation.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "node", include: ["src/lib/meta-*.test.ts"] },
});
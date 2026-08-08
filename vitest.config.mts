import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    passWithNoTests: true,
    // e2e/ holds Playwright specs, run via `npm run test:e2e`, not Vitest.
    exclude: ["**/node_modules/**", "**/e2e/**"],
  },
});

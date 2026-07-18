import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [
        "src/features/slotting/utils/**",
        "src/features/slotting/schemas/**",
        "src/features/slotting/store/**",
        "src/features/slotting/hooks/**",
        "src/shared/**",
      ],
      thresholds: {
        statements: 70,
      },
    },
    css: false,
  },
});

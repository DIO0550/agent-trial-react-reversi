import { defineProject } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineProject({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    include: ["./src/**/*.test.?(m)[jt]s?(x)"],
  },
  resolve: {
    alias: {
      "@": "./src",
    },
  },
});

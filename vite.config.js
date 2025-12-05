import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    server: {
      deps: {
        inline: ["@mui/x-data-grid"],
      },
    },
    coverage: {
      provider: "istanbul", // or "v8"
      all: true, // IMPORTANT: include files not tested
      include: ["src/**/*.jsx", "src/**/*.js", "src/**/*.tsx", "src/**/*.ts"],
      exclude: [
        "src/main.jsx",
        "src/**/__tests__/**",
        "**/*.test.*",
        "**/*.spec.*",
        "src/data",
        "src/routes",
        "**/*.css",
      ],
    },
  },
});

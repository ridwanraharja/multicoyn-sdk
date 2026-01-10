import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MulticoynSDK",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "viem",
        "wagmi",
        "@tanstack/react-query",
        "@rainbow-me/rainbowkit",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          viem: "viem",
          wagmi: "wagmi",
        },
      },
    },
  },
});

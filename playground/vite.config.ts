import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Point to source for development
      'multicoyn-sdk': resolve(__dirname, '../src/index.ts'),
      // Alias for styles - point to source CSS
      'multicoyn-sdk/styles': resolve(__dirname, '../src/styles/tailwind.css'),
    },
  },
  // Optimize deps to process SDK properly
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});



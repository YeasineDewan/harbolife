import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "esnext",
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router")
          ) {
            return "vendor";
          }
          if (
            id.includes("node_modules/@reduxjs/") ||
            id.includes("node_modules/react-redux/")
          ) {
            return "redux";
          }
          if (
            id.includes("node_modules/lucide-react/") ||
            id.includes("node_modules/react-hot-toast/") ||
            id.includes("node_modules/clsx/") ||
            id.includes("node_modules/tailwind-merge/")
          ) {
            return "ui";
          }
          if (
            id.includes("/api/") ||
            id.includes("Api.js") ||
            id.includes("/store/")
          ) {
            return "store-apis";
          }
          if (
            id.includes("node_modules/zod/") ||
            id.includes("node_modules/react-hook-form/") ||
            id.includes("node_modules/@hookform/resolvers/")
          ) {
            return "forms-vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});

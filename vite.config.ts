import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      treeshake: false,
      input: {
        popup: resolve(__dirname, "popup.html"),
        sidepanel: resolve(__dirname, "sidepanel.html"),
        background: resolve(__dirname, "src/background.js"),
        content: resolve(__dirname, "src/content/index.js"),
        popupCss: resolve(__dirname, "src/popup/popup.css"),
        contentCss: resolve(__dirname, "src/content/content.css"),
      },
      output: {
        inlineDynamicImports: false,
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [tailwindcss(), react()],
});

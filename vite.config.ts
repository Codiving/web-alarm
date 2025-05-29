import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      treeshake: false,
      input: {
        popup: resolve(__dirname, "popup.html"),
        background: resolve(__dirname, "src/background.js"),
        content: resolve(__dirname, "src/content.js"),
        popupScript: resolve(__dirname, "src/popup.js"),
        popupCss: resolve(__dirname, "popup.css"),
        contentCss: resolve(__dirname, "content.css")
      },
      output: {
        inlineDynamicImports: false,
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      }
    },
    outDir: "dist",
    emptyOutDir: true
  }
});

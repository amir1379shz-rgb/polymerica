import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync } from "fs";

const staticFiles = [
  "index.html",
  "materials.html",
  "prices.html",
  "robots.txt",
  "sitemap.xml",
  "og-image.png",
];

function copyStaticFiles() {
  return {
    name: "copy-static-files",
    closeBundle() {
      for (const file of staticFiles) {
        try {
          copyFileSync(resolve(__dirname, file), resolve(__dirname, "dist", file));
        } catch (e) {
          console.warn(`Could not copy ${file}:`, e.message);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyStaticFiles()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "polymarket-2.html"),
      },
    },
  },
});

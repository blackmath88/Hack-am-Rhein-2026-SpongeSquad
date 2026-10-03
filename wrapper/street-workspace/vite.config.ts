import { defineConfig } from "vite";
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: { input: { workspace: "index.html", fieldbook: "fieldbook.html" } },
  },
});

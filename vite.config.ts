import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import electron from "vite-plugin-electron/simple";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    electron({
      main: {
        //Main process entry
        entry: "electron/main.ts",
        vite: {
          build: {
            outDir: "dist-electron",
            rolldownOptions: {
              external: ["better-sqlite3"],
            },
          },
        },
      },
      preload: {
        // Preload script shared by both windows
        input: path.join(__dirname, "electron/preload.ts"),
        vite: {
          build: {
            outDir: "dist-electron",
            rollupOptions: {
              output: {
                format: "cjs",
                entryFileNames: "[name].js",
              },
            },
          },
        },
      },
      //Set to false to disable auto relaunching of electron window
      renderer: {},
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },

  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        pip: path.resolve(__dirname, "pip.html"),
      },
    },
  },
});

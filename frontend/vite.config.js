import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa"; // :contentReference[oaicite:1]{index=1}

// NOTE: "Spark" is a temporary name — search for SPARK_RENAME_TAG to rebrand easily. SPARK_RENAME_TAG
const APP_NAME = "Spark"; // SPARK_RENAME_TAG

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: APP_NAME, // SPARK_RENAME_TAG
        short_name: APP_NAME, // SPARK_RENAME_TAG
        description: "Things that spark joy, and things that sparkle away", // SPARK_RENAME_TAG
        theme_color: "#0b0b0f",
        background_color: "#0b0b0f",
        display: "standalone",
        icons: [
          // Replace these with real icons later
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ],
  server: {
    proxy: {
      // Frontend calls /api/... and Vite forwards to Express:
      "/api": "http://localhost:5174"
    }
  }
});

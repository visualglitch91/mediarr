import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

const iconSizes = [48, 72, 96, 128, 192, 512];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg,woff2}"],
        globIgnores: ["latest.json"],
      },
      includeAssets: iconSizes.map(
        (size) => `icons/maskable_icon_x${size}.png`
      ),
      manifest: {
        name: "mediarr",
        short_name: "mediarr",
        description: "An app to manage my media servarr apps",
        scope: "/",
        start_url: "/",
        theme_color: "#0c0a09",
        background_color: "#0c0a09",
        icons: iconSizes.map((size) => ({
          src: `icons/maskable_icon_x${size}.png`,
          sizes: `${size}x${size}`,
          type: "image/png",
          purpose: "maskable",
        })),
      },
    }),
  ],
});

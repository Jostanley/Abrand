import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa"; // ✅ MISSING IMPORT

export default defineConfig({
  base: "/Abrand/",
  plugins: [
    react(),
    tailwindcss(),
    
  ]
});
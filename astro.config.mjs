// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://javier-jimenez-molina.vercel.app",
  integrations: [react()],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: "manual",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

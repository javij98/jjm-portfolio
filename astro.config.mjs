// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { SITE_URL } from "./src/config/url.mjs";

export default defineConfig({
  site: SITE_URL,
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

import type { APIRoute } from "astro";
import { SITE_URL } from "../config/url.mjs";

export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: *\nAllow: /\nSitemap: ${new URL("/sitemap.xml", site ?? SITE_URL).href}\n`,
  { headers: { "Content-Type": "text/plain; charset=utf-8" } },
);

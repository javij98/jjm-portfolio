import type { APIRoute } from "astro";
import { llmsIndex } from "../lib/markdown";
import { SITE_URL } from "../config/url.mjs";

export const GET: APIRoute = ({ site }) => new Response(
  llmsIndex(site ?? new URL(SITE_URL)),
  { headers: { "Content-Type": "text/plain; charset=utf-8" } },
);

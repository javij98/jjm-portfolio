import type { APIRoute } from "astro";
import { portfolioMarkdown } from "../lib/markdown";

export const GET: APIRoute = ({ site }) => new Response(
  portfolioMarkdown("en", site ?? new URL("https://javier-jimenez-molina.vercel.app")),
  { headers: { "Content-Type": "text/plain; charset=utf-8", "Content-Language": "en" } },
);

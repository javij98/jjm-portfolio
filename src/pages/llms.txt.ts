import type { APIRoute } from "astro";
import { llmsIndex } from "../lib/markdown";

export const GET: APIRoute = ({ site }) => new Response(
  llmsIndex(site ?? new URL("https://javier-jimenez-molina.vercel.app")),
  { headers: { "Content-Type": "text/plain; charset=utf-8" } },
);

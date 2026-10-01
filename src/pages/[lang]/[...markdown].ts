import type { APIRoute } from "astro";
import { markdownRoutes, routeMarkdown } from "../../lib/markdown";
import { SITE_URL } from "../../config/url.mjs";

export function getStaticPaths() {
  return markdownRoutes().map((route) => ({ params: { lang: route.lang, markdown: route.path } }));
}

export const GET: APIRoute = ({ params, site }) => {
  const route = markdownRoutes().find((item) => item.lang === params.lang && item.path === params.markdown);
  if (!route) return new Response("Not found", { status: 404 });
  return new Response(routeMarkdown(route, site ?? new URL(SITE_URL)), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Content-Language": route.lang },
  });
};

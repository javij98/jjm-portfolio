import type { APIRoute } from "astro";
import { BLOG_ENABLED } from "../config/site";
import { BLOG_POSTS } from "../data/blog";

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://javier-jimenez-molina.vercel.app");
  const paths = ["es", "en"].flatMap((lang) => [
    `/${lang}`,
    `/${lang}/projects`,
    ...(BLOG_ENABLED ? [`/${lang}/blog`, ...BLOG_POSTS.map((post) => `/${lang}/blog/${post.slug}`)] : []),
  ]);
  const pages = paths
    .map((path) => `<url><loc>${new URL(path, base).toString()}</loc></url>`)
    .join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};

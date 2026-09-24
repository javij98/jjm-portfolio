import { defineMiddleware } from "astro:middleware";

// Manual locale routing is handled by src/pages/[lang]/index.astro.
export const onRequest = defineMiddleware((_context, next) => next());

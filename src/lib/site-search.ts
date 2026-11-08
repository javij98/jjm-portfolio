import type { Locale } from "../i18n/content";

export interface SearchEntry {
  title: string;
  source: string;
  text: string;
  href: string;
}

export function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Deliberately curated equivalents, not a general-purpose translation model.
const equivalentWords = [
  ["kubernetes", "k8s"], ["javascript", "js"], ["typescript", "ts"], ["postgresql", "postgres", "pg"],
  ["container", "containers", "contenedor", "contenedores"],
  ["deployment", "deployments", "deploy", "despliegue", "despliegues", "desplegar"],
  ["automation", "automatizacion"], ["development", "desarrollo"],
  ["monitoring", "monitorizacion", "supervision"],
  ["observability", "observabilidad"], ["infrastructure", "infraestructura"],
  ["project", "projects", "proyecto", "proyectos"], ["experience", "experiencia"],
  ["skill", "skills", "competencia", "competencias", "habilidad", "habilidades"],
  ["education", "training", "formacion"], ["contact", "contacto"],
  ["cv", "curriculum", "resume"],
];
const aliases = new Map(equivalentWords.flatMap((words) => words.map((word) => [word, words[0]] as const)));
function queryTerms(query: string): string[] {
  return (normalize(query).match(/[\p{L}\p{N}]+/gu) ?? []).map((term) => aliases.get(term) ?? term);
}

function distance(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[b.length];
}

export function scoreEntry(entry: SearchEntry, query: string): number {
  const terms = queryTerms(query);
  if (!terms.length) return 0;
  const title = normalize(entry.title);
  const text = normalize(`${entry.source} ${entry.text}`);
  const titleWords = (title.match(/[\p{L}\p{N}]+/gu) ?? []).map((word) => aliases.get(word) ?? word);
  const words = Array.from(new Set(`${title} ${text}`.match(/[\p{L}\p{N}]+/gu) ?? []));
  const canonicalWords = new Set(words.map((word) => aliases.get(word) ?? word));
  let score = 0;
  for (const term of terms) {
    if (title.includes(term) || titleWords.includes(term)) score += 12;
    else if (text.includes(term) || canonicalWords.has(term)) score += 5;
    else {
      const limit = term.length >= 8 ? 2 : term.length >= 5 ? 1 : 0;
      if (!limit || !words.some((word) => distance(term, word, limit) <= limit)) return 0;
      score += 1;
    }
  }
  if (title.includes(normalize(query.trim()))) score += 20;
  return score;
}

export function excerpt(entry: SearchEntry, query: string): string {
  const terms = queryTerms(query);
  const text = entry.text.replace(/\s+/g, " ").trim();
  const normalized = normalize(text);
  const positions = terms.flatMap((term) => (equivalentWords.find((words) => words[0] === term) ?? [term])
    .map((word) => normalized.indexOf(word))).filter((index) => index >= 0);
  const position = positions.length ? Math.min(...positions) : 0;
  const start = Math.max(0, position - 60);
  const end = Math.min(text.length, Math.max(start + 160, position + 100));
  return `${start ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

function cleanText(element: Element): string {
  const clone = element.cloneNode(true) as Element;
  clone.querySelectorAll("script, style, svg, template, noscript, [aria-hidden='true']").forEach((node) => node.remove());
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];
  while (walker.nextNode()) parts.push(walker.currentNode.textContent ?? "");
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function extract(doc: Document, path: string, lang: Locale): SearchEntry[] {
  const main = doc.querySelector("main");
  if (!main) return [];
  const home = path === `/${lang}`;
  const projects = path === `/${lang}/projects`;
  const blogPost = path.startsWith(`/${lang}/blog/`);
  const cv = path === `/${lang}/cv`;
  const fullCv = path === `/${lang}/cv/${lang === "es" ? "completo" : "full"}`;
  const entries: SearchEntry[] = [];
  const add = (element: Element, title: string, source: string, href: string) => {
    const text = cleanText(element);
    if (title && text) entries.push({ title, source, text, href });
  };
  if (home) {
    for (const section of main.querySelectorAll(":scope > section[id]")) {
      const copy = section.cloneNode(true) as Element;
      copy.querySelectorAll("dialog").forEach((node) => node.remove());
      const title = section.querySelector("h1, h2")?.textContent?.trim() ?? section.id;
      add(copy, title, lang === "es" ? "Sección" : "Section", `${path}#${section.id}`);
    }
    main.querySelectorAll<HTMLDialogElement>("dialog[id^='work-case-dialog-']").forEach((dialog) => {
      add(dialog, dialog.querySelector("h2")?.textContent?.trim() ?? "", lang === "es" ? "Experiencia · Caso" : "Experience · Case study", `${path}#${dialog.id}`);
    });
  } else if (fullCv) {
    for (const section of main.querySelectorAll(":scope > section[id]")) {
      const copy = section.cloneNode(true) as Element;
      copy.querySelectorAll("dialog").forEach((node) => node.remove());
      const title = section.querySelector("h1, h2")?.textContent?.trim() ?? section.id;
      add(copy, title, lang === "es" ? "CV · Sección" : "CV · Section", `${path}#${section.id}`);
    }
    main.querySelectorAll<HTMLDialogElement>("dialog[id^='work-case-dialog-']").forEach((dialog) => {
      add(dialog, dialog.querySelector("h2")?.textContent?.trim() ?? "", lang === "es" ? "Experiencia · Caso" : "Experience · Case study", `${path}#${dialog.id}`);
    });
    main.querySelectorAll<HTMLDialogElement>("dialog[id^='project-dialog-']").forEach((dialog) => {
      add(dialog, dialog.querySelector("h2")?.textContent?.trim() ?? "", lang === "es" ? "Proyecto" : "Project", `${path}#${dialog.id}`);
    });
  } else if (projects) {
    main.querySelectorAll<HTMLDialogElement>("dialog[id^='project-dialog-']").forEach((dialog) => {
      add(dialog, dialog.querySelector("h2")?.textContent?.trim() ?? "", lang === "es" ? "Proyecto" : "Project", `${path}#${dialog.id}`);
    });
  } else if (blogPost || cv) {
    const article = main.querySelector("article");
    if (article) add(article, cv ? "CV" : article.querySelector("h1")?.textContent?.trim() ?? "", cv ? (lang === "es" ? "Currículum" : "Résumé") : "Blog", path);
  } else {
    const title = main.querySelector("h1, h2")?.textContent?.trim();
    if (title) add(main, title, lang === "es" ? "Página" : "Page", path);
  }
  return entries;
}

// Crawl only same-language HTML links published by the site; no external service or private data.
export async function buildSearchIndex(lang: Locale): Promise<{ entries: SearchEntry[]; incomplete: boolean }> {
  const pending = [`/${lang}`];
  const visited = new Set<string>();
  const entries: SearchEntry[] = [];
  let incomplete = false;
  while (pending.length && visited.size < 60) {
    const batch = pending.splice(0, 6).filter((path) => !visited.has(path));
    batch.forEach((path) => visited.add(path));
    const pages = await Promise.all(batch.map(async (path) => {
      try {
        const response = await fetch(path);
        if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) throw new Error("Page unavailable");
        return { path, doc: new DOMParser().parseFromString(await response.text(), "text/html") };
      } catch {
        incomplete = true;
        return null;
      }
    }));
    for (const page of pages) {
      if (!page) continue;
      entries.push(...extract(page.doc, page.path, lang));
      for (const link of page.doc.querySelectorAll<HTMLAnchorElement>("a[href]")) {
        const url = new URL(link.getAttribute("href")!, window.location.origin);
        const path = url.pathname.replace(/\/+$/, "") || "/";
        if (url.origin !== window.location.origin || !(path === `/${lang}` || path.startsWith(`/${lang}/`)) || path === `/${lang}/llm` || /\.[a-z0-9]+$/i.test(path)) continue;
        if (!visited.has(path) && !pending.includes(path)) pending.push(path);
      }
    }
  }
  if (pending.length) incomplete = true;
  return { entries, incomplete };
}

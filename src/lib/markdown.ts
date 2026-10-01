import { BLOG_ENABLED } from "../config/site";
import { BLOG_POSTS, type BlogPost } from "../data/blog";
import { LOCALES, SITE_BY_LANG, type Locale, type SiteContent } from "../i18n/content";

const labels = {
  es: {
    language: "Idioma", location: "Ubicación", website: "Web", markdown: "Perfil completo en Markdown",
    role: "Perfil", direction: "Dirección profesional", category: "Categoría", status: "Estado",
    estimated: "Estimación", documented: "Resultado documentado", article: "Artículo original",
    otherLanguage: "English version", otherLocale: "en", blogIntro: "Notas sobre DevOps, ingeniería y proyectos personales.",
  },
  en: {
    language: "Language", location: "Location", website: "Website", markdown: "Complete Markdown profile",
    role: "Role", direction: "Career direction", category: "Category", status: "Status",
    estimated: "Estimate", documented: "Documented result", article: "Original article",
    otherLanguage: "Versión en español", otherLocale: "es", blogIntro: "Notes on DevOps, engineering and personal projects.",
  },
} as const;

// Content is plain text in the shared data. Escape Markdown syntax without changing its meaning.
function inline(value: string): string {
  return value.replace(/([\\`*_\[\]<>])/g, "\\$1");
}

function heading(level: number, value: string): string {
  return `${"#".repeat(level)} ${inline(value)}`;
}

function list(values: string[]): string {
  return values.map((value) => `- ${inline(value)}`).join("\n");
}

function field(label: string, value: string): string {
  return `**${inline(label)}:** ${inline(value)}`;
}

function link(label: string, path: string, site: URL): string {
  return `[${inline(label)}](${new URL(path, site).href})`;
}

function document(parts: string[]): string {
  return `${parts.filter(Boolean).join("\n\n")}\n`;
}

function projects(content: SiteContent, lang: Locale): string[] {
  return [
    heading(2, content.projects.title),
    inline(content.projects.introduction),
    ...content.projects.items.flatMap((project) => [
      heading(3, project.name),
      inline(project.kind),
      inline(project.description),
      ...project.detailParagraphs.map(inline),
      field(labels[lang].category, content.projects.filters[project.category]),
      heading(4, content.projects.highlightLabel),
      list(project.highlights),
      field(content.projects.stackLabel, project.stack.join(", ")),
    ]),
  ];
}

function postParts(post: BlogPost, lang: Locale, site: URL, level: number): string[] {
  const data = post.content[lang];
  return [
    heading(level, data.title),
    field(labels[lang].category, post.category[lang]),
    link(labels[lang].article, `/${lang}/blog/${post.slug}`, site),
    inline(data.excerpt),
    ...data.paragraphs.map(inline),
  ];
}

function blog(lang: Locale, site: URL): string[] {
  if (!BLOG_ENABLED) return [];
  return [
    heading(2, SITE_BY_LANG[lang].nav.blog),
    labels[lang].blogIntro,
    ...BLOG_POSTS.flatMap((post) => postParts(post, lang, site, 3)),
  ];
}

export function portfolioMarkdown(lang: Locale, site: URL): string {
  const content = SITE_BY_LANG[lang];
  const text = labels[lang];
  const { profile, about, experience, skills, education, contact } = content;
  return document([
    heading(1, profile.name),
    `> ${inline(profile.role)}`,
    inline(profile.introduction),
    field(text.role, profile.role),
    field(text.direction, profile.direction),
    field(text.location, profile.location),
    field(text.language, lang === "es" ? "Español" : "English"),
    link(text.website, `/${lang}`, site),
    link(text.markdown, `/${lang}/index.md`, site),
    link(text.otherLanguage, `/${text.otherLocale}/index.md`, site),
    field(content.hero.focus, content.hero.focusAreas.join(", ")),
    ...content.hero.terminalLines.map(inline),
    heading(2, about.title),
    ...about.paragraphs.map(inline),
    heading(3, about.asideTitle),
    inline(about.asideText),
    field(about.interestsLabel, about.interests.join(", ")),
    heading(2, experience.title),
    inline(experience.introduction),
    ...experience.items.flatMap((item) => [
      heading(3, `${item.company} — ${item.role}`),
      inline(item.period),
      ...(item.current ? [inline(experience.currentLabel)] : []),
      inline(item.summary),
      ...(item.evolution ? [field(experience.evolutionLabel, item.evolution.join(" → "))] : []),
      list(item.achievements),
    ]),
    heading(2, experience.examplesTitle),
    inline(experience.examplesIntroduction),
    ...experience.examples.flatMap((example) => [
      heading(3, example.title),
      inline(example.area),
      field(text.status, example.status),
      inline(example.description),
      field(experience.exampleLabels.problem, example.problem),
      field(experience.exampleLabels.solution, example.solution),
      field(experience.exampleLabels.impact, example.impact),
      ...(example.metric ? [
        field(example.metric.kind === "estimated" ? text.estimated : text.documented, `${example.metric.value} — ${example.metric.label}`),
        ...(example.metric.note ? [inline(example.metric.note)] : []),
      ] : []),
      field(experience.exampleLabels.stack, example.stack.join(", ")),
    ]),
    ...projects(content, lang),
    heading(2, skills.title),
    inline(skills.introduction),
    ...skills.categories.flatMap((category) => [
      heading(3, category.title),
      inline(category.description),
      list(category.skills.map((skill) => `${skill.name} — ${skills.levels[skill.level]}`)),
    ]),
    heading(2, education.title),
    heading(3, education.degree),
    inline(`${education.institution} · ${education.period}`),
    heading(3, education.trainingTitle),
    list(education.training),
    ...blog(lang, site),
    heading(2, contact.title),
    inline(contact.description),
    inline(contact.statement),
    `- ${link(profile.email, `mailto:${profile.email}`, site)}\n- ${link(contact.linkedinLabel, profile.linkedin, site)}\n- ${link(contact.githubLabel, profile.github, site)}`,
  ]);
}

export interface MarkdownRoute {
  lang: Locale;
  path: string;
  kind: "portfolio" | "projects" | "blog" | "post";
  slug?: string;
}

export function markdownRoutes(): MarkdownRoute[] {
  return LOCALES.flatMap((lang): MarkdownRoute[] => [
    { lang, path: "index.md", kind: "portfolio" },
    { lang, path: "projects.md", kind: "projects" },
    ...(BLOG_ENABLED ? [
      { lang, path: "blog/index.md", kind: "blog" } as const,
      ...BLOG_POSTS.map((post): MarkdownRoute => ({ lang, path: `blog/${post.slug}.md`, kind: "post", slug: post.slug })),
    ] : []),
  ]);
}

export function routeMarkdown(route: MarkdownRoute, site: URL): string {
  if (route.kind === "portfolio") return portfolioMarkdown(route.lang, site);
  const content = SITE_BY_LANG[route.lang];
  if (route.kind === "projects") {
    return document([
      heading(1, `${content.profile.name} — ${content.nav.projects}`),
      link(labels[route.lang].website, `/${route.lang}/projects`, site),
      link(labels[route.lang].markdown, `/${route.lang}/index.md`, site),
      ...projects(content, route.lang),
    ]);
  }
  if (route.kind === "blog") {
    return document([
      heading(1, `${content.profile.name} — ${content.nav.blog}`),
      link(labels[route.lang].website, `/${route.lang}/blog`, site),
      ...blog(route.lang, site),
    ]);
  }
  const post = BLOG_POSTS.find((item) => item.slug === route.slug);
  if (!post) throw new Error(`Unknown blog post: ${route.slug}`);
  return document(postParts(post, route.lang, site, 1));
}

export function markdownPath(currentPath: string, lang: Locale): string {
  const suffix = currentPath.replace(/^\/(es|en)(?=\/|$)/, "").replace(/\/$/, "");
  if (!suffix || suffix === "/llm") return `/${lang}/index.md`;
  if (suffix === "/blog") return `/${lang}/blog/index.md`;
  return `/${lang}${suffix}.md`;
}

export function llmsIndex(site: URL): string {
  const profile = SITE_BY_LANG.en.profile;
  return document([
    heading(1, profile.name),
    `> ${inline(profile.introduction)}`,
    `${inline(profile.direction)}. Based in ${inline(profile.location)}.`,
    "The links below provide the published portfolio as plain Markdown, including full project descriptions and work examples. Skill levels, case status and the distinction between estimated and documented impact are included in the content.",
    heading(2, "Complete profile"),
    `- ${link("English profile", "/en/index.md", site)}: Experience, all projects, work examples, skills, education, contact and published articles.\n- ${link("Perfil en español", "/es/index.md", site)}: The same complete portfolio in Spanish.\n- ${link("Complete English content", "/llms-full.txt", site)}: Single-file plain-text export.`,
    heading(2, "Projects"),
    `- ${link("Personal projects in English", "/en/projects.md", site)}: Full descriptions, highlights and technologies.\n- ${link("Proyectos personales en español", "/es/projects.md", site)}: Descripciones completas, aspectos destacados y tecnologías.`,
    ...(BLOG_ENABLED ? [
      heading(2, "Blog"),
      `- ${link("Articles in English", "/en/blog/index.md", site)}: All published articles in full.\n- ${link("Artículos en español", "/es/blog/index.md", site)}: Todos los artículos publicados completos.`,
    ] : []),
    heading(2, "Optional"),
    `- ${link("Visual portfolio in English", "/en", site)}: Human mode.\n- ${link("Portfolio visual en español", "/es", site)}: Modo Human.`,
  ]);
}

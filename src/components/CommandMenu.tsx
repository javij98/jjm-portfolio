import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Command } from "cmdk";
import {
  Briefcase,
  BookOpen,
  FileText,
  FolderKanban,
  Github,
  GraduationCap,
  Home,
  Languages,
  Layers3,
  Linkedin,
  Mail,
  UserRound,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "../i18n/content";
import { buildSearchIndex, excerpt, normalize, scoreEntry, type SearchEntry } from "../lib/site-search";
import { cvEmailHref } from "../lib/cv-actions";

interface Props {
  lang: Locale;
  email: string;
  linkedin: string;
  githubHref: string;
  blogEnabled: boolean;
}

interface MenuItem {
  label: string;
  keywords: string;
  icon: LucideIcon;
  action: () => void;
}

export default function CommandMenu({ lang, email, linkedin, githubHref, blogEnabled }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [indexState, setIndexState] = useState<"idle" | "loading" | "ready" | "partial">("idle");
  const [showHint, setShowHint] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasOpenRef = useRef(false);
  const restoreFocusRef = useRef(false);

  const isSpanish = lang === "es";
  const labels = isSpanish
    ? {
        trigger: "Comandos",
        dialog: "Navegación rápida",
        placeholder: "Buscar en toda la web...",
        empty: "Sin resultados",
        loading: "Buscando en el contenido de la web…",
        partial: "Algunas páginas no están disponibles; los resultados pueden estar incompletos.",
        results: "Contenido",
        actions: "Acciones",
        emailCv: ["Enviarte el CV en español por correo", "Enviarte el CV en inglés por correo"],
        emailHint: "Abre un borrador con el enlace al PDF",
        hint: "Busca en la web",
        shortHint: "Buscar",
        close: "Cerrar",
        sections: ["Secciones", "Enlaces", "Idioma"],
        items: ["Inicio", "Sobre mí", "Proyectos", "Experiencia", "Competencias", "Formación", "Contacto", "GitHub", "LinkedIn", "Enviar email", "Español", "English"],
      }
    : {
        trigger: "Commands",
        dialog: "Quick navigation",
        placeholder: "Search the whole site...",
        empty: "No results",
        loading: "Searching site content…",
        partial: "Some pages are unavailable; results may be incomplete.",
        results: "Content",
        actions: "Actions",
        emailCv: ["Email yourself the Spanish CV", "Email yourself the English CV"],
        emailHint: "Opens an email draft with the PDF link",
        hint: "Search the site",
        shortHint: "Search",
        close: "Close",
        sections: ["Sections", "Links", "Language"],
        items: ["Home", "About", "Projects", "Experience", "Skills", "Education", "Contact", "GitHub", "LinkedIn", "Send email", "Español", "English"],
      };

  const navigate = (id: string) => {
    setOpen(false);
    const homePath = `/${lang}`;
    if (window.location.pathname.replace(/\/$/, "") === homePath) window.location.hash = id;
    else window.location.assign(`${homePath}#${id}`);
  };

  const navigateCvSection = (id: string) => {
    setOpen(false);
    const path = `/${lang}/cv`;
    if (window.location.pathname.replace(/\/$/, "") === path) {
      window.location.hash = id;
      document.getElementById(id)?.scrollIntoView();
    } else window.location.assign(`${path}#${id}`);
  };
  const switchLanguage = (target: Locale) => {
    const suffix = window.location.pathname.replace(/^\/(es|en)/, "").replace(/\/+$/, "");
    window.location.assign(`/${target}${suffix}${window.location.hash}`);
  };

  const sections: MenuItem[] = [
    { label: labels.items[0], keywords: "home inicio", icon: Home, action: () => navigate("hero") },
    { label: labels.items[1], keywords: "about sobre mi", icon: UserRound, action: () => navigate("about") },
    { label: labels.items[2], keywords: "projects proyectos portfolio", icon: FolderKanban, action: () => navigateCvSection("projects") },
    { label: labels.items[3], keywords: "experience experiencia career", icon: Briefcase, action: () => navigateCvSection("experience") },
    { label: labels.items[4], keywords: "skills competencias stack", icon: Layers3, action: () => navigateCvSection("skills") },
    { label: labels.items[5], keywords: "education formacion", icon: GraduationCap, action: () => navigateCvSection("education") },
    ...(blogEnabled ? [{ label: "Blog", keywords: "blog articles notas posts", icon: BookOpen, action: () => window.location.assign(`/${lang}/blog`) }] : []),
    { label: "CV", keywords: "cv curriculum resume", icon: FileText, action: () => window.location.assign(`/${lang}/cv`) },
    { label: labels.items[6], keywords: "contact contacto", icon: Mail, action: () => navigate("contact") },
  ];
  const links: MenuItem[] = [
    { label: labels.items[7], keywords: "github code", icon: Github, action: () => window.open(githubHref, "_blank", "noopener,noreferrer") },
    { label: labels.items[8], keywords: "linkedin social", icon: Linkedin, action: () => window.open(linkedin, "_blank", "noopener,noreferrer") },
    { label: labels.items[9], keywords: "email mail", icon: Mail, action: () => window.location.assign(`mailto:${email}`) },
  ];
  const languages: MenuItem[] = [
    { label: labels.items[10], keywords: "spanish espanol es", icon: Languages, action: () => switchLanguage("es") },
    { label: labels.items[11], keywords: "english en", icon: Languages, action: () => switchLanguage("en") },
  ];

  const normalizedQuery = normalize(query);
  const cvQuery = /\b(cv|curriculum|resume)\b/.test(normalizedQuery);
  const emailIntent = /\b(envi\w*|mand\w*|recib\w*|send\w*|email|e mail|correo|mail)\b/.test(normalizedQuery);
  const showCvActions = !query.trim() || (cvQuery && (emailIntent || /^(cv|curriculum|resume)$/.test(normalizedQuery.trim())));
  const wantsSpanish = /\b(espanol|spanish)\b/.test(normalizedQuery);
  const wantsEnglish = /\b(ingles|english)\b/.test(normalizedQuery);
  const cvActions = (["es", "en"] as const).filter((pdfLanguage) => showCvActions &&
    (!(wantsSpanish || wantsEnglish) || (pdfLanguage === "es" ? wantsSpanish : wantsEnglish)))
    .map((pdfLanguage) => ({ pdfLanguage, href: cvEmailHref(lang, pdfLanguage), label: labels.emailCv[pdfLanguage === "es" ? 0 : 1] }));

  useEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const sameOriginReferrer = document.referrer && new URL(document.referrer).origin === window.location.origin;
    if (navigation?.type !== "reload" && (navigation?.type === "back_forward" || sameOriginReferrer)) return;
    setShowHint(true);
    const timer = window.setTimeout(() => setShowHint(false), 4000);
    const onFocus = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest("header") && !triggerRef.current?.contains(target)) setShowHint(false);
    };
    document.addEventListener("focusin", onFocus);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("focusin", onFocus);
    };
  }, []);

  useEffect(() => {
    if (!open || indexState !== "idle") return;
    setIndexState("loading");
    buildSearchIndex(lang).then(({ entries: found, incomplete }) => {
      setEntries(found);
      setIndexState(incomplete ? "partial" : "ready");
    });
  }, [open, lang, indexState]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return entries.map((entry) => ({ entry, score: scoreEntry(entry, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);
  }, [entries, query]);
  const groups = [sections, links, languages].map((group) => query.trim()
    ? group.filter((item) => scoreEntry({ title: item.label, source: "", text: item.keywords, href: "" }, query) > 0)
    : group);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        restoreFocusRef.current = true;
        setOpen((previous) => !previous);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setShowHint(false);
      wasOpenRef.current = true;
      document.body.style.overflow = "hidden";
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      setQuery("");
      if (wasOpenRef.current && restoreFocusRef.current) triggerRef.current?.focus();
      restoreFocusRef.current = false;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const run = (action: () => void) => {
    restoreFocusRef.current = false;
    setOpen(false);
    action();
  };

  const openResult = (href: string) => {
    const target = new URL(href, window.location.origin);
    if (target.href === window.location.href && target.hash) {
      window.setTimeout(() => window.dispatchEvent(new HashChangeEvent("hashchange")), 0);
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(event) => {
          restoreFocusRef.current = event.detail === 0;
          setOpen(true);
        }}
        aria-label={labels.trigger}
        aria-expanded={open}
        className="signal-hover inline-flex h-9 shrink-0 items-center whitespace-nowrap gap-2 rounded-md border border-white/15 bg-slate-900/60 px-2.5 text-xs text-slate-200 focus-visible:outline-2 focus-visible:outline-cyan-300"
      >
        <Search className="h-4 w-4 text-cyan-300" aria-hidden="true" />
        <span className="hidden md:inline lg:hidden">{labels.trigger}</span>
        <kbd className="hidden shrink-0 whitespace-nowrap font-mono text-[10px] text-slate-400 md:inline lg:hidden">⌘/Ctrl K</kbd>
        {showHint && <span data-search-expansion aria-hidden="true" className="search-discovery-expansion"><Search className="h-4 w-4 shrink-0 text-cyan-300" /><span className="search-expansion-label"><span className="search-expansion-long">{labels.hint}</span><span className="search-expansion-short">{labels.shortHint}</span></span></span>}
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[90] w-screen bg-slate-950/80 px-3 pt-20 backdrop-blur-sm sm:pt-28"
          onMouseDown={(event) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
              restoreFocusRef.current = false;
              setOpen(false);
            }
          }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={labels.dialog}
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const focusable = panelRef.current?.querySelectorAll<HTMLElement>("input, button");
              if (!focusable?.length) return;
              const first = focusable.item(0);
              const last = focusable.item(focusable.length - 1);
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
              }
            }}
            className="mx-auto max-w-xl overflow-hidden rounded-xl border border-white/15 bg-slate-900 shadow-2xl shadow-black/50"
          >
            <Command label={labels.dialog} shouldFilter={false}>
              <div className="flex items-center gap-2 border-b border-white/10 px-4">
                <Search className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                <Command.Input ref={inputRef} value={query} onValueChange={setQuery} placeholder={labels.placeholder} className="h-13 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400" />
                <button type="button" onClick={() => { restoreFocusRef.current = false; setOpen(false); }} aria-label={labels.close} className="rounded-md p-2 text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300"><X className="h-4 w-4" /></button>
              </div>
              <Command.List className="max-h-[min(65vh,28rem)] overflow-y-auto p-2">
                {indexState === "loading" && query.trim() && <p role="status" className="px-3 py-2 text-xs text-slate-400">{labels.loading}</p>}
                {indexState === "partial" && <p role="status" className="px-3 py-2 text-xs text-amber-200">{labels.partial}</p>}
                {query.trim() && indexState !== "loading" && !results.length && !cvActions.length && !groups.some((group) => group.length) && <p className="px-3 py-6 text-center text-sm text-slate-400">{labels.empty}</p>}
                {results.length > 0 && <Command.Group heading={labels.results} className="mb-2 font-mono text-[11px] uppercase tracking-wider text-slate-400 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2">
                  {results.map(({ entry }) => (
                    <Command.Item key={entry.href} value={entry.href} onSelect={() => run(() => openResult(entry.href))} className="flex cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 text-sm normal-case tracking-normal text-slate-200 outline-none data-[selected=true]:bg-emerald-400/10 data-[selected=true]:text-white">
                      <Search className="mt-1 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                      <span className="min-w-0"><span className="block font-semibold">{entry.title}</span><span className="block text-xs text-emerald-300">{entry.source}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{excerpt(entry, query)}</span></span>
                    </Command.Item>
                  ))}
                </Command.Group>}
                {groups.map((group, groupIndex) => group.length > 0 && (
                  <Command.Group key={labels.sections[groupIndex]} heading={labels.sections[groupIndex]} className="mb-2 font-mono text-[11px] uppercase tracking-wider text-slate-400 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2">
                    {group.map((item) => (
                      <Command.Item key={item.label} value={`${item.label} ${item.keywords}`} onSelect={() => run(item.action)} className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm normal-case tracking-normal text-slate-200 outline-none data-[selected=true]:bg-emerald-400/10 data-[selected=true]:text-white">
                        <item.icon className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                        {item.label}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
                {cvActions.length > 0 && <Command.Group heading={labels.actions} className="mb-2 font-mono text-[11px] uppercase tracking-wider text-slate-400 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2">
                  {cvActions.map(({ pdfLanguage, href, label }) => (
                    <Command.Item key={pdfLanguage} value={`email-cv-${pdfLanguage}`} data-search-action={`email-cv-${pdfLanguage}`} data-action-href={href} onSelect={() => run(() => window.location.assign(href))} className="flex cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 text-sm normal-case tracking-normal text-slate-200 outline-none data-[selected=true]:bg-emerald-400/10 data-[selected=true]:text-white">
                      <Mail className="mt-1 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                      <span><span className="block">{label}</span><span className="block text-xs text-slate-400">{labels.emailHint}</span></span>
                    </Command.Item>
                  ))}
                </Command.Group>}
              </Command.List>
            </Command>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

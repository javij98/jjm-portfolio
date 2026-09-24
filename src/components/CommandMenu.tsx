import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Command } from "cmdk";
import {
  Briefcase,
  BookOpen,
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
        placeholder: "Buscar sección o enlace...",
        empty: "Sin resultados",
        close: "Cerrar",
        sections: ["Secciones", "Enlaces", "Idioma"],
        items: ["Inicio", "Sobre mí", "Proyectos", "Experiencia", "Competencias", "Formación", "Contacto", "GitHub", "LinkedIn", "Enviar email", "Español", "English"],
      }
    : {
        trigger: "Commands",
        dialog: "Quick navigation",
        placeholder: "Find a section or link...",
        empty: "No results",
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

  const sections: MenuItem[] = [
    { label: labels.items[0], keywords: "home inicio", icon: Home, action: () => navigate("hero") },
    { label: labels.items[1], keywords: "about sobre mi", icon: UserRound, action: () => navigate("about") },
    { label: labels.items[2], keywords: "projects proyectos portfolio", icon: FolderKanban, action: () => navigate("projects") },
    { label: labels.items[3], keywords: "experience experiencia career", icon: Briefcase, action: () => navigate("experience") },
    { label: labels.items[4], keywords: "skills competencias stack", icon: Layers3, action: () => navigate("skills") },
    { label: labels.items[5], keywords: "education formacion", icon: GraduationCap, action: () => navigate("education") },
    ...(blogEnabled ? [{ label: "Blog", keywords: "blog articles notas posts", icon: BookOpen, action: () => window.location.assign(`/${lang}/blog`) }] : []),
    { label: labels.items[6], keywords: "contact contacto", icon: Mail, action: () => navigate("contact") },
  ];
  const links: MenuItem[] = [
    { label: labels.items[7], keywords: "github code", icon: Github, action: () => window.open(githubHref, "_blank", "noopener,noreferrer") },
    { label: labels.items[8], keywords: "linkedin social", icon: Linkedin, action: () => window.open(linkedin, "_blank", "noopener,noreferrer") },
    { label: labels.items[9], keywords: "email mail", icon: Mail, action: () => window.location.assign(`mailto:${email}`) },
  ];
  const languages: MenuItem[] = [
    { label: labels.items[10], keywords: "spanish espanol es", icon: Languages, action: () => window.location.assign(`/es${window.location.pathname.replace(/^\/(es|en)/, "")}${window.location.hash}`) },
    { label: labels.items[11], keywords: "english en", icon: Languages, action: () => window.location.assign(`/en${window.location.pathname.replace(/^\/(es|en)/, "")}${window.location.hash}`) },
  ];

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
      wasOpenRef.current = true;
      document.body.style.overflow = "hidden";
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = "";
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
        <span className="hidden lg:inline">{labels.trigger}</span>
        <kbd className="hidden shrink-0 whitespace-nowrap font-mono text-[10px] text-slate-400 lg:inline">⌘/Ctrl K</kbd>
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[90] bg-slate-950/80 px-3 pt-20 backdrop-blur-sm sm:pt-28"
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
            <Command label={labels.dialog}>
              <div className="flex items-center gap-2 border-b border-white/10 px-4">
                <Search className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                <Command.Input ref={inputRef} placeholder={labels.placeholder} className="h-13 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400" />
                <button type="button" onClick={() => { restoreFocusRef.current = false; setOpen(false); }} aria-label={labels.close} className="rounded-md p-2 text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300"><X className="h-4 w-4" /></button>
              </div>
              <Command.List className="max-h-[min(65vh,28rem)] overflow-y-auto p-2">
                <Command.Empty className="px-3 py-6 text-center text-sm text-slate-400">{labels.empty}</Command.Empty>
                {[sections, links, languages].map((group, groupIndex) => (
                  <Command.Group key={labels.sections[groupIndex]} heading={labels.sections[groupIndex]} className="mb-2 font-mono text-[11px] uppercase tracking-wider text-slate-400 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2">
                    {group.map((item) => (
                      <Command.Item key={item.label} value={`${item.label} ${item.keywords}`} onSelect={() => run(item.action)} className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm normal-case tracking-normal text-slate-200 outline-none data-[selected=true]:bg-emerald-400/10 data-[selected=true]:text-white">
                        <item.icon className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                        {item.label}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

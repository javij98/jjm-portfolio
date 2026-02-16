import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Command } from "cmdk";
import {
  Briefcase,
  Download,
  FolderKanban,
  Github,
  Home,
  Languages,
  Linkedin,
  Mail,
  Search,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "../i18n/ui";

interface CommandMenuProps {
  lang: Locale;
  currentPath: string;
  resumeDownloadHref: string;
  email: string;
  linkedin: string;
  githubHref?: string;
}

type CommandGroupId = "navigation" | "social" | "system";

interface CommandItemConfig {
  id: string;
  group: CommandGroupId;
  label: string;
  keywords: string;
  icon: LucideIcon;
  action: () => void;
  shortcut?: string;
}

export default function CommandMenu({
  lang,
  currentPath,
  resumeDownloadHref,
  email,
  linkedin,
  githubHref = "https://github.com/javij98",
}: CommandMenuProps) {
  const [open, setOpen] = useState(false);
  const [modifierLabel, setModifierLabel] = useState("Ctrl");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const t = lang === "es"
    ? {
        trigger: "Comandos",
        placeholder: "Escribe un comando o busca...",
        empty: "Sin resultados.",
        closeAria: "Cerrar comandos",
        sections: {
          navigation: "Navegación",
          social: "Social",
          system: "Sistema",
        },
        items: {
          home: "Ir a Inicio",
          experience: "Ir a Experiencia",
          projects: "Ir a Métricas",
          skills: "Ir a Skills",
          github: "Abrir GitHub",
          linkedin: "Abrir LinkedIn",
          email: "Enviar Email",
          langEs: "Cambiar a Español",
          langEn: "Switch to English",
          downloadCv: "Descargar CV",
        },
      }
    : {
        trigger: "Commands",
        placeholder: "Type a command or search...",
        empty: "No results found.",
        closeAria: "Close commands",
        sections: {
          navigation: "Navigation",
          social: "Social",
          system: "System",
        },
        items: {
          home: "Go to Home",
          experience: "Go to Experience",
          projects: "Go to Metrics",
          skills: "Go to Skills",
          github: "Open GitHub",
          linkedin: "Open LinkedIn",
          email: "Send Email",
          langEs: "Cambiar a español",
          langEn: "Switch to English",
          downloadCv: "Download CV",
        },
      };

  const normalizeUrl = useCallback((url: string) => {
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  }, []);

  const navigateToSection = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `${window.location.pathname}#${sectionId}`);
        return;
      }

      window.location.assign(`/${lang}#${sectionId}`);
    },
    [lang],
  );

  const switchLocale = useCallback(
    (targetLang: Locale) => {
      const segments = currentPath.split("/").filter(Boolean);
      if (segments[0] === "es" || segments[0] === "en") {
        segments[0] = targetLang;
      } else {
        segments.unshift(targetLang);
      }

      const nextPath = segments.length > 0 ? `/${segments.join("/")}` : `/${targetLang}`;
      window.location.assign(nextPath);
    },
    [currentPath],
  );

  const downloadResume = useCallback(() => {
    const anchor = document.createElement("a");
    anchor.href = resumeDownloadHref;
    anchor.download = "";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  }, [resumeDownloadHref]);

  const openExternal = useCallback((url: string) => {
    window.open(normalizeUrl(url), "_blank", "noopener,noreferrer");
  }, [normalizeUrl]);

  const commandItems = useMemo<CommandItemConfig[]>(
    () => [
      {
        id: "nav-home",
        group: "navigation",
        label: t.items.home,
        keywords: "hero inicio home",
        icon: Home,
        action: () => navigateToSection("hero"),
      },
      {
        id: "nav-metrics",
        group: "navigation",
        label: t.items.projects,
        keywords: "metrics metricas",
        icon: FolderKanban,
        action: () => navigateToSection("metrics"),
      },
      {
        id: "nav-experience",
        group: "navigation",
        label: t.items.experience,
        keywords: "experience experiencia",
        icon: Briefcase,
        action: () => navigateToSection("experience"),
      },
      {
        id: "nav-skills",
        group: "navigation",
        label: t.items.skills,
        keywords: "skills stack tech",
        icon: Wrench,
        action: () => navigateToSection("skills"),
      },
      {
        id: "social-github",
        group: "social",
        label: t.items.github,
        keywords: "github repo code",
        icon: Github,
        action: () => openExternal(githubHref),
      },
      {
        id: "social-linkedin",
        group: "social",
        label: t.items.linkedin,
        keywords: "linkedin profile social",
        icon: Linkedin,
        action: () => openExternal(linkedin),
      },
      {
        id: "social-email",
        group: "social",
        label: t.items.email,
        keywords: "email mail contacto contact",
        icon: Mail,
        action: () => window.location.assign(`mailto:${email}`),
      },
      {
        id: "system-lang-es",
        group: "system",
        label: t.items.langEs,
        keywords: "spanish espanol idioma es",
        icon: Languages,
        action: () => switchLocale("es"),
      },
      {
        id: "system-lang-en",
        group: "system",
        label: t.items.langEn,
        keywords: "english idioma en",
        icon: Languages,
        action: () => switchLocale("en"),
      },
      {
        id: "system-cv",
        group: "system",
        label: t.items.downloadCv,
        keywords: "cv resume download",
        icon: Download,
        action: downloadResume,
      },
    ],
    [downloadResume, email, githubHref, linkedin, navigateToSection, openExternal, switchLocale, t.items],
  );

  const groupedItems = useMemo(
    () => ({
      navigation: commandItems.filter((item) => item.group === "navigation"),
      social: commandItems.filter((item) => item.group === "social"),
      system: commandItems.filter((item) => item.group === "system"),
    }),
    [commandItems],
  );

  const runAndClose = useCallback((action: () => void) => {
    setOpen(false);
    action();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    setModifierLabel(isMac ? "Cmd" : "Ctrl");
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current && !panelRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-slate-900/55 px-2.5 py-1.5 font-mono text-[11px] text-slate-300 transition hover:bg-white/5 hover:text-white"
        aria-label={t.trigger}
      >
        <Search className="h-3.5 w-3.5 text-accent-300" />
        <span className="hidden md:inline">{t.trigger}</span>
        <kbd className="hidden rounded border border-white/10 bg-slate-950/80 px-1.5 py-0.5 text-[10px] text-slate-500 sm:inline">
          {modifierLabel}+K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] bg-slate-950/75 backdrop-blur-sm">
          <div
            ref={panelRef}
            className="relative z-[91] mx-auto mt-18 w-[calc(100%-1rem)] max-w-2xl sm:mt-24"
          >
            <Command className="overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
                <span className="font-mono text-sm text-operational-400">&gt;</span>
                <Command.Input
                  ref={inputRef}
                  placeholder={t.placeholder}
                  className="w-full bg-transparent font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                <Command.Empty className="px-3 py-6 text-center font-mono text-xs text-slate-500">
                  {t.empty}
                </Command.Empty>

                {(["navigation", "social", "system"] as const).map((group) => (
                  <Command.Group
                    key={group}
                    heading={t.sections[group]}
                    className="mb-1 text-[10px] font-mono uppercase tracking-widest text-slate-500 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2"
                  >
                    {groupedItems[group].map((item) => (
                      <Command.Item
                        key={item.id}
                        value={`${item.label} ${item.keywords}`}
                        onSelect={() => runAndClose(item.action)}
                        className="relative flex cursor-pointer items-center gap-3 rounded-lg border-l-2 border-transparent px-2.5 py-2 text-sm text-slate-300 outline-none transition data-[selected=true]:border-operational-400 data-[selected=true]:bg-white/5 data-[selected=true]:text-white data-[selected=true]:[&_svg]:text-operational-300"
                      >
                        <item.icon className="h-4 w-4 text-slate-500 transition-colors" />
                        <span className="font-mono text-xs sm:text-sm">{item.label}</span>
                        {item.shortcut && (
                          <span className="ml-auto font-mono text-[10px] text-slate-500">
                            {item.shortcut}
                          </span>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}

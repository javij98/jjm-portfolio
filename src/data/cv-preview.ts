import type { Locale } from "../i18n/content";

export const CV_PREVIEW = {
  es: {
    eyebrow: "Trayectoria y trabajo",
    title: "CV y proyectos",
    description: "Conoce mi experiencia en DevOps, mis competencias y los proyectos que he desarrollado.",
    cv: "Ver CV",
    projects: "Ver proyectos",
    experienceMore: "Descubre mi trayectoria",
  },
  en: {
    eyebrow: "Experience and work",
    title: "CV and projects",
    description: "Explore my DevOps experience, skills and the projects I have built.",
    cv: "View CV",
    projects: "View projects",
    experienceMore: "Discover my experience",
  },
} satisfies Record<Locale, { eyebrow: string; title: string; description: string; cv: string; projects: string; experienceMore: string }>;

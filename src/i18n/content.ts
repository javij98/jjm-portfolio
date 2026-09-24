export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export type SkillLevel = "strong" | "experienced" | "developing";
export type ProjectCategory = "product" | "platform" | "automation" | "web";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface Project {
  name: string;
  kind: string;
  category: ProjectCategory;
  visual: string;
  description: string;
  detailParagraphs: string[];
  highlights: string[];
  stack: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  summary: string;
  achievements: string[];
  evolution?: string[];
  current?: boolean;
}

export interface SiteContent {
  profile: {
    name: string;
    role: string;
    direction: string;
    introduction: string;
    location: string;
    email: string;
    linkedin: string;
    github: string;
  };
  nav: {
    home: string;
    about: string;
    projects: string;
    experience: string;
    skills: string;
    education: string;
    contact: string;
    menu: string;
    blog: string;
  };
  hero: {
    eyebrow: string;
    mobileIntroduction: string;
    focus: string;
    focusAreas: string[];
    terminalTitle: string;
    terminalPrompt: string;
    terminalLines: string[];
    terminalMobileLines: string[];
    projectsCta: string;
    contactCta: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    asideLabel: string;
    asideTitle: string;
    asideText: string;
    interestsLabel: string;
    interests: string[];
  };
  projects: {
    eyebrow: string;
    title: string;
    introduction: string;
    highlightLabel: string;
    stackLabel: string;
    filters: Record<ProjectCategory | "all", string>;
    filterLabel: string;
    detailsLabel: string;
    closeLabel: string;
    viewAllLabel: string;
    backLabel: string;
    items: Project[];
  };
  experience: {
    eyebrow: string;
    title: string;
    introduction: string;
    currentLabel: string;
    evolutionLabel: string;
    impactLabel: string;
    examplesEyebrow: string;
    examplesTitle: string;
    examplesIntroduction: string;
    examples: { title: string; status: string; description: string }[];
    items: Experience[];
  };
  skills: {
    eyebrow: string;
    title: string;
    introduction: string;
    levelsLabel: string;
    levels: Record<SkillLevel, string>;
    marqueeLabel: string;
    marqueePause: string;
    marqueeResume: string;
    marqueeItems: string[];
    categories: { id: string; title: string; description: string; skills: Skill[] }[];
  };
  education: {
    eyebrow: string;
    title: string;
    degree: string;
    institution: string;
    period: string;
    trainingEyebrow: string;
    trainingTitle: string;
    training: string[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    statement: string;
    emailLabel: string;
    copyLabel: string;
    copiedLabel: string;
    copyError: string;
    linkedinLabel: string;
    githubLabel: string;
    newTabLabel: string;
  };
  footer: string;
}

const commonProfile = {
  name: "Javier Jiménez Molina",
  role: "DevOps Engineer",
  email: "jjime981@gmail.com",
  linkedin: "https://www.linkedin.com/in/javierjimenezmolina",
  github: "https://github.com/javij98",
};

export const SITE_ES: SiteContent = {
  profile: {
    ...commonProfile,
    direction: "En evolución hacia Platform & Cloud Engineering",
    introduction:
      "Ingeniero DevOps con más de cuatro años de experiencia técnica y una base sólida en desarrollo de software. Trabajo con CI/CD, Kubernetes, contenedores, Linux y automatización para mejorar la entrega y operación de aplicaciones.",
    location: "Murcia, España",
  },
  nav: {
    home: "Inicio",
    about: "Sobre mí",
    projects: "Proyectos",
    experience: "Experiencia",
    skills: "Competencias",
    education: "Formación",
    contact: "Contacto",
    menu: "Abrir navegación",
    blog: "Blog",
  },
  hero: {
    eyebrow: "Ingeniería DevOps · Murcia, España",
    mobileIntroduction: "CI/CD, Kubernetes y automatización para entregar y operar software con confianza.",
    focus: "Mi foco",
    focusAreas: ["Kubernetes", "CI/CD", "Docker", "Linux", "Automatización"],
    terminalTitle: "perfil / enfoque actual",
    terminalPrompt: "javier@platform:~$ resumen --actual",
    terminalLines: [
      "Construyo y mantengo pipelines de entrega con Jenkins.",
      "Trabajo en entornos Kubernetes y resolución de incidencias en producción.",
      "Desarrollo herramientas para auditar y optimizar recursos.",
    ],
    terminalMobileLines: [
      "Pipelines de entrega con Jenkins.",
      "Kubernetes y soporte en producción.",
      "Audito y optimizo recursos.",
    ],
    projectsCta: "Ver proyectos",
    contactCta: "Contactar",
  },
  about: {
    eyebrow: "La persona detrás del terminal",
    title: "Sobre mí",
    paragraphs: [
      "Soy Javier, ingeniero DevOps en Murcia. Empecé desarrollando aplicaciones y acabé interesándome por todo lo que permite entregarlas y operarlas con confianza: pipelines, contenedores, observabilidad y automatización.",
      "Me gusta entender el sistema completo, investigar problemas difíciles y transformar tareas repetitivas en procesos más claros. Fuera del trabajo construyo productos propios y exploro cómo aplicar la IA al trabajo de ingeniería.",
    ],
    asideLabel: "Fuera del trabajo",
    asideTitle: "Curiosidad también lejos de la pantalla",
    asideText: "Disfruto aprendiendo, colaborando y probando cosas nuevas. El deporte y viajar me ayudan a cambiar de perspectiva.",
    interestsLabel: "En mi tiempo libre",
    interests: ["CrossFit", "Escalada", "Pádel", "Viajes"],
  },
  projects: {
    eyebrow: "Trabajo personal",
    title: "Proyectos",
    introduction:
      "Una galería de los productos, plataformas y herramientas personales que he construido o sigo desarrollando.",
    highlightLabel: "Qué incluye",
    stackLabel: "Tecnologías",
    filters: { all: "Todos", product: "Producto", platform: "Plataforma", automation: "Automatización", web: "Web" },
    filterLabel: "Filtrar proyectos por tipo",
    detailsLabel: "Detalles",
    closeLabel: "Cerrar",
    viewAllLabel: "Ver todos los proyectos",
    backLabel: "Volver a la portada",
    items: [
      {
        name: "MoneyFlow",
        category: "product",
        visual: "MF",
        kind: "Producto web y móvil",
        description:
          "Aplicación personal de finanzas con clientes web y React Native. Comparte lógica en un monorepo y utiliza Supabase como backend.",
        detailParagraphs: [
          "La web y la app móvil comparten lógica en un paquete core dentro de un monorepo, evitando duplicar las reglas del producto entre interfaces.",
          "Supabase aporta autenticación, PostgreSQL y Edge Functions. El producto incluye cuentas, movimientos, transferencias, operaciones recurrentes y paneles de análisis; Gemini asiste la entrada en lenguaje natural.",
        ],
        highlights: [
          "Web con React y aplicación móvil con React Native",
          "Paquete core compartido en un monorepo",
          "Supabase, PostgreSQL y Edge Functions",
          "Entrada de transacciones en lenguaje natural con IA",
        ],
        stack: ["React", "React Native", "TypeScript", "Supabase", "PostgreSQL", "Gemini API"],
      },
      {
        name: "Self-hosted Knowledge Platform",
        category: "platform",
        visual: "KB",
        kind: "Plataforma autoalojada",
        description:
          "Plataforma de documentación basada en Outline, con extensiones propias y una infraestructura operada sobre Linux y contenedores.",
        detailParagraphs: [
          "Proyecto autoalojado basado en Outline: proxy inverso, aplicación, PostgreSQL y Redis operados en contenedores sobre Linux.",
          "Además de mantener el despliegue, desarrollo extensiones propias y su flujo de cambios y CI/CD. Print Studio forma parte de este mismo ecosistema.",
        ],
        highlights: [
          "Despliegue con Docker y proxy inverso",
          "PostgreSQL y Redis",
          "Desarrollo de extensiones y flujo de CI/CD",
        ],
        stack: ["Linux", "Docker", "PostgreSQL", "Redis", "CI/CD"],
      },
      {
        name: "Print Studio",
        category: "product",
        visual: "PS",
        kind: "Extensión de producto",
        description:
          "Extensión integrada en la plataforma de conocimiento para dar formato a documentos y prepararlos para impresión o exportación.",
        detailParagraphs: [
          "Extensión integrada en la plataforma de conocimiento para preparar y dar formato a documentos antes de imprimirlos o exportarlos.",
          "Se desarrolla junto a la aplicación autoalojada y comparte su forma de trabajo: cambios de código, despliegue en contenedores y CI/CD.",
        ],
        highlights: [
          "Personalización de la aplicación",
          "Despliegue en contenedores",
          "Integración en el flujo de CI/CD",
        ],
        stack: ["Desarrollo web", "Docker", "CI/CD"],
      },
      {
        name: "Hermes Agent",
        category: "automation",
        visual: "HA",
        kind: "Automatización personal · en evolución",
        description:
          "Entorno personal para trabajar con agentes de IA: perfiles persistentes, habilidades, memoria de tareas e integraciones con herramientas.",
        detailParagraphs: [
          "Laboratorio personal para experimentar con agentes: perfiles, contexto persistente, habilidades y registro de tareas.",
          "Exploro integraciones con APIs y herramientas MCP, validación local y límites explícitos antes de acciones externas. Sigue en desarrollo; no es una plataforma de producción.",
        ],
        highlights: [
          "Organización del contexto y registro de trabajo",
          "Integraciones mediante APIs y herramientas MCP",
          "Validación local y límites explícitos para acciones externas",
        ],
        stack: ["LLMs", "MCP", "APIs", "Automatización"],
      },
      {
        name: "Personal Portfolio",
        category: "web",
        visual: "JJM",
        kind: "Web personal",
        description: "Esta web bilingüe presenta mi trayectoria, proyectos y competencias con una arquitectura Astro y componentes interactivos en React.",
        detailParagraphs: [
          "Este sitio organiza contenido bilingüe y componentes reutilizables. Astro genera las páginas y React se reserva para las interacciones que lo necesitan.",
          "Incluye navegación accesible, un menú de comandos y metadatos por idioma; la galería de proyectos y el blog tienen rutas propias.",
        ],
        highlights: [
          "Rutas en español e inglés con metadatos propios",
          "Navegación accesible y menú de comandos",
          "Contenido estático con interactividad donde aporta valor",
        ],
        stack: ["Astro", "React", "TypeScript", "Tailwind CSS", "i18n"],
      },
      {
        name: "Services Site",
        category: "web",
        visual: "ES/EN",
        kind: "Web de servicios",
        description: "Landing bilingüe de servicios tecnológicos centrada en una estructura reutilizable y en fundamentos de internacionalización y SEO.",
        detailParagraphs: [
          "Landing en español e inglés orientada a presentar servicios tecnológicos con una estructura compartida entre idiomas.",
          "La base cubre SEO técnico con OpenGraph, canonical, hreflang, sitemap y robots.txt, además de componentes reutilizables y configuración por entorno.",
        ],
        highlights: [
          "Contenido en español e inglés",
          "OpenGraph, canonical, hreflang y sitemap",
          "Componentes reutilizables y configuración por entorno",
        ],
        stack: ["Astro", "TypeScript", "CSS", "i18n", "SEO"],
      },
    ],
  },
  experience: {
    eyebrow: "Trayectoria",
    title: "Experiencia profesional",
    introduction:
      "Mi trayectoria conecta desarrollo de software con automatización, entrega continua y operación de plataformas.",
    currentLabel: "Actual",
    evolutionLabel: "Evolución del rol",
    impactLabel: "Impacto acreditado",
    examplesEyebrow: "Del trabajo diario",
    examplesTitle: "Problemas concretos, soluciones contrastadas",
    examplesIntroduction: "Tres ejemplos anonimizados de mi trabajo diario, con la fase alcanzada en cada uno.",
    examples: [
      { title: "Validación previa de CI/CD", status: "Desarrollo y prueba local", description: "Desarrollé una validación de cambios de configuración para pipelines Jenkins. Clasifica el commit exacto, falla de forma conservadora ante errores y se probó en generadores de varias tecnologías y en una ejecución Jenkins." },
      { title: "Helm y telemetría", status: "Preparación y dry-run", description: "Durante un dry-run de un chart Helm OCI detecté una especificación HPA inválida. Preparé la corrección y una integración de telemetría para su validación local." },
      { title: "Diagnóstico de memoria en Kubernetes", status: "Análisis y propuesta", description: "Analicé reinicios por falta de memoria relacionando límites y solicitudes de recursos con el comportamiento observado. Documenté una propuesta de ajuste." },
    ],
    items: [
      {
        company: "Krimda",
        role: "DevOps Engineer",
        period: "2025 — actualidad",
        summary:
          "CI/CD y operación de entornos Kubernetes, con foco en automatización, estandarización de despliegues y resolución de incidencias en producción.",
        achievements: [
          "Diseño y mantenimiento de pipelines modulares con Jenkins Shared Libraries (Groovy) para estandarizar despliegues y reducir duplicación.",
          "Administración y diagnóstico de Kubernetes; despliegues con Docker y Helm y resolución de incidencias de producción.",
          "Desarrollo de scripts para auditar recursos por microservicio y fundamentar propuestas de optimización.",
          "Gestión de binarios y dependencias con JFrog Artifactory integrado en el flujo de Bitbucket.",
          "Dashboards, métricas y logs con Grafana, Prometheus y Graylog para mejorar la visibilidad operativa.",
        ],
        current: true,
      },
      {
        company: "Capgemini",
        role: "Software / DevOps Engineer",
        period: "2021 — 2025",
        summary:
          "Comencé en desarrollo Full-Stack y fui orientando mi trabajo hacia automatización, CI/CD y DevOps.",
        evolution: ["Desarrollo", "Automatización", "CI/CD", "DevOps"],
        achievements: [
          "Desarrollo de microservicios con Java y Spring Boot, y aplicaciones con React, Node.js y APIs REST.",
          "Creación de pipelines con Jenkins y GitHub Actions durante la transición hacia automatización y CI/CD.",
          "Trabajo con Docker, Kubernetes y Helm; supervisión de entornos con Rancher y Lens.",
          "Despliegues y gestión de recursos en OVHCloud.",
          "Mejoras de CI/CD que redujeron los tiempos de despliegue en más de un 80 %.",
        ],
      },
    ],
  },
  skills: {
    eyebrow: "Herramientas y práctica",
    title: "Competencias técnicas",
    introduction:
      "Tecnologías con las que trabajo, diferenciando la experiencia aplicada de las áreas que sigo desarrollando.",
    levelsLabel: "Nivel de experiencia",
    levels: {
      strong: "Fuerte",
      experienced: "Experiencia aplicada",
      developing: "En desarrollo",
    },
    marqueeLabel: "Tecnologías con experiencia aplicada",
    marqueePause: "Pausar",
    marqueeResume: "Reanudar",
    marqueeItems: ["Kubernetes", "Jenkins", "Docker", "Helm", "Linux", "Groovy", "Git / Bitbucket", "Prometheus", "Grafana", "Bash", "React", "TypeScript"],
    categories: [
      {
        id: "devops",
        title: "DevOps y CI/CD",
        description: "Entrega continua y estandarización de despliegues.",
        skills: [
          { name: "Jenkins / Shared Libraries", level: "experienced" },
          { name: "Git / Bitbucket", level: "strong" },
          { name: "GitHub Actions", level: "experienced" },
          { name: "Artifactory", level: "experienced" },
        ],
      },
      {
        id: "platform",
        title: "Contenedores y plataforma",
        description: "Aplicaciones en contenedores y operación de clústeres.",
        skills: [
          { name: "Docker", level: "strong" },
          { name: "Kubernetes", level: "experienced" },
          { name: "Helm", level: "experienced" },
          { name: "Rancher", level: "experienced" },
        ],
      },
      {
        id: "observability",
        title: "Observabilidad",
        description: "Métricas, registros y diagnóstico de producción.",
        skills: [
          { name: "Prometheus", level: "experienced" },
          { name: "Grafana", level: "experienced" },
          { name: "Graylog", level: "experienced" },
        ],
      },
      {
        id: "development",
        title: "Desarrollo",
        description: "Base de ingeniería de software para entender el ciclo completo.",
        skills: [
          { name: "Java / Spring Boot", level: "experienced" },
          { name: "React", level: "experienced" },
          { name: "Node.js", level: "experienced" },
          { name: "TypeScript", level: "experienced" },
        ],
      },
      {
        id: "cloud",
        title: "Cloud e infraestructura",
        description: "Línea de crecimiento hacia Platform y Cloud Engineering.",
        skills: [
          { name: "Linux", level: "strong" },
          { name: "AWS", level: "developing" },
          { name: "Terraform", level: "developing" },
        ],
      },
      {
        id: "automation",
        title: "Automatización",
        description: "Scripts, integraciones y reducción de tareas manuales.",
        skills: [
          { name: "Bash / Shell", level: "strong" },
          { name: "Groovy", level: "experienced" },
          { name: "REST APIs / Webhooks", level: "experienced" },
          { name: "Python", level: "developing" },
        ],
      },
      {
        id: "ai",
        title: "IA aplicada y harness engineering",
        description: "Exploración personal de agentes: contexto persistente, herramientas y validación.",
        skills: [
          { name: "LLMs y flujos con herramientas", level: "developing" },
          { name: "Herramientas MCP", level: "developing" },
          { name: "Harness engineering", level: "developing" },
          { name: "Gestión del contexto", level: "developing" },
          { name: "Hermes Agent", level: "developing" },
          { name: "Codex", level: "developing" },
          { name: "Gemini", level: "developing" },
          { name: "OpenCode", level: "developing" },
        ],
      },
    ],
  },
  education: {
    eyebrow: "Aprendizaje continuo",
    title: "Formación",
    degree: "Grado en Ingeniería Telemática",
    institution: "Universidad Politécnica de Cartagena",
    period: "2017 — 2021",
    trainingEyebrow: "Cursos",
    trainingTitle: "Formación complementaria",
    training: [
      "Continuous Delivery & DevOps · University of Minnesota",
      "Docker Advanced · Pluralsight",
      "Linux Advanced · Pluralsight",
    ],
  },
  contact: {
    eyebrow: "Hablemos",
    title: "Contacto",
    description:
      "Si buscas a alguien para trabajar en CI/CD, Kubernetes, Infraestructura, IA, Integración y automatización, me encantará conversar.",
    statement: "Construyamos una entrega más clara, automatizada y fiable.",
    emailLabel: "Escribirme un email",
    copyLabel: "Copiar dirección",
    copiedLabel: "Dirección copiada",
    copyError: "No se pudo copiar. Puedes usar el enlace de email.",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    newTabLabel: "se abre en una pestaña nueva",
  },
  footer: "DevOps Engineer · Murcia, España",
};

export const SITE_EN: SiteContent = {
  profile: {
    ...commonProfile,
    direction: "Growing toward Platform & Cloud Engineering",
    introduction:
      "DevOps Engineer with more than four years of technical experience and a strong software development background. I work with CI/CD, Kubernetes, containers, Linux and automation to improve how applications are delivered and operated.",
    location: "Murcia, Spain",
  },
  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    experience: "Experience",
    skills: "Skills",
    education: "Education",
    contact: "Contact",
    menu: "Open navigation",
    blog: "Blog",
  },
  hero: {
    eyebrow: "DevOps Engineering · Murcia, Spain",
    mobileIntroduction: "CI/CD, Kubernetes and automation for reliable delivery and operations.",
    focus: "My focus",
    focusAreas: ["Kubernetes", "CI/CD", "Docker", "Linux", "Automation"],
    terminalTitle: "profile / current focus",
    terminalPrompt: "javier@platform:~$ summary --current",
    terminalLines: [
      "I build and maintain delivery pipelines with Jenkins.",
      "I work with Kubernetes and troubleshoot production issues.",
      "I develop tools to audit and optimize resources.",
    ],
    terminalMobileLines: [
      "Delivery pipelines with Jenkins.",
      "Kubernetes and production support.",
      "I audit and optimize resources.",
    ],
    projectsCta: "Explore projects",
    contactCta: "Get in touch",
  },
  about: {
    eyebrow: "The person behind the terminal",
    title: "About me",
    paragraphs: [
      "I'm Javier, a DevOps Engineer based in Murcia. I started out building applications and became interested in everything that makes them reliable to deliver and operate: pipelines, containers, observability and automation.",
      "I like understanding the whole system, investigating difficult problems and turning repetitive tasks into clearer processes. Outside work I build personal products and explore how AI can support engineering work.",
    ],
    asideLabel: "Away from the keyboard",
    asideTitle: "Curiosity beyond the screen",
    asideText: "I enjoy learning, collaborating and trying new things. Sport and travel help me change perspective.",
    interestsLabel: "In my spare time",
    interests: ["CrossFit", "Climbing", "Padel", "Travel"],
  },
  projects: {
    eyebrow: "Personal work",
    title: "Projects",
    introduction:
      "A gallery of the personal products, platforms and tools I have built or continue to develop.",
    highlightLabel: "What it includes",
    stackLabel: "Technologies",
    filters: { all: "All", product: "Product", platform: "Platform", automation: "Automation", web: "Web" },
    filterLabel: "Filter projects by type",
    detailsLabel: "Details",
    closeLabel: "Close",
    viewAllLabel: "View all projects",
    backLabel: "Back to home",
    items: [
      {
        name: "MoneyFlow",
        category: "product",
        visual: "MF",
        kind: "Web and mobile product",
        description:
          "A personal finance app with web and React Native clients. They share logic in a monorepo and use Supabase as the backend.",
        detailParagraphs: [
          "The web and mobile clients share logic in a core package within a monorepo, so product rules do not have to be duplicated across interfaces.",
          "Supabase provides authentication, PostgreSQL and Edge Functions. The product includes accounts, transactions, transfers, recurring entries and analytics dashboards; Gemini assists natural-language entry.",
        ],
        highlights: [
          "React web app and React Native mobile app",
          "Shared core package in a monorepo",
          "Supabase, PostgreSQL and Edge Functions",
          "AI-assisted natural-language transaction entry",
        ],
        stack: ["React", "React Native", "TypeScript", "Supabase", "PostgreSQL", "Gemini API"],
      },
      {
        name: "Self-hosted Knowledge Platform",
        category: "platform",
        visual: "KB",
        kind: "Self-hosted platform",
        description:
          "An Outline-based documentation platform with custom extensions, operated on Linux and container infrastructure.",
        detailParagraphs: [
          "An Outline-based self-hosted project: reverse proxy, application, PostgreSQL and Redis run in containers on Linux.",
          "Alongside the deployment, I work on custom extensions and their change and CI/CD workflow. Print Studio belongs to the same ecosystem.",
        ],
        highlights: [
          "Docker deployment and reverse proxy",
          "PostgreSQL and Redis",
          "Custom extensions and CI/CD workflow",
        ],
        stack: ["Linux", "Docker", "PostgreSQL", "Redis", "CI/CD"],
      },
      {
        name: "Print Studio",
        category: "product",
        visual: "PS",
        kind: "Product extension",
        description:
          "An extension integrated with the knowledge platform to format documents and prepare them for printing or export.",
        detailParagraphs: [
          "An extension integrated into the knowledge platform to prepare and format documents for printing or export.",
          "It is developed alongside the self-hosted application and shares its workflow: code changes, container deployment and CI/CD.",
        ],
        highlights: [
          "Application customization",
          "Containerized deployment",
          "CI/CD integration",
        ],
        stack: ["Web development", "Docker", "CI/CD"],
      },
      {
        name: "Hermes Agent",
        category: "automation",
        visual: "HA",
        kind: "Personal automation · evolving",
        description:
          "A personal environment for working with AI agents: persistent profiles, skills, task memory and tool integrations.",
        detailParagraphs: [
          "A personal lab for experimenting with agents: profiles, persistent context, skills and task journals.",
          "I am exploring API and MCP tool integrations, local validation and explicit boundaries before external actions. It is still developing, not a production platform.",
        ],
        highlights: [
          "Context organization and task journaling",
          "Integrations through APIs and MCP tools",
          "Local validation and explicit boundaries for external actions",
        ],
        stack: ["LLMs", "MCP", "APIs", "Automation"],
      },
      {
        name: "Personal Portfolio",
        category: "web",
        visual: "JJM",
        kind: "Personal website",
        description: "This bilingual site presents my career, projects and skills using Astro for the page architecture and React for interactive elements.",
        detailParagraphs: [
          "This site organizes bilingual content and reusable components. Astro generates the pages, while React is reserved for interactions that need it.",
          "It includes accessible navigation, a command menu and per-language metadata; the project gallery and blog have dedicated routes.",
        ],
        highlights: [
          "Spanish and English routes with dedicated metadata",
          "Accessible navigation and command menu",
          "Static content with interaction only where useful",
        ],
        stack: ["Astro", "React", "TypeScript", "Tailwind CSS", "i18n"],
      },
      {
        name: "Services Site",
        category: "web",
        visual: "ES/EN",
        kind: "Services website",
        description: "A bilingual technology-services landing page built around reusable structure, internationalization and SEO fundamentals.",
        detailParagraphs: [
          "A Spanish/English landing page for technology services, built on a shared structure across both languages.",
          "Its technical SEO foundation includes OpenGraph, canonical URLs, hreflang, a sitemap and robots.txt, along with reusable components and environment configuration.",
        ],
        highlights: [
          "Spanish and English content",
          "OpenGraph, canonical, hreflang and sitemap",
          "Reusable components and environment configuration",
        ],
        stack: ["Astro", "TypeScript", "CSS", "i18n", "SEO"],
      },
    ],
  },
  experience: {
    eyebrow: "Career path",
    title: "Professional experience",
    introduction:
      "My path connects software development with automation, continuous delivery and platform operations.",
    currentLabel: "Current",
    evolutionLabel: "Role progression",
    impactLabel: "Documented impact",
    examplesEyebrow: "Day-to-day engineering",
    examplesTitle: "Concrete problems, evidence-led work",
    examplesIntroduction: "Three anonymized examples from my day-to-day work, each with its stage of progress.",
    examples: [
      { title: "CI/CD pre-validation", status: "Development and local testing", description: "I developed configuration-only change validation for Jenkins pipelines. It classifies the exact commit, fails closed on errors and was tested across several technology generators and in one Jenkins run." },
      { title: "Helm and telemetry", status: "Preparation and dry-run", description: "During a Helm OCI chart dry-run, I found an invalid HPA specification. I prepared the fix and a telemetry integration for local validation." },
      { title: "Kubernetes memory troubleshooting", status: "Analysis and proposal", description: "I analyzed out-of-memory restarts by relating resource requests and limits to observed behavior, then documented a proposed adjustment." },
    ],
    items: [
      {
        company: "Krimda",
        role: "DevOps Engineer",
        period: "2025 — present",
        summary:
          "CI/CD and Kubernetes operations, focused on automation, deployment standardization and production troubleshooting.",
        achievements: [
          "Designed and maintained modular Jenkins pipelines with Groovy Shared Libraries to standardize deployments and reduce duplication.",
          "Administered and troubleshot Kubernetes; handled Docker and Helm deployments and production incidents.",
          "Developed scripts to audit resources by microservice and inform optimization proposals.",
          "Managed binaries and dependencies with JFrog Artifactory integrated into the Bitbucket workflow.",
          "Used Grafana, Prometheus and Graylog dashboards, metrics and logs to improve operational visibility.",
        ],
        current: true,
      },
      {
        company: "Capgemini",
        role: "Software / DevOps Engineer",
        period: "2021 — 2025",
        summary:
          "I started in Full-Stack development and gradually moved toward automation, CI/CD and DevOps.",
        evolution: ["Development", "Automation", "CI/CD", "DevOps"],
        achievements: [
          "Developed Java and Spring Boot microservices, plus React and Node.js applications and REST APIs.",
          "Built Jenkins and GitHub Actions pipelines while moving toward automation and CI/CD.",
          "Worked with Docker, Kubernetes and Helm; monitored environments with Rancher and Lens.",
          "Deployed applications and managed resources on OVHCloud.",
          "CI/CD improvements reduced deployment times by more than 80%.",
        ],
      },
    ],
  },
  skills: {
    eyebrow: "Tools and practice",
    title: "Technical skills",
    introduction:
      "Technologies I use, with applied experience distinguished from areas I am still developing.",
    levelsLabel: "Experience level",
    marqueeLabel: "Technologies with applied experience",
    marqueePause: "Pause",
    marqueeResume: "Resume",
    marqueeItems: ["Kubernetes", "Jenkins", "Docker", "Helm", "Linux", "Groovy", "Git / Bitbucket", "Prometheus", "Grafana", "Bash", "React", "TypeScript"],
    levels: {
      strong: "Strong",
      experienced: "Applied experience",
      developing: "Developing",
    },
    categories: [
      {
        id: "devops",
        title: "DevOps & CI/CD",
        description: "Continuous delivery and deployment standardization.",
        skills: [
          { name: "Jenkins / Shared Libraries", level: "experienced" },
          { name: "Git / Bitbucket", level: "strong" },
          { name: "GitHub Actions", level: "experienced" },
          { name: "Artifactory", level: "experienced" },
        ],
      },
      {
        id: "platform",
        title: "Containers & platform",
        description: "Containerized applications and cluster operations.",
        skills: [
          { name: "Docker", level: "strong" },
          { name: "Kubernetes", level: "experienced" },
          { name: "Helm", level: "experienced" },
          { name: "Rancher", level: "experienced" },
        ],
      },
      {
        id: "observability",
        title: "Observability",
        description: "Metrics, logs and production troubleshooting.",
        skills: [
          { name: "Prometheus", level: "experienced" },
          { name: "Grafana", level: "experienced" },
          { name: "Graylog", level: "experienced" },
        ],
      },
      {
        id: "development",
        title: "Development",
        description: "Software engineering background across the delivery cycle.",
        skills: [
          { name: "Java / Spring Boot", level: "experienced" },
          { name: "React", level: "experienced" },
          { name: "Node.js", level: "experienced" },
          { name: "TypeScript", level: "experienced" },
        ],
      },
      {
        id: "cloud",
        title: "Cloud & infrastructure",
        description: "Growth path toward Platform and Cloud Engineering.",
        skills: [
          { name: "Linux", level: "strong" },
          { name: "AWS", level: "developing" },
          { name: "Terraform", level: "developing" },
        ],
      },
      {
        id: "automation",
        title: "Automation",
        description: "Scripts, integrations and reducing manual work.",
        skills: [
          { name: "Bash / Shell", level: "strong" },
          { name: "Groovy", level: "experienced" },
          { name: "REST APIs / Webhooks", level: "experienced" },
          { name: "Python", level: "developing" },
        ],
      },
      {
        id: "ai",
        title: "Applied AI & harness engineering",
        description: "Personal exploration of agents: persistent context, tools and validation.",
        skills: [
          { name: "LLMs and tool workflows", level: "developing" },
          { name: "MCP tools", level: "developing" },
          { name: "Harness engineering", level: "developing" },
          { name: "Context design", level: "developing" },
          { name: "Hermes Agent", level: "developing" },
          { name: "Codex", level: "developing" },
          { name: "Gemini", level: "developing" },
          { name: "OpenCode", level: "developing" },
        ],
      },
    ],
  },
  education: {
    eyebrow: "Continuous learning",
    title: "Education",
    degree: "Bachelor's Degree in Telematics Engineering",
    institution: "Polytechnic University of Cartagena",
    period: "2017 — 2021",
    trainingEyebrow: "Courses",
    trainingTitle: "Additional training",
    training: [
      "Continuous Delivery & DevOps · University of Minnesota",
      "Docker Advanced · Pluralsight",
      "Linux Advanced · Pluralsight",
    ],
  },
  contact: {
    eyebrow: "Let's talk",
    title: "Contact",
    description:
      "If you’re looking for someone to work on CI/CD, Kubernetes, infrastructure, AI, integration, and automation, I’d love to connect.",
    statement: "Let’s make delivery clearer, more automated and more reliable.",
    emailLabel: "Send me an email",
    copyLabel: "Copy address",
    copiedLabel: "Address copied",
    copyError: "Could not copy. You can use the email link.",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    newTabLabel: "opens in a new tab",
  },
  footer: "DevOps Engineer · Murcia, Spain",
};

export const SITE_BY_LANG: Record<Locale, SiteContent> = {
  es: SITE_ES,
  en: SITE_EN,
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

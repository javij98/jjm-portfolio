export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export type MetricTrend = "up" | "stable" | "processing";

export interface ResumeMetric {
  label: string;
  value: string;
  trend: MetricTrend;
}

export interface ResumeExperienceItem {
  company: string;
  role: string;
  period: string;
  achievements: string[];
  isCurrent: boolean;
}

export interface ResumeEducationItem {
  degree: string;
  institution: string;
  faculty: string;
  location: string;
  period: string;
}

export interface ResumeSkills {
  core: string[];
  dev: string[];
  observability: string[];
  learning: string[];
}

export interface ResumeImpactCase {
  title: string;
  context: string;
  challenge: string;
  action: string;
  result: string;
  stack: string[];
}

export interface ResumeData {
  profile: {
    name: string;
    role: string;
    tagline: string;
    status: string;
    location: string;
    email: string;
    linkedin: string;
  };
  summary: string;
  metrics: ResumeMetric[];
  impactCases: ResumeImpactCase[];
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
  skills: ResumeSkills;
}

export interface UiLabels {
  meta: {
    ogLocale: string;
  };
  language: {
    es: string;
    en: string;
  };
  nav: {
    home: string;
    metrics: string;
    experience: string;
    skills: string;
    contact: string;
    online: string;
  };
  footer: {
    status: string;
    online: string;
    branch: string;
    branchValue: string;
    region: string;
    regionValue: string;
  };
  hero: {
    eyebrow: string;
    skip: string;
    loadingProfile: string;
    profileSummary: string;
    showJson: string;
    hideJson: string;
    viewImpact: string;
    contactCta: string;
    recruiterCommand: string;
    latestImpact: string;
    coreStack: string;
    quickRole: string;
    quickImpact: string;
    quickReliability: string;
    quickLocation: string;
    kpiExperienceLabel: string;
    copyOutputAria: string;
    terminalUser: string;
  };
  metrics: {
    eyebrow: string;
    title: string;
    description: string;
    caseStudiesTitle: string;
    caseStudiesDescription: string;
    challengeLabel: string;
    actionLabel: string;
    resultLabel: string;
    stackLabel: string;
    trendUp: string;
    trendStable: string;
    trendProcessing: string;
  };
  experience: {
    eyebrow: string;
    title: string;
    description: string;
    active: string;
  };
  education: {
    eyebrow: string;
    title: string;
    description: string;
  };
  skills: {
    eyebrow: string;
    title: string;
    description: string;
    categories: {
      core: string;
      dev: string;
      observability: string;
      learning: string;
    };
    inProgress: string;
    skillsWord: string;
    compiling: string;
    stable: string;
    progress: string;
    building: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    copyEmailAria: string;
    copied: string;
    copySuccess: string;
    copyError: string;
    linkedin: string;
  };
}

export const RESUME_ES: ResumeData = {
  profile: {
    name: "Javier Jiménez Molina",
    role: "DevOps & Platform Engineer",
    tagline: "Bridging the gap between Code and Infrastructure.",
    status: "Operational",
    location: "Murcia, España",
    email: "jjime981@gmail.com",
    linkedin: "www.linkedin.com/in/javierjimenezmolina",
  },
  summary:
    "Ingeniero DevOps con +4 años de experiencia y background sólido en desarrollo (Java/React). Especializado en reducir el Time-to-Market mediante pipelines de CI/CD avanzados y orquestación eficiente con Kubernetes.",
  metrics: [
    { label: "Reducción Deploy Time", value: "80%", trend: "up" },
    { label: "Disponibilidad K8s", value: "99.9%", trend: "stable" },
    { label: "Optimización CI/CD", value: "Escalable", trend: "up" },
  ],
  impactCases: [
    {
      title: "Reducción del ciclo de entrega CI/CD",
      context: "Capgemini · Entorno enterprise",
      challenge:
        "Despliegues lentos y parcialmente manuales entre equipos de desarrollo y operación.",
      action:
        "Diseño de pipelines CI/CD automatizados y estandarización de releases con contenedores.",
      result:
        "Reducción del Deploy Time en un 80% y aumento de frecuencia de entrega con menos fricción operativa.",
      stack: ["Jenkins", "Docker", "Helm", "Rancher"],
    },
    {
      title: "Observabilidad y estabilidad en Kubernetes",
      context: "Krimda · Plataforma productiva",
      challenge:
        "Falta de visibilidad en rendimiento y consumo de recursos sobre clústeres críticos.",
      action:
        "Automatización de auditorías y despliegue de dashboards/alertas con observabilidad centralizada.",
      result:
        "Disponibilidad K8s del 99.9% y detección proactiva de cuellos de botella en producción.",
      stack: ["Kubernetes", "Grafana", "Graylog", "Linux"],
    },
  ],
  experience: [
    {
      company: "Krimda",
      role: "Ingeniero DevOps",
      period: "Julio 2025 - Presente",
      achievements: [
        "Diseño de pipelines modulares en Jenkins usando Shared Libraries (Groovy).",
        "Implementación de JFrog Artifactory integrado con Bitbucket.",
        "Optimización de recursos en Kubernetes mediante scripting de auditoría.",
        "Observabilidad completa con Grafana y Graylog.",
      ],
      isCurrent: true,
    },
    {
      company: "Capgemini",
      role: "DevOps Engineer (Evolución desde Dev)",
      period: "Feb 2021 - Jul 2025",
      achievements: [
        "Reducción de tiempos de despliegue en un 80% mediante CI/CD.",
        "Gestión de contenedores Docker y orquestación con Helm/Rancher.",
        "Desarrollo previo de microservicios Java Spring Boot y React.",
      ],
      isCurrent: false,
    },
  ],
  education: [
    {
      degree: "Ingeniería Telemática",
      institution: "Universidad Politécnica de Cartagena (UPCT)",
      faculty: "Tecnologías de la Información y Telecomunicaciones",
      location: "Cartagena, Murcia, España",
      period: "Julio 2021",
    },
  ],
  skills: {
    core: ["Jenkins (Shared Libs)", "Kubernetes", "Docker", "Linux", "Git"],
    dev: ["Java Spring Boot", "TypeScript", "React", "Node.js"],
    observability: ["Grafana", "Graylog", "Prometheus"],
    learning: ["AWS (En progreso)", "Terraform (En progreso)"],
  },
};

export const RESUME_EN: ResumeData = {
  profile: {
    name: "Javier Jiménez Molina",
    role: "DevOps & Platform Engineer",
    tagline: "Bridging the gap between Code and Infrastructure.",
    status: "Operational",
    location: "Murcia, Spain",
    email: "jjime981@gmail.com",
    linkedin: "www.linkedin.com/in/javierjimenezmolina",
  },
  summary:
    "DevOps Engineer with +4 years of experience and a strong software development background (Java/React). Specialized in reducing time-to-market through advanced CI/CD pipelines and efficient Kubernetes orchestration.",
  metrics: [
    { label: "Deployment Time Reduction", value: "80%", trend: "up" },
    { label: "K8s Availability", value: "99.9%", trend: "stable" },
    { label: "CI/CD Optimization", value: "Scalable", trend: "up" },
  ],
  impactCases: [
    {
      title: "CI/CD delivery cycle reduction",
      context: "Capgemini · Enterprise environment",
      challenge:
        "Slow and partially manual deployments across development and operations teams.",
      action:
        "Designed automated CI/CD pipelines and standardized release workflows with containers.",
      result:
        "Achieved an 80% deployment time reduction and increased delivery frequency with less operational friction.",
      stack: ["Jenkins", "Docker", "Helm", "Rancher"],
    },
    {
      title: "Kubernetes reliability and observability",
      context: "Krimda · Production platform",
      challenge:
        "Limited visibility into performance and resource usage across critical clusters.",
      action:
        "Implemented audit automation plus centralized dashboards/alerts for proactive monitoring.",
      result:
        "Reached 99.9% K8s availability and enabled earlier bottleneck detection in production.",
      stack: ["Kubernetes", "Grafana", "Graylog", "Linux"],
    },
  ],
  experience: [
    {
      company: "Krimda",
      role: "DevOps Engineer",
      period: "July 2025 - Present",
      achievements: [
        "Designed modular Jenkins pipelines using Shared Libraries (Groovy).",
        "Implemented JFrog Artifactory integrated with Bitbucket.",
        "Optimized Kubernetes resource usage through custom audit scripting.",
        "Built full observability coverage with Grafana and Graylog.",
      ],
      isCurrent: true,
    },
    {
      company: "Capgemini",
      role: "DevOps Engineer (Progressed from Software Developer)",
      period: "Feb 2021 - Jul 2025",
      achievements: [
        "Reduced deployment times by 80% through CI/CD automation.",
        "Managed Docker workloads and orchestration using Helm/Rancher.",
        "Previously developed Java Spring Boot and React microservices.",
      ],
      isCurrent: false,
    },
  ],
  education: [
    {
      degree: "Telematics Engineering",
      institution: "Polytechnic University of Cartagena (UPCT)",
      faculty: "School of Information and Telecommunication Technologies",
      location: "Cartagena, Murcia, Spain",
      period: "July 2021",
    },
  ],
  skills: {
    core: ["Jenkins (Shared Libs)", "Kubernetes", "Docker", "Linux", "Git"],
    dev: ["Java Spring Boot", "TypeScript", "React", "Node.js"],
    observability: ["Grafana", "Graylog", "Prometheus"],
    learning: ["AWS (In progress)", "Terraform (In progress)"],
  },
};

export const UI_LABELS: Record<Locale, UiLabels> = {
  es: {
    meta: {
      ogLocale: "es_ES",
    },
    language: {
      es: "ES",
      en: "EN",
    },
    nav: {
      home: "Inicio",
      metrics: "Métricas",
      experience: "Experiencia",
      skills: "Skills",
      contact: "Contacto",
      online: "Online",
    },
    footer: {
      status: "Status",
      online: "Online",
      branch: "Branch",
      branchValue: "main",
      region: "Region",
      regionValue: "EU-West",
    },
    hero: {
      eyebrow: "// DevOps & Platform Engineering",
      skip: "Saltar",
      loadingProfile: "Cargando perfil...",
      profileSummary: "profile summary",
      showJson: "Ver JSON",
      hideJson: "Ocultar JSON",
      viewImpact: "Ver impacto",
      contactCta: "Contactar",
      recruiterCommand: "recruiter-summary --quick",
      latestImpact: "Último impacto",
      coreStack: "Stack core",
      quickRole: "Rol",
      quickImpact: "Impacto",
      quickReliability: "Fiabilidad",
      quickLocation: "Ubicación",
      kpiExperienceLabel: "Experiencia",
      copyOutputAria: "Copiar output",
      terminalUser: "jjimenez@devops ~ $",
    },
    metrics: {
      eyebrow: "// System Metrics",
      title: "Impacto Medible",
      description:
        "Métricas reales de reducción de tiempos, disponibilidad y optimización en entornos productivos.",
      caseStudiesTitle: "Impacto",
      caseStudiesDescription:
        "Ejemplos de proyectos donde se aplicó enfoque DevOps con resultados cuantificables.",
      challengeLabel: "Reto",
      actionLabel: "Acción",
      resultLabel: "Resultado",
      stackLabel: "Tecnologías",
      trendUp: "Trending Up",
      trendStable: "Stable",
      trendProcessing: "Processing",
    },
    experience: {
      eyebrow: "// Deployment Pipeline",
      title: "Experiencia Profesional",
      description:
        "Trayectoria desde desarrollo de software hasta ingeniería de plataformas y DevOps.",
      active: "ACTIVE",
    },
    education: {
      eyebrow: "// Credentials",
      title: "Educación",
      description: "Formación académica en ingeniería y telecomunicaciones.",
    },
    skills: {
      eyebrow: "// Skill Matrix",
      title: "Stack Tecnológico",
      description:
        "Competencias core sólidas y tecnologías en proceso de adopción, diferenciadas por estado operativo.",
      categories: {
        core: "Infraestructura Core",
        dev: "Desarrollo",
        observability: "Observabilidad",
        learning: "Ruta de Aprendizaje",
      },
      inProgress: "en progreso",
      skillsWord: "skills",
      compiling: "COMPILING...",
      stable: "STABLE",
      progress: "Progreso",
      building: "Construyendo...",
    },
    contact: {
      eyebrow: "// Connect",
      title: "Contacto",
      description: "¿Tienes un proyecto o una propuesta? No dudes en contactarme.",
      copyEmailAria: "Copiar email {email}",
      copied: "¡Copiado!",
      copySuccess: "Email copiado: {email}",
      copyError: "No se pudo copiar el email",
      linkedin: "LinkedIn",
    },
  },
  en: {
    meta: {
      ogLocale: "en_US",
    },
    language: {
      es: "ES",
      en: "EN",
    },
    nav: {
      home: "Home",
      metrics: "Metrics",
      experience: "Experience",
      skills: "Skills",
      contact: "Contact",
      online: "Online",
    },
    footer: {
      status: "Status",
      online: "Online",
      branch: "Branch",
      branchValue: "main",
      region: "Region",
      regionValue: "EU-West",
    },
    hero: {
      eyebrow: "// DevOps & Platform Engineering",
      skip: "Skip",
      loadingProfile: "Loading profile data...",
      profileSummary: "profile summary",
      showJson: "Show JSON",
      hideJson: "Hide JSON",
      viewImpact: "See impact",
      contactCta: "Contact",
      recruiterCommand: "recruiter-summary --quick",
      latestImpact: "Latest impact",
      coreStack: "Core stack",
      quickRole: "Role",
      quickImpact: "Impact",
      quickReliability: "Reliability",
      quickLocation: "Location",
      kpiExperienceLabel: "Experience",
      copyOutputAria: "Copy output",
      terminalUser: "jjimenez@devops ~ $",
    },
    metrics: {
      eyebrow: "// System Metrics",
      title: "Measured Impact",
      description:
        "Real-world metrics on delivery speed, reliability, and optimization in production environments.",
      caseStudiesTitle: "Impact",
      caseStudiesDescription:
        "Selected projects showing DevOps execution with measurable business and platform outcomes.",
      challengeLabel: "Challenge",
      actionLabel: "Action",
      resultLabel: "Result",
      stackLabel: "Stack",
      trendUp: "Trending Up",
      trendStable: "Stable",
      trendProcessing: "Processing",
    },
    experience: {
      eyebrow: "// Deployment Pipeline",
      title: "Professional Experience",
      description:
        "Career journey from software development to platform engineering and DevOps.",
      active: "ACTIVE",
    },
    education: {
      eyebrow: "// Credentials",
      title: "Education",
      description:
        "Academic background in engineering and telecommunication systems.",
    },
    skills: {
      eyebrow: "// Skill Matrix",
      title: "Technology Stack",
      description:
        "Strong core competencies and technologies currently being adopted, grouped by operational maturity.",
      categories: {
        core: "Core Infrastructure",
        dev: "Development",
        observability: "Observability",
        learning: "Learning Path",
      },
      inProgress: "in progress",
      skillsWord: "skills",
      compiling: "COMPILING...",
      stable: "STABLE",
      progress: "Progress",
      building: "Building...",
    },
    contact: {
      eyebrow: "// Connect",
      title: "Contact",
      description: "Have a project or proposal? Feel free to reach out.",
      copyEmailAria: "Copy email {email}",
      copied: "Copied!",
      copySuccess: "Email copied: {email}",
      copyError: "Could not copy email",
      linkedin: "LinkedIn",
    },
  },
};

export const RESUME_BY_LANG: Record<Locale, ResumeData> = {
  es: RESUME_ES,
  en: RESUME_EN,
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

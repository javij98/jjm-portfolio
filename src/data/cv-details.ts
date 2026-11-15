import type { Locale } from "../i18n/content";

/** CV-specific text shared by the visual CV and Markdown exports. */
export const CV_DETAILS = {
  es: {
    summary: "Ingeniero DevOps con más de cuatro años de experiencia técnica, especializado en automatización de infraestructura, orquestación de contenedores y optimización de CI/CD. Mi trayectoria en desarrollo full-stack ayuda a conectar las necesidades de desarrollo y operaciones. Trabajo con observabilidad, eficiencia operativa e integraciones con APIs, agentes de IA, flujos n8n y webhooks.",
    krimdaDates: "jul. 2025–actualidad",
    capgeminiDates: "feb. 2021–jul. 2025",
    capgeminiLocation: "Valencia, España · Híbrido",
    krimdaOne: "Diseño y mantengo pipelines modulares de Jenkins con Shared Libraries (Groovy) y Pipelines as Code para estandarizar despliegues y reducir duplicación.",
    krimdaTwo: "Integré JFrog Artifactory con Bitbucket para la gestión centralizada de binarios y dependencias.",
    krimdaThree: "Administro clústeres Kubernetes para microservicios escalables y desarrollé herramientas para auditar el uso de recursos por servicio y optimizar la capacidad.",
    krimdaFour: "Configuré dashboards en Grafana y centralización de logs con Graylog para mejorar la visibilidad y respuesta a incidencias.",
    krimdaFive: "Automatizo procesos e integraciones mediante APIs, flujos n8n y webhooks.",
    capgeminiSummary: "Evolucioné desde el desarrollo de software hacia operaciones, automatización e ingeniería de CI/CD.",
    capgeminiOne: "Desarrollé microservicios backend con Java y Spring Boot, aplicaciones frontend con React y APIs REST con Node.js.",
    capgeminiTwo: "Gestioné cargas con Docker, Kubernetes y Helm; supervisé entornos productivos con Rancher y Lens.",
    capgeminiThree: "Desplegué y gestioné recursos cloud en OVHcloud para entornos productivos.",
    capgeminiFour: "Creé pipelines de integración continua con Jenkins y GitHub Actions.",
    impact: "Mejora documentada: reducción superior al 80% en tiempos de despliegue.",
    languageLevels: "Español nativo · Inglés B2",
    aiAutomationSkills: "LLMs · MCP · Harness Engineering · APIs · Webhooks · contexto, validación y seguridad · Hermes Agent",
    cloudSkills: "OVHcloud · AWS (en desarrollo) · Terraform (en desarrollo)",
  },
  en: {
    summary: "DevOps Engineer with more than four years of technical experience, focused on infrastructure automation, container orchestration and CI/CD optimisation. My full-stack development background helps me connect development and operations needs. I work with observability, operational efficiency, and integrations through APIs, AI agents, n8n workflows and webhooks.",
    krimdaDates: "Jul 2025–present",
    capgeminiDates: "Feb 2021–Jul 2025",
    capgeminiLocation: "Valencia, Spain · Hybrid",
    krimdaOne: "Design and maintain modular Jenkins pipelines with Shared Libraries (Groovy) and Pipelines as Code to standardise deployments and reduce duplication.",
    krimdaTwo: "Integrated JFrog Artifactory with Bitbucket for centralised binary and dependency management.",
    krimdaThree: "Administer Kubernetes clusters for scalable microservices and developed tools to audit per-service resource usage and optimise capacity.",
    krimdaFour: "Set up Grafana dashboards and centralised logging with Graylog to improve visibility and incident response.",
    krimdaFive: "Automate processes and integrations through APIs, n8n workflows and webhooks.",
    capgeminiSummary: "Progressed from software development into operations, automation and CI/CD engineering.",
    capgeminiOne: "Built backend microservices with Java and Spring Boot, frontend applications with React and REST APIs with Node.js.",
    capgeminiTwo: "Managed workloads with Docker, Kubernetes and Helm; monitored production environments with Rancher and Lens.",
    capgeminiThree: "Deployed and managed cloud resources on OVHcloud for production environments.",
    capgeminiFour: "Created continuous integration pipelines with Jenkins and GitHub Actions.",
    impact: "Documented improvement: deployment times reduced by more than 80%.",
    languageLevels: "Spanish native · English B2",
    aiAutomationSkills: "LLMs · MCP · Harness Engineering · APIs · Webhooks · context, validation and safety · Hermes Agent",
    cloudSkills: "OVHcloud · AWS (developing) · Terraform (developing)",
  },
} satisfies Record<Locale, Record<string, string>>;

export const CV_TRAINING = [
  { name: "Agile Software Development", provider: "University of Minnesota" },
  { name: "Confluence: Getting Started", provider: "Pluralsight" },
  { name: "Continuous Delivery & DevOps", provider: "University of Minnesota" },
  { name: "DevOps: The Big Picture", provider: "Pluralsight" },
  { name: "Docker Advanced", provider: "Pluralsight" },
  { name: "Oracle PL/SQL Advanced", provider: "Oracle" },
  { name: "IT Service Management Specific Practices", provider: "Pluralsight" },
  { name: "Linux Advanced", provider: "Pluralsight" },
];

export const CV_SKILL_LINES = {
  strong: "Docker · Bash / Shell · Git / Bitbucket · Linux",
  delivery: "Jenkins Shared Libraries · Groovy · Pipelines as Code · GitHub Actions · GitLab CI · Kubernetes · Helm · Rancher · Lens · REST APIs · Webhooks",
  observability: "Prometheus · Grafana · Graylog",
  development: "Java · Spring Boot · Node.js · React · JavaScript / TypeScript",
  artifacts: "JFrog Artifactory",
  automation: "Python · n8n",
};

import type { Locale } from "../i18n/content";

interface LocalizedPost {
  title: string;
  excerpt: string;
  paragraphs: string[];
}

export interface BlogPost {
  slug: string;
  category: { es: string; en: string };
  content: Record<Locale, LocalizedPost>;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "del-desarrollo-a-devops",
    category: { es: "Trayectoria", en: "Career path" },
    content: {
      es: {
        title: "Del desarrollo a DevOps: mirar el sistema completo",
        excerpt: "Cómo una base en desarrollo de software me llevó a interesarme por la entrega, la operación y la automatización.",
        paragraphs: [
          "Empecé construyendo aplicaciones. Al trabajar en su entrega descubrí que escribir código era solo una parte del sistema: también importaban los pipelines, los entornos, el despliegue y la capacidad de entender qué ocurría después.",
          "Ese interés me fue acercando a la automatización, CI/CD y DevOps. Hoy trabajo con Jenkins, contenedores y Kubernetes, sin perder la perspectiva de quien desarrolla la aplicación que termina operándose.",
          "Me interesa reducir tareas manuales y hacer que los procesos de entrega sean comprensibles y repetibles. Platform Engineering es la dirección en la que quiero seguir creciendo."
        ]
      },
      en: {
        title: "From software development to DevOps: seeing the whole system",
        excerpt: "How a software development background led me toward delivery, operations and automation.",
        paragraphs: [
          "I started by building applications. Working on their delivery showed me that writing code was only part of the system: pipelines, environments, deployment and understanding what happened afterwards mattered too.",
          "That interest gradually brought me toward automation, CI/CD and DevOps. Today I work with Jenkins, containers and Kubernetes, while keeping the perspective of the people developing the applications being operated.",
          "I care about reducing manual work and making delivery processes understandable and repeatable. Platform Engineering is the direction in which I want to keep growing."
        ]
      }
    }
  },
  {
    slug: "plataforma-de-conocimiento-autoalojada",
    category: { es: "Proyecto personal", en: "Personal project" },
    content: {
      es: {
        title: "Una plataforma de conocimiento autoalojada",
        excerpt: "Una mirada a la combinación de Outline, contenedores, datos y extensiones propias en un proyecto personal.",
        paragraphs: [
          "Mi plataforma personal de conocimiento parte de Outline. La opero sobre Linux y contenedores, con un proxy inverso, PostgreSQL y Redis.",
          "Además del despliegue, he trabajado en extensiones propias y en su flujo de CI/CD. Print Studio nació como una extensión para preparar documentos para impresión o exportación.",
          "El proyecto me sirve para practicar una visión de extremo a extremo: aplicación, infraestructura, cambios y operación."
        ]
      },
      en: {
        title: "Building a self-hosted knowledge platform",
        excerpt: "A look at Outline, containers, data services and custom extensions in a personal project.",
        paragraphs: [
          "My personal knowledge platform is based on Outline. I run it on Linux and containers, with a reverse proxy, PostgreSQL and Redis.",
          "Alongside deployment, I have worked on custom extensions and their CI/CD workflow. Print Studio grew out of an extension that prepares documents for printing or export.",
          "The project lets me practise an end-to-end view: application, infrastructure, changes and operations."
        ]
      }
    }
  }
];

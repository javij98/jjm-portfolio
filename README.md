# Portfolio de Javier Jiménez Molina

Portfolio bilingüe de Javier, DevOps Engineer con experiencia en CI/CD, Kubernetes, contenedores, Linux y automatización. La web muestra su trayectoria profesional, los seis proyectos personales documentados y su dirección hacia Platform y Cloud Engineering.

Dominio oficial: [javierjimenez.dev](https://javierjimenez.dev). El origen canónico
se define una sola vez en `src/config/url.mjs` para Astro, metadatos y exportaciones.

## Desarrollo local

```sh
npm ci
npm run dev
```

La web está disponible en `/es` y `/en`. El CV completo está en `/{lang}/cv` y la vista compacta en `/{lang}/cv/compact`; ambas comparten resumen, selector e índice de secciones. También hay catálogos en `/{lang}/projects` y blog estático en `/{lang}/blog`. La raíz dirige al idioma del navegador, con español como alternativa.

```sh
npm run build
npm run preview
```

Para las pruebas de interfaz, instala Chromium con `npx playwright install chromium`, arranca el servidor y, en otra terminal, ejecuta `PORTFOLIO_URL=http://127.0.0.1:4321 node --test --test-concurrency=2 tests/*.mjs`, usando el puerto real del servidor. Para verificar la versión compilada, usa `npm run build` y `npm run preview` antes de las pruebas.

## Estructura

- `src/i18n/content.ts`: contenido y etiquetas en español e inglés.
- `src/config/site.ts`: flags centrales (`BLOG_ENABLED`) y límite de proyectos de portada (`HOME_PROJECT_PREVIEW_LIMIT`).
- `src/config/url.mjs`: dominio oficial compartido por la configuración y las rutas estáticas, incluido `robots.txt`.
- `src/data/blog.ts`: entradas estáticas bilingües; punto de sustitución por una fuente dinámica futura.
- `src/components/sections/`: secciones renderizadas con Astro, incluidas la galería filtrable, la franja animada de tecnologías y las vistas de blog.
- `src/components/CommandMenu.tsx`: navegación rápida interactiva con React.
- `src/layouts/Layout.astro`: navegación, pie y metadatos SEO compartidos.
- `src/components/ModePicker.astro`: selector Human / LLM junto al selector de idioma.
- `src/data/cv-details.ts` y `src/lib/markdown.ts`: datos compartidos del CV y exportación Markdown.
- `src/components/CvContents.astro` y `src/components/MarkdownView.astro`: índice del CV y vista de lectura Markdown.
- `docs/PROFILE_CONTEXT.md` y `docs/WEBSITE_GOALS.md`: fuentes para la trayectoria y el posicionamiento profesional.
- `AGENTS.md`: criterios de trabajo para futuras actualizaciones.

Para ocultar el blog, cambia `BLOG_ENABLED` a `false` en `src/config/site.ts` y reconstruye la web. Se eliminarán la sección de portada, los enlaces de navegación y paleta, las rutas generadas y sus entradas del sitemap.

No se deben añadir métricas, enlaces a proyectos o afirmaciones profesionales sin una fuente verificable. Cualquier cambio de contenido debe mantenerse en ambos idiomas.

## Modo LLM

El selector de la cabecera es contextual: desde la portada abre `/{lang}/llm`,
con el portfolio completo; desde el CV abre `/{lang}/cv/llm`, con el perfil
profesional sin artículos. Ambas vistas muestran los marcadores Markdown y
permiten copiar o descargar el texto original. Mantienen las distinciones entre
niveles de experiencia, estados de los casos y métricas documentadas o estimadas.

También se generan archivos estáticos accesibles sin JavaScript:

- `/es/index.md` y `/en/index.md`: portfolio completo por idioma.
- `/{lang}/cv.md`: perfil profesional sin blog, compartido por las dos vistas del CV.
- `/{lang}/projects.md`: proyectos completos.
- `/{lang}/blog/index.md` y `/{lang}/blog/{slug}.md`: artículos, cuando el blog está habilitado.
- `/llms.txt`: índice de lectura siguiendo la propuesta [llms.txt](https://llmstxt.org/).
- `/llms-full.txt`: contenido completo en inglés, equivalente a `/en/index.md`.

Las páginas visuales enlazan su alternativa Markdown desde los metadatos HTML.
`vercel.json` fija los tipos de contenido de los archivos estáticos en el hosting
actual; no cambia la compilación ni las rutas. Estas alternativas facilitan la
lectura por agentes, sin garantizar indexación ni posicionamiento en servicios de IA.

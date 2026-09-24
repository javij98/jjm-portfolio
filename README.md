# Portfolio de Javier Jiménez Molina

Portfolio bilingüe de Javier, DevOps Engineer con experiencia en CI/CD, Kubernetes, contenedores, Linux y automatización. La web muestra su trayectoria profesional, los seis proyectos personales documentados y su dirección hacia Platform y Cloud Engineering.

## Desarrollo local

```sh
npm ci
npm run dev
```

La web está disponible en `/es` y `/en`, con catálogos completos en `/es/projects` y `/en/projects` y blog estático en `/es/blog` y `/en/blog`. La raíz dirige al idioma del navegador, con español como alternativa.

```sh
npm run build
npm run preview
```

Para comprobar el contorno de hover en escritorio y móvil, instala Chromium para Playwright una vez con `npx playwright install chromium`, arranca `npm run dev` y ejecuta `npm run test:ui` en otra terminal.

## Estructura

- `src/i18n/content.ts`: contenido y etiquetas en español e inglés.
- `src/config/site.ts`: flags centrales (`BLOG_ENABLED`) y límite de proyectos de portada (`HOME_PROJECT_PREVIEW_LIMIT`).
- `src/data/blog.ts`: entradas estáticas bilingües; punto de sustitución por una fuente dinámica futura.
- `src/components/sections/`: secciones renderizadas con Astro, incluidas la galería filtrable, la franja animada de tecnologías y las vistas de blog.
- `src/components/CommandMenu.tsx`: navegación rápida interactiva con React.
- `src/layouts/Layout.astro`: navegación, pie y metadatos SEO compartidos.
- `docs/PROFILE_CONTEXT.md` y `docs/WEBSITE_GOALS.md`: fuentes para la trayectoria y el posicionamiento profesional.
- `AGENTS.md`: criterios de trabajo para futuras actualizaciones.

Para ocultar el blog, cambia `BLOG_ENABLED` a `false` en `src/config/site.ts` y reconstruye la web. Se eliminarán la sección de portada, los enlaces de navegación y paleta, las rutas generadas y sus entradas del sitemap.

No se deben añadir métricas, enlaces a proyectos o afirmaciones profesionales sin una fuente verificable. Cualquier cambio de contenido debe mantenerse en ambos idiomas.

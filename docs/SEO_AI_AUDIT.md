# Auditoría SEO y lectura por IA

Revisión: 1 de octubre de 2026. Dominio oficial: https://javierjimenez.dev.
Se han revisado el código, el contenido ES/EN, la compilación estática y las
respuestas públicas del dominio y del perfil de GitHub. No se dispone de datos
privados de Search Console, Bing Webmaster Tools ni analítica. Las prioridades
siguientes son recomendaciones; no son estimaciones de volumen de búsqueda.

## Corregido en esta revisión

- Los selectores Human / LLM y ES / EN mantienen su anchura y posición entre
  páginas, modos e idiomas. La cabecera es común y se reserva el espacio de la
  barra de desplazamiento. Los controles siguen siendo enlaces accesibles.
- El dominio se define en `src/config/url.mjs` y se comparte entre Astro,
  canonical, hreflang, OpenGraph, sitemap, robots y exportaciones Markdown.
  Se eliminaron las referencias al origen anterior del código y documentación.
- `robots.txt` se genera al compilar para mantener su sitemap sincronizado con
  el dominio. Conserva el acceso general de rastreadores.
- Canonical y sitemap utilizan las mismas URLs. La vista LLM referencia la
  página visual canónica y sus versiones por idioma en hreflang.
- Las páginas completas de proyectos y blog tenían el encabezado principal
  como H2. Ahora usan H1 y las tarjetas H2; las secciones de portada mantienen
  H2 y sus tarjetas H3, con el mismo aspecto visual.
- La categoría de proyecto en Markdown se etiqueta como categoría, en lugar de
  reutilizar el texto del control para filtrar proyectos.

La versión publicada examinada antes de estas correcciones todavía declaraba
otro origen en canonical, hreflang, robots y sitemap. Los cambios de esta
revisión están preparados en el repositorio; hay que publicarlos para que los
rastreadores reciban la versión corregida.

## Exactitud del perfil

La experiencia, los periodos y las tecnologías publicados coinciden con las
fuentes del repositorio. Se mantienen AWS, Terraform, Python e IA aplicada con
sus niveles reales de desarrollo. Platform / Cloud Engineering es una dirección
profesional, y la trayectoria en Capgemini conserva la transición desde desarrollo.

La reducción de más del 80 % está atribuida a Capgemini. Los 13–25 h/día y
67–125 h/semana del pipeline se conservan como ahorro potencial agregado de
ejecución CI, con el cálculo y sus límites; no se presentan como horas personales
ni como un resultado medido en producción. Helm y memoria mantienen sus estados
de preparación, diagnóstico o propuesta.

## Prioridades de publicación y descubrimiento

| Prioridad | Acción | Motivo y comprobación |
| --- | --- | --- |
| Alta | Publicar las correcciones de dominio | Revisar el HTML servido y que canonical, hreflang, sitemap y robots usen el origen oficial. |
| Alta | Configurar redirecciones permanentes del origen anterior conservando rutas | Facilitar la migración de URLs. Comprobar 301/308 y destino equivalente. |
| Alta | Verificar el dominio en Google Search Console y Bing Webmaster Tools | Enviar el sitemap e inspeccionar las páginas principales. Estos datos permitirán comprobar indexación real. |
| Alta | Añadir el dominio al perfil público de GitHub, LinkedIn y README relevantes | En la comprobación pública, el campo `blog` de GitHub estaba vacío. Mantener nombre, rol y dominio consistentes. |
| Media | Revisar el alias `www` si se quiere admitir | No resolvió desde el entorno de esta revisión. Configurarlo y redirigirlo al dominio principal si se utiliza. |

Google recomienda mapear las URLs y configurar redirecciones permanentes durante
un cambio de dominio, además de actualizar anotaciones y monitorizar Search
Console. [Guía oficial de migración](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

## Contenido que añadiría primero

La web ya ofrece texto estático bilingüe y casos reales. La principal oportunidad
es que cada caso y proyecto tenga una página propia, enlazada desde su lista o
diálogo y desde artículos relacionados. Los diálogos se pueden conservar para la
lectura rápida. Las rutas siguientes son propuestas y aún no existen.

| Página propuesta | Búsqueda o tema objetivo | Contenido respaldado |
| --- | --- | --- |
| Portada ES/EN | Javier Jiménez Molina, DevOps Engineer, ingeniero DevOps, Kubernetes, CI/CD | Rol, localización y experiencia real. |
| `/es/casos/jenkins-shared-libraries-python` | Jenkins Shared Libraries, pipeline Python, CI/CD reutilizable | Workflow Python y biblioteca compartida en Groovy. |
| `/es/casos/despliegue-cambios-configuracion` | Jenkins sin reconstrucción, values.yaml, application.properties | Clasificación de cambios, flujo y cálculo del ahorro potencial. |
| `/es/casos/grafana-prometheus-http-500` | Grafana Prometheus HTTP 500 Slack | Métricas, regla de alerta y notificación. |
| `/es/casos/bitbucket-jenkins-notificaciones-pr` | Bitbucket webhooks Jenkins, avisos de Pull Requests | Integración y canales Slack, correo y Teams. |
| `/es/casos/kubernetes-memoria` | Kubernetes reinicios por memoria, requests, limits | Diagnóstico y propuesta, con sus límites actuales. |
| `/es/projects/self-hosted-knowledge-platform` | Outline autoalojado Docker PostgreSQL Redis | Arquitectura y operación del proyecto personal. |

Cada página debería empezar con una explicación breve del trabajo, seguida de
contexto, problema, decisiones, solución, validación, resultado y límites. Añadir
diagramas, ejemplos reproducibles y evidencia pública cuando estén disponibles.
Crear la versión inglesa equivalente y exportación Markdown desde los mismos
datos. Mantener anonimizada la información de trabajo.

Un título posible para la portada es «Javier Jiménez Molina | DevOps, Kubernetes
y CI/CD». Las palabras objetivo deben aparecer donde describan el contenido:
título, introducción, encabezados y enlaces. Evitar listas repetitivas o contenido
creado únicamente para captar consultas. Google no utiliza `meta keywords` para
posicionar. [Metadatos admitidos por Google](https://developers.google.com/search/docs/crawling-indexing/special-tags).

Los enlaces deberían explicar el destino, por ejemplo «Caso: pipeline Python con
Jenkins Shared Libraries». Añadir enlaces a repositorios, demos y documentación
cuando existan y sean públicos. Compartir el trabajo en perfiles y comunidades
técnicas pertinentes. [Guía de enlaces de Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

## Datos estructurados y presentación

No hay JSON-LD ni `og:image` en el layout actual. Recomiendo añadir:

- `Person` y `WebSite`, con el nombre real, rol, dominio y enlaces `sameAs` a los
  perfiles públicos. `ProfilePage` en la página dedicada al perfil, según encaje
  con su contenido. [Documentación de ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page).
- `BlogPosting` en artículos, con autor y URL del perfil; fechas de publicación y
  actualización reales cuando se registren. No usar la fecha de cada build como
  si fuera una revisión editorial. [Documentación de Article](https://developers.google.com/search/docs/appearance/structured-data/article).
- Breadcrumbs visibles y su marcado en las futuras páginas de casos y proyectos.
- Una imagen de presentación para OpenGraph/Twitter y vistas previas coherentes
  al compartir. Su propósito es mejorar la presentación, sin prometer ranking.

El marcado debe reflejar el contenido visible. No añadir certificaciones,
valoraciones, disponibilidad, cargos o dominio experto no documentados.

## Descubrimiento y medición con IA

El modo Markdown, los `.md` y `llms.txt` ya permiten leer todo el contenido sin
interacciones ni JavaScript. Mantenerlos sincronizados y ampliar su índice cuando
se publiquen nuevas páginas. `llms.txt` es una propuesta de lectura para agentes.
[Propuesta llms.txt](https://llmstxt.org/).

Google indica que las prácticas habituales de SEO también aplican a AI Overviews
y AI Mode; no exige archivos especiales de IA. Priorizar texto útil, acceso de
rastreadores, enlaces y coherencia del contenido.
[Guía oficial de Google sobre IA](https://developers.google.com/search/docs/appearance/ai-features).

Para ChatGPT Search, permitir `OAI-SearchBot` y comprobar que el hosting/CDN no
bloquee sus solicitudes. El acceso para búsqueda y el de entrenamiento son
controles independientes. El robots actual permite el rastreo general.
[Rastreadores de OpenAI](https://developers.openai.com/api/docs/bots).

Medir impresiones, consultas y clics en Search Console; contactos y clics a
perfiles en la analítica elegida. Bing ofrece un panel AI Performance para
consultar citas y URLs referenciadas en sus experiencias de IA compatibles.
Sus métricas de citas no equivalen a una posición de ranking.
[AI Performance de Bing](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/).

Valorar IndexNow para avisar a Bing y otros motores participantes de páginas
nuevas, cambiadas o eliminadas. Un aviso aceptado no garantiza indexación.
[Documentación de IndexNow](https://www.indexnow.org/documentation).

Antes de optimizar rendimiento, medir el dominio publicado con PageSpeed
Insights y datos de Core Web Vitals. Revisar especialmente carga de fuentes,
LCP, INP y CLS. El sitio utiliza Google Fonts mediante CSS import y SVG ligeros;
la prioridad debe basarse en mediciones, no en atribuir una puntuación inventada.

## Orden de trabajo recomendado

1. Publicar la corrección de dominio, configurar la migración y verificar los
   buscadores. Completar los enlaces del perfil público.
2. Añadir datos estructurados y presentación social, con validación del marcado.
3. Publicar primero los tres casos más diferenciadores: workflow Python,
   configuración sin construcción y alertas HTTP 500. Después ampliar proyectos.
4. Registrar resultados reales de búsqueda, citas y contactos, y orientar las
   siguientes páginas según esas consultas y la experiencia disponible.

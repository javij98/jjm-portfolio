# Project instructions

This repository contains Javier Jiménez Molina's personal professional website.

## Main objective

The site should position Javier primarily as a DevOps / Platform Engineer.

Professional positioning should prioritize:
- DevOps
- Platform Engineering
- Kubernetes
- CI/CD
- Automation
- Observability
- Linux
- Cloud-native engineering

Software development experience is relevant as supporting background, but the site
should not position Javier primarily as a Full-Stack Developer.

## Source of truth

For Javier's professional background, experience, projects and positioning, read:

- `docs/PROFILE_CONTEXT.md`
- `docs/WEBSITE_GOALS.md`

Do not invent experience, technologies, certifications or metrics that are not
supported by these documents or the repository.

## Working rules

- Preserve Spanish and English versions.
- Keep the current Astro + React architecture unless there is a clear reason to change it.
- Maintain responsive behaviour.
- Prefer reusable components.
- Run the build after significant changes.
- Do not remove existing content without explaining why.

## Site structure and content

- The home page previews real experience and projects and links to the CV. Reuse
  existing content and images rather than maintaining separate factual copies.
- `/{lang}/cv` is the full CV; `/{lang}/cv/compact` is its compact view. Keep
  the summary and view selector shared, preserve section fragments and browser
  history, and keep the in-page contents usable on desktop, mobile and without JS.
- Human/LLM navigation is contextual: `/{lang}/llm` reads the whole portfolio;
  `/{lang}/cv/llm` reads the CV. Their raw sources are `/{lang}/index.md` and
  `/{lang}/cv.md` respectively. Both visual CV views share the latter; do not
  add duplicate Markdown URLs for them. The CV export excludes blog articles.
- Keep CV facts consistent across HTML and Markdown via `src/i18n/content.ts`,
  `src/data/cv-details.ts` and `src/lib/markdown.ts`. Do not hide Markdown syntax
  in the LLM views or alter the raw text when copying or downloading.

## Interaction and verification

- Preserve keyboard operation, focus return, direct links, no-JS fallbacks and
  reduced-motion behavior. Detail dialogs animate from the selected card's bounds;
  offscreen deep links must still open sensibly.
- The search hint animates on direct entry or reload, not on same-site navigation
  or browser back/forward. Preserve that behavior when changing the header.
- For UI changes, test both languages and representative mobile, tablet and
  desktop sizes, including affected search, navigation and Markdown paths.
  Run `npm run build`, `npx tsc --noEmit` and relevant Playwright tests; set
  `PORTFOLIO_URL` to the actual server and report pre-existing failures honestly.
- When a review server is running, leave one accessible and share its URL. If a
  restart is necessary, start a replacement before stopping the existing server.

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";
const languages = {
  es: { cases: "Problemas concretos, soluciones contrastadas", projects: "Proyectos", skills: "Competencias técnicas", level: "En desarrollo", estimate: "Estimación" },
  en: { cases: "Concrete problems, practical solutions", projects: "Projects", skills: "Technical skills", level: "Developing", estimate: "Estimate" },
};

function section(markdown, title) {
  return markdown.split(`\n## ${title}\n`)[1]?.split("\n## ")[0] ?? "";
}

test("Human / LLM and language switching work without JavaScript and include all content", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const [lang, labels] of Object.entries(languages)) {
      const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 800 } });
      await page.goto(`${baseUrl}/${lang}/projects`);
      await page.locator('[data-view-mode="llm"]').click();
      assert.equal(new URL(page.url()).pathname.replace(/\/$/, ""), `/${lang}/llm`);
      const markdown = await page.locator("[data-markdown-content]").textContent();
      const response = await page.request.get(`${baseUrl}/${lang}/index.md`);
      assert.equal(response.status(), 200);
      assert.match(response.headers()["content-type"], /^text\/markdown\b/);
      assert.equal(markdown, await response.text(), "Visible Markdown and raw export must match exactly");
      assert.ok(markdown.startsWith("# Javier Jiménez Molina\n"));
      assert.equal(section(markdown, labels.cases).match(/^### /gm)?.length, 9, "Expanded and dialog-only cases must be included");
      assert.equal(section(markdown, labels.projects).match(/^### /gm)?.length, 6, "Include projects outside the homepage preview");
      assert.match(markdown, /### Services Site\n/);
      assert.match(markdown, /### Print Studio\n/);
      assert.ok(markdown.includes(`- AWS — ${labels.level}`));
      assert.ok(markdown.includes(`- Terraform — ${labels.level}`));
      assert.ok(markdown.includes(`**${labels.estimate}:** 13–25 h`));
      assert.match(markdown, /67–125 h/);
      assert.match(markdown, lang === "es" ? /tiempo de ejecución de agentes CI/ : /CI agent execution time/);
      assert.match(markdown, /mailto:jjime981@gmail\.com/);
      assert.equal(section(markdown, "Blog").match(/^### /gm)?.length, 2, "Include full published blog articles");
      assert.equal(await page.locator("[data-copy-markdown]").isVisible(), false, "No inactive copy control without JavaScript");

      const otherLang = lang === "es" ? "en" : "es";
      await page.locator(`header a[lang="${otherLang}"]`).click();
      assert.equal(new URL(page.url()).pathname.replace(/\/$/, ""), `/${otherLang}/llm`);
      await page.locator('[data-view-mode="human"]').click();
      assert.equal(new URL(page.url()).pathname.replace(/\/$/, ""), `/${otherLang}`);
      assert.equal(await page.locator("html").getAttribute("data-reading-mode"), "human");
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test("every public page advertises a working Markdown alternative and llms.txt links resolve", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false });
    for (const lang of ["es", "en"]) {
      for (const suffix of ["", "/projects", "/blog", "/blog/del-desarrollo-a-devops", "/blog/plataforma-de-conocimiento-autoalojada", "/llm"]) {
        await page.goto(`${baseUrl}/${lang}${suffix}`);
        const href = await page.locator('head link[rel="alternate"][type="text/markdown"]').getAttribute("href");
        assert.ok(href, `Missing Markdown alternative on /${lang}${suffix}`);
        const path = new URL(href).pathname;
        const response = await page.request.get(`${baseUrl}${path}`);
        assert.equal(response.status(), 200, path);
        assert.match(response.headers()["content-type"], /^text\/markdown\b/, path);
        assert.match(await response.text(), /^# /, path);
        assert.doesNotMatch(await response.text(), /<!doctype|<html/i, "Agents must receive Markdown rather than the HTML shell");
        assert.ok(await page.locator('head link[rel="describedby"]').getAttribute("href"));
      }
    }
    const index = await page.request.get(`${baseUrl}/llms.txt`);
    assert.equal(index.status(), 200);
    assert.match(index.headers()["content-type"], /^text\/plain\b/);
    const text = await index.text();
    assert.match(text, /^# Javier Jiménez Molina/);
    const links = [...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((match) => new URL(match[1]).pathname);
    assert.ok(links.includes("/es/index.md") && links.includes("/en/index.md"));
    for (const path of links) {
      assert.equal((await page.request.get(`${baseUrl}${path}`)).status(), 200, `llms.txt link: ${path}`);
    }
    const full = await page.request.get(`${baseUrl}/llms-full.txt`);
    const english = await page.request.get(`${baseUrl}/en/index.md`);
    assert.equal(await full.text(), await english.text());
  } finally {
    await browser.close();
  }
});

test("both reading modes fit mobile and desktop screens in ES and EN", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    for (const lang of ["es", "en"]) {
      for (const suffix of ["", "/llm"]) {
        await page.goto(`${baseUrl}/${lang}${suffix}`);
        for (const width of [320, 375, 640, 768, 1024, 1280, 1536, 1920]) {
          await page.setViewportSize({ width, height: 900 });
          // Let the browser repaint after resizing; scrollWidth can otherwise reflect the previous viewport.
          await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          const size = await page.evaluate(() => {
            const header = document.querySelector("header nav");
            return {
              documentWidth: document.documentElement.scrollWidth,
              viewport: innerWidth,
              headerWidth: header.scrollWidth,
              headerAvailable: header.clientWidth,
              headerHeight: header.getBoundingClientRect().height,
            };
          });
          assert.ok(size.documentWidth <= size.viewport, `${lang}${suffix} at ${width}px: page overflow ${JSON.stringify(size)}`);
          assert.ok(size.headerWidth <= size.headerAvailable, `${lang}${suffix} at ${width}px: header overflow`);
          assert.equal(size.headerHeight, 64, "Adding the switch must preserve the compact header");
        }
      }
    }
  } finally {
    await browser.close();
  }
});

test("copy and download provide the complete Markdown document", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const context = await browser.newContext({ permissions: ["clipboard-read", "clipboard-write"], viewport: { width: 1100, height: 800 } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/en/llm`);
    const markdown = await page.locator("[data-markdown-content]").textContent();
    const button = page.locator("[data-copy-markdown]");
    await button.click();
    await page.getByRole("status").filter({ hasText: "Markdown copied" }).waitFor();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), markdown);
    assert.equal(await button.evaluate((element) => element === document.activeElement), false, "Pointer copy must release focus");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: "Download .md", exact: true }).click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), "javier-jimenez-molina-en.md");
    assert.equal(await readFile(await download.path(), "utf8"), markdown);
  } finally {
    await browser.close();
  }
});

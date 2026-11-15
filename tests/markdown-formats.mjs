import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("both CV views expose the single localized CV Markdown and open its reading view", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) for (const suffix of ["/cv", "/cv/compact"]) for (const js of [false, true]) {
      const page = await browser.newPage({ javaScriptEnabled: js, reducedMotion: "reduce" });
      await page.goto(`${base}/${lang}${suffix}`, { waitUntil: "networkidle" });
      const alternate = await page.locator('link[rel="alternate"][type="text/markdown"]').getAttribute("href");
      assert.equal(new URL(alternate).pathname, `/${lang}/cv.md`);
      const llm = page.locator('[data-view-mode="llm"]');
      assert.equal(await llm.getAttribute("href"), `/${lang}/cv/llm`);
      await llm.click();
      const response = await page.request.get(`${base}/${lang}/cv.md`);
      assert.equal(response.status(), 200);
      assert.match(response.headers()["content-type"], /^text\/markdown/);
      const markdown = await response.text();
      assert.equal(await page.locator("[data-markdown-content]").textContent(), markdown);
      assert.match(markdown, /MoneyFlow/);
      assert.doesNotMatch(markdown, /\n## Blog\n/);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("view switching keeps the same CV Markdown alternative and obsolete duplicates are absent", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      await page.goto(`${base}/${lang}/cv`, { waitUntil: "networkidle" });
      await page.locator('[data-cv-view="compact"]').click();
      assert.equal(new URL(await page.locator('link[rel="alternate"][type="text/markdown"]').getAttribute("href")).pathname, `/${lang}/cv.md`);
      assert.equal(await page.locator('[data-view-mode="llm"]').getAttribute("href"), `/${lang}/cv/llm`);
      for (const path of [`/${lang}/cv/compact.md`, `/${lang}/cv/${lang === "es" ? "completo" : "full"}.md`]) {
        assert.equal((await page.request.get(`${base}${path}`)).status(), 404, `${path} must not be another published document`);
      }
      assert.equal((await page.request.get(`${base}/${lang}/index.md`)).status(), 200);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("each Markdown export links to the matching language and document scope", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage();
    for (const [lang, other] of [["es", "en"], ["en", "es"]]) {
      for (const doc of ["index", "cv"]) {
        const text = await (await page.request.get(`${base}/${lang}/${doc}.md`)).text();
        assert.ok(text.includes(`](https://javierjimenez.dev/${other}/${doc}.md)`), `${lang}/${doc}.md should link to the corresponding ${other} export`);
        assert.doesNotMatch(text, /\/cv\/(?:compact|completo|full)\.md/);
      }
    }
  } finally { await browser.close(); }
});

test("LLM mode styles Markdown syntax while preserving every source character", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) for (const width of [320, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: false });
      page.setDefaultTimeout(3000);
      await page.goto(`${base}/${lang}/llm`);
      const raw = await (await page.request.get(`${base}/${lang}/index.md`)).text();
      const pre = page.locator("[data-markdown-content]");
      assert.equal(await pre.textContent(), raw);
      const title = pre.locator("[data-md-heading='1']").first();
      assert.match(await title.textContent(), /^# /);
      const bodySize = await pre.evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
      assert.ok(await title.evaluate((e) => parseFloat(getComputedStyle(e).fontSize)) > bodySize);
      const bold = pre.locator("[data-md-strong]").first();
      assert.match(await bold.textContent(), /^\*\*.+\*\*$/);
      assert.ok(await bold.evaluate((e) => parseInt(getComputedStyle(e).fontWeight)) >= 600);
      assert.ok(await pre.locator("[data-md-link]").count() > 0);
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.close();
    }
  } finally { await browser.close(); }
});

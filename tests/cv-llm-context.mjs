import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("CV Human/LLM navigation is contextual and preserves raw Markdown", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) for (const suffix of ["/cv", "/cv/compact"]) for (const enabled of [false, true]) {
      const page = await browser.newPage({ javaScriptEnabled: enabled, reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
      page.setDefaultTimeout(4000);
      await page.goto(`${base}/${lang}${suffix}`, { waitUntil: "networkidle" });
      await page.locator('[data-view-mode="llm"]').click();
      assert.equal(new URL(page.url()).pathname, `/${lang}/cv/llm`);
      const raw = await (await page.request.get(`${base}/${lang}/cv.md`)).text();
      assert.equal(await page.locator("[data-markdown-content]").textContent(), raw);
      assert.match(raw, /MoneyFlow/);
      assert.doesNotMatch(raw, /\n## Blog\n/);
      assert.equal(await page.locator('[data-view-mode="human"]').getAttribute("href"), `/${lang}/cv`);
      const other = lang === "es" ? "en" : "es";
      assert.equal(await page.locator(`header a[lang='${other}']`).getAttribute("href"), `/${other}/cv/llm`);
      assert.equal(new URL(await page.locator('link[rel="alternate"][type="text/markdown"]').getAttribute("href")).pathname, `/${lang}/cv.md`);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex,follow");
      await page.locator('[data-view-mode="human"]').click();
      assert.equal(new URL(page.url()).pathname, `/${lang}/cv`);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("CV LLM copies and downloads exactly its localized raw document", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const context = await browser.newContext({ permissions: ["clipboard-read", "clipboard-write"] });
      const page = await context.newPage();
      await page.goto(`${base}/${lang}/cv/llm`);
      const raw = await (await page.request.get(`${base}/${lang}/cv.md`)).text();
      await page.locator("[data-copy-markdown]").click();
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), raw);
      const pending = page.waitForEvent("download");
      await page.locator('a[download]').click();
      const download = await pending;
      assert.equal(await readFile(await download.path(), "utf8"), raw);
      await context.close();
    }
  } finally { await browser.close(); }
});

test("CV summary and compact-specific facts are present in both Markdown scopes", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage({ javaScriptEnabled: false });
      await page.goto(`${base}/${lang}/cv/compact`);
      const summary = (await page.locator("[data-cv-summary] > p").last().textContent()).trim();
      const compact = page.locator("[data-cv-panel='compact']");
      const details = (await compact.locator("ol > li ul > li").allTextContents()).map((text) => text.trim());
      const dates = (await compact.locator("ol > li > div > span").allTextContents()).map((text) => text.trim());
      const location = (await compact.locator("ol > li:nth-child(2) > p").first().textContent()).trim();
      const skillLines = (await compact.locator("#compact-skills > div > div > p").allTextContents()).map((text) => text.trim());
      const courses = (await compact.locator("[aria-labelledby='cv-training'] li > span:first-child").allTextContents()).map((text) => text.trim());
      assert.ok(details.length >= 9 && skillLines.length >= 8 && courses.length >= 8, "compact CV content must be present");
      for (const path of [`/${lang}/cv.md`, `/${lang}/index.md`]) {
        const text = await (await page.request.get(`${base}${path}`)).text();
        assert.ok(text.includes(summary), `${path}: shared professional summary missing`);
        assert.equal(text.split(summary).length - 1, 1, `${path}: summary should not be repeated`);
        for (const detail of [...details, ...dates, location, ...skillLines, ...courses]) assert.ok(text.includes(detail), `${path}: missing CV detail ${detail}`);
        for (const phrase of ["n8n", "Pipelines as Code", "Agile Software Development"]) assert.ok(text.includes(phrase), `${path}: missing ${phrase}`);
      }
      await page.close();
    }
  } finally { await browser.close(); }
});

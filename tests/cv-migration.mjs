import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4391";

test("the CV switcher links compact and complete views in both languages without JavaScript", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage({ javaScriptEnabled: false });
      await page.goto(`${base}/${lang}/cv`);
      for (const id of ["experience", "skills", "projects", "education"]) assert.ok(await page.locator(`#${id}`).isVisible(), `${lang} full CV missing ${id}`);
      const picker = page.locator("[data-cv-view-picker]");
      assert.equal(await picker.count(), 1);
      assert.equal(await picker.locator('[aria-current="page"]').getAttribute("href"), `/${lang}/cv`);
      assert.equal(await page.locator("[data-skills-marquee]").count(), 1, "technology strip moves with the skills");
      await picker.locator(`[href="/${lang}/cv/compact"]`).click();
      assert.equal(new URL(page.url()).pathname.replace(/\/$/, ""), `/${lang}/cv/compact`);
      for (const id of ["experience", "skills", "projects", "education"]) assert.ok(await page.locator(`#compact-${id}`).isVisible());
      assert.equal(await page.locator('[data-cv-view-picker] [aria-current="page"]').getAttribute("href"), `/${lang}/cv/compact`);
      await page.locator('[data-cv-view-picker]').getByRole('link', { name: lang === 'es' ? 'Vista completa' : 'Full view' }).click();
      assert.equal(new URL(page.url()).pathname.replace(/\/$/, ""), `/${lang}/cv`);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("CV Markdown and PDF links resolve in both languages and full views", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false });
    for (const lang of ["es", "en"]) {
      for (const suffix of ["/cv", "/cv/compact"]) {
        await page.goto(`${base}/${lang}${suffix}`);
        const href = await page.locator('link[rel="alternate"][type="text/markdown"]').getAttribute("href");
        assert.equal(new URL(href).pathname, `/${lang}/cv.md`);
        const markdown = await page.request.get(`${base}${new URL(href).pathname}`);
        assert.equal(markdown.status(), 200, href);
        assert.match(markdown.headers()["content-type"], /^text\/markdown/);
        const text = await markdown.text();
        assert.match(text, /MoneyFlow/);
        assert.match(text, /Krimda/);
        assert.doesNotMatch(text, /\n## Blog\n/);
      }
      for (const pdfLang of ["es", "en"]) {
        const pdf = await page.request.get(`${base}/${pdfLang}/cv.pdf`);
        assert.equal(pdf.status(), 200);
        assert.match(pdf.headers()["content-type"], /^application\/pdf/);
        assert.equal((await pdf.body()).subarray(0, 5).toString(), "%PDF-");
        const filename = pdfLang === "es" ? "JavierJimenezMolina_cv_es.pdf" : "JavierJimenezMolinaCV_en.pdf";
        assert.deepEqual(await pdf.body(), await readFile(new URL(`../public/files/${filename}`, import.meta.url)));
      }
      await page.goto(`${base}/${lang}/cv`);
      for (const pdfLang of ["es", "en"]) assert.equal(await page.locator(`[data-cv-language="${pdfLang}"] a[download]`).getAttribute("href"), `/${pdfLang}/cv.pdf`);
      await page.goto(`${base}/${lang}/cv/compact`);
      await page.locator('[data-view-mode="llm"]').click();
      assert.equal(new URL(page.url()).pathname.replace(/\/$/, ""), `/${lang}/cv/llm`);
      assert.equal(await page.locator("[data-markdown-content]").textContent(), await (await page.request.get(`${base}/${lang}/cv.md`)).text());
    }
  } finally { await browser.close(); }
});

test("full CV language links and hreflang preserve the complete view", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false });
    await page.goto(`${base}/es/cv/compact`);
    assert.equal(await page.locator('header a[lang="en"]').getAttribute("href"), "/en/cv/compact");
    assert.equal(new URL(await page.locator('link[hreflang="en"]').getAttribute("href")).pathname, "/en/cv/compact");
    await page.locator('header a[lang="en"]').click();
    assert.equal(new URL(page.url()).pathname.replace(/\/$/, ""), "/en/cv/compact");
    assert.equal(await page.locator('header a[lang="es"]').getAttribute("href"), "/es/cv/compact");
  } finally { await browser.close(); }
});

test("home stays concise and links directly to the full CV sections", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage({ javaScriptEnabled: false });
      await page.goto(`${base}/${lang}`);
      for (const id of ["hero", "about", "blog", "contact"]) assert.equal(await page.locator(`main > section#${id}`).count(), 1);
      for (const id of ["projects", "experience", "skills", "education"]) assert.equal(await page.locator(`main > section#${id}`).count(), 0);
      assert.ok(await page.locator(`a[href="/${lang}/cv#projects"]`).count());
      assert.ok(await page.locator(`a[href="/${lang}/cv"]`).count());
      await page.goto(`${base}/${lang}/cv#experience`);
      assert.equal(await page.locator("#experience").count(), 1);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("old home section links lead to their new full CV destination", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage();
      for (const fragment of ["experience", "skills", "education", "projects", "work-case-dialog-4"]) {
        await page.goto(`${base}/${lang}#${fragment}`);
        await page.waitForURL(`**/${lang}/cv#${fragment}`);
        assert.equal(await page.locator(`#${fragment}`).count(), 1);
      }
      await page.close();
    }
  } finally { await browser.close(); }
});

test("search results open work cases and projects in the complete CV", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(8000);
    await page.goto(`${base}/en`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Commands" }).click();
    await page.getByRole("combobox").fill("Print Studio");
    await page.getByRole("option").filter({ hasText: "Print Studio" }).first().click();
    await page.waitForURL("**/en/cv#project-dialog-2");
    await page.locator("#project-dialog-2[open]").waitFor();
    await page.locator("#project-dialog-2 [data-detail-close]").click();
    await page.getByRole("button", { name: "Commands" }).click();
    await page.getByRole("combobox").fill("HTTP 500");
    await page.getByRole("option").filter({ hasText: /500/ }).first().click();
    await page.waitForURL("**/en/cv#work-case-dialog-4");
    await page.locator("#work-case-dialog-4[open]").waitFor();
  } finally { await browser.close(); }
});

test("search section actions navigate to and within the complete CV", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const [lang, trigger, label] of [["es", "Comandos", "Experiencia"], ["en", "Commands", "Experience"]]) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
      page.setDefaultTimeout(8000);
      await page.goto(`${base}/${lang}`, { waitUntil: "networkidle" });
      for (let i = 0; i < 2; i++) {
        await page.getByRole("button", { name: trigger }).click();
        await page.getByRole("option", { name: label, exact: true }).click();
        await page.waitForURL(`**/${lang}/cv#experience`);
        assert.equal(await page.getByRole("dialog", { name: lang === "es" ? "Navegación rápida" : "Quick navigation" }).count(), 0);
      }
      await page.close();
    }
  } finally { await browser.close(); }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4393";

test("CV starts complete and switches views without replacing the shared header", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, reducedMotion: "reduce" });
      page.setDefaultTimeout(4000);
      await page.goto(`${base}/${lang}/cv`);
      const picker = page.locator("[data-cv-view-picker]");
      await picker.evaluate((element) => { element.dataset.testIdentity = "preserved"; });
      assert.ok(await page.locator("[data-cv-panel='full']").isVisible());
      const summary = await page.locator("[data-cv-summary]").innerText();
      await picker.getByRole("link", { name: lang === "es" ? "Vista compacta" : "Compact view" }).click();
      assert.equal(new URL(page.url()).pathname, `/${lang}/cv/compact`);
      assert.equal(await picker.getAttribute("data-test-identity"), "preserved");
      assert.equal(await page.locator("[data-cv-summary]").innerText(), summary);
      assert.ok(await page.locator("[data-cv-panel='compact']").isVisible());
      assert.equal(await page.locator("[data-back-home]").count(), 0);
      assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute("href")).pathname, `/${lang}/cv/compact`);
      assert.equal(new URL(await page.locator('link[rel="alternate"][type="text/markdown"]').getAttribute("href")).pathname, `/${lang}/cv/compact.md`);
      assert.equal(new URL(await page.locator(`header a[lang='${lang === "es" ? "en" : "es"}']`).getAttribute("href"), base).pathname, `/${lang === "es" ? "en" : "es"}/cv/compact`);
      await page.goBack();
      assert.equal(new URL(page.url()).pathname, `/${lang}/cv`);
      assert.ok(await page.locator("[data-cv-panel='full']").isVisible());
      assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute("href")).pathname, `/${lang}/cv`);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("full view controls work after switching from a directly loaded compact URL", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${base}/en/cv/compact`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Full view" }).click();
    await page.locator("[data-work-examples-toggle]").click();
    assert.equal(await page.locator("[data-work-examples-toggle]").getAttribute("aria-expanded"), "true");
    await page.locator("#projects [data-project-open]").first().click();
    assert.equal(await page.locator("#project-dialog-0").getAttribute("open"), "");
    await page.locator("#project-dialog-0 [data-detail-close]").click();
  } finally { await browser.close(); }
});

test("both CV URLs work without JavaScript and retain language and Markdown links", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const other = lang === "es" ? "en" : "es";
      const page = await browser.newPage({ javaScriptEnabled: false });
      for (const [suffix, view] of [["/cv", "full"], ["/cv/compact", "compact"]]) {
        await page.goto(`${base}/${lang}${suffix}`);
        assert.ok(await page.locator(`[data-cv-panel='${view}']`).isVisible());
        assert.equal(await page.locator("[data-back-home]").count(), 0);
        assert.equal(await page.locator(`header a[lang='${other}']`).getAttribute("href"), `/${other}${suffix}`);
        assert.equal(new URL(await page.locator('link[rel="alternate"][type="text/markdown"]').getAttribute("href")).pathname, `/${lang}${suffix}.md`);
        assert.equal((await page.request.get(`${base}/${lang}${suffix}.md`)).status(), 200);
      }
      await page.close();
    }
  } finally { await browser.close(); }
});

test("old complete-view URLs retain fragments while forwarding to the default CV", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const [lang, old] of [["es", "completo"], ["en", "full"]]) {
      const page = await browser.newPage();
      await page.goto(`${base}/${lang}/cv/${old}#experience`);
      await page.waitForURL(`**/${lang}/cv#experience`, { timeout: 5000 });
      assert.ok(await page.locator("#experience").isVisible());
      await page.close();
    }
  } finally { await browser.close(); }
});

test("search opens project and case results on the default full CV", async () => {
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

test("view switching keeps summary geometry and main section typography consistent", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [320, 390, 768, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${base}/es/cv`);
      await page.evaluate(() => document.fonts.ready);
      const summary = page.locator("[data-cv-summary]");
      const before = await summary.boundingBox();
      const fullSize = await page.locator("#experience h2").first().evaluate((el) => getComputedStyle(el).fontSize);
      await page.getByRole("link", { name: "Vista compacta" }).click();
      assert.deepEqual(await summary.boundingBox(), before);
      const compactSize = await page.locator("#compact-experience h2").first().evaluate((el) => getComputedStyle(el).fontSize);
      assert.equal(compactSize, fullSize, `${width}px: section title size changes across views`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px: compact CV overflows`);
      await page.close();
    }
  } finally { await browser.close(); }
});

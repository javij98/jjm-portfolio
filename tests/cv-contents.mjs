import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";
const ids = ["experience", "skills", "projects", "education"];

test("CV offers localized in-page navigation for the visible view without JavaScript", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) for (const width of [375, 1440]) for (const view of ["full", "compact"]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: false });
      await page.goto(`${base}/${lang}/cv${view === "compact" ? "/compact" : ""}`);
      const index = page.locator("[data-cv-index]:visible");
      assert.equal(await index.count(), 1, `${lang} ${width} ${view}: one visible index`);
      for (const id of ids) {
        const target = `${view === "compact" ? "compact-" : ""}${id}`;
        const link = index.locator(`a[href='#${target}']`);
        assert.equal(await link.count(), 1);
        assert.ok(await page.locator(`#${target}`).isVisible());
      }
      await index.locator(`a[href='#${view === "compact" ? "compact-" : ""}skills']`).click();
      assert.equal(new URL(page.url()).hash, `#${view === "compact" ? "compact-" : ""}skills`);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("CV index follows view switches and browser history without replacing the shared summary", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${base}/${lang}/cv`, { waitUntil: "networkidle" });
      await page.locator("[data-cv-summary]").evaluate((e) => { e.dataset.identity = "same"; });
      await page.locator('[data-cv-view="compact"]').click();
      const index = page.locator("[data-cv-index]:visible");
      for (const id of ids) assert.equal(await index.locator(`a[href='#compact-${id}']`).count(), 1);
      await index.locator("a[href='#compact-projects']").click();
      assert.equal(new URL(page.url()).hash, "#compact-projects");
      assert.ok(await page.locator("#compact-projects").isVisible());
      assert.equal(await page.locator("[data-cv-summary]").getAttribute("data-identity"), "same");
      await page.goBack();
      await page.goBack();
      assert.ok(await page.locator("[data-cv-panel='full']").isVisible());
      assert.equal(await index.locator("a[href='#experience']").count(), 1);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("CV index highlights the selected section even when compact sections share a row", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${base}/es/cv/compact`, { waitUntil: "networkidle" });
    const index = page.locator("[data-cv-index]:visible");
    for (const section of ["experience", "skills", "experience", "projects", "education"]) {
      const link = index.locator(`a[data-cv-index-section='${section}']`);
      await link.click();
      await page.waitForTimeout(100);
      assert.equal(await link.getAttribute("aria-current"), "location", `${section}: selected section should be highlighted`);
    }
    await page.goto(`${base}/es/cv/compact#compact-skills`, { waitUntil: "networkidle" });
    await page.waitForTimeout(100);
    assert.equal(await index.locator("a[data-cv-index-section='skills']").getAttribute("aria-current"), "location", "a direct link highlights its section");
  } finally { await browser.close(); }
});

test("index works by keyboard and stays within the viewport at responsive breakpoints", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) for (const width of [320, 768, 1279, 1280, 1440, 1920]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${base}/${lang}/cv`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const index = page.locator("[data-cv-index]:visible");
      const rect = await index.boundingBox();
      assert.ok(rect.x >= 0 && rect.x + rect.width <= width, `${lang} ${width}: index fits`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${lang} ${width}: no horizontal overflow`);
      const link = index.locator("a[href='#projects']");
      await link.focus();
      await page.keyboard.press("Enter");
      assert.equal(new URL(page.url()).hash, "#projects");
      assert.ok(await page.locator("#projects").isVisible());
      await page.close();
    }
  } finally { await browser.close(); }
});

test("visible index precedes the CV sections in keyboard and reading order", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(`${base}/es/cv`, { waitUntil: "networkidle" });
      const precedes = await page.locator("[data-cv-index]:visible").evaluate((index) => Boolean(index.compareDocumentPosition(document.querySelector("#experience")) & Node.DOCUMENT_POSITION_FOLLOWING));
      assert.equal(precedes, true, `${width}px: index must precede content in DOM order`);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("desktop index stays visible on scroll but does not stick in very short viewports", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${base}/es/cv`, { waitUntil: "networkidle" });
    const sticky = page.locator("[data-cv-index-sticky]");
    assert.equal(await sticky.evaluate((e) => getComputedStyle(e).position), "sticky");
    await page.evaluate(() => window.scrollTo(0, 1000));
    const first = await sticky.boundingBox();
    await page.evaluate(() => window.scrollTo(0, 1800));
    const second = await sticky.boundingBox();
    assert.ok(Math.abs(first.y - second.y) <= 2, "sidebar remains at the same height while scrolling");
    await page.setViewportSize({ width: 1440, height: 400 });
    assert.equal(await sticky.evaluate((e) => getComputedStyle(e).position), "static");
  } finally { await browser.close(); }
});

test("global navigation keeps a single CV link without a subnavigation", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [375, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: false });
      await page.goto(`${base}/es`);
      if (width < 1024) await page.locator("[data-mobile-nav] > summary").click();
      assert.equal(await page.locator("[data-cv-desktop-nav], [data-cv-mobile-nav]").count(), 0);
      const link = page.getByRole("navigation", { name: "Navegación principal" }).getByRole("link", { name: "CV y proyectos", exact: true });
      assert.equal(await link.getAttribute("href"), "/es/cv");
      await link.click();
      assert.equal(new URL(page.url()).pathname, "/es/cv");
      assert.ok(await page.locator("[data-cv-summary]").isVisible());
      await page.close();
    }
  } finally { await browser.close(); }
});

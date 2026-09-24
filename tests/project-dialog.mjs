import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("project details open in an accessible dialog without stretching gallery cards", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      for (const width of [390, 1408]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        await page.goto(`${baseUrl}/${lang}/projects`, { waitUntil: "domcontentloaded" });
        await page.evaluate(() => document.fonts.ready);
        const cards = page.locator(".gallery-card");
        const positionsBefore = await cards.evaluateAll((elements) => elements.map((card) => {
          const { top, height } = card.getBoundingClientRect();
          return { top: top + window.scrollY, height };
        }));
        const opener = cards.first().locator("[data-project-open]");
        assert.equal(await opener.getAttribute("aria-haspopup"), "dialog");
        await opener.click();
        const dialog = page.locator("[data-project-dialog][open]");
        assert.equal(await dialog.count(), 1, `${lang} ${width}px: exactly one dialog should open`);
        assert.equal(await dialog.locator("h2").textContent(), "MoneyFlow");
        assert.ok(await dialog.locator("[data-project-detail]").count() >= 1, "dialog needs additional project context");
        assert.ok(await dialog.locator("li").count() >= 4, "dialog includes project highlights and stack");
        const positionsAfter = await cards.evaluateAll((elements) => elements.map((card) => {
          const { top, height } = card.getBoundingClientRect();
          return { top: top + window.scrollY, height };
        }));
        assert.deepEqual(positionsAfter, positionsBefore, "gallery cards must not move or stretch");
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert.ok(overflow <= 0, `${lang} ${width}px: page must not overflow horizontally`);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("[data-project-dialog][open]").count(), 0);
        assert.equal(await opener.evaluate((element) => element === document.activeElement), true, "focus must return to the details button");
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
});

test("filtered project details open their own content and close with the visible control", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 580, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/es/projects`, { waitUntil: "domcontentloaded" });
    await page.locator('[data-project-filter="web"]').click();
    const visibleCards = page.locator(".gallery-card:visible");
    assert.equal(await visibleCards.count(), 2);
    await visibleCards.last().locator("[data-project-open]").click();
    const dialog = page.locator("[data-project-dialog][open]");
    assert.equal(await dialog.locator("h2").textContent(), "Services Site");
    await dialog.locator("[data-project-close]").click();
    assert.equal(await page.locator("[data-project-dialog][open]").count(), 0);
    assert.equal(await visibleCards.count(), 2, "filter selection remains intact after closing");
  } finally {
    await browser.close();
  }
});

test("home project preview also opens a dialog and backdrop click closes it", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1408, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    const opener = page.locator("#projects .gallery-card [data-project-open]").first();
    await opener.click();
    assert.equal(await page.locator("[data-project-dialog][open]").count(), 1);
    await page.mouse.click(10, 10);
    assert.equal(await page.locator("[data-project-dialog][open]").count(), 0);
    assert.equal(await opener.evaluate((element) => element === document.activeElement), true);
  } finally {
    await browser.close();
  }
});

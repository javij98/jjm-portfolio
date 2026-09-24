import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("every standalone route has a localized link back to its home page", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      for (const path of ["/blog", "/projects", "/blog/del-desarrollo-a-devops"]) {
        const page = await browser.newPage({ viewport: { width: 398, height: 752 }, reducedMotion: "reduce" });
        await page.goto(`${baseUrl}/${lang}${path}`, { waitUntil: "domcontentloaded" });
        const link = page.locator("main [data-back-home]");
        assert.equal(await link.count(), 1, `${lang}${path}: one home link`);
        assert.equal(await link.getAttribute("href"), `/${lang}`);
        assert.match(await link.textContent(), lang === "es" ? /Volver al inicio/ : /Back to home/);
        await page.close();
      }
      const home = await browser.newPage({ viewport: { width: 398, height: 752 }, reducedMotion: "reduce" });
      await home.goto(`${baseUrl}/${lang}`, { waitUntil: "domcontentloaded" });
      assert.equal(await home.locator("main [data-back-home]").count(), 0);
      await home.close();
    }
  } finally {
    await browser.close();
  }
});

test("the whole mobile terminal fits in a screenshot-sized first viewport", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      for (const [width, height] of [[398, 752], [390, 740], [375, 667]]) {
        const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
        await page.goto(`${baseUrl}/${lang}`, { waitUntil: "domcontentloaded" });
        const result = await page.evaluate(() => ({
          terminalBottom: document.querySelector("#hero [data-terminal]").getBoundingClientRect().bottom,
          titleVisible: document.querySelector("#hero h1").getBoundingClientRect().bottom < innerHeight,
          overflow: document.documentElement.scrollWidth > innerWidth,
        }));
        assert.equal(result.titleVisible, true);
        assert.equal(result.overflow, false);
        assert.ok(result.terminalBottom <= height - 12, `${lang} ${width}×${height}: terminal ends at ${result.terminalBottom}`);
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("home previews real projects with visual cards linking to the CV gallery", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      for (const width of [320, 768, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: false });
        await page.goto(`${base}/${lang}`);
        await page.evaluate(() => document.fonts.ready);
        const cards = page.locator("[data-home-project-card]");
        assert.equal(await cards.count(), 2);
        assert.match(await cards.nth(0).innerText(), /MoneyFlow/);
        assert.match(await cards.nth(1).innerText(), /Self-hosted Knowledge Platform/);
        for (const card of await cards.all()) {
          assert.equal(await card.getAttribute("href"), `/${lang}/cv#projects`);
          assert.ok(await card.locator("img").evaluate((img) => img.complete && img.naturalWidth > 0));
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        await cards.first().click();
        assert.equal(new URL(page.url()).hash, "#projects");
        assert.ok(await page.locator("#projects").isVisible());
        await page.close();
      }
    }
  } finally { await browser.close(); }
});

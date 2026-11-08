import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4401";

test("CV summary and section introductions share typography", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      for (const width of [390, 1280]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        await page.goto(`${base}/${lang}/cv`);
        await page.evaluate(() => document.fonts.ready);
        const typography = (selector) => page.locator(selector).first().evaluate((el) => {
          const s = getComputedStyle(el);
          return { family: s.fontFamily, size: s.fontSize, lineHeight: s.lineHeight, weight: s.fontWeight, color: s.color };
        });
        assert.deepEqual(await typography("[data-cv-summary] > p"), await typography("#experience h2 + p"), `${lang} ${width}px: summary and introduction`);
        const title = await typography("#cv-heading");
        const section = await typography("#experience h2");
        assert.equal(title.family, section.family);
        assert.equal(title.size, section.size);
        assert.equal(title.weight, section.weight);
        await page.close();
      }
    }
  } finally { await browser.close(); }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4401";

test("back-to-top appears after scrolling and returns to the top in both languages", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const [lang, path, width] of [["es", "", 320], ["en", "/cv", 1280], ["es", "/llm", 390], ["en", "/blog/del-desarrollo-a-devops", 768]]) {
      const page = await browser.newPage({ viewport: { width, height: 700 }, reducedMotion: "reduce" });
      await page.goto(`${base}/${lang}${path}`);
      const button = page.getByRole("button", { name: lang === "es" ? "Volver arriba" : "Back to top" });
      assert.equal(await button.isVisible(), false);
      await page.evaluate(() => window.scrollTo(0, 800));
      await button.waitFor({ state: "visible", timeout: 3000 });
      const box = await button.boundingBox();
      assert.ok(box.x >= 0 && box.x + box.width <= width && box.y >= 0 && box.y + box.height <= 700);
      assert.ok(box.width >= 44 && box.height >= 44);
      await button.click();
      await page.waitForFunction(() => window.scrollY === 0);
      await button.waitFor({ state: "hidden" });
      await page.close();
    }
  } finally { await browser.close(); }
});

test("keyboard activation restores focus and the control stays hidden without JavaScript", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.goto(`${base}/es/cv`);
    await page.evaluate(() => window.scrollTo(0, 800));
    const button = page.getByRole("button", { name: "Volver arriba" });
    await button.waitFor({ state: "visible" });
    await button.focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => window.scrollY === 0);
    assert.equal(await page.evaluate(() => document.activeElement?.id), "main-content");
    const withoutJs = await browser.newPage({ javaScriptEnabled: false });
    await withoutJs.goto(`${base}/en/cv`);
    await withoutJs.evaluate(() => window.scrollTo(0, 800));
    assert.equal(await withoutJs.locator("[data-back-to-top]").isVisible(), false);
  } finally { await browser.close(); }
});

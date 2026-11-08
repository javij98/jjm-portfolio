import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("terminal icon receives an animated click before terminal content opens", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, reducedMotion: "no-preference" });
      await page.goto(`${base}/${lang}`, { waitUntil: "domcontentloaded" });
      const stage = page.locator("[data-terminal-stage]");
      const overlay = stage.locator("[data-terminal-intro]");
      await stage.locator("[data-terminal-pointer]").waitFor({ state: "visible", timeout: 3000 });
      assert.equal(await stage.locator("[data-terminal-icon]").isVisible(), true);
      const first = await stage.locator("[data-terminal-pointer]").boundingBox();
      await page.waitForTimeout(450);
      const second = await stage.locator("[data-terminal-pointer]").boundingBox();
      assert.ok(Math.abs(first.x - second.x) + Math.abs(first.y - second.y) > 2, "pointer moves toward terminal icon");
      await overlay.waitFor({ state: "hidden", timeout: 5000 });
      await page.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("[data-terminal]")).opacity) > 0.99);
      const command = stage.locator("[data-typed-command]");
      await page.waitForFunction(() => { const e = document.querySelector("[data-typed-command]"); return e.textContent === e.dataset.text; }, null, { timeout: 5000 });
      assert.ok((await command.textContent()).length > 0);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("reduced motion and no JavaScript show the terminal immediately", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const options of [{ reducedMotion: "reduce" }, { javaScriptEnabled: false }]) {
      const page = await browser.newPage({ ...options, viewport: { width: 390, height: 900 } });
      await page.goto(`${base}/es`);
      assert.ok(await page.locator("[data-terminal]").isVisible());
      assert.equal(await page.locator("[data-terminal-intro]").isVisible(), false);
      const command = page.locator("[data-typed-command]");
      assert.equal(await command.textContent(), await command.getAttribute("data-text"));
      await page.close();
    }
  } finally { await browser.close(); }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("full mobile name fits on one line and terminal starts in the first view", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [320, 375, 412, 597]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
      const result = await page.locator("#hero h1").evaluate((heading) => {
        const range = document.createRange();
        range.selectNodeContents(heading);
        return {
          lines: range.getClientRects().length,
          title: heading.textContent?.trim(),
          overflow: document.documentElement.scrollWidth > innerWidth,
          terminalTop: document.querySelector("#hero [data-terminal]").getBoundingClientRect().top,
        };
      });
      assert.equal(result.title, "Javier Jiménez Molina");
      assert.equal(result.lines, 1, `${width}px: name should be one line`);
      assert.equal(result.overflow, false, `${width}px: no horizontal overflow`);
      assert.ok(result.terminalTop < 900, `${width}px: terminal should begin in first view (${result.terminalTop})`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test("hero background follows the pointer and settles when it leaves", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    const shell = page.locator("[data-hero-interactive]");
    const field = page.locator("[data-hero-pointer-field]");
    const box = await shell.boundingBox();
    assert.ok(box);
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.25);
    await page.waitForTimeout(450);
    const first = await shell.evaluate((element) => ({
      x: parseFloat(getComputedStyle(element).getPropertyValue("--hero-pointer-x")),
      y: parseFloat(getComputedStyle(element).getPropertyValue("--hero-pointer-y")),
    }));
    assert.ok(Number.isFinite(first.x) && Number.isFinite(first.y), "pointer coordinates must be set");
    assert.ok(parseFloat(await field.evaluate((element) => getComputedStyle(element).opacity)) > 0.5, "background glow should appear");
    await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.7);
    await page.waitForTimeout(600);
    const second = await shell.evaluate((element) => ({
      x: parseFloat(getComputedStyle(element).getPropertyValue("--hero-pointer-x")),
      y: parseFloat(getComputedStyle(element).getPropertyValue("--hero-pointer-y")),
    }));
    assert.ok(second.x > first.x + 150 && second.y > first.y + 100, "glow should follow the pointer");
    await page.mouse.move(0, 0);
    await page.waitForTimeout(450);
    assert.ok(parseFloat(await field.evaluate((element) => getComputedStyle(element).opacity)) < 0.1, "glow should fade on leave");
  } finally {
    await browser.close();
  }
});

test("reduced motion keeps pointer-follow effect off", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    const shell = page.locator("[data-hero-interactive]");
    const field = page.locator("[data-hero-pointer-field]");
    const box = await shell.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    assert.equal(await field.evaluate((element) => getComputedStyle(element).opacity), "0");
    assert.equal(await shell.evaluate((element) => element.classList.contains("is-pointer-active")), false);
  } finally {
    await browser.close();
  }
});

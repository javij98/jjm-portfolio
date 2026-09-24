import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("informational hover fades before its rounded edges", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1415, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    for (const selector of [".experience-entry", ".work-example", ".skill-entry"]) {
      const item = page.locator(selector).first();
      await item.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      const before = await item.evaluate((element) => ({
        color: getComputedStyle(element).backgroundColor,
        opacity: Number.parseFloat(getComputedStyle(element, "::before").opacity),
      }));
      await item.hover();
      await page.waitForFunction((selector) => {
        const element = document.querySelector(selector);
        return element && Number.parseFloat(getComputedStyle(element, "::before").opacity) > 0.95;
      }, selector);
      const after = await item.evaluate((element) => ({
        color: getComputedStyle(element).backgroundColor,
        opacity: Number.parseFloat(getComputedStyle(element, "::before").opacity),
        image: getComputedStyle(element, "::before").backgroundImage,
      }));
      assert.equal(after.color, before.color, `${selector}: no solid rectangular fill`);
      assert.ok(after.opacity > before.opacity, `${selector}: soft light appears on hover`);
      assert.match(after.image, /radial-gradient/, `${selector}: light fades toward the edges`);
    }
  } finally {
    await browser.close();
  }
});

test("informational rows leave breathing room between copy and hover area", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [412, 1415]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
      for (const [selector, child] of [
        [".experience-entry", "p"],
        [".work-example", "span"],
        [".skill-entry", "p"],
      ]) {
        const gap = await page.locator(selector).first().evaluate((element, childSelector) => {
          const article = element.getBoundingClientRect();
          const copy = element.querySelector(childSelector).getBoundingClientRect();
          return copy.left - article.left;
        }, child);
        assert.ok(gap >= 12, `${width}px ${selector}: text needs 12px of breathing room, got ${gap}px`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test("timeline hover ends close to its content rather than filling the row gap", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1415, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    const gap = await page.locator(".experience-entry").first().evaluate((element) => {
      const entry = element.getBoundingClientRect();
      const content = element.querySelector(".grid").getBoundingClientRect();
      return entry.bottom - content.bottom;
    });
    assert.ok(gap <= 16, `timeline hover should stop within 16px of its divider, got ${gap}px`);
  } finally {
    await browser.close();
  }
});

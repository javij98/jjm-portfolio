import assert from "node:assert/strict";
import { test } from "node:test";

import { chromium } from "playwright";
const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

for (const width of [1415, 412]) {
  test(`interactive hover shows a complete in-bounds perimeter at ${width}px`, async () => {
    const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
    try {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });

      for (const selector of [".blog-card", "#projects a.signal-hover", "#hero a.signal-hover"]) {
        const target = page.locator(selector).first();
        await target.scrollIntoViewIfNeeded();
        await target.hover();
        const result = await target.evaluate((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          const fullBorder = ["Top", "Right", "Bottom", "Left"].every(
            (side) => Number.parseFloat(style[`border${side}Width`]) > 0 && style[`border${side}Style`] !== "none",
          );
          return {
            fullPerimeter: fullBorder || style.boxShadow.includes("inset"),
            withinViewport: rect.left >= -1 && rect.right <= innerWidth + 1,
            boxShadow: style.boxShadow,
          };
        });
        assert.ok(result.fullPerimeter, `${selector}: hover lacks a complete perimeter (${result.boxShadow})`);
        assert.ok(result.withinViewport, `${selector}: hover target extends outside the viewport`);
      }
    } finally {
      await browser.close();
    }
  });
}

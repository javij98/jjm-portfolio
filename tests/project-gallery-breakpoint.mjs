import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("projects switch to two columns at 560px but stay single-column on smaller mobile", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const [width, expectedColumns] of [[375, 1], [559, 1], [560, 2], [580, 2], [640, 2], [1024, 3]]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
      const { columns, scrollWidth, clientWidth } = await page.locator(".project-gallery").evaluate((element) => ({
        columns: getComputedStyle(element).gridTemplateColumns.split(" ").length,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      assert.equal(columns, expectedColumns, `${width}px: expected ${expectedColumns} columns`);
      assert.ok(scrollWidth <= clientWidth, `${width}px: page must not overflow horizontally`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

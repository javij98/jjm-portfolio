import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("experience milestones align with their dates and the timeline stops at the last milestone", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [412, 580, 1408]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.locator(".experience-line").evaluate((line) => {
        const center = (rect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        return {
          borderWidth: getComputedStyle(line).borderLeftWidth,
          entries: [...line.querySelectorAll(".experience-entry")].map((entry) => ({
            node: center(entry.querySelector(".experience-node").getBoundingClientRect()),
            date: center(entry.querySelector("p").getBoundingClientRect()),
            segment: entry.querySelector(".experience-segment")?.getBoundingClientRect().toJSON(),
          })),
        };
      });
      assert.equal(geometry.borderWidth, "0px", `${width}px: parent border must not extend beyond the last milestone`);
      for (const [index, entry] of geometry.entries.entries()) {
        assert.ok(Math.abs(entry.node.y - entry.date.y) <= 2, `${width}px date ${index + 1}: node ${entry.node.y}, date ${entry.date.y}`);
        if (index === geometry.entries.length - 1) {
          assert.equal(entry.segment, undefined, `${width}px: no line after the final milestone`);
        } else {
          assert.ok(entry.segment, `${width}px: missing line between milestones`);
          assert.ok(Math.abs(entry.segment.left + entry.segment.width / 2 - entry.node.x) <= 2, `${width}px: segment must share the milestone axis`);
          assert.ok(Math.abs(entry.segment.top - entry.node.y) <= 2, `${width}px: segment must start at the first milestone`);
          assert.ok(Math.abs(entry.segment.bottom - geometry.entries[index + 1].node.y) <= 2, `${width}px: segment must stop at the next milestone`);
        }
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

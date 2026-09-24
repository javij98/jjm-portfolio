import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("experience milestones sit on the vertical timeline at mobile and desktop widths", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [412, 580, 1408]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
      const positions = await page.locator(".experience-line").evaluate((line) => {
        const segment = line.querySelector(".experience-segment").getBoundingClientRect();
        const track = segment.left + segment.width / 2;
        const nodes = [...line.querySelectorAll(".experience-node")].map((node) => {
          const rect = node.getBoundingClientRect();
          return rect.left + rect.width / 2;
        });
        return { track, nodes };
      });
      for (const [index, center] of positions.nodes.entries()) {
        assert.ok(Math.abs(center - positions.track) <= 2, `${width}px node ${index + 1}: center ${center}, line ${positions.track}`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

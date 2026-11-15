import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";
const cases = [
  { opener: "#projects [data-project-open]", dialog: "#project-dialog-0" },
  { opener: "[data-work-case-open]", dialog: "#work-case-dialog-0" },
];

test("project and work dialogs morph quickly from the selected item's exact bounds", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) for (const width of [375, 1440]) for (const entry of cases) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "no-preference" });
      await page.goto(`${base}/${lang}/cv`, { waitUntil: "networkidle" });
      const opener = page.locator(entry.opener).first();
      await opener.scrollIntoViewIfNeeded();
      await opener.evaluate((element) => element.addEventListener("click", () => {
        const rect = element.closest(".gallery-card, .work-example").getBoundingClientRect();
        element.dataset.clickBounds = JSON.stringify({ x: rect.x, y: rect.y, w: rect.width, h: rect.height });
      }, { capture: true, once: true }));
      await opener.click();
      const dialog = page.locator(entry.dialog);
      assert.equal(await dialog.evaluate((element) => element.open), true);
      const geometry = await dialog.evaluate((element) => {
        const anim = element.getAnimations().find((a) => a.effect?.getKeyframes().some((frame) => frame.transform));
        if (!anim) return null;
        anim.pause();
        anim.currentTime = 0;
        const start = element.getBoundingClientRect();
        const source = JSON.parse(document.querySelector(`[aria-controls="${element.id}"]`).dataset.clickBounds);
        anim.currentTime = Number(anim.effect.getTiming().duration) / 2;
        const middle = element.getBoundingClientRect();
        anim.finish();
        const end = element.getBoundingClientRect();
        return { start: { x:start.x, y:start.y, w:start.width, h:start.height }, middle: { x:middle.x, y:middle.y, w:middle.width, h:middle.height }, source, end: { x:end.x, y:end.y, w:end.width, h:end.height }, duration: anim.effect.getTiming().duration };
      });
      assert.ok(geometry, `${lang} ${width} ${entry.dialog}: opening animation must exist`);
      for (const dimension of ["x", "y", "w", "h"]) {
        assert.ok(Math.abs(geometry.start[dimension] - geometry.source[dimension]) <= 3, `${lang} ${width} ${entry.dialog}: initial ${dimension} matches the selected item: ${JSON.stringify(geometry)}`);
        assert.ok(geometry.middle[dimension] >= Math.min(geometry.start[dimension], geometry.end[dimension]) - 1 && geometry.middle[dimension] <= Math.max(geometry.start[dimension], geometry.end[dimension]) + 1, `intermediate ${dimension} moves between card and window`);
      }
      assert.ok(geometry.duration > 0 && geometry.duration <= 360, "opening is faster than before");
      await dialog.locator("[data-detail-close]").click();
      assert.equal(await dialog.evaluate((element) => element.open), false);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("opening an offscreen item starts near the window instead of flying from outside the viewport", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const entry of cases) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: "no-preference" });
      await page.goto(`${base}/es/cv`, { waitUntil: "networkidle" });
      const result = await page.locator(entry.opener).first().evaluate((opener) => {
        const source = opener.closest(".gallery-card, .work-example").getBoundingClientRect();
        const offscreen = source.bottom <= 0 || source.top >= innerHeight;
        opener.click();
        const dialog = document.getElementById(opener.getAttribute("aria-controls"));
        const anim = dialog.getAnimations().find((a) => a.effect?.getKeyframes().some((frame) => frame.transform));
        anim.pause();
        anim.currentTime = 0;
        const start = dialog.getBoundingClientRect();
        anim.finish();
        const end = dialog.getBoundingClientRect();
        return { offscreen, startCenter: start.x + start.width / 2, endCenter: end.x + end.width / 2, startWidth: start.width, endWidth: end.width };
      });
      assert.ok(result.offscreen, "test starts with the item outside the viewport");
      assert.ok(Math.abs(result.startCenter - result.endCenter) < 2);
      assert.ok(result.startWidth > result.endWidth * 0.9);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("rapidly closing and reopening a dialog keeps its animation and scroll lock", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const entry of cases) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "no-preference" });
      await page.goto(`${base}/es/cv`, { waitUntil: "networkidle" });
      const opener = page.locator(entry.opener).first();
      await opener.scrollIntoViewIfNeeded();
      await opener.evaluate((element) => {
        const dialog = document.getElementById(element.getAttribute("aria-controls"));
        element.click();
        dialog.close();
        element.click();
      });
      await page.waitForTimeout(80);
      const result = await page.locator(entry.dialog).evaluate((element) => ({
        open: element.open,
        locked: document.documentElement.classList.contains("project-dialog-open"),
        animating: element.getAnimations().some((animation) => animation.effect?.getKeyframes().some((frame) => frame.transform)),
      }));
      assert.deepEqual(result, { open: true, locked: true, animating: true });
      await page.close();
    }
  } finally { await browser.close(); }
});

test("reduced motion opens both dialogs immediately and Escape restores focus", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const entry of cases) {
      const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${base}/es/cv`, { waitUntil: "networkidle" });
      const opener = page.locator(entry.opener).first();
      await opener.focus();
      await page.keyboard.press("Enter");
      const dialog = page.locator(entry.dialog);
      assert.equal(await dialog.evaluate((element) => element.open), true);
      assert.equal(await dialog.evaluate((element) => element.getAnimations().filter((a) => a.effect?.getKeyframes().some((frame) => frame.transform)).length), 0);
      await page.keyboard.press("Escape");
      assert.equal(await dialog.evaluate((element) => element.open), false);
      await opener.waitFor({ state: "visible" });
      await page.waitForFunction((id) => document.activeElement?.getAttribute("aria-controls") === id, entry.dialog.slice(1));
      await page.close();
    }
  } finally { await browser.close(); }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("narrow mobile header keeps the logo and controls visible without overlap", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) for (const width of [320, 340, 360, 374, 375, 390, 414, 559, 560]) {
      const page = await browser.newPage({ viewport: { width, height: 850 }, reducedMotion: "reduce" });
      await page.goto(`${base}/${lang}`, { waitUntil: "networkidle" });
      await page.locator('[data-view-mode="human"]').focus();
      const measurements = await page.locator("header nav").evaluate((nav) => {
        const elements = [nav.querySelector(":scope > a"), nav.querySelector(".search-trigger-slot button"), nav.querySelector("[data-mode-picker]"), nav.querySelector("[data-language-picker]"), nav.querySelector("[data-mobile-nav] summary")];
        const rects = elements.map((element) => { const r = element.getBoundingClientRect(); return { left:r.left, right:r.right, width:r.width, height:r.height }; });
        return { rects, overflow: document.documentElement.scrollWidth > innerWidth, navRight: nav.getBoundingClientRect().right };
      });
      assert.equal(measurements.overflow, false, `${lang} ${width}: horizontal overflow`);
      const rects = measurements.rects;
      assert.ok(rects[0].width >= 30 && rects[0].height >= 30, `${lang} ${width}: logo should be visible`);
      for (let i = 1; i < rects.length; i++) assert.ok(rects[i].left >= rects[i - 1].right - 1, `${lang} ${width}: header controls overlap`);
      assert.ok(measurements.navRight - rects.at(-1).right <= 25, `${lang} ${width}: controls should be aligned to the right`);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("extra-narrow 280px header preserves the logo and usable controls without overflow", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 280, height: 850 }, reducedMotion: "reduce" });
    await page.goto(`${base}/es`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('[data-view-mode="human"]').focus();
    const result = await page.locator("header nav").evaluate((nav) => {
      const logo = nav.querySelector(":scope > a").getBoundingClientRect();
      const group = nav.querySelector(":scope > div:nth-child(3)").getBoundingClientRect();
      return { logo: { left: logo.left, right: logo.right, top: logo.top, bottom: logo.bottom }, group: { left: group.left, right: group.right, top: group.top, bottom: group.bottom }, scroll: nav.scrollWidth, available: nav.clientWidth };
    });
    assert.ok(result.logo.right > result.logo.left && result.group.right <= result.available, JSON.stringify(result));
    assert.ok(result.scroll <= result.available, JSON.stringify(result));
    assert.ok(result.group.top >= result.logo.bottom || result.group.left >= result.logo.right, JSON.stringify(result));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "page fits viewport at 280px");
    assert.equal(await page.locator("#hero h1").evaluate((heading) => heading.scrollWidth <= heading.clientWidth), true, "full name remains readable");
    await page.locator("[data-mobile-nav] > summary").click();
    assert.equal(await page.locator("[data-mobile-nav]").evaluate((e) => e.open), true);
  } finally { await browser.close(); }
});

test("desktop navigation uses readable body-sized text", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
    await page.goto(`${base}/es`);
    const links = page.locator("header nav > div:nth-child(2) > a");
    assert.ok(await links.count() >= 3);
    for (const link of await links.all()) assert.ok(await link.evaluate((element) => parseFloat(getComputedStyle(element).fontSize)) >= 14);
  } finally { await browser.close(); }
});

test("desktop navigation remains separated from logo and controls across breakpoints", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) for (const width of [1024, 1100, 1279, 1280, 1535, 1536, 1920]) {
      const page = await browser.newPage({ viewport: { width, height: 850 }, reducedMotion: "reduce" });
      await page.goto(`${base}/${lang}`, { waitUntil: "networkidle" });
      const rects = await page.locator("header nav").evaluate((nav) => {
        const elements = [nav.querySelector(":scope > a"), nav.querySelector(":scope > div:nth-child(2)"), nav.querySelector(":scope > div:nth-child(3)")];
        return elements.map((element) => { const r = element.getBoundingClientRect(); return { left:r.left, right:r.right, width:r.width }; });
      });
      assert.ok(rects.every((r) => r.width > 0 && r.left >= 0 && r.right <= width), `${lang} ${width}: controls must be visible`);
      for (let i = 1; i < rects.length; i++) assert.ok(rects[i].left >= rects[i-1].right - 1, `${lang} ${width}: navigation overlaps a neighboring control`);
      await page.close();
    }
  } finally { await browser.close(); }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("all six projects have distinct, loaded covers in both languages without mobile overflow", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      for (const width of [390, 580, 1408]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        await page.goto(`${baseUrl}/${lang}/projects`, { waitUntil: "domcontentloaded" });
        const covers = page.locator(".gallery-card .gallery-cover");
        assert.equal(await covers.count(), 6, `${lang} ${width}px: every project needs a cover`);
        const images = await covers.evaluateAll((elements) => elements.map((image) => ({
          src: image.getAttribute("src"),
          alt: image.getAttribute("alt"),
          loaded: image.complete && image.naturalWidth > 0,
        })));
        assert.equal(new Set(images.map((image) => image.src)).size, 6, "covers must be distinct");
        for (const image of images) {
          assert.equal(image.alt, "", "cover is decorative; card text already names the project");
          assert.ok(image.loaded, `cover failed to load: ${image.src}`);
        }
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert.ok(overflow <= 0, `${lang} ${width}px: page overflows by ${overflow}px`);
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
});

test("experience elaboration stays tied to each employer and keeps real cases separate", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/${lang}`, { waitUntil: "domcontentloaded" });
      const entries = page.locator(".experience-entry");
      assert.equal(await entries.count(), 2);
      assert.equal(await entries.nth(0).locator("ul li").count(), 5);
      assert.equal(await entries.nth(1).locator("ul li").count(), 5);
      assert.equal(await page.locator(".work-example").count(), 3);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

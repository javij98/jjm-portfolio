import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4410";

test("footer exposes a localized contact link on human pages without JavaScript", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      for (const path of ["", "/cv", "/blog"]) {
        const page = await browser.newPage({ javaScriptEnabled: false });
        await page.goto(`${base}/${lang}${path}`);
        const link = page.locator("footer").getByRole("link", { name: lang === "es" ? "Contacto" : "Contact", exact: true });
        assert.equal(await link.getAttribute("href"), `/${lang}#contact`);
        await link.click();
        assert.equal(new URL(page.url()).pathname.replace(/\/$/, ""), `/${lang}`);
        assert.equal(new URL(page.url()).hash, "#contact");
        assert.equal(await page.locator("#contact").count(), 1);
        await page.close();
      }
    }
  } finally { await browser.close(); }
});

test("floating contact follows home and CV context without covering the top control", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const [lang, label] of [["es", "Contacto"], ["en", "Contact"]]) {
      for (const width of [320, 768, 1280]) {
        const page = await browser.newPage({ viewport: { width, height: 700 }, reducedMotion: "reduce" });
        page.setDefaultTimeout(4000);
        await page.goto(`${base}/${lang}`);
        const floating = page.locator("[data-floating-contact]");
        assert.equal(await floating.isVisible(), false);
        await page.locator("#about").scrollIntoViewIfNeeded();
        await page.evaluate(() => window.scrollTo({ top: document.querySelector("#hero").offsetHeight + 100, behavior: "instant" }));
        await floating.waitFor({ state: "visible" });
        assert.equal(await floating.getAttribute("href"), `/${lang}#contact`);
        assert.equal((await floating.textContent()).trim(), label);
        const top = page.locator("[data-back-to-top]");
        await top.waitFor({ state: "visible" });
        const [a, b] = await Promise.all([floating.boundingBox(), top.boundingBox()]);
        assert.ok(a.x >= 0 && a.x + a.width <= width && a.y >= 0 && a.y + a.height <= 700);
        assert.ok(a.width >= 44 && a.height >= 44);
        assert.ok(a.y + a.height <= b.y || b.y + b.height <= a.y || a.x + a.width <= b.x || b.x + b.width <= a.x, "floating controls must not overlap");
        await page.locator("#contact").scrollIntoViewIfNeeded();
        await floating.waitFor({ state: "hidden" });
        await page.goto(`${base}/${lang}/cv`);
        assert.equal(await floating.isVisible(), false);
        await page.evaluate(() => { const el = document.querySelector("[data-cv-actions]"); window.scrollTo({ top: el.getBoundingClientRect().bottom + scrollY + 100, behavior: "instant" }); });
        await floating.waitFor({ state: "visible" });
        await floating.click();
        await page.waitForURL(`**/${lang}#contact`);
        assert.equal(await page.locator("#contact").count(), 1);
        await page.close();
      }
    }
  } finally { await browser.close(); }
});

test("floating contact works on compact CV and stays absent or hidden when inapplicable", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 700 }, reducedMotion: "reduce" });
    await page.goto(`${base}/es/cv/compact`);
    await page.evaluate(() => { const actions = document.querySelector("[data-cv-actions]"); window.scrollTo({ top: actions.getBoundingClientRect().bottom + scrollY + 100, behavior: "instant" }); });
    await page.locator("[data-floating-contact]").waitFor({ state: "visible" });
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.locator("[data-floating-contact]").waitFor({ state: "hidden" });
    await page.goto(`${base}/es/llm`);
    assert.equal(await page.locator("[data-floating-contact]").count(), 0);
    await page.goto(`${base}/es/blog`);
    assert.equal(await page.locator("[data-floating-contact]").count(), 0);
    const noJs = await browser.newPage({ javaScriptEnabled: false });
    await noJs.goto(`${base}/en/cv`);
    await noJs.evaluate(() => window.scrollTo(0, 900));
    assert.equal(await noJs.locator("[data-floating-contact]").isVisible(), false);
  } finally { await browser.close(); }
});

test("footer contact stays clickable beside the back-to-top button", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [320, 768, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 700 }, reducedMotion: "reduce" });
      await page.goto(`${base}/es/cv`);
      const contact = page.locator("footer a[href='/es#contact']");
      await contact.scrollIntoViewIfNeeded();
      const top = page.locator("[data-back-to-top]");
      await top.waitFor({ state: "visible" });
      const [a, b] = await Promise.all([contact.boundingBox(), top.boundingBox()]);
      assert.ok(a.y + a.height <= b.y || b.y + b.height <= a.y || a.x + a.width <= b.x || b.x + b.width <= a.x, `${width}px footer contact overlaps back-to-top`);
      await contact.click();
      await page.waitForURL("**/es#contact");
      await page.close();
    }
  } finally { await browser.close(); }
});

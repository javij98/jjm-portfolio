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

test("work cases expand in place in both languages and remain usable on mobile and with a keyboard", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      for (const width of [360, 768, 1408]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        await page.goto(`${baseUrl}/${lang}`, { waitUntil: "domcontentloaded" });
        const entries = page.locator(".experience-entry");
        assert.equal(await entries.count(), 2);
        assert.equal(await entries.nth(0).locator("ul li").count(), 5);
        assert.equal(await entries.nth(1).locator("ul li").count(), 5);
        const cases = page.locator(".work-example");
        assert.equal(await cases.count(), 9);
        assert.equal(await page.locator(".work-example:visible").count(), 4);
        const toggle = page.locator("[data-work-examples-toggle]");
        assert.match(await toggle.innerText(), lang === "es" ? /Ver más casos/ : /See more cases/);
        const url = page.url();
        const alertCase = cases.filter({ hasText: "HTTP 500" });
        assert.equal(await alertCase.isVisible(), false, "additional cases start collapsed");
        await toggle.click();
        assert.equal(await toggle.getAttribute("aria-expanded"), "true");
        assert.equal(await page.locator(".work-example:visible").count(), 9);
        assert.equal(await alertCase.isVisible(), true, "the Grafana case appears on expansion");
        assert.equal(page.url(), url, "expanding cases must stay on the same page");
        const lastCaseBox = await cases.last().boundingBox();
        const toggleBox = await toggle.boundingBox();
        assert.ok(toggleBox.y >= lastCaseBox.y + lastCaseBox.height, "collapse control stays below every case");

        const saving = cases.filter({ hasText: "application.properties" });
        const rowHeight = (await saving.boundingBox()).height;
        const opener = saving.getByRole("button", { name: lang === "es" ? /Detalles/ : /Details/ });
        await opener.click();
        const dialog = page.locator("[data-work-case-dialog][open]");
        assert.equal(await dialog.count(), 1);
        assert.match(await dialog.innerText(), /13–25 h/);
        assert.match(await dialog.innerText(), /67–125 h/);
        assert.match(await dialog.innerText(), /4–5/);
        assert.match(await dialog.innerText(), /10–15/);
        assert.match(await dialog.innerText(), /100/);
        assert.match(await dialog.innerText(), lang === "es" ? /Estimación/ : /Estimate/);
        assert.equal((await saving.boundingBox()).height, rowHeight, "details must not stretch the row");
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("[data-work-case-dialog][open]").count(), 0);
        assert.equal(await opener.evaluate((element) => element === document.activeElement), true);

        const capgemini = cases.filter({ hasText: "Capgemini" });
        await capgemini.locator("[data-work-case-open]").click();
        assert.match(await dialog.innerText(), />80\s?%/);
        await dialog.locator("[data-detail-close]").click();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert.ok(overflow <= 0, `${lang} ${width}px: expanded cases must not overflow, got ${overflow}px`);
        const collapse = page.getByRole("button", { name: lang === "es" ? "Ver menos" : "See less" });
        await collapse.focus();
        await page.keyboard.press("Space");
        assert.equal(await page.locator(".work-example:visible").count(), 4);
        assert.equal(await alertCase.isVisible(), false);
        await toggle.press("Enter");
        assert.equal(await alertCase.isVisible(), true, "keyboard users can expand again");
        assert.equal(await toggle.evaluate((element) => element === document.activeElement), true, "keyboard focus stays on the control");
        await page.getByRole("button", { name: lang === "es" ? "Ver menos" : "See less" }).click();
        await page.mouse.move(0, 0);
        assert.equal(await toggle.evaluate((element) => element === document.activeElement), false, "pointer activation must not retain focus");
        await page.waitForFunction(() => {
          const control = document.querySelector("[data-work-examples-toggle]");
          return control && getComputedStyle(control).boxShadow === "none";
        });
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
});

test("all work cases and their complete content remain available without JavaScript", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator(".work-example:visible").count(), 9);
    assert.equal(await page.locator(".work-example dl:visible").count(), 9);
    assert.equal(await page.locator("[data-work-case-open]:visible").count(), 0);
    assert.equal(await page.locator("[data-work-examples-toggle]:visible").count(), 0);
  } finally {
    await browser.close();
  }
});

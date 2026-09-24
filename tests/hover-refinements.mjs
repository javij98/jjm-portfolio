import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("command palette overlays the viewport and pointer close does not retain trigger focus", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 412, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    const trigger = page.getByRole("button", { name: "Comandos" });
    await page.waitForFunction(() => !document.querySelector("astro-island[component-url*=CommandMenu]")?.hasAttribute("ssr"));
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Navegación rápida" });
    await dialog.waitFor();
    const rect = await dialog.evaluate((element) => {
      const overlay = element.parentElement.getBoundingClientRect();
      return { left: overlay.left, top: overlay.top, right: overlay.right, bottom: overlay.bottom, width: innerWidth, height: innerHeight };
    });
    assert.ok(rect.left <= 1 && rect.top <= 1 && rect.right >= rect.width - 1 && rect.bottom >= rect.height - 1, `overlay must cover viewport: ${JSON.stringify(rect)}`);
    await dialog.getByText("Proyectos", { exact: true }).hover();
    assert.equal(await page.locator("#hero").evaluate((element) => element.matches(":hover")), false, "palette hover must not reach the hero behind it");
    await page.mouse.click(8, 880);
    await dialog.waitFor({ state: "hidden" });
    assert.equal(await trigger.evaluate((element) => document.activeElement === element), false, "pointer closing should not leave trigger focused");
  } finally {
    await browser.close();
  }
});

test("navigation uses a stable underline without a boxed hover", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [597, 1923]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
      if (width < 1000) await page.locator("[data-mobile-nav] summary").click();
      const link = page.locator(width < 1000 ? "[data-mobile-nav] a" : "header nav > div a[href='#skills']").filter({ hasText: "Competencias" }).first();
      await link.hover();
      const styles = await link.evaluate((element) => ({ shadow: getComputedStyle(element).boxShadow, transform: getComputedStyle(element).transform, line: getComputedStyle(element, "::after").transform, hovered: element.matches(":hover") }));
      assert.equal(styles.shadow, "none", `${width}px: no hover box`);
      assert.equal(styles.transform, "none", `${width}px: no hover movement`);
      assert.notEqual(styles.line, "none", `${width}px: underline exists`);
      assert.equal(styles.hovered, true, `${width}px: hover remains stable`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test("blog card accent stops short of rounded corners", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 412, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    const line = await page.locator(".blog-card").first().evaluate((element) => {
      const style = getComputedStyle(element, "::after");
      return { left: parseFloat(style.left), right: parseFloat(style.right), bottom: parseFloat(style.bottom) };
    });
    assert.ok(line.left >= 12 && line.right >= 12 && line.bottom >= 3, JSON.stringify(line));
  } finally {
    await browser.close();
  }
});

test("non-clickable cards have a quiet ambient hover", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1415, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    for (const selector of [".experience-entry", ".work-example", ".skill-entry", ".gallery-card"]) {
      const item = page.locator(selector).first();
      await item.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      const before = await item.evaluate((element) => getComputedStyle(element).backgroundColor);
      await item.hover();
      await page.waitForFunction(([selector, previous]) => {
        const element = document.querySelector(selector);
        return element && getComputedStyle(element).backgroundColor !== previous;
      }, [selector, before]);
      const after = await item.evaluate((element) => getComputedStyle(element).backgroundColor);
      assert.notEqual(after, before, `${selector} should respond subtly`);
      assert.equal(await item.evaluate((element) => getComputedStyle(element).boxShadow), "none", `${selector} should not glow like a link`);
    }
  } finally {
    await browser.close();
  }
});

test("mobile hero brings terminal into the initial view and starts typing only when visible", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 412, height: 900 } });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    const top = await page.locator("#hero [data-terminal]").evaluate((element) => element.getBoundingClientRect().top);
    assert.ok(top < 900, `terminal should begin in initial viewport: ${top}`);
    await page.close();
    const shortPage = await browser.newPage({ viewport: { width: 412, height: 360 } });
    await shortPage.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    await shortPage.waitForTimeout(600);
    const typed = shortPage.locator("#hero [data-typed-command]");
    assert.equal(await typed.textContent(), "", "typing waits while terminal is below viewport");
    await shortPage.locator("#hero [data-terminal]").scrollIntoViewIfNeeded();
    await shortPage.waitForTimeout(350);
    assert.ok((await typed.textContent()).length > 0, "typing starts on intersection");
  } finally {
    await browser.close();
  }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("header labels stay on one line at intermediate desktop widths", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [1280, 1366, 1536, 1923]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
      const result = await page.evaluate(() => {
        const nav = document.querySelector("header nav");
        const links = [...document.querySelectorAll("header nav a.signal-hover")].filter((link) => {
          return getComputedStyle(link).display !== "none" && link.getBoundingClientRect().width > 0;
        });
        const commandHint = document.querySelector("header kbd");
        const all = [...links, commandHint].filter(Boolean);
        const wrapped = all.filter((element) => {
          if (getComputedStyle(element).display === "none") return false;
          const range = document.createRange();
          range.selectNodeContents(element);
          return range.getClientRects().length > 1;
        }).map((element) => element.textContent?.trim());
        return { wrapped, overflow: nav.scrollWidth > nav.clientWidth };
      });
      assert.deepEqual(result.wrapped, [], `${width}px: wrapped header labels`);
      assert.equal(result.overflow, false, `${width}px: header overflows`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test("informational articles do not imply they can be clicked", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1415, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    for (const selector of [".experience-entry", ".work-example", ".skill-entry", ".gallery-card"]) {
      const target = page.locator(selector).first();
      await target.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      const before = await target.evaluate((element) => ({
        shadow: getComputedStyle(element).boxShadow,
        accent: getComputedStyle(element, "::after").transform,
      }));
      await target.hover();
      const after = await target.evaluate((element) => ({
        shadow: getComputedStyle(element).boxShadow,
        accent: getComputedStyle(element, "::after").transform,
      }));
      assert.deepEqual(after, before, `${selector} should not have a clickable-card hover`);
    }
    await page.close();
  } finally {
    await browser.close();
  }
});

test("clickable blog cards have comfortable rounded hit areas", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [412, 1415]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
      const card = page.locator(".blog-card").first();
      const values = await card.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          padding: Number.parseFloat(style.paddingLeft),
          radius: Number.parseFloat(style.borderTopLeftRadius),
          href: element.getAttribute("href"),
        };
      });
      assert.ok(values.padding >= 24, `${width}px: blog card needs at least 24px side padding`);
      assert.ok(values.radius >= 12, `${width}px: blog card needs rounded corners`);
      assert.ok(values.href?.startsWith("/es/blog/"), "blog card must be a real link");
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test("hero topology responds subtly to hover without becoming a link", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1415, height: 900 } });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    const topology = page.locator("#hero .signal-topology--hero");
    const before = await topology.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity));
    await page.locator("#hero h1").hover();
    await page.waitForFunction((initial) => {
      const element = document.querySelector("#hero .signal-topology--hero");
      return element && Number.parseFloat(getComputedStyle(element).opacity) > initial + 0.1;
    }, before, { timeout: 5000 });
    const after = await topology.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity));
    assert.ok(after > before + 0.1, `hero background should brighten on hover (${before} → ${after})`);
    assert.equal(await page.locator("#hero").evaluate((element) => getComputedStyle(element).cursor), "auto");
  } finally {
    await browser.close();
  }
});

test("every strong-hover action has padding and rounded corners", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const path of ["/es", "/es/blog/del-desarrollo-a-devops"]) {
      const page = await browser.newPage({ viewport: { width: 1415, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });
      const failures = await page.locator("a.signal-hover, button.signal-hover").evaluateAll((elements) =>
        elements.flatMap((element) => {
          const style = getComputedStyle(element);
          const padding = Number.parseFloat(style.paddingLeft);
          const radius = Number.parseFloat(style.borderTopLeftRadius);
          return padding >= 8 && radius >= 6 ? [] : [`${element.textContent?.trim().slice(0, 30)}: padding=${padding}, radius=${radius}`];
        }),
      );
      assert.deepEqual(failures, [], `${path}: strong-hover actions need a complete hit area`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

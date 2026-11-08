import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4432";

test("expanded search never covers other header controls on tablet or desktop", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      for (const width of [560, 768, 900, 1024, 1100, 1279, 1280, 1536, 1600, 1920]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        await page.goto(`${baseUrl}/${lang}`, { waitUntil: "networkidle" });
        const result = await page.locator("header nav").evaluate((nav) => {
          const expansion = nav.querySelector("[data-search-expansion]");
          const button = expansion.closest("button");
          const rect = expansion.getBoundingClientRect();
          const buttonRect = button.getBoundingClientRect();
          const targets = [...nav.querySelectorAll(":scope > a, :scope > div:nth-child(2) a, [data-mode-picker], [data-language-picker], [data-mobile-nav] summary")];
          const overlaps = targets.filter((element) => {
            const r = element.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && r.left < rect.right - 1 && r.right > rect.left + 1 && r.top < rect.bottom - 1 && r.bottom > rect.top + 1;
          }).map((element) => element.textContent.trim() || element.getAttribute("aria-label"));
          const text = expansion.lastElementChild.getBoundingClientRect();
          return { overlaps, left: rect.left, right: rect.right, textLeft: text.left, textRight: text.right, buttonRight: buttonRect.right, overflow: nav.scrollWidth > nav.clientWidth };
        });
        assert.deepEqual(result.overlaps, [], `${lang} ${width}px: expansion covers ${result.overlaps.join(", ")}`);
        assert.equal(result.overflow, false, `${lang} ${width}px: header overflow`);
        assert.ok(result.left >= 0 && result.right <= width && result.textLeft >= result.left && result.textRight <= result.right, `${lang} ${width}px: expansion or text clipped`);
        assert.ok(Math.abs(result.right - result.buttonRight) <= 2, `${lang} ${width}px: expansion must stay anchored to the button`);
        await page.close();
      }
    }
  } finally { await browser.close(); }
});

test("search stays next to the reading mode after the hint disappears", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      for (const width of [320, 375, 559, 560, 639, 640, 767, 768, 900, 1023, 1024, 1100, 1279, 1280, 1536, 1920]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        await page.goto(`${baseUrl}/${lang}`, { waitUntil: "networkidle" });
        await page.locator('[data-view-mode="human"]').focus();
        await page.locator("[data-search-expansion]").waitFor({ state: "detached" });
        const geometry = await page.locator("header nav").evaluate((nav) => {
          const search = nav.querySelector(".search-trigger-slot button").getBoundingClientRect();
          const mode = nav.querySelector("[data-mode-picker]").getBoundingClientRect();
          return { gap: mode.left - search.right, overflow: nav.scrollWidth > nav.clientWidth };
        });
        assert.ok(geometry.gap >= 0 && geometry.gap <= 12, `${lang} ${width}px: search-to-mode gap is ${geometry.gap}px`);
        assert.equal(geometry.overflow, false, `${lang} ${width}px: header overflow`);
        await page.getByRole("button", { name: lang === "es" ? "Comandos" : "Commands" }).click();
        await page.getByRole("dialog", { name: lang === "es" ? "Navegación rápida" : "Quick navigation" }).waitFor();
        await page.close();
      }
    }
  } finally { await browser.close(); }
});

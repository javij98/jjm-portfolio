import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("project dialogs use a themed scrollbar and remain scrollable on mobile and desktop", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [390, 1408]) {
      const page = await browser.newPage({ viewport: { width, height: 720 } });
      await page.goto(`${baseUrl}/es/projects`, { waitUntil: "domcontentloaded" });
      await page.locator(".gallery-card [data-project-open]").first().click();
      const dialog = page.locator("[data-project-dialog][open]");
      const appearance = await dialog.evaluate((element) => {
        const styles = getComputedStyle(element);
        return {
          width: styles.scrollbarWidth,
          color: styles.scrollbarColor,
          scrollHeight: element.scrollHeight,
          clientHeight: element.clientHeight,
        };
      });
      assert.equal(appearance.width, "thin", `${width}px: use a compact scrollbar`);
      assert.notEqual(appearance.color, "auto", `${width}px: use colors that match the dialog`);
      assert.ok(appearance.scrollHeight > appearance.clientHeight, `${width}px: dialog should be scrollable`);
      await dialog.evaluate((element) => { element.scrollTop = element.scrollHeight; });
      assert.ok(await dialog.evaluate((element) => element.scrollTop) > 0, `${width}px: scrollbar must still work`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

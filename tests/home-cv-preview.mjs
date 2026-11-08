import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4401";

test("home introduces CV and projects with direct localized links", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage({ javaScriptEnabled: false });
      await page.goto(`${base}/${lang}`);
      const preview = page.locator("#cv-projects");
      assert.equal(await preview.count(), 1);
      assert.ok((await preview.locator("p").allTextContents()).join(" ").trim().length > 30);
      assert.equal(await preview.locator(`a[href='/${lang}/cv']`).count(), 1);
      const projectsLink = preview.getByRole("link", { name: lang === "es" ? "Ver proyectos" : "View projects", exact: true });
      assert.equal(await projectsLink.getAttribute("href"), `/${lang}/cv#projects`);
      const description = (await preview.locator("p").allTextContents()).map((text) => text.trim()).find((text) => text.length > 30);
      const markdown = await (await page.request.get(`${base}/${lang}/index.md`)).text();
      assert.ok(markdown.includes(description), `${lang}: LLM export must include the home introduction`);
      await projectsLink.click();
      assert.equal(new URL(page.url()).pathname.replace(/\/$/, ""), `/${lang}/cv`);
      assert.equal(new URL(page.url()).hash, "#projects");
      assert.ok(await page.locator("#projects").isVisible());
      await page.close();
    }
  } finally { await browser.close(); }
});

test("CV project shortcut is labeled Projects and points to the projects section", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const [lang, label] of [["es", "Proyectos"], ["en", "Projects"]]) {
      const page = await browser.newPage({ javaScriptEnabled: false });
      page.setDefaultTimeout(3000);
      await page.goto(`${base}/${lang}/cv`);
      const link = page.locator("[data-cv-summary]").getByRole("link", { name: label, exact: true });
      assert.equal(await link.getAttribute("href"), `/${lang}/cv#projects`);
      await page.close();
    }
  } finally { await browser.close(); }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
const base = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4401";

test("home offers a truthful, responsive preview of experience and projects", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) for (const width of [320, 375, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: false });
      await page.goto(`${base}/${lang}/cv`, { waitUntil: "networkidle" });
      const cvExperience = await page.locator("#experience .experience-entry").allTextContents();
      const cvProjects = await page.locator("#projects .gallery-card").allTextContents();
      await page.goto(`${base}/${lang}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const experience = page.locator("[data-home-experience-item]");
      assert.equal(await experience.count(), 2);
      for (let i = 0; i < 2; i++) {
        const item = experience.nth(i);
        const company = (await item.locator("[data-home-experience-company]").innerText()).trim();
        const role = (await item.locator("[data-home-experience-role]").innerText()).trim();
        assert.ok(cvExperience[i].includes(company) && cvExperience[i].includes(role), `${lang}: preview matches CV experience`);
        assert.ok(await item.isVisible());
      }
      const summary = (await experience.first().locator("[data-home-experience-summary]").innerText()).trim();
      assert.ok(summary.length > 40 && cvExperience[0].includes(summary), "preview shows a real experience summary");
      const secondSummary = (await experience.nth(1).locator("[data-home-experience-summary]").innerText()).trim();
      assert.ok(secondSummary.length > 30 && cvExperience[1].includes(secondSummary), "second experience previews the transition toward DevOps");
      const projects = page.locator("[data-home-project-card]");
      assert.equal(await projects.count(), 2);
      for (let i = 0; i < 2; i++) {
        const description = (await projects.nth(i).locator("[data-home-project-description]").innerText()).trim();
        assert.ok(description.length > 40 && cvProjects[i].includes(description), `${lang}: project preview contains the real description`);
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${lang} ${width}: no horizontal overflow`);
      const discover = page.locator("[data-home-experience-more]");
      assert.equal(await discover.getAttribute("href"), `/${lang}/cv#experience`);
      if (width === 320) {
        const markdown = await (await page.request.get(`${base}/${lang}/index.md`)).text();
        assert.ok(markdown.includes((await discover.innerText()).replace("↗", "").trim()), `${lang}: Markdown includes the experience link`);
        assert.ok(markdown.includes(`/${lang}/cv#experience`));
      }
      await discover.click();
      assert.equal(new URL(page.url()).hash, "#experience");
      assert.ok(await page.locator("#experience").isVisible());
      await page.close();
    }
  } finally { await browser.close(); }
});

test("home introduces CV and projects with direct localized links", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage({ javaScriptEnabled: false });
      await page.goto(`${base}/${lang}`);
      await page.evaluate(() => document.fonts.ready);
      const preview = page.locator("#cv-projects");
      assert.equal(await preview.count(), 1);
      assert.ok((await preview.locator("p").allTextContents()).join(" ").trim().length > 30);
      assert.equal(await preview.locator(`a[href='/${lang}/cv']`).count(), 1);
      const projectsLink = preview.getByRole("link", { name: lang === "es" ? "Ver proyectos" : "View projects", exact: true });
      assert.equal(await projectsLink.getAttribute("href"), `/${lang}/cv#projects`);
      const description = (await preview.locator("p").allTextContents()).map((text) => text.trim()).find((text) => text.length > 30);
      const markdown = await (await page.request.get(`${base}/${lang}/index.md`)).text();
      assert.ok(markdown.includes(description), `${lang}: LLM export must include the home introduction`);
      await projectsLink.scrollIntoViewIfNeeded();
      await page.waitForFunction((link) => {
        const bounds = link.getBoundingClientRect();
        return bounds.top >= 0 && bounds.bottom <= innerHeight;
      }, await projectsLink.elementHandle());
      await projectsLink.click();
      assert.equal(new URL(page.url()).pathname.replace(/\/$/, ""), `/${lang}/cv`);
      assert.equal(new URL(page.url()).hash, "#projects");
      assert.ok(await page.locator("#projects").isVisible());
      await page.close();
    }
  } finally { await browser.close(); }
});

test("experience and project previews are reachable and actionable by keyboard", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const lang of ["es", "en"]) for (const width of [375, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${base}/${lang}`, { waitUntil: "networkidle" });
      for (const [selector, fragment] of [["[data-home-experience-more]", "#experience"], ["[data-home-project-card]", "#projects"]]) {
        const link = page.locator(selector).first();
        await link.scrollIntoViewIfNeeded();
        await link.focus();
        await page.keyboard.press("Shift+Tab");
        await page.keyboard.press("Tab");
        assert.equal(await link.evaluate((element) => document.activeElement === element), true);
        await page.keyboard.press("Enter");
        await page.waitForURL(`**/${lang}/cv${fragment}`);
        assert.ok(await page.locator(fragment).isVisible());
        await page.goto(`${base}/${lang}`, { waitUntil: "networkidle" });
      }
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

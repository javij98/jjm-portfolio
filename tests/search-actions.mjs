import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4432";
const launch = () => chromium.launch({ headless: true, args: ["--no-proxy-server"] });

test("CV is a direct entry in the default search menu", async () => {
  const browser = await launch();
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    page.setDefaultTimeout(5000);
    await page.goto(`${baseUrl}/es`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Comandos" }).click();
    await page.getByRole("option", { name: "CV", exact: true }).click();
    await page.waitForURL("**/es/cv");
  } finally { await browser.close(); }
});

test("natural language offers email CV actions for both PDFs without sending", async () => {
  const browser = await launch();
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      page.setDefaultTimeout(5000);
      await page.goto(`${baseUrl}/${lang}/cv`, { waitUntil: "networkidle" });
      const expected = {};
      for (const pdfLang of ["es", "en"]) expected[pdfLang] = await page.locator(`[data-cv-language="${pdfLang}"] a[href^="mailto:"]`).getAttribute("href");
      await page.getByRole("button", { name: lang === "es" ? "Comandos" : "Commands" }).click();
      const search = page.getByRole("combobox");
      await search.fill(lang === "es" ? "quiero enviarme el curriculum por correo" : "email the resume to myself");
      for (const pdfLang of ["es", "en"]) {
        const action = page.locator(`[data-search-action="email-cv-${pdfLang}"]`);
        await action.waitFor();
        assert.equal(await action.getAttribute("data-action-href"), expected[pdfLang]);
        const mail = new URL(expected[pdfLang]);
        assert.equal(mail.pathname, "");
        assert.ok(mail.searchParams.get("body").includes(`/${pdfLang}/cv.pdf`));
      }
      await search.fill(lang === "es" ? "mandame el cv en ingles por email" : "send me the spanish cv by email");
      await page.locator(`[data-search-action="email-cv-${lang === "es" ? "en" : "es"}"]`).waitFor();
      assert.equal(await page.locator(`[data-search-action="email-cv-${lang}"]`).count(), 0);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("selecting a CV action opens the correct draft by mouse and keyboard", async () => {
  const browser = await launch();
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    page.setDefaultTimeout(5000);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Page.enable");
    await page.goto(`${baseUrl}/es`, { waitUntil: "networkidle" });
    for (const method of ["mouse", "keyboard"]) {
      await page.getByRole("button", { name: "Comandos" }).click();
      const search = page.getByRole("combobox");
      await search.fill("enviame el cv en ingles por correo");
      const action = page.locator('[data-search-action="email-cv-en"]');
      await action.waitFor();
      const expected = await action.getAttribute("data-action-href");
      const requested = new Promise((resolve) => cdp.once("Page.frameRequestedNavigation", resolve));
      if (method === "mouse") await action.click();
      else await search.press("Enter");
      const event = await Promise.race([requested, new Promise((_, reject) => setTimeout(() => reject(new Error(`${method} did not open mailto`)), 5000))]);
      assert.equal(event.url, expected);
      assert.equal(await page.getByRole("dialog", { name: "Navegación rápida" }).count(), 0);
    }
  } finally { await browser.close(); }
});

test("controlled Spanish-English terms find content and show a relevant excerpt", async () => {
  const browser = await launch();
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    page.setDefaultTimeout(5000);
    await page.goto(`${baseUrl}/es`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Comandos" }).click();
    await page.getByRole("combobox").fill("deployment");
    const result = page.getByRole("option").filter({ hasText: "Entregas más rápidas en Capgemini" });
    await result.waitFor();
    assert.match(await result.textContent(), /despliegue/i);
    await page.close();
    const english = await browser.newPage({ reducedMotion: "reduce" });
    english.setDefaultTimeout(5000);
    await english.goto(`${baseUrl}/en`, { waitUntil: "networkidle" });
    await english.getByRole("button", { name: "Commands" }).click();
    await english.getByRole("combobox").fill("contenedores");
    await english.getByRole("option").filter({ hasText: /containers/i }).first().waitFor();
  } finally { await browser.close(); }
});

test("search control expands inline again after reload and then contracts", async () => {
  const browser = await launch();
  try {
    for (const width of [320, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 740 }, reducedMotion: "no-preference" });
      page.setDefaultTimeout(5000);
      await page.goto(`${baseUrl}/es`, { waitUntil: "networkidle" });
      for (let visit = 0; visit < 2; visit++) {
        if (visit) await page.reload({ waitUntil: "networkidle" });
        const button = page.getByRole("button", { name: "Comandos" });
        const expansion = button.locator("[data-search-expansion]");
        await expansion.waitFor({ state: "visible" });
        await page.waitForTimeout(900);
        const box = await expansion.boundingBox();
        const trigger = await button.boundingBox();
        assert.ok(box.width > trigger.width + 20, "control visibly expands");
        assert.ok(Math.abs(box.y - trigger.y) <= 2, "message is inline with icon, not below it");
        assert.ok(box.x >= 0 && box.x + box.width <= width, "expanded control fits viewport");
      }
      await page.locator("[data-search-expansion]").waitFor({ state: "detached", timeout: 8000 });
      await page.close();
    }
  } finally { await browser.close(); }
});

test("expanded search respects reduced motion on each page load", async () => {
  const browser = await launch();
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 740 }, reducedMotion: "reduce" });
    for (let visit = 0; visit < 2; visit++) {
      if (visit) await page.reload({ waitUntil: "networkidle" });
      else await page.goto(`${baseUrl}/es`, { waitUntil: "networkidle" });
      const expansion = page.locator("[data-search-expansion]");
      await expansion.waitFor({ state: "visible" });
      assert.equal(await expansion.evaluate((el) => getComputedStyle(el).animationName), "none");
    }
  } finally { await browser.close(); }
});

test("clicking the expanded search label opens the command menu", async () => {
  const browser = await launch();
  try {
    for (const width of [320, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 740 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/es`, { waitUntil: "networkidle" });
      await page.locator("[data-search-expansion]").getByText("Busca en la web").click();
      await page.getByRole("dialog", { name: "Navegación rápida" }).waitFor();
      await page.close();
    }
  } finally { await browser.close(); }
});

test("focusing another header control dismisses the expansion", async () => {
  const browser = await launch();
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 740 }, reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/es`, { waitUntil: "networkidle" });
    await page.locator("[data-search-expansion]").waitFor();
    await page.locator('[data-view-mode="llm"]').focus();
    await page.locator("[data-search-expansion]").waitFor({ state: "detached", timeout: 1500 });
  } finally { await browser.close(); }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("search finds content across pages, tolerates typos, and opens the source", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(5000);
    await page.goto(`${baseUrl}/es`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Comandos" }).click();
    const search = page.getByRole("dialog", { name: "Navegación rápida" }).getByRole("combobox");
    await search.fill("n8n");
    await page.getByRole("option").filter({ hasText: "CV" }).first().waitFor();
    await search.fill("Kubernets");
    await page.getByRole("option").filter({ hasText: /Kubernetes/i }).first().waitFor();
    await search.fill("proxy inverso");
    const article = page.getByRole("option").filter({ hasText: "Una plataforma de conocimiento autoalojada" });
    await article.waitFor();
    await article.click();
    await page.waitForURL("**/es/blog/plataforma-de-conocimiento-autoalojada");
    await page.getByRole("heading", { name: "Una plataforma de conocimiento autoalojada" }).waitFor();
  } finally {
    await browser.close();
  }
});

test("project detail results navigate to and open the matching dialog", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(5000);
    await page.goto(`${baseUrl}/en/cv`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Commands" }).click();
    await page.getByRole("combobox").fill("Print Studio");
    await page.getByRole("option").filter({ hasText: "Print Studio" }).first().click();
    await page.waitForURL("**/en/projects#project-dialog-2");
    await page.locator("#project-dialog-2[open]").waitFor();
    assert.match(await page.locator("#project-dialog-2 h2").textContent(), /Print Studio/);
  } finally {
    await browser.close();
  }
});

test("search works on narrow mobile screens and understands common technology aliases", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 740 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(5000);
    await page.goto(`${baseUrl}/es`, { waitUntil: "networkidle" });
    const nav = page.locator("header nav");
    assert.equal(await nav.evaluate((element) => element.scrollWidth > element.clientWidth), false);
    await page.getByRole("button", { name: "Comandos" }).click();
    await page.getByRole("combobox").fill("k8s");
    await page.getByRole("option").filter({ hasText: /Kubernetes/i }).first().waitFor();
  } finally {
    await browser.close();
  }
});

test("search reports incomplete results when a page is unavailable", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(5000);
    await page.goto(`${baseUrl}/es`, { waitUntil: "networkidle" });
    await page.route("**/es/cv", (route) => route.abort());
    await page.getByRole("button", { name: "Comandos" }).click();
    await page.getByRole("status").filter({ hasText: "resultados pueden estar incompletos" }).waitFor();
    await page.getByRole("combobox").fill("MoneyFlow");
    await page.getByRole("option").filter({ hasText: "MoneyFlow" }).first().waitFor();
  } finally {
    await browser.close();
  }
});

test("a collapsed work case opens and can be reopened from search", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(5000);
    await page.goto(`${baseUrl}/es`, { waitUntil: "networkidle" });
    for (let attempt = 0; attempt < 2; attempt++) {
      await page.getByRole("button", { name: "Comandos" }).click();
      await page.getByRole("combobox").fill("Errores HTTP 500 con aviso directo a Slack");
      await page.getByRole("option").filter({ hasText: "Errores HTTP 500 con aviso directo a Slack" }).first().click();
      await page.locator("#work-case-dialog-4[open]").waitFor();
      await page.locator("#work-case-dialog-4 [data-detail-close]").click();
    }
  } finally {
    await browser.close();
  }
});

test("fuzzy search preserves word boundaries between HTML elements", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(5000);
    await page.goto(`${baseUrl}/es`, { waitUntil: "networkidle" });
    await page.route("**/es/cv", (route) => route.fulfill({ contentType: "text/html", body: "<main><article><p>UNIQUEBREAK</p><p>BOUNDARYTOKEN</p></article></main>" }));
    await page.getByRole("button", { name: "Comandos" }).click();
    await page.getByRole("combobox").fill("BOUNDARYTOKN");
    await page.getByRole("option").filter({ hasText: "CV" }).waitFor();
  } finally {
    await browser.close();
  }
});

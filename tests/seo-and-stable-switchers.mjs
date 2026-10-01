import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";
const origin = "https://javierjimenez.dev";

async function positions(page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    return ["[data-mode-picker]", "[data-language-picker]"].map((selector) => {
      const { x, y, width, height } = document.querySelector(selector).getBoundingClientRect();
      return { x, y, width, height };
    });
  });
}

test("mode and language selectors keep their coordinates across routes, modes and languages", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [320, 375, 768, 1280, 1536]) {
      const page = await browser.newPage({ viewport: { width, height: 1800 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/es`);
      const reference = await positions(page);
      for (const lang of ["es", "en"]) {
        for (const suffix of ["/llm", "/projects", "/blog", "/blog/del-desarrollo-a-devops", ""]) {
          await page.goto(`${baseUrl}/${lang}${suffix}`);
          const current = await positions(page);
          for (let index = 0; index < reference.length; index++) {
            for (const dimension of ["x", "y", "width", "height"]) {
              assert.ok(Math.abs(current[index][dimension] - reference[index][dimension]) < 0.5,
                `${width}px /${lang}${suffix}: selector ${index} ${dimension} changed (${reference[index][dimension]} → ${current[index][dimension]})`);
            }
          }
          assert.equal(await page.locator('[data-view-mode="human"]').isVisible(), true);
          assert.equal(await page.locator('[data-view-mode="llm"]').isVisible(), true);
        }
      }
      // A long document stays at the same header coordinates after scrolling.
      await page.goto(`${baseUrl}/es/llm`);
      await page.evaluate(() => window.scrollTo(0, 1200));
      assert.deepEqual(await positions(page), reference);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test("metadata, robots, sitemap and Markdown all identify the official domain", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false });
    for (const lang of ["es", "en"]) {
      for (const suffix of ["", "/projects", "/blog", "/blog/del-desarrollo-a-devops", "/llm"]) {
        await page.goto(`${baseUrl}/${lang}${suffix}`);
        const canonical = await page.locator('head link[rel="canonical"]').getAttribute("href");
        assert.equal(canonical, `${origin}/${lang}${suffix === "/llm" ? "" : suffix}`);
        assert.equal(await page.locator("main h1").count(), 1, `One main heading on /${lang}${suffix}`);
        for (const alternate of ["es", "en"]) {
          assert.equal(await page.locator(`head link[hreflang="${alternate}"]`).getAttribute("href"), `${origin}/${alternate}${suffix === "/llm" ? "" : suffix}`);
        }
        assert.equal(await page.locator('meta[property="og:url"]').getAttribute("content"), canonical);
        for (const href of await page.locator("head link[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href")))) {
          if (href.startsWith("https://")) assert.equal(new URL(href).origin, origin, href);
        }
      }
      for (const path of [`/${lang}/index.md`, `/${lang}/projects.md`, `/${lang}/blog/index.md`]) {
        const response = await page.request.get(`${baseUrl}${path}`);
        assert.equal(response.status(), 200, path);
        const markdown = await response.text();
        assert.doesNotMatch(markdown, /\.vercel\.app/);
        assert.ok(markdown.includes(origin), path);
      }
    }
    const robots = await page.request.get(`${baseUrl}/robots.txt`);
    assert.equal(await robots.text(), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
    const sitemap = await page.request.get(`${baseUrl}/sitemap.xml`);
    const paths = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
    assert.equal(paths.length, 10);
    for (const url of paths) {
      assert.equal(url.origin, origin);
      await page.goto(`${baseUrl}${url.pathname}`);
      assert.equal(await page.locator('head link[rel="canonical"]').getAttribute("href"), url.href);
    }
    const llms = await page.request.get(`${baseUrl}/llms.txt`);
    assert.ok((await llms.text()).includes(`${origin}/en/index.md`));
    assert.doesNotMatch(await llms.text(), /\.vercel\.app/);
  } finally {
    await browser.close();
  }
});

test("opening a details dialog keeps the header selectors in place", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1408, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/es/projects`);
    await page.locator(".gallery-card [data-project-open]").first().scrollIntoViewIfNeeded();
    const before = await positions(page);
    await page.locator(".gallery-card [data-project-open]").first().click();
    assert.deepEqual(await positions(page), before);
  } finally {
    await browser.close();
  }
});

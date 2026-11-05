import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chromium } from 'playwright';

const baseUrl = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';

test('CV menu uses navigation underlines without decorative icons or wrapped language labels', async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-proxy-server'] });
  try {
    for (const motion of ['no-preference', 'reduce']) {
      const page = await browser.newPage({ reducedMotion: motion });
      await page.goto(`${baseUrl}/es/cv`);
      const menu = page.locator('[data-cv-download]');
      await menu.locator(':scope > summary').click();
      const language = menu.locator('[data-cv-language="es"]');
      const summary = language.locator(':scope > summary');
      assert.equal(await summary.evaluate((el) => getComputedStyle(el, '::before').content), 'none');
      assert.equal(await summary.evaluate((el) => getComputedStyle(el).whiteSpace), 'nowrap');
      assert.equal(await summary.evaluate((el) => getComputedStyle(el, '::after').content), '""');
      await summary.hover();
      await page.waitForTimeout(300);
      assert.notEqual(await summary.evaluate((el) => getComputedStyle(el, '::after').transform), 'matrix(0, 0, 0, 1, 0, 0)');
      await language.locator(':scope > summary').click();
      const link = language.locator('a[download]');
      assert.equal(await link.evaluate((el) => getComputedStyle(el, '::before').content), 'none');
      assert.equal(await link.evaluate((el) => getComputedStyle(el, '::after').content), '""');
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

for (const pageLang of ['es', 'en']) {
  for (const width of [412, 1415]) {
    test(`CV actions on ${pageLang} at ${width}px`, async () => {
      const browser = await chromium.launch({ headless: true, args: ['--no-proxy-server'] });
      try {
        const page = await browser.newPage({ viewport: { width, height: 900 }, acceptDownloads: true });
        await page.goto(`${baseUrl}/${pageLang}/cv`);
        const menu = page.locator('[data-cv-download]');
        await menu.locator(':scope > summary').click();
        for (const pdfLang of ['es', 'en']) {
          const language = menu.locator(`[data-cv-language="${pdfLang}"]`);
          await language.locator(':scope > summary').click();
          const downloadLink = language.locator('a[download]');
          const emailLink = language.locator('a[href^="mailto:"]');
          assert.equal(await downloadLink.getAttribute('href'), `/${pdfLang}/cv.pdf`);
          const mail = new URL(await emailLink.getAttribute('href'));
          assert.equal(mail.pathname, '', 'recipient must not be Javier');
          assert.ok(mail.searchParams.get('subject'));
          assert.ok(mail.searchParams.get('body').includes('\n\nhttps://'), 'body separates text and link with line breaks');
          assert.ok(mail.searchParams.get('body').includes(`https://javierjimenez.dev/${pdfLang}/cv.pdf`));
          const box = await emailLink.boundingBox();
          assert.ok(box.x >= 0 && box.x + box.width <= width, 'menu fits viewport');
          const downloadPromise = page.waitForEvent('download');
          await downloadLink.click();
          const download = await downloadPromise;
          assert.match(download.suggestedFilename(), /\.pdf$/);
          await menu.locator(':scope > summary').click();
        }
        await page.keyboard.press('Escape');
        assert.equal(await menu.getAttribute('open'), null);
      } finally {
        await browser.close();
      }
    });
  }
}

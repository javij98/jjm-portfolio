import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";
const pdfs = {
  es: "public/files/JavierJimenezMolina_cv_es.pdf",
  en: "public/files/JavierJimenezMolinaCV_en.pdf",
};

test("each language has a direct PDF URL and both CV pages link to them", async () => {
  for (const [lang, source] of Object.entries(pdfs)) {
    const response = await fetch(`${baseUrl}/${lang}/cv.pdf`);
    assert.equal(response.status, 200, `/${lang}/cv.pdf`);
    assert.match(response.headers.get("content-type"), /^application\/pdf\b/);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(source));
  }
  for (const lang of Object.keys(pdfs)) {
    const page = await fetch(`${baseUrl}/${lang}/cv`);
    const html = await page.text();
    for (const pdfLang of Object.keys(pdfs)) {
      assert.ok(html.includes(`href="/${pdfLang}/cv.pdf"`), `/${lang}/cv links to ${pdfLang} PDF`);
    }
  }
});

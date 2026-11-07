import assert from "node:assert/strict";
import { test } from "node:test";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("contact email is consistent in both languages and exports", async () => {
  for (const lang of ["es", "en"]) {
    for (const path of [`/${lang}`, `/${lang}/cv`, `/${lang}/index.md`]) {
      const response = await fetch(`${baseUrl}${path}`);
      assert.equal(response.status, 200, path);
      const content = await response.text();
      assert.match(content, /mailto:contact@javierjimenez\.dev/, path);
      assert.doesNotMatch(content, /jjime981@gmail\.com/, path);
    }
  }
});

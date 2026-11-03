import assert from "node:assert/strict";
import { test } from "node:test";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("redirect and localized pages advertise the site favicon", async () => {
  for (const path of ["/", "/cv", "/es", "/en", "/es/cv", "/en/cv"]) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), /<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="\/favicon\.svg"/, path);
  }
});

test("the fallback favicon is an ICO file", async () => {
  const response = await fetch(`${baseUrl}/favicon.ico`);
  assert.equal(response.status, 200);
  const data = Buffer.from(await response.arrayBuffer());
  assert.deepEqual([...data.subarray(0, 4)], [0, 0, 1, 0]);
});

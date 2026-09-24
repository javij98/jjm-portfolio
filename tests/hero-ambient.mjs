import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4321";

test("hero ambient layers span the section while copy keeps its reading width", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1415, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    const bounds = await page.evaluate(() => {
      const section = document.querySelector("#hero").getBoundingClientRect();
      const topology = document.querySelector("#hero .signal-topology--hero").getBoundingClientRect();
      const glow = document.querySelector("#hero [data-hero-pointer-field]").getBoundingClientRect();
      const title = document.querySelector("#hero h1").getBoundingClientRect();
      return { section, topology, glow, title };
    });
    assert.ok(Math.abs(bounds.topology.left - bounds.section.left) < 2, "topology must not start at an inner box edge");
    assert.ok(Math.abs(bounds.topology.right - bounds.section.right) < 2, "topology must not end at an inner box edge");
    assert.ok(Math.abs(bounds.glow.width - bounds.section.width) < 2, "pointer glow uses the same full-width surface");
    assert.ok(bounds.title.left > bounds.section.left + 80, "copy remains comfortably centered");
  } finally {
    await browser.close();
  }
});

test("mobile hero shows a centered straight pipeline rather than ornamental loops", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    for (const width of [412, 597]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
      const result = await page.evaluate(() => {
        const layer = document.querySelector("#hero .signal-topology--hero");
        const svg = layer.querySelector(".signal-topology-svg--mobile");
        if (!svg) return { visible: false };
        const bounds = layer.getBoundingClientRect();
        const route = svg.querySelector(".signal-topology-base");
        const points = [.2, .4, .6, .8].map((fraction) => {
          const local = route.getPointAtLength(route.getTotalLength() * fraction);
          const screen = local.matrixTransform(route.getScreenCTM());
          return { x: screen.x, y: screen.y };
        });
        return {
          visible: getComputedStyle(svg).display !== "none",
          opacity: Number(getComputedStyle(layer).opacity),
          centeredPoints: points.filter((point) => point.x > bounds.left + bounds.width * .2 && point.x < bounds.right - bounds.width * .2 && point.y > bounds.top + bounds.height * .1 && point.y < bounds.bottom - bounds.height * .1).length,
          curved: /[QCSAT]/i.test(route.getAttribute("d")),
          circles: svg.querySelectorAll("circle").length,
          branches: svg.querySelectorAll(".signal-topology-branch").length,
        };
      });
      assert.equal(result.visible, true, `${width}px: mobile diagram must be visible`);
      assert.ok(result.opacity >= .6, `${width}px: diagram should not disappear into the background`);
      assert.ok(result.centeredPoints >= 2, `${width}px: route should cross the visual center`);
      assert.equal(result.curved, false, `${width}px: pipeline should use straight segments`);
      assert.equal(result.circles, 0, `${width}px: no unexplained circles`);
      assert.equal(result.branches, 0, `${width}px: no decorative dead-end branches`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test("touching the mobile hero produces a local glow that fades after release", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 412, height: 900 }, hasTouch: true, isMobile: true });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    const field = page.locator("[data-hero-pointer-field]");
    await page.touchscreen.tap(300, 180);
    const activeHandle = await page.waitForFunction(() => {
      const element = document.querySelector("[data-hero-pointer-field]");
      const style = getComputedStyle(element);
      const opacity = Number(style.opacity);
      if (opacity <= .2) return null;
      return {
        opacity,
        display: style.display,
        x: Number.parseFloat(getComputedStyle(element.parentElement).getPropertyValue("--hero-pointer-x")),
      };
    }, null, { timeout: 1500 });
    const active = await activeHandle.jsonValue();
    assert.notEqual(active.display, "none", "touch glow must be rendered");
    assert.ok(active.opacity > .2, "touch should briefly illuminate the background");
    assert.ok(Math.abs(active.x - 300) < 25, "glow should originate near the touch point");
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector("[data-hero-pointer-field]")).opacity) < .1, null, { timeout: 2000 });
    assert.ok(Number(await field.evaluate((element) => getComputedStyle(element).opacity)) < .1, "glow should fade after touch");
  } finally {
    await browser.close();
  }
});

test("mobile signal travels continuously across its own path length", async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-proxy-server"] });
  try {
    const page = await browser.newPage({ viewport: { width: 412, height: 900 } });
    await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
    const motion = await page.locator(".signal-topology-svg--mobile .signal-topology-flow--one").evaluate((path) => {
      const dash = getComputedStyle(path).strokeDasharray.split(/[ ,]+/).map(Number.parseFloat);
      return { length: path.getTotalLength(), cycle: dash[0] + dash[1] };
    });
    assert.ok(Math.abs(motion.cycle - motion.length) < 5, `mobile pulse should loop with its path: ${JSON.stringify(motion)}`);
  } finally {
    await browser.close();
  }
});

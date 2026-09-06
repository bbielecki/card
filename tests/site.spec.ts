import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import site from "../src/content/site.json" with { type: "json" };
import locations from "../src/content/locations.json" with { type: "json" };

// Exercise our iframe integration without depending on Google's network or UI.
test.beforeEach(async ({ page }) => {
  await page.route("https://www.google.com/maps**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<!doctype html><html lang="pl"><head><title>Mapa gabinetu</title></head><body></body></html>',
    })
  );
});

for (const width of [360, 390, 430, 768, 1024, 1440]) {
  test(`strona i dostępność przy szerokości ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".hero-portrait img").evaluate((image: HTMLImageElement) => image.decode());
    await expect(page.locator("h1")).toHaveCount(1);
    for (const id of [
      "o-mnie",
      "uslugi",
      "rehabilitacja",
      "lokalizacje",
      "telekonsultacja",
      "wizyta-domowa",
      "wspolpraca",
      "kontakt",
    ]) {
      await expect(page.locator(`section#${id}`)).toBeVisible();
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    expect(errors).toEqual([]);
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    }
  });
}

test("dotykowy scroll na telefonie odsłania menu", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL as string);
  await expect(page.locator("#hero-panel")).toBeHidden();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 190, y: 650 }],
  });
  for (const y of [600, 550, 500, 450, 400, 350]) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 190, y }] });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.locator("#hero-panel")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("linki, brak fikcyjnych danych i metadane", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  await expect(page).toHaveTitle(/Łukasz Wilgocki/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Fizjoterapia/);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(
    page.locator('a[href="tel:"], a[href="mailto:"], a[href="#"], a[href=""]')
  ).toHaveCount(0);
  if (!site.phone) await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  else
    await expect(page.locator('a[href^="tel:"]').first()).toHaveAttribute(
      "href",
      `tel:${site.phone.replace(/[^+\d]/g, "")}`
    );
  if (!site.email) await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  else
    await expect(page.locator('a[href^="mailto:"]').first()).toHaveAttribute(
      "href",
      `mailto:${site.email}`
    );
  for (const location of locations.items) {
    if (location.googleMapsUrl)
      await expect(page.getByRole("link", { name: locations.mapLabel })).toHaveAttribute(
        "href",
        location.googleMapsUrl
      );
    else await expect(page.getByText(locations.mapPending)).toBeVisible();
  }
  const brokenAnchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href")!.slice(1))
        .filter((id) => !document.getElementById(id))
    );
  expect(brokenAnchors).toEqual([]);
  for (const path of ["/robots.txt", "/sitemap.xml", "/favicon.svg", "/social-card.png"]) {
    expect((await request.get(path)).ok()).toBe(true);
  }
  if (site.isDraft) {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow"
    );
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  }
  await page
    .locator("footer")
    .getByRole("link", { name: /Polityka prywatności/ })
    .click();
  await expect(page).toHaveURL(/\/rodo\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Polityka prywatności i RODO");
  await expect(page.getByRole("heading", { name: "Dokument w przygotowaniu" })).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze())
      .violations
  ).toEqual([]);
  const missing = await request.get("/nieistniejaca-strona/");
  expect(missing.status()).toBe(404);
});

test("bez JavaScriptu treść i nawigacja pozostają dostępne", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL as string);
  await expect(page.locator("#main-navigation")).toBeVisible();
  await page.locator(".shortcut-grid a").first().click();
  await expect(page).toHaveURL(/#uslugi$/);
  await expect(page.locator("#uslugi")).toBeVisible();
  await expect(page.locator("#hero-panel")).not.toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("ograniczenie animacji jest respektowane", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto("/");
  await page.locator("[data-hero-menu]").click();
  expect(
    await page.locator("#hero-panel").evaluate((element) => getComputedStyle(element).animationName)
  ).toBe("none");
  expect(
    await page
      .locator(".hero-portrait")
      .evaluate((element) => getComputedStyle(element).transitionDuration)
  ).toBe("0s");
});

for (const width of [390, 1440]) {
  test(`scroll: zdjęcie znika, menu pod headerem przy ${width}px`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const panel = page.locator("#hero-panel");
    const scene = page.locator(".hero-main");
    await expect(panel).toBeHidden();
    const initial = await scene.boundingBox();
    if (width === 1440) {
      const visual = (await page.locator(".hero-visual").boundingBox())!;
      expect(visual.width / (initial!.width - 24)).toBeCloseTo(0.75, 2);
    }
    await page.mouse.wheel(0, 180);
    await expect(panel).toBeVisible();
    await expect
      .poll(async () => (await scene.boundingBox())!.height)
      .toBeLessThan(initial!.height - 100);
    const pictureBottom = (await scene.boundingBox())!.y + (await scene.boundingBox())!.height;
    expect((await panel.boundingBox())!.y).toBeGreaterThanOrEqual(pictureBottom - 2);
    await page.evaluate(() => window.scrollTo({ top: 720, behavior: "instant" }));
    await expect.poll(async () => (await scene.boundingBox())!.height).toBeLessThan(2);
    await page.evaluate(() => window.scrollTo({ top: 850, behavior: "instant" }));
    await expect(page.locator("html")).toHaveClass(/menu-docked/);
    await expect(page.locator(".site-header")).toBeHidden();
    await expect(page.locator(".hero-menu-brand")).toBeVisible();
    expect((await page.locator(".hero-menu-bar").boundingBox())!.y).toBe(0);
    await expect(panel.getByRole("tab")).toHaveCount(8);
    await expect(page.locator("#main-navigation")).toBeHidden();
    await expect(page.locator("[data-panel-close]")).toBeHidden();
    for (const tab of await panel.getByRole("tab").all()) {
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", "true");
      expect(
        (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze())
          .violations
      ).toEqual([]);
    }
    await page.locator("#tab-uslugi").focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#panel-lokalizacje")).toBeVisible();
    await page.keyboard.press("End");
    await expect(page.locator("#panel-rodo")).toBeVisible();
    await page.screenshot({ path: `test-results/menu-docked-${width}.png` });
    await page.evaluate(() =>
      document.querySelector("#kontakt")!.scrollIntoView({ behavior: "instant" })
    );
    await expect(page.locator(".hero-menu-brand")).toBeInViewport();
    expect((await page.locator(".hero-menu-bar").boundingBox())!.y).toBe(0);
    await page.locator("#tab-uslugi").click();
    await expect(page.locator("#panel-uslugi")).toBeInViewport();
    await page.screenshot({ path: `test-results/menu-content-${width}.png` });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(panel).toBeHidden();
    await expect.poll(async () => (await scene.boundingBox())!.height).toBeGreaterThan(800);
  });
}

test("desktop: pinezka prowadzi do mapy, a przyciski obok niej są zwarte", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const mapPin = page.getByRole("link", { name: site.hero.mapPinLabel });
  await expect(mapPin).toBeInViewport();
  await expect(mapPin).toHaveAttribute("href", "#lokalizacje");
  await mapPin.click();
  await expect(page).toHaveURL(/#lokalizacje$/);
  await expect(page.locator("#lokalizacje")).toBeInViewport();
  const map = page.locator(".location-map");
  await expect(map.locator("iframe")).toHaveAttribute("src", locations.items[0].embedUrl);
  const links = page.locator(".location-alternatives > a");
  for (const link of await links.all()) {
    const bounds = (await link.boundingBox())!;
    expect(bounds.height).toBeGreaterThanOrEqual(44);
    expect(bounds.height).toBeLessThanOrEqual(140);
  }
  expect((await links.first().boundingBox())!.x).toBeGreaterThan((await map.boundingBox())!.x);
  await page.screenshot({ path: "test-results/desktop-location-layout.png" });
});

test("desktop: klawiatura może przejść od zdjęcia do menu", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("[data-hero-menu]").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#tab-uslugi")).toBeFocused();
  await expect(page.locator(".hero-main")).toHaveAttribute("inert", "");
  await expect(page.locator("#hero-panel")).toBeVisible();
});

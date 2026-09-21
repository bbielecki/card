import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import site from "../src/content/site.json" with { type: "json" };
import locations from "../src/content/locations.json" with { type: "json" };

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
  await expect(page.getByText(/Instagram/)).toHaveCount(0);
  await expect(page.locator('a.button[href^="tel:"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Zadzwoń", exact: true })).toHaveCount(0);
  await expect(page.locator('#kontakt a[href^="tel:"]')).toHaveAttribute(
    "aria-label",
    `${site.contact.phoneLabel}: ${site.phone}`
  );
  await expect(page.locator('#kontakt a[href^="mailto:"]')).toHaveText(site.ui.email);
  await expect(page.locator(".mobile-cta .button")).toHaveAttribute("href", `mailto:${site.email}`);
  await expect(page.locator('#telekonsultacja a[href^="mailto:"]')).toHaveAttribute(
    "href",
    `mailto:${site.email}`
  );
  await expect(page.locator("#telekonsultacja .consultation-details li")).toHaveCount(3);
  await expect(page.locator("#tab-telekonsultacja")).toHaveText("Fizjo konsultacja online");
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
    await expect(page.locator("#kontakt .location-card")).toContainText(location.name);
    await expect(page.locator("#kontakt .location-card")).toContainText(location.address);
  }
  await expect(
    page.locator(
      'iframe, a[href*="maps.google"], a[href*="google.com/maps"], a[href*="maps.app.goo.gl"]'
    )
  ).toHaveCount(0);
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
    expect(await (await request.get("/robots.txt")).text()).toContain("Allow: /");
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain("<loc>");
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

test("SEO: lokalizacja, canonical, graf osoby i dostępny obraz udostępniania", async ({ page, request }) => {
  await page.goto("/?utm_source=test");
  await expect(page).toHaveTitle(site.seoTitle);
  await expect(page.locator("h1")).toHaveText(`${site.name} / ${site.title}`);
  await expect(page.locator(".hero-intro")).toContainText("pacjentów z Legionowa i Warszawy");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", site.description);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical!).pathname).toBe("/");
  expect(new URL(canonical!).search).toBe("");
  const image = new URL((await page.locator('meta[property="og:image"]').getAttribute("content"))!);
  const response = await request.get(image.pathname);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/png");
  const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  const person = schema["@graph"].find((entry: { "@type": string }) => entry["@type"] === "Person");
  expect(person.jobTitle).toBe(site.title);
  expect(person.workLocation[0].address).toBe(locations.items[0].address);
  const service = schema["@graph"].find((entry: { "@type": string }) => entry["@type"] === "Service");
  expect(service.areaServed.map((area: { name: string }) => area.name)).toEqual(["Legionowo", "Warszawa"]);
  expect(person.workLocation).toHaveLength(1);
  expect(JSON.stringify(schema)).not.toContain(site.email);
  await page.goto("/rodo/");
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
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
  await page.locator(".hero-pin[data-hero-menu]").click();
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
  test(`aktywna zakładka śledzi sekcje przy scrollu: ${width}px`, async ({ page }) => {
    // Finish anchor navigation immediately before measuring scroll stability.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#rehabilitacja");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("#tab-rehabilitacja")).toHaveAttribute("aria-current", "location");
    const order = await page.locator("[data-panel-tab]").evaluateAll((tabs) => {
      const menu = tabs
        .map((tab) => tab.getAttribute("data-panel-tab")!)
        .filter((id) => document.getElementById(id));
      const sections = [...document.querySelectorAll("section[id]")]
        .map((section) => section.id)
        .filter((id) => menu.includes(id));
      return { menu, sections };
    });
    expect(order.sections).toEqual(order.menu);
    const brand = page.locator(".hero-menu-brand");
    await brand.focus();
    for (const id of [
      "uslugi",
      "kontakt",
      "rehabilitacja",
      "telekonsultacja",
      "wspolpraca",
      "kontakt",
      "telekonsultacja",
      "rehabilitacja",
    ]) {
      const position = await page.evaluate((id) => {
        const section = document.getElementById(id)!;
        const top = section.getBoundingClientRect().top + scrollY - 100;
        window.scrollTo({ top, behavior: "instant" });
        return scrollY;
      }, id);
      const active = page.locator(`#tab-${id}`);
      await expect(active).toHaveAttribute("aria-current", "location");
      await expect(page.locator('.panel-tabs [aria-current="location"]')).toHaveCount(1);
      await expect(active).toBeInViewport();
      await expect(brand).toBeFocused();
      // Allow pixel rounding while still detecting an unwanted navigation jump.
      expect(Math.abs((await page.evaluate(() => scrollY)) - position)).toBeLessThanOrEqual(2);
    }
    await page.locator("#tab-uslugi").click();
    await expect(page.locator("#panel-uslugi")).toBeInViewport();
    await expect(page.locator(".panel-tabs [aria-current]")).toHaveCount(0);
    await expect(page.locator("#tab-uslugi")).toHaveAttribute("aria-selected", "true");
  });

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
    const portraitState = await page.locator(".hero-visual").evaluate((element) => ({
      opacity: Number(getComputedStyle(element).opacity),
      height: element.getBoundingClientRect().height,
    }));
    expect(portraitState.opacity).toBeGreaterThan(0.2);
    expect(portraitState.opacity).toBeLessThan(0.6);
    expect(portraitState.height).toBeGreaterThan(500);
    await expect(page.locator(".site-header")).toBeHidden();
    await expect(page.locator(".hero-menu-brand")).toBeVisible();
    expect((await page.locator(".hero-menu-bar").boundingBox())!.y).toBe(0);
    await expect(panel.getByRole("tab")).toHaveCount(6);
    await expect(page.locator("#main-navigation")).toBeHidden();
    await expect(page.locator("[data-panel-close]")).toBeHidden();
    await panel.getByRole("tab").first().click();
    await expect.poll(async () => Math.abs(await page.evaluate(() => {
      const headerHeight = document.querySelector(".site-header")!.getBoundingClientRect().height;
      const heroTop = document.querySelector(".hero")!.getBoundingClientRect().top + scrollY;
      return scrollY - (heroTop + Math.max(620, innerHeight - headerHeight) * 0.85 + 1);
    }))).toBeLessThanOrEqual(1);
    const layout = await page.evaluate(() => ({
      panelHeight: document.getElementById("hero-panel")!.getBoundingClientRect().height,
      nextSection: document.getElementById("o-mnie")!.getBoundingClientRect().top + scrollY,
      scroll: scrollY,
    }));
    for (const tab of await panel.getByRole("tab").all()) {
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", "true");
      const current = await page.evaluate(() => ({
        panelHeight: document.getElementById("hero-panel")!.getBoundingClientRect().height,
        nextSection: document.getElementById("o-mnie")!.getBoundingClientRect().top + scrollY,
        scroll: scrollY,
      }));
      expect(current.panelHeight).toBeCloseTo(layout.panelHeight, 0);
      expect(current.nextSection).toBeCloseTo(layout.nextSection, 0);
      expect(current.scroll).toBeCloseTo(layout.scroll, 0);
      await expect(panel.getByRole("tabpanel")).toHaveCount(1);
      expect(
        (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze())
          .violations
      ).toEqual([]);
    }
    await page.locator("#tab-uslugi").focus();
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("#panel-kontakt")).toBeVisible();
    await page.keyboard.press("End");
    await expect(page.locator("#panel-rodo")).toBeVisible();
    // Reproduce a partly visible panel just before the About section, then
    // reselect the same tab as well as a different one from the fixed menu.
    for (const id of ["rodo", "kontakt"]) {
      await page.evaluate(() => {
        const about = document.getElementById("o-mnie")!;
        window.scrollTo({ top: about.getBoundingClientRect().top + scrollY - 250, behavior: "instant" });
      });
      await page.locator(`#tab-${id}`).click();
      await expect.poll(async () => Math.abs((await page.evaluate(() => scrollY)) - layout.scroll))
        .toBeLessThanOrEqual(1);
      const heading = page.locator(`#panel-${id} h2`);
      await expect(heading).toBeInViewport();
      expect((await heading.boundingBox())!.y).toBeGreaterThanOrEqual(
        (await page.locator(".hero-menu-bar").boundingBox())!.height
      );
    }
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
    await page.locator(".hero-pin[data-hero-menu]").click();
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("tab").first()).toHaveAttribute("id", "tab-kontakt");
    await expect(page.locator("#tab-kontakt")).toBeFocused();
    await expect(page.locator("#panel-kontakt")).toBeVisible();
    await expect(page.locator("html")).toHaveClass(/menu-docked/);
  });
}

test("desktop: kontakt rozdziela gabinet i konsultacje online", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(() =>
    document.getElementById("kontakt")!.scrollIntoView({ behavior: "instant" })
  );
  await expect(page.locator("#kontakt")).toBeInViewport();
  await expect(page.locator("section#kontakt")).toHaveCount(1);
  await expect(page.locator("section#lokalizacje, #tab-lokalizacje")).toHaveCount(0);
  await expect(page.locator('#kontakt a[href^="mailto:"]')).toHaveAttribute(
    "href",
    `mailto:${site.email}`
  );
  await expect(page.locator("#kontakt #lokalizacje")).toHaveCount(1);
  const locationCard = page.locator(".location-card");
  const online = page.locator(".location-online");
  await expect(locationCard.locator('a[href^="tel:"]')).toHaveCount(1);
  await expect(online.locator('a[href^="mailto:"]')).toHaveCount(1);
  await expect(
    page.locator('#kontakt a[href="#telekonsultacja"], #kontakt a[href="#wizyta-domowa"]')
  ).toHaveCount(0);
  expect((await online.boundingBox())!.x).toBeGreaterThan((await locationCard.boundingBox())!.x);
  await page.screenshot({ path: "test-results/desktop-location-layout.png" });
});

test("desktop: klawiatura może przejść od zdjęcia do menu", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".hero-menu-hint[data-hero-menu]").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#tab-kontakt")).toBeFocused();
  await expect(page.locator(".hero-main")).toHaveAttribute("inert", "");
  await expect(page.locator("#hero-panel")).toBeVisible();
});

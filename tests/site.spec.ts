import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import site from '../src/content/site.json' with { type: 'json' };
import locations from '../src/content/locations.json' with { type: 'json' };

for (const width of [360, 390, 430, 768, 1024, 1440]) {
  test(`strona i dostępność przy szerokości ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    for (const id of ['o-mnie', 'uslugi', 'rehabilitacja', 'lokalizacje', 'telekonsultacja', 'wizyta-domowa', 'wspolpraca', 'kontakt']) {
      await expect(page.locator(`section#${id}`)).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations).toEqual([]);
    expect(errors).toEqual([]);
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    }
  });
}

for (const width of [390, 1440]) {
  test('pinezka i zakładki: ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const pin = page.locator('[data-hero-reveal]');
    const panel = page.locator('#hero-panel');
    await expect(panel).toBeHidden();
    await expect(page.locator('#main-navigation')).toBeHidden();
    await expect(page.locator('.hero-shortcuts')).toBeHidden();
    await expect(pin).toBeInViewport();
    const portrait = await page.locator('.hero-portrait').boundingBox();
    expect(portrait!.height).toBeGreaterThan(600);
    await pin.click();
    await expect(panel).toBeVisible();
    await expect(pin).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#tab-uslugi')).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#panel-lokalizacje')).toBeVisible();
    await page.keyboard.press('End');
    await expect(page.locator('#panel-rodo')).toBeVisible();
    await page.keyboard.press('Home');
    for (const tab of await panel.getByRole('tab').all()) {
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    }
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(pin).toBeFocused();
    await expect(pin).toHaveAttribute('aria-expanded', 'false');
    await pin.click();
    await panel.getByRole('button', { name: 'Zamknij panel' }).click();
    await expect(panel).toBeHidden();
    await pin.click();
    await page.locator('#tab-uslugi').click();
    await page.locator('#panel-uslugi [data-panel-link]').click();
    await expect(panel).toBeHidden();
    await expect(page).toHaveURL(/#uslugi$/);
    await expect(page.locator('#uslugi')).toBeFocused();
  });

  test('scroll odsłania menu bez blokady i przejęcia fokusu: ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const pin = page.locator('[data-hero-reveal]');
    const panel = page.locator('#hero-panel');
    await expect(panel).toBeHidden();
    await pin.focus();
    await page.mouse.move(5, 400);
    await page.mouse.wheel(0, 180);
    await expect(panel).toBeVisible();
    await expect(pin).toBeFocused();
    await expect(page.locator('.hero')).toHaveClass(/is-panel-open/);
    await expect.poll(() => page.locator('.hero-portrait').evaluate(el => Number(getComputedStyle(el).opacity))).toBeLessThan(1);
    expect(await page.locator('html').evaluate(el => getComputedStyle(el).overflowY)).not.toBe('hidden');
    await page.screenshot({ path: 'test-results/hero-revealed-' + width + '.png' });
    await page.locator('[data-panel-close]').click();
    await page.mouse.move(5, 400);
    await page.mouse.wheel(0, 120);
    await expect(panel).toBeHidden();
    // Returning to the top re-arms scroll reveal.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(page.locator('html')).not.toHaveClass(/hero-revealed/);
    await page.mouse.wheel(0, 180);
    await expect(panel).toBeVisible();
    await page.evaluate(() => document.querySelector('#kontakt')!.scrollIntoView({ behavior: 'instant' }));
    await expect(panel).toBeHidden();
    await expect(page.locator('#kontakt')).toBeInViewport();
  });
}

test('dotykowy scroll na telefonie odsłania menu', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL as string);
  await expect(page.locator('#hero-panel')).toBeHidden();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 650 }] });
  for (const y of [600, 550, 500, 450, 400, 350]) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 190, y }] });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('#hero-panel')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test('mobile: menu po akcji, zmiana rozmiaru i klik poza panelem', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu', exact: true });
  await expect(toggle).toBeHidden();
  await expect(page.locator('.mobile-cta')).toBeHidden();
  await page.locator('[data-hero-reveal]').click();
  await expect(toggle).toBeVisible();
  await expect(page.locator('.mobile-cta')).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('#hero-panel')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('#hero-panel')).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 150, behavior: 'instant' }));
  await toggle.click();
  await expect(page.locator('#hero-panel')).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('#main-navigation').getByRole('link', { name: 'Jak pomagam' }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#uslugi$/);
});

test('linki, brak fikcyjnych danych i metadane', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
  await expect(page).toHaveTitle(/Łukasz Wilgocki/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Fizjoterapia/);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('a[href="tel:"], a[href="mailto:"], a[href="#"], a[href=""]')).toHaveCount(0);
  if (!site.phone) await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  else await expect(page.locator('a[href^="tel:"]').first()).toHaveAttribute('href', `tel:${site.phone.replace(/[^+\d]/g, '')}`);
  if (!site.email) await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  else await expect(page.locator('a[href^="mailto:"]').first()).toHaveAttribute('href', `mailto:${site.email}`);
  for (const location of locations.items) {
    if (location.googleMapsUrl) await expect(page.getByRole('link', { name: locations.mapLabel })).toHaveAttribute('href', location.googleMapsUrl);
    else await expect(page.getByText(locations.mapPending)).toBeVisible();
  }
  const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute('href')!.slice(1)).filter(id => !document.getElementById(id)));
  expect(brokenAnchors).toEqual([]);
  for (const path of ['/robots.txt', '/sitemap.xml', '/favicon.svg', '/social-card.png']) {
    expect((await request.get(path)).ok()).toBe(true);
  }
  if (site.isDraft) {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
  }
  await page.locator('footer').getByRole('link', { name: /Polityka prywatności/ }).click();
  await expect(page).toHaveURL(/\/rodo\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Polityka prywatności i RODO');
  await expect(page.getByRole('heading', { name: 'Dokument w przygotowaniu' })).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  const missing = await request.get('/nieistniejaca-strona/');
  expect(missing.status()).toBe(404);
});

test('bez JavaScriptu treść i nawigacja pozostają dostępne', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL as string);
  await expect(page.locator('#main-navigation')).toBeVisible();
  await page.locator('.shortcut-grid a').first().click();
  await expect(page).toHaveURL(/#uslugi$/);
  await expect(page.locator('#uslugi')).toBeVisible();
  await expect(page.locator('#hero-panel')).not.toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test('ograniczenie animacji jest respektowane', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.locator('[data-hero-reveal]').click();
  expect(await page.locator('#hero-panel').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  expect(await page.locator('.hero-portrait').evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
});

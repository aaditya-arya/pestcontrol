import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';

const pages = readdirSync('.').filter(file => file.endsWith('.html'));

test('all pages load without errors, broken images, overflow, or accessibility violations', async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  for (const file of pages) {
    await page.goto(`/${file}`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toBeVisible();
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      // Resizing updates media queries on the browser's next rendering frame.
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), { message: `${file} overflow at ${width}px` }).toBe(true);
    }
    // Check off-screen images as well, including lazy-loaded assets.
    await page.locator('footer').scrollIntoViewIfNeeded();
    const broken = await page.locator('img').evaluateAll(images => images.filter(i => i.complete && i.naturalWidth === 0).map(i => i.src));
    expect(broken, file).toEqual([]);
    const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(a11y.violations, `${file} accessibility`).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('mobile navigation supports touch, Escape, and navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  await toggle.click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation')).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole('navigation').getByRole('link', { name: 'Fumigation', exact: true }).click();
  await expect(page).toHaveURL(/b2b-fumigation.html/);
  await expect(page.getByRole('navigation')).toBeHidden();
});

test('service enquiry carries selection, validates input, and prepares correctly encoded messages', async ({ page }) => {
  await page.goto('/container-fumigation.html');
  await page.getByRole('link', { name: 'Enquire about this service' }).click();
  await expect(page.locator('#service')).toHaveValue('container-fumigation');
  await page.getByRole('button', { name: 'Prepare my enquiry' }).click();
  await expect(page.locator('.enquiry-result')).toBeHidden();
  await page.locator('#full-name').fill('Asha & Co');
  await page.locator('#phone').fill('-------');
  await page.locator('#location').fill('Ahmedabad');
  await page.locator('[name=consent]').check();
  await page.getByRole('button', { name: 'Prepare my enquiry' }).click();
  await expect(page.locator('.enquiry-result')).toBeHidden();
  await page.locator('#phone').fill('+91 98765 43210');
  await page.locator('#message').fill('Cargo: spices & seeds\nDestination: UAE');
  await page.getByRole('button', { name: 'Prepare my enquiry' }).click();
  await expect(page.locator('.enquiry-result')).toBeVisible();
  const url = new URL(await page.locator('[data-whatsapp]').getAttribute('href'));
  expect(url.hostname).toBe('wa.me');
  expect(url.searchParams.get('text')).toContain('Name: Asha & Co');
  expect(url.searchParams.get('text')).toContain('Service: Container fumigation');
  expect(url.searchParams.get('text')).toContain('Cargo: spices & seeds\nDestination: UAE');
  expect(await page.locator('[data-email]').getAttribute('href')).toMatch(/^mailto:docs@ecomax.co.in\?subject=/);
  await page.locator('#location').fill('Mundra');
  await expect(page.locator('.enquiry-result')).toBeHidden();
});

test('quote and certificate journeys are explicit and never fabricate verification', async ({ page }) => {
  await page.goto('/book-inspection.html?request=quote');
  await expect(page.getByRole('heading', { name: 'Request a service quote' })).toBeVisible();
  await page.goto('/certificate.html');
  await page.locator('#reference').fill('UNKNOWN-123');
  await page.locator('#full-name').fill('Documentation request');
  await page.locator('#phone').fill('9876543210');
  await page.locator('[name=consent]').check();
  await page.getByRole('button', { name: 'Prepare document enquiry' }).click();
  await expect(page.locator('.enquiry-result')).toBeVisible();
  const url = new URL(await page.locator('[data-whatsapp]').getAttribute('href'));
  expect(url.searchParams.get('text')).toContain('Certificate reference: UNKNOWN-123');
  await expect(page.locator('.enquiry-result')).not.toContainText(/verified|valid certificate/i);
});

test('FAQs work with keyboard and reduced motion keeps content available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/pest-control.html');
  const question = page.locator('summary').first();
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  expect(await page.locator('html').getAttribute('class') || '').not.toContain('motion-ready');
});

test('core navigation and content remain usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.goto('http://127.0.0.1:4173/book-inspection.html');
  await expect(page.getByRole('button', { name: 'Prepare my enquiry' })).toBeDisabled();
  await context.close();
});

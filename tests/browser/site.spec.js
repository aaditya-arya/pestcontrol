import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';

const pages = readdirSync('.').filter(file => file.endsWith('.html'));
const visualPages = ['index.html', 'about.html', 'branches.html', 'b2b-fumigation.html', 'pest-control.html', 'container-fumigation.html', 'contact.html', 'book-inspection.html'];

test('homepage has clean service cards, alternate hover photos, and responsive category links', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.hero-service-directory')).toHaveCount(0);
  await expect(page.locator('.home-hero').getByRole('link', { name: 'Services', exact: true })).toHaveAttribute('href', '#services');
  const directory = page.locator('.compact-service-grid');
  const services = ['container-fumigation', 'pallet-treatment', 'warehouse-fumigation', 'termite-control', 'ant-cockroach-treatment', 'general-pest-control', 'rodent-control', 'prophylactic-treatment'];
  for (const slug of services) {
    await expect(directory.locator(`a[href="${slug}.html"]`)).toHaveCount(1);
  }
  await expect(directory.locator('a')).toHaveCount(8);
  await expect(directory.locator('p, .service-card-symbol, .treatment-object')).toHaveCount(0);
  await expect(page.locator('.home-category-heading p')).toHaveCount(0);
  await expect(page.locator('.section-route-button')).toHaveCount(3);
  const container = directory.locator('a[href="container-fumigation.html"]');
  const alternate = container.locator('.service-hover-image');
  await expect(alternate).toHaveAttribute('src', 'assets/images/container-fumigation-hover.jpg');
  await expect(alternate).toHaveCSS('opacity', '0');
  await container.hover();
  await expect(alternate).toHaveCSS('opacity', '1');
  await page.screenshot({ path: '.local/qa/service-photo-hover.png' });
  await page.mouse.move(0, 0);
  await container.focus();
  await expect(alternate).toHaveCSS('opacity', '1');
  const box = await container.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect.poll(() => container.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBeLessThan(1);
  await page.mouse.up();
  await expect(page).toHaveURL(/container-fumigation.html$/);
  await expect(page.locator('h1')).toHaveText('Container Fumigation');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const button of await page.locator('.section-route-button').all()) {
      const bounds = await button.boundingBox();
      expect(bounds.height).toBeGreaterThanOrEqual(64);
      expect(bounds.width).toBeGreaterThan(width - 80);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    }
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await page.locator('img').evaluateAll(images => Promise.all(images.map(image => {
    image.loading = 'eager';
    return image.decode();
  })));
  await page.screenshot({ path: '.local/qa/services-home-mobile.png', fullPage: true });
  const trailingSpace = await page.locator('footer').evaluate(footer => document.documentElement.scrollHeight - (footer.getBoundingClientRect().bottom + scrollY));
  expect(trailingSpace).toBeLessThanOrEqual(1);
});

test('enquiry offers a direct call or WhatsApp before the form and buttons fill from the arrow', async ({ page }) => {
  await page.goto('/book-inspection.html');
  const call = page.getByRole('link', { name: 'Call our team' });
  const chat = page.getByRole('link', { name: 'Chat on WhatsApp' });
  await expect(call).toHaveAttribute('href', 'tel:+918401137910');
  await expect(chat).toHaveAttribute('href', 'https://wa.me/918401137910');
  await expect(chat).toHaveAttribute('rel', 'noopener noreferrer');
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(call).toBeVisible();
    await expect(chat).toBeVisible();
    const contacts = await page.locator('.enquiry-direct-panel').boundingBox();
    const form = await page.locator('#enquiry-form').boundingBox();
    expect(contacts.y + contacts.height).toBeLessThan(form.y);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  const arrow = call.locator('.button-arrow');
  await call.hover();
  await expect.poll(() => arrow.evaluate(el => {
    const circle = getComputedStyle(el, '::before');
    const scale = new DOMMatrix(circle.transform).a;
    const a = el.getBoundingClientRect();
    const b = el.closest('.button').getBoundingClientRect();
    return scale * a.width / 2 >= Math.hypot(a.x + a.width / 2 - b.x, b.height / 2);
  })).toBe(true);
  await expect(call).toHaveCSS('color', 'rgb(22, 59, 50)');
  await expect(call).toHaveCSS('background-color', 'rgb(216, 237, 172)');
  await page.screenshot({ path: '.local/qa/inquiry-button-hover.png' });
  await page.mouse.move(0, 0);
  await call.focus();
  await page.keyboard.press('Tab');
  await expect(chat).toBeFocused();
  await expect(chat).toHaveCSS('color', 'rgb(248, 248, 240)');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const duration = await arrow.evaluate(el => parseFloat(getComputedStyle(el, '::before').transitionDuration));
  expect(duration).toBeLessThanOrEqual(.001);
});

test('all pages load without errors, broken images, overflow, or accessibility violations', async ({ page }) => {
  // Seventeen pages, screenshots and accessibility scans need room on busy hosts.
  test.setTimeout(180_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  for (const file of pages) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${file}`);
    await page.evaluate(() => document.fonts.ready);
    // Decode every image, including assets below the lazy-load threshold.
    await page.locator('img').evaluateAll(images => Promise.all(images.map(image => {
      image.loading = 'eager';
      return image.decode();
    })));
    await expect(page.locator('h1')).toBeVisible();
    if (visualPages.includes(file)) {
      await page.screenshot({ path: `.local/qa/${file}-desktop.png`, fullPage: true });
    }
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      // Resizing updates media queries on the browser's next rendering frame.
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), { message: `${file} overflow at ${width}px` }).toBe(true);
      if (width === 390 && visualPages.includes(file)) {
        const trailingSpace = await page.locator('footer').evaluate(footer =>
          document.documentElement.scrollHeight - (footer.getBoundingClientRect().bottom + scrollY));
        expect(trailingSpace, `${file}: empty space after footer`).toBeLessThanOrEqual(1);
        await page.screenshot({ path: `.local/qa/${file}-mobile.png`, fullPage: true });
      }
    }
    // Check off-screen images as well, including lazy-loaded assets.
    await page.locator('footer').scrollIntoViewIfNeeded();
    const broken = await page.locator('img').evaluateAll(images => images.filter(i => i.complete && i.naturalWidth === 0).map(i => i.src));
    expect(broken, file).toEqual([]);
    const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(a11y.violations, `${file} accessibility`).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('skip link moves keyboard focus past the navigation into the page', async ({ page }) => {
  for (const file of ['index.html', 'book-inspection.html', 'container-fumigation.html']) {
    await page.goto(`/${file}`);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement.closest('main'))).toBe(true);
  }
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

test('header stays transparent until 30% of the viewport is scrolled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const header = page.locator('.site-header');
  await expect(header).not.toHaveClass(/scrolled/);
  await expect(header).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.evaluate(() => scrollTo(0, innerHeight * .29));
  await expect(header).not.toHaveClass(/scrolled/);
  await page.evaluate(() => scrollTo(0, innerHeight * .31));
  await expect(header).toHaveClass(/scrolled/);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(header).not.toHaveClass(/scrolled/);
});

test('closed service specifications cannot receive focus and reopening works', async ({ page }) => {
  await page.goto('/container-fumigation.html');
  const drawer = page.locator('#specs-drawer');
  await expect(drawer).toHaveAttribute('inert', '');
  await expect(drawer).toBeHidden();
  const trigger = page.getByRole('button', { name: 'Technical specifications' });
  await trigger.click();
  await expect(drawer).toBeVisible();
  await expect(drawer).not.toHaveAttribute('inert');
  await expect(page.getByRole('button', { name: 'Close specifications' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('.specs-drawer-call')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close specifications' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveAttribute('inert', '');
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('small-screen specifications allow keyboard scrolling and have no accessibility violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [[320, 568], [844, 390]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/container-fumigation.html');
    await page.getByRole('button', { name: 'Technical specifications' }).click();
    await expect(page.getByRole('button', { name: 'Close specifications' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('#specs-drawer-body')).toBeFocused();
    await page.keyboard.press('PageDown');
    await expect.poll(() => page.locator('#specs-drawer-body').evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(a11y.violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Technical specifications' })).toBeFocused();
  }
});

test('service enquiry carries selection, validates input, and prepares correctly encoded messages', async ({ page }) => {
  await page.goto('/container-fumigation.html');
  await page.getByRole('link', { name: 'Enquire about this service' }).click();
  await expect(page.locator('#service')).toHaveValue('container-fumigation');
  await page.getByRole('button', { name: 'Prepare my enquiry' }).click();
  await expect(page.locator('.enquiry-result')).toBeHidden();
  await page.locator('#full-name').fill('Asha Shah');
  await page.locator('.optional-form-summary').click();
  await page.locator('#company').fill('Asha & Co');
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
  expect(url.searchParams.get('text')).toContain('Name: Asha Shah');
  expect(url.searchParams.get('text')).toContain('Company: Asha & Co');
  expect(url.searchParams.get('text')).toContain('Service: Container fumigation');
  expect(url.searchParams.get('text')).toContain('Cargo: spices & seeds\nDestination: UAE');
  expect(await page.locator('[data-email]').getAttribute('href')).toMatch(/^mailto:docs@ecomax.co.in\?subject=/);
  await page.locator('#location').fill('Mundra');
  await expect(page.locator('.enquiry-result')).toBeHidden();
});

test('location enquiry carries its city and service guidance responds to selection', async ({ page }) => {
  await page.goto('/branches.html');
  await page.getByRole('link', { name: 'Enquire in Morbi' }).click();
  await expect(page.locator('#location')).toHaveValue('Morbi');
  await expect(page.locator('.form-section-optional')).not.toHaveAttribute('open');
  await page.locator('#service').selectOption('pallet-treatment');
  await expect(page.locator('[data-service-note]')).toBeVisible();
  await expect(page.locator('[data-service-guidance]')).toContainText('pallets or boxes');
  await page.locator('#full-name').fill('आदित्य शर्मा');
  await page.locator('#phone').fill('9876543210');
  await page.locator('[name=consent]').check();
  await page.getByRole('button', { name: 'Prepare my enquiry' }).click();
  await expect(page.locator('.enquiry-result')).toBeVisible();
  const message = new URL(await page.locator('[data-whatsapp]').getAttribute('href')).searchParams.get('text');
  expect(message).toContain('आदित्य शर्मा');
  expect(message).toContain('Location: Morbi');
  await page.locator('#service').selectOption('rodent-control');
  await expect(page.locator('.enquiry-result')).toBeHidden();
  await expect(page.locator('[data-service-guidance]')).toContainText('rodent activity');
});

test('service cards are linked and normal browser back navigation preserves routes', async ({ page }) => {
  await page.goto('/b2b-fumigation.html');
  await page.locator('.service-card-link').first().click();
  await expect(page).toHaveURL(/container-fumigation.html$/);
  await expect(page.locator('h1')).toContainText('Container Fumigation');
  await page.goBack();
  await expect(page).toHaveURL(/b2b-fumigation.html$/);
  await expect(page.locator('h1')).toContainText('Container, pallet');
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

test('location cards keep direct contacts, service links and homepage city anchors', async ({ page }) => {
  await page.goto('/branches.html');
  await expect(page.locator('.location-card')).toHaveCount(4);
  await expect(page.locator('.hub-explorer, .branch-service-tags, .cta-section')).toHaveCount(0);
  const cities = [
    ['ahmedabad', '918401137910', 'index.html#services'],
    ['mundra', '919898472483', 'container-fumigation.html'],
    ['morbi', '918401137910', 'pallet-treatment.html'],
    ['unjha', '919898472483', 'warehouse-fumigation.html']
  ];
  for (const [id, phone, service] of cities) {
    const card = page.locator(`#${id}`);
    await expect(card.locator('.location-phone')).toHaveAttribute('href', `tel:+${phone}`);
    await expect(card.locator('a[href^="https://wa.me/"]')).toHaveAttribute('href', `https://wa.me/${phone}`);
    await expect(card.locator('.location-service')).toHaveAttribute('href', service);
  }
  await page.goto('/');
  await page.locator('.home-location-card[href="branches.html#unjha"]').click();
  await expect(page).toHaveURL(/branches.html#unjha$/);
  await expect(page.locator('#unjha h2')).toBeInViewport();
});

test('scroll animation reveals content and stops drifting when reduced motion is selected', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-copy')).toHaveClass(/is-visible/);
  await page.locator('#services').scrollIntoViewIfNeeded();
  await expect(page.locator('.expertise-card').first()).toHaveClass(/is-visible/);
  await expect.poll(() => page.locator('.home-hero').evaluate(el => parseFloat(el.style.getPropertyValue('--image-shift')))).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.locator('.home-hero').evaluate(el => el.style.getPropertyValue('--image-shift'))).toBe('0px');
  await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
});

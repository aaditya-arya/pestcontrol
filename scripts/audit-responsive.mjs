import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';

// Repeatable local audit; start the static server first. This is not a conformance certification.
const base = process.env.AUDIT_URL || 'http://127.0.0.1:4180';
const out = '.local/qa/responsive-audit';
mkdirSync(out, { recursive: true });
const files = readdirSync('.').filter(f => f.endsWith('.html')).sort();
const widths = [320, 360, 390, 414, 600, 640, 680, 681, 768, 820, 960, 961, 1024, 1150, 1280, 1440, 1920];
const visual = ['index.html', 'about.html', 'branches.html', 'b2b-fumigation.html', 'pest-control.html', 'container-fumigation.html', 'book-inspection.html', 'contact.html'];
const result = { createdAt: new Date().toISOString(), browser: 'Installed Google Chrome, headless', widths, pages: [], keyboard: [], landscape: [], errors: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
const settle = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const measure = () => page.evaluate(() => {
  const visible = el => el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) && el.getBoundingClientRect().width > 0;
  const overflow = [...document.querySelectorAll('body *')].filter(el => !el.closest('.specs-drawer, .primary-nav, .skip-link') && visible(el)).map(el => {
    const r = el.getBoundingClientRect();
    return { element: el.tagName.toLowerCase(), class: el.className?.baseVal ?? el.className, right: Math.round(r.right), width: Math.round(r.width) };
  }).filter(el => el.right > innerWidth + 1);
  return {
    width: innerWidth, scrollWidth: document.documentElement.scrollWidth, overflow,
    smallFormText: [...document.querySelectorAll('input:not([type=checkbox]), select, textarea')].filter(visible).filter(el => parseFloat(getComputedStyle(el).fontSize) < 16).map(el => el.id),
    clippedControls: [...document.querySelectorAll('.button > span:first-child, label, summary strong')].filter(visible).filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.textContent.trim()),
  };
});
page.on('pageerror', error => result.errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) result.errors.push(`${response.status()} ${response.url()}`); });
try {
  for (const file of files) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${base}/${file}`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('img').evaluateAll(images => images.forEach(img => { img.loading = 'eager'; }));
    await settle();
    // A responsive source can change while decoding after the viewport reset.
    await page.locator('img').evaluateAll(images => Promise.all(images.map(async img => {
      try { await img.decode(); }
      catch { await new Promise(requestAnimationFrame); await img.decode(); }
    })));
    const entry = { file, layouts: [], accessibility: [], spacing: [], mobileFormText: [], clippedControls: [], metadata: {} };
    entry.metadata = await page.evaluate(() => ({ title: document.title, description: document.querySelector('meta[name=description]')?.content, lang: document.documentElement.lang, h1: document.querySelectorAll('h1').length, viewport: document.querySelector('meta[name=viewport]')?.content }));
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await settle();
      const metrics = await measure();
      entry.layouts.push({ width, scrollWidth: metrics.scrollWidth, overflow: metrics.scrollWidth > width ? metrics.overflow : [] });
      if (width <= 414 && metrics.smallFormText.length) entry.mobileFormText.push({ width, fields: metrics.smallFormText });
      if (metrics.clippedControls.length) entry.clippedControls.push({ width, controls: metrics.clippedControls });
      if (visual.includes(file) && [390, 768, 1440].includes(width)) await page.screenshot({ path: `${out}/${file}-${width}.png`, fullPage: true });
    }
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await settle();
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      entry.accessibility.push({ width, violations: axe.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), incomplete: axe.incomplete.map(v => ({ id: v.id, count: v.nodes.length })) });
    }
    const style = await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }' });
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await settle();
      entry.spacing.push(await measure());
    }
    await style.evaluate(el => el.remove());
    result.pages.push(entry);
    writeFileSync(`${out}/results.json`, JSON.stringify(result, null, 2));
    console.log(`${file}: ${widths.length} widths; ${entry.accessibility.reduce((n, a) => n + a.violations.length, 0)} axe violations`);
  }
  for (const [width, height] of [[844, 390], [1024, 600], [320, 568]]) {
    await page.setViewportSize({ width, height });
    await page.goto(`${base}/index.html`);
    if (await page.locator('.menu-toggle').isVisible()) {
      await page.locator('.menu-toggle').click();
      await settle();
      result.landscape.push(await page.locator('.primary-nav').evaluate(nav => ({ width: innerWidth, height: innerHeight, bottom: nav.getBoundingClientRect().bottom, overflowY: getComputedStyle(nav).overflowY, scrollHeight: nav.scrollHeight, clientHeight: nav.clientHeight })));
      await page.screenshot({ path: `${out}/navigation-${width}x${height}.png` });
    }
  }
  for (const file of ['index.html', 'book-inspection.html', 'container-fumigation.html']) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/${file}`);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    const skipTarget = await page.evaluate(() => document.activeElement.id);
    const hidden = [];
    for (let i = 0; i < 65; i++) {
      await page.keyboard.press('Tab');
      await settle();
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        const r = el.getBoundingClientRect();
        const header = document.querySelector('.site-header').getBoundingClientRect();
        const obstruction = el.closest('.site-header, .skip-link') ? 0 : Math.max(0, header.bottom);
        return { id: el.id, text: el.textContent.trim().slice(0, 55), hidden: r.width > 0 && (r.bottom <= obstruction || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth), outline: getComputedStyle(el).outlineStyle };
      });
      if (info.hidden) hidden.push(info);
    }
    result.keyboard.push({ file, skipTarget, hidden });
  }
} finally {
  writeFileSync(`${out}/results.json`, JSON.stringify(result, null, 2));
  await browser.close();
}
const failures = result.pages.flatMap(p => [
  ...p.layouts.filter(v => v.scrollWidth > v.width).map(v => `${p.file}: overflow at ${v.width}`),
  ...p.accessibility.flatMap(v => v.violations.map(a => `${p.file}: ${a.id} at ${v.width}`)),
  ...p.spacing.filter(v => v.scrollWidth > v.width).map(v => `${p.file}: text-spacing overflow at ${v.width}`),
  ...p.mobileFormText.map(v => `${p.file}: small mobile form text at ${v.width}`),
]);
failures.push(...result.keyboard.filter(k => k.skipTarget !== 'main' || k.hidden.length).map(k => `${k.file}: keyboard focus issue`));
failures.push(...result.landscape.filter(n => n.bottom > n.height + 1 && !['auto', 'scroll'].includes(n.overflowY)).map(n => `Menu clipped at ${n.width}x${n.height}`));
console.log(JSON.stringify({ pageCount: result.pages.length, layoutChecks: result.pages.length * widths.length, failures, keyboard: result.keyboard, landscape: result.landscape, errors: result.errors }, null, 2));
process.exitCode = failures.length || result.errors.length ? 1 : 0;

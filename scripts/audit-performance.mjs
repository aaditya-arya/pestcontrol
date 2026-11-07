import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = process.env.AUDIT_URL || 'http://127.0.0.1:4180';
const out = '.local/qa/responsive-audit';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = {
  profile: 'Installed Chrome; 390x844 mobile viewport, DPR 2, cold cache, 1.6 Mbps down, 150ms latency, 4x CPU slowdown; local server',
  limitations: 'Single lab run per page, not field Core Web Vitals or a Lighthouse score. INP is not measured.',
  results: [],
};
try {
  for (const file of ['index.html', 'container-fumigation.html', 'book-inspection.html']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.bringToFront();
    const session = await context.newCDPSession(page);
    await session.send('Network.enable');
    await session.send('Network.setCacheDisabled', { cacheDisabled: true });
    await session.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 204800, uploadThroughput: 93750 });
    await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.addInitScript(() => {
      window.auditVitals = { lcp: null, cls: 0 };
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.auditVitals.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.auditVitals.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(`${base}/${file}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Allow font swapping, entrance motion and buffered paint callbacks to finish.
    await page.waitForTimeout(1500);
    const metrics = await page.evaluate(() => ({
      ...window.auditVitals,
      visibility: document.visibilityState,
      resources: performance.getEntriesByType('resource').map(r => ({ name: r.name.split('/').pop(), bytes: r.transferSize })),
      domContentLoaded: performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,
    }));
    report.results.push({ file, ...metrics });
    writeFileSync(`${out}/performance.json`, JSON.stringify(report, null, 2));
    console.log(`${file}: LCP ${metrics.lcp}ms; CLS ${metrics.cls}; ${metrics.resources.reduce((n, r) => n + r.bytes, 0)} bytes`);
    await context.close();
  }
} finally { await browser.close(); }

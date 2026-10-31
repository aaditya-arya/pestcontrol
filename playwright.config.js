import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4173', channel: 'chrome', screenshot: 'only-on-failure' },
  webServer: { command: 'python -m http.server 4173 --bind 127.0.0.1', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});

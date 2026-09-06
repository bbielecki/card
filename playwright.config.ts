import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4321',
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge',
    headless: true,
    trace: 'retain-on-failure',
  },
});

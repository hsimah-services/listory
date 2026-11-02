import { defineConfig } from '@playwright/test';

const baseURL = process.env.LISTORY_TEST_URL || 'http://127.0.0.1:18476';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  workers: 1,
  retries: 0,
  reporter: 'list',
  expect: { timeout: 10000 },
  use: {
    baseURL,
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
});

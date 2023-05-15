// playwright.config.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import { PlaywrightTestConfig } from '@playwright/test';
import environmentVariables from './environmentVariables';

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./ui-global-setup'),
  use: {
    storageState: 'temp/state.json',
    baseURL: environmentVariables.PLAYWRIGHT_BASEURL ?? 'http://localhost:3000',
    permissions: ['microphone'],
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Browser proxy option is required for Chromium on Windows
    launchOptions: { proxy: { server: `https://per-context` } },
    ignoreHTTPSErrors: true,
  },
  testDir: './ui-tests',
  timeout: 60000,
  workers: 1,
};
export default config;

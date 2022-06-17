// playwright.config.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./global-setup'),
  use: {
    storageState: 'temp/state.json',
    baseURL: process.env.PLAYWRIGHT_BASEURL ?? 'http://localhost:3000',
    permissions: ['microphone'],
  },
  timeout: 180000,
};
export default config;

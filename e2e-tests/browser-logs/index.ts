// eslint-disable-next-line import/no-extraneous-dependencies
import { Page } from '@playwright/test';

export function logPageErrors(page: Page, errorsOnly = true): void {
  page.on('console', (message) => {
    if (!errorsOnly || message.type() === 'error' || message.type() === 'warn') {
      console.log(`[BROWSER: ${page.url()} (${message.type()})] ${message.text()}`);
    }
  });
  page.on('requestfailed', (request) => {
    console.log(
      `[BROWSER: ${page.url()} (REQUEST FAILED)] ${request.method()} ${request.url()} ${request.failure()}`,
    );
  });
  page.on('requestfinished', async (request) => {
    const response = await request.response();
    if (response && (!errorsOnly || response.status() >= 400)) {
      console.log(
        `[BROWSER: ${page.url()} (REQUEST)] ${request.method()} ${request.url()} ${response.status()}: ${await response.text()}`,
      );
    }
  });
}

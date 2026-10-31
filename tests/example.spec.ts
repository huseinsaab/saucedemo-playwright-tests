import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page}) => {
  await page.goto('https://saucedemo.com');
})

test('title is Swag Labs', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Swag Labs/);
});

test('title is not Sauce Labs', async ({ page }) => {
  // Expect title to not be Sauce Labs
  await expect(page).not.toHaveTitle(/Sauce Labs/);
})
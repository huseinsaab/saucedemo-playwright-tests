import { test, expect, Page } from '@playwright/test'

test.beforeEach(async ({ page}) => {
  await page.goto('https://saucedemo.com');
})

async function login(page: Page, username: string, password: string) {
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

test('valid login reaches inventory page', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await login(page, 'standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory/);
});

test('invalid login returns incorrect password message', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await login(page, 'wrong_username', 'wrong_password');

  await expect(page).not.toHaveURL(/inventory/);

  await page.pause();
});
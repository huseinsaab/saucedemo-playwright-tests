import { test, expect, Page } from '@playwright/test'

const errorPrefix = 'Epic sadface: ';

const errorMessages = {
  invalidCredentials: 'Username and password do not match any user in this service',
  usernameRequired: 'Username is required',
  passwordRequired: 'Password is required',
};

async function login(page: Page, username: string, password: string) {
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

async function expectLoginRejected(page: Page, errorMessage: string) {
  await expect(page.locator('[data-test="error"]')).toContainText(errorPrefix + errorMessage);
  await expect(page).not.toHaveURL(/inventory/);
}

test.beforeEach(async ({ page}) => {
  await page.goto('https://saucedemo.com');
})

test('valid login reaches inventory page', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory/);
});

test('invalid login does not reach inventory page and shows correct error message', async ({ page }) => {
  await login(page, 'wrong_username', 'wrong_password');

  await expectLoginRejected(page, errorMessages.invalidCredentials);
});

test('invalid password does not reach inventory page and shows correct error message', async ({ page }) => {
  //known username, incorrect password
  await login(page, 'standard_user', 'wrong_password');

  await expectLoginRejected(page, errorMessages.invalidCredentials);
});

test('correct error messaging with no username entered', async ({ page }) => {
  await login(page, '', 'secret_sauce');

  await expectLoginRejected(page, errorMessages.usernameRequired);
});

test('correct error messaging with no password entered', async ({ page }) => {
  await login(page, 'standard_user', '');

  await expectLoginRejected(page, errorMessages.passwordRequired);
});

test.only('error messaging dissapears when closed', async ({ page }) => {
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();

  await page.locator('[data-test="error-button"]').click();

  await expect(page.locator('[data-test="error"]')).toBeHidden();
})

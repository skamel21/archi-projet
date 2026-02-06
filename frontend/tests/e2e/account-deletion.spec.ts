import { test, expect } from '@playwright/test';

const uniqueEmail = () => `test-${Date.now()}@example.com`;
const PASSWORD = 'password123';

test.describe('Account Deletion', () => {
  test('deleted user cannot login', async ({ page }) => {
    const email = uniqueEmail();

    // Register
    await page.goto('/register');
    await page.fill('#email', email);
    await page.fill('#password', PASSWORD);
    await page.fill('#confirmPassword', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toHaveText('My Todos');

    // Go to profile and delete account
    await page.click('a:has-text("' + email + '")');
    await page.click('button:has-text("Delete My Account")');
    await page.click('button:has-text("Yes, delete my account")');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    // Try to login - should fail
    await page.fill('#email', email);
    await page.fill('#password', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('.alert-danger')).toBeVisible();
  });
});

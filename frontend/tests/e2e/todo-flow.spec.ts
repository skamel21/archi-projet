import { test, expect } from '@playwright/test';

const uniqueEmail = () => `test-${Date.now()}@example.com`;
const PASSWORD = 'password123';

test.describe('Complete Todo Flow', () => {
  test('register, create, update, delete todo, logout', async ({ page }) => {
    const email = uniqueEmail();

    // Register
    await page.goto('/register');
    await page.fill('#email', email);
    await page.fill('#password', PASSWORD);
    await page.fill('#confirmPassword', PASSWORD);
    await page.click('button[type="submit"]');

    // Should redirect to todos page
    await expect(page.locator('h1')).toHaveText('My Todos');

    // Create a todo
    await page.fill('input[placeholder="What needs to be done?"]', 'Buy milk');
    await page.click('button:has-text("Add")');
    await expect(page.locator('text=Buy milk')).toBeVisible();

    // Toggle completion
    await page.click('button[aria-label="Mark as complete"]');
    await expect(page.locator('.text-decoration-line-through')).toBeVisible();

    // Delete todo
    await page.click('button[aria-label="Delete todo"]');
    await expect(page.locator('text=Buy milk')).not.toBeVisible();

    // Logout
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/\/login/);
  });
});

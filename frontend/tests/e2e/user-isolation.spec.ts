import { test, expect } from '@playwright/test';

const uniqueEmail = () => `test-${Date.now()}@example.com`;
const PASSWORD = 'password123';

test.describe('User Isolation', () => {
  test('user B should not see user A todos', async ({ page }) => {
    const emailA = uniqueEmail();
    const emailB = `b-${uniqueEmail()}`;

    // Register user A and create a todo
    await page.goto('/register');
    await page.fill('#email', emailA);
    await page.fill('#password', PASSWORD);
    await page.fill('#confirmPassword', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toHaveText('My Todos');

    await page.fill('input[placeholder="What needs to be done?"]', 'User A private todo');
    await page.click('button:has-text("Add")');
    await expect(page.locator('text=User A private todo')).toBeVisible();

    // Logout
    await page.click('button:has-text("Logout")');

    // Register user B
    await page.goto('/register');
    await page.fill('#email', emailB);
    await page.fill('#password', PASSWORD);
    await page.fill('#confirmPassword', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toHaveText('My Todos');

    // User B should not see User A's todo
    await expect(page.locator('text=User A private todo')).not.toBeVisible();
    await expect(page.locator('text=No todos yet')).toBeVisible();
  });
});

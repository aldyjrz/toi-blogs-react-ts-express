import { test, expect } from '@playwright/test';

test.describe('Public blog', () => {
  test('home page loads with SEO title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Blog/);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('blog listing is reachable from nav', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Blog' }).first().click();
    await expect(page).toHaveURL(/\/blog$/);
  });

  test('renders 404 for unknown route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByText('404')).toBeVisible();
  });
});

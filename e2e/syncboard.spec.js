import { test, expect } from '@playwright/test';

test.describe('SyncBoard E2E Browser Test Suite', () => {
  test('should load main page and verify sprint title', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('.board-main-title')).toBeVisible();
  });

  test('should navigate to List View tab', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.click('button:has-text("List")');
    await expect(page.locator('.list-title')).toHaveText('All Tasks');
  });

  test('should navigate to Analytics tab and verify burndown chart', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.click('button:has-text("Analytics")');
    await expect(page.locator('h2:has-text("Analytics & Reports")')).toBeVisible();
  });

  test('should open Create Task modal', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.click('.create-task-btn');
    await expect(page.locator('.modal-card')).toBeVisible();
  });
});

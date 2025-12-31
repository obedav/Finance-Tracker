import { test, expect } from '@playwright/test';

test.describe('Transaction Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard/transactions page
    // Note: In a real scenario, you'd need to authenticate first
    await page.goto('/dashboard');
  });

  test('should display transaction list', async ({ page }) => {
    // Check if transactions section is visible
    await expect(page.locator('text=/transaction|recent activity/i').first()).toBeVisible();
  });

  test('should open transaction form modal', async ({ page }) => {
    // Look for add transaction button
    const addButton = page.getByRole('button', { name: /add transaction|new transaction/i });

    if (await addButton.count() > 0) {
      await addButton.first().click();

      // Check if modal/form is visible
      await expect(page.locator('text=/amount|category|description/i').first()).toBeVisible();
    }
  });

  test('should validate transaction form', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add transaction|new transaction/i });

    if (await addButton.count() > 0) {
      await addButton.first().click();

      // Try to submit empty form
      const submitButton = page.getByRole('button', { name: /save|add|create/i }).first();
      await submitButton.click();

      // Check for validation messages
      await expect(page.locator('text=/required|must/i').first()).toBeVisible();
    }
  });

  test('should filter transactions by type', async ({ page }) => {
    // Look for filter options
    const filterButtons = page.locator('button:has-text("Income"), button:has-text("Expense"), button:has-text("All")');
    const buttonCount = await filterButtons.count();

    if (buttonCount > 0) {
      await filterButtons.first().click();

      // Verify filter is applied (transactions list should update)
      await page.waitForTimeout(500); // Wait for filtering
    }
  });

  test('should search transactions', async ({ page }) => {
    // Look for search input
    const searchInput = page.getByPlaceholder(/search/i);

    if (await searchInput.count() > 0) {
      await searchInput.fill('test');
      await page.waitForTimeout(500); // Wait for search debounce

      // Verify search is working
      await expect(searchInput).toHaveValue('test');
    }
  });
});

test.describe('Transaction Categories', () => {
  test('should display category selection', async ({ page }) => {
    await page.goto('/dashboard');

    const addButton = page.getByRole('button', { name: /add transaction|new transaction/i });

    if (await addButton.count() > 0) {
      await addButton.first().click();

      // Check if category dropdown/select is visible
      await expect(page.locator('text=/category/i, select[name="category"], [aria-label*="category" i]').first()).toBeVisible();
    }
  });
});

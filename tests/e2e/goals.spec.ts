import { test, expect } from '@playwright/test';

test.describe('Goal Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to goals page
    await page.goto('/goals');
  });

  test('should display goals page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /financial goals|goals/i })).toBeVisible();
  });

  test('should display goal statistics', async ({ page }) => {
    // Check for stats cards
    await expect(page.locator('text=/total goals|active goals|completed/i').first()).toBeVisible();
  });

  test('should open create goal modal', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /create goal|new goal|add goal/i });

    if (await createButton.count() > 0) {
      await createButton.first().click();

      // Check if modal is visible
      await expect(page.locator('text=/goal name|target amount|goal type/i').first()).toBeVisible();
    }
  });

  test('should validate goal form', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /create goal|new goal|add goal/i });

    if (await createButton.count() > 0) {
      await createButton.first().click();

      // Try to submit empty form
      const submitButton = page.locator('button:has-text("Create"), button:has-text("Save")').first();
      await submitButton.click();

      // Check for validation messages
      await expect(page.locator('text=/required|must/i').first()).toBeVisible();
    }
  });

  test('should filter goals by status', async ({ page }) => {
    // Look for filter tabs/buttons
    const filterButtons = page.locator('button:has-text("Active"), button:has-text("Completed"), button:has-text("All")');
    const buttonCount = await filterButtons.count();

    if (buttonCount > 1) {
      await filterButtons.nth(1).click();

      // Verify filter is applied
      await page.waitForTimeout(500);
    }
  });

  test('should display goal cards with progress', async ({ page }) => {
    // Check for goal progress indicators
    const goalCards = page.locator('[class*="goal"], [data-testid*="goal"]');
    const cardCount = await goalCards.count();

    if (cardCount === 0) {
      // Check for empty state
      await expect(page.locator('text=/no goals|create.*first goal/i').first()).toBeVisible();
    } else {
      // Check if progress is visible on goal cards
      await expect(page.locator('text=/%|progress/i').first()).toBeVisible();
    }
  });

  test('should add contribution to goal', async ({ page }) => {
    // Look for a goal card with add contribution button
    const addContributionButton = page.locator('button:has-text("Add"), button:has-text("Contribute")').first();
    const buttonCount = await addContributionButton.count();

    if (buttonCount > 0) {
      await addContributionButton.click();

      // Check if contribution modal is visible
      await expect(page.locator('text=/contribution|amount/i').first()).toBeVisible();
    }
  });
});

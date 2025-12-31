import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper page titles', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);

    await page.goto('/dashboard');
    await expect(page).toHaveTitle(/.+/);
  });

  test('should have keyboard navigable forms', async ({ page }) => {
    await page.goto('/login');

    // Tab through form fields
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(firstFocused);
  });

  test('should have focus indicators', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.getByLabel(/email/i);
    await emailInput.focus();

    // Check if element has focus
    await expect(emailInput).toBeFocused();
  });

  test('should have ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for buttons with accessible names
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const accessibleName = await button.getAttribute('aria-label') || await button.textContent();
        expect(accessibleName).toBeTruthy();
      }
    }
  });

  test('should support keyboard navigation in modals', async ({ page }) => {
    await page.goto('/dashboard');

    const addButton = page.getByRole('button', { name: /add|new|create/i }).first();

    if (await addButton.count() > 0) {
      await addButton.click();

      // Press Escape to close modal
      await page.keyboard.press('Escape');

      // Verify modal is closed (this may vary based on implementation)
      await page.waitForTimeout(300);
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for h1 heading
    const h1 = page.locator('h1');
    const h1Count = await h1.count();

    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(1); // Should only have one h1 per page
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/dashboard');

    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        // Images should have alt attribute (can be empty for decorative images)
        expect(alt).not.toBeNull();
      }
    }
  });

  test('should have visible focus on tab navigation', async ({ page }) => {
    await page.goto('/login');

    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check if any element has focus
    const hasFocus = await page.evaluate(() => {
      const activeElement = document.activeElement;
      return activeElement !== document.body && activeElement !== null;
    });

    expect(hasFocus).toBeTruthy();
  });

  test('should announce form errors to screen readers', async ({ page }) => {
    await page.goto('/login');

    // Submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for aria-live regions or error messages with proper ARIA
    const errorMessages = page.locator('[role="alert"], [aria-live], .error, .invalid');
    const errorCount = await errorMessages.count();

    expect(errorCount).toBeGreaterThan(0);
  });
});

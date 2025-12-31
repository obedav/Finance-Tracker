import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveTitle(/Finance Tracker/i);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for validation messages
    await expect(page.locator('text=/email.*required/i').or(page.locator('text=/this field is required/i'))).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.locator('text=/incorrect|invalid|failed/i')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /sign up|register|create account/i }).click();

    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('heading', { name: /sign up|create account|register/i })).toBeVisible();
  });

  test('should show validation errors on registration', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('button', { name: /sign up|create account|register/i }).click();

    // Check for validation messages
    await expect(page.locator('text=/required|must/i').first()).toBeVisible();
  });

  test('should validate password confirmation', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel(/first name/i).fill('Test');
    await page.getByLabel(/last name/i).fill('User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('Password123!');
    await page.locator('input[type="password"]').last().fill('DifferentPassword123!');
    await page.getByRole('button', { name: /sign up|create account|register/i }).click();

    await expect(page.locator('text=/password.*match|passwords must match/i')).toBeVisible();
  });
});

test.describe('Two-Factor Authentication', () => {
  test('should allow navigation to 2FA settings', async ({ page }) => {
    // This test assumes user is logged in
    // In a real scenario, you'd use a test user or mock authentication
    await page.goto('/settings');

    // Look for 2FA section
    await expect(page.locator('text=/two.?factor|2fa/i').first()).toBeVisible();
  });

  test('should display 2FA setup flow', async ({ page }) => {
    await page.goto('/settings');

    // Find and click enable 2FA button if visible
    const enable2FAButton = page.locator('button:has-text("Enable 2FA"), button:has-text("Enable Two-Factor")');
    const buttonCount = await enable2FAButton.count();

    if (buttonCount > 0) {
      await enable2FAButton.first().click();

      // Check for QR code or setup instructions
      await expect(page.locator('text=/scan.*qr|authenticator app|secret key/i').first()).toBeVisible();
    }
  });
});

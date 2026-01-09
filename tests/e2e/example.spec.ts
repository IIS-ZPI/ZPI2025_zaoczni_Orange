import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle('zpi2025-zaoczni-orange');
});

test('vite logo link works', async ({ page }) => {
    await page.goto('/');

    // Check if Vite logo link exists and has correct href
    const viteLink = page.getByRole('link').filter({ has: page.getByAltText('Vite logo') });
    await expect(viteLink).toHaveAttribute('href', 'https://vite.dev');
    await expect(viteLink).toHaveAttribute('target', '_blank');
});

test('react logo link works', async ({ page }) => {
    await page.goto('/');

    // Check if React logo link exists and has correct href
    const reactLink = page.getByRole('link').filter({ has: page.getByAltText('React logo') });
    await expect(reactLink).toHaveAttribute('href', 'https://react.dev');
    await expect(reactLink).toHaveAttribute('target', '_blank');
});

test('app renders correctly', async ({ page }) => {
    await page.goto('/');

    // Check if the main heading is present
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Vite + React');

    // Check if the counter button is present
    await expect(page.getByRole('button', { name: /count is/i })).toBeVisible();

    // Check if the deploy test text is present
    await expect(page.getByText('Deploy test v1')).toBeVisible();

    // Check if the read the docs text is present
    await expect(page.getByText('Click on the Vite and React logos to learn more')).toBeVisible();

    // Check if logos are present
    await expect(page.getByAltText('Vite logo')).toBeVisible();
    await expect(page.getByAltText('React logo')).toBeVisible();
});

test('counter functionality works', async ({ page }) => {
    await page.goto('/');

    // Find the counter button and click it
    const counterButton = page.getByRole('button', { name: /count is/i });

    // Check initial state
    await expect(counterButton).toContainText('count is 0');

    // Click the button
    await counterButton.click();

    // Check if counter incremented
    await expect(counterButton).toContainText('count is 1');

    // Click again
    await counterButton.click();

    // Check if counter incremented again
    await expect(counterButton).toContainText('count is 2');
});

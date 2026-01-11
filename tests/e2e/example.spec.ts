import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle('NBP Currency Stats Dashboard');
});

test('renders the main heading', async ({ page }) => {
    await page.goto('/');

    // Check if the H1 heading is correct
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('NBP Currency Analyzer');
});

test('renders the subtitle description', async ({ page }) => {
    await page.goto('/');

    // Check if the subtitle exists
    await expect(page.getByText('System for statistical analysis of disease states')).toBeVisible();
});

test('renders header badges', async ({ page }) => {
    await page.goto('/');

    // Check for the informative text in the header (visible on desktop)
    await expect(page.getByText('Data from NBP API')).toBeVisible();
    await expect(page.getByText('Real-time analysis')).toBeVisible();
});

test('renders footer with NBP API link', async ({ page }) => {
    await page.goto('/');

    // Check for copyright text
    await expect(page.getByText('© 2025 NBP Currency Analyzer')).toBeVisible();

    // Check if the NBP API link exists and has the correct href
    const apiLink = page.getByRole('link', { name: 'api.nbp.pl' });

    await expect(apiLink).toBeVisible();
    await expect(apiLink).toHaveAttribute('href', 'http://api.nbp.pl/');
});

test('app structure renders correctly', async ({ page }) => {
    await page.goto('/');

    // Ensure the <main> content area exists
    const mainElement = page.locator('main');
    await expect(mainElement).toBeVisible();

    // Check if the header icons are rendered (using the Lucide icon class logic or svg presence)
    await expect(page.locator('header svg').first()).toBeVisible();
});

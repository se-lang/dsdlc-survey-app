import { test, expect } from '@playwright/test';

test('Login form lets user log in', async ({ page }) => {
    page.on('console', (msg) => {
        console.log(msg.text());
    });
    await page.goto('/login');
    await expect(page.getByRole('button')).toHaveText('Login');
    await page
        .getByRole('textbox', {
            name: 'Username',
        })
        .fill('e2euser@example.com');
    await page
        .getByRole('textbox', {
            name: 'Password',
        })
        .fill('password123');

    const loginButton = page.getByRole('button', { name: 'Login' });
    await loginButton.click();
    await page.waitForURL('/');
    await expect(page.getByText('User: e2euser@example.com')).toBeVisible();
    await page.reload();
    await expect(page.getByText('User: e2euser@example.com')).toBeVisible();
});

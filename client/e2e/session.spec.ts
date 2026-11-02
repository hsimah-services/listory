import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

const PASSWORD = 'correct horse battery';

async function signInWithForm(page: Page, username = 'editor1') {
  await page.goto('/auth/login');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

test('signed out, / shows the sign-in prompt and links to the login page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in to continue' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Listory sign-in' })).toHaveAttribute('href', '/auth/login');
  await expect(page.getByRole('navigation')).toHaveCount(0);
});

test('a bad password shows the sign-in error', async ({ page }) => {
  await page.goto('/auth/login');
  await page.getByLabel('Username').fill('editor1');
  await page.getByLabel('Password').fill('wrong password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Could not sign in. Check your username and password.');
  await expect(page).toHaveURL(/\/auth\/login$/);
});

test('signing in shows the Lists and Checklists navigation', async ({ page }) => {
  await signInWithForm(page);
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(nav.getByRole('link', { name: 'Lists', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Checklists', exact: true })).toBeVisible();
});

test('Sign out returns to the sign-in prompt', async ({ page }) => {
  await signInWithForm(page);
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  page.on('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Account menu' }).click();
  await page.getByRole('menuitem', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Session ended' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Listory sign-in' })).toHaveAttribute('href', '/auth/login');
});

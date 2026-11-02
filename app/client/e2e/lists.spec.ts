import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { LIST_TARGET, deleteAllTitled } from './cleanup';

// Every list these tests can create. Each test removes them, even when it fails part way.
const CREATED_TITLES = ['Picnic', 'Park picnic'];

async function createList(page: Page, title: string) {
  await page.goto('/lists/new');
  await page.getByLabel('Title').fill(title);
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('heading', { name: title, level: 2 })).toBeVisible();
}

async function addItem(page: Page, name: string) {
  await page.getByLabel('New item').fill(name);
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByText(name, { exact: true })).toBeVisible();
}

test.afterEach(async ({ page }) => {
  for (const title of CREATED_TITLES) {
    await deleteAllTitled(page, LIST_TARGET, title);
  }
});

test('creating a list lands on its details', async ({ page, authenticate }) => {
  await authenticate();
  await createList(page, 'Picnic');
  await expect(page).toHaveURL(/\/lists\/[^/]+$/);
});

test('added items Blanket and Plates both appear on the list', async ({ page, authenticate }) => {
  await authenticate();
  await createList(page, 'Picnic');
  await addItem(page, 'Blanket');
  await addItem(page, 'Plates');
});

test('removing Plates takes it off the list and keeps Blanket', async ({ page, authenticate }) => {
  await authenticate();
  await createList(page, 'Picnic');
  await addItem(page, 'Blanket');
  await addItem(page, 'Plates');
  await page.getByRole('button', { name: 'Remove Plates' }).click();
  await expect(page.getByText('Plates', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Blanket', { exact: true })).toBeVisible();
});

test('renaming a list to Park picnic shows the new title', async ({ page, authenticate }) => {
  await authenticate();
  await createList(page, 'Picnic');
  // Edit is an Astryx Button with href, so it renders as a link.
  await page.getByRole('link', { name: 'Edit', exact: true }).click();
  await page.getByLabel('Title').fill('Park picnic');
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByRole('heading', { name: 'Park picnic', level: 2 })).toBeVisible();
});

test('searching park on /lists shows exactly one row', async ({ page, authenticate }) => {
  await authenticate();
  await createList(page, 'Park picnic');
  await page.goto('/lists');
  await page.getByLabel('Search lists').fill('park');
  await expect(page.getByRole('link', { name: 'Park picnic', exact: true })).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Camping' })).toHaveCount(0);
});

test('deleting a list lands on /lists and the list is gone', async ({ page, authenticate }) => {
  await authenticate();
  await createList(page, 'Park picnic');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page).toHaveURL(/\/lists$/);
  await expect(page.getByRole('link', { name: 'Park picnic', exact: true })).toHaveCount(0);
});

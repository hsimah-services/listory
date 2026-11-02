import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

const details = (page: Page) => page.getByRole('complementary', { name: 'Checklist details' });

async function createChecklist(page: Page, title: string, lists: string[]) {
  await page.goto('/checklists/new');
  await page.getByLabel('Title').fill(title);
  for (const list of lists) {
    await page.getByRole('checkbox', { name: list }).check();
  }
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('heading', { name: title, level: 2 })).toBeVisible();
}

async function deleteChecklist(page: Page) {
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page).toHaveURL(/\/checklists$/);
}

test('Trip from Camping and Hiking shows four items with Water once', async ({ page, authenticate }) => {
  await authenticate();
  await createChecklist(page, 'Trip', ['Camping', 'Hiking']);
  const items = details(page).getByRole('checkbox');
  await expect(items).toHaveCount(4);
  for (const name of ['Tent', 'Torch', 'Water', 'Boots']) {
    await expect(details(page).getByRole('checkbox', { name, exact: true })).toHaveCount(1);
  }
  await deleteChecklist(page);
});

test('checking every item shows Completed and unchecking one clears it', async ({ page, authenticate }) => {
  await authenticate();
  await createChecklist(page, 'Trip', ['Camping', 'Hiking']);
  const names = ['Tent', 'Torch', 'Water', 'Boots'];
  for (const name of names) {
    await details(page).getByRole('checkbox', { name, exact: true }).check();
  }
  await expect(details(page).getByText(/Completed/)).toBeVisible();
  await details(page).getByRole('checkbox', { name: 'Tent', exact: true }).uncheck();
  await expect(details(page).getByText(/Completed/)).toHaveCount(0);
  await deleteChecklist(page);
});

test('removing Camping leaves only Boots', async ({ page, authenticate }) => {
  await authenticate();
  await createChecklist(page, 'Trip', ['Camping', 'Hiking']);
  page.once('dialog', (dialog) => dialog.accept());
  await details(page).getByRole('button', { name: 'Remove Camping' }).click();
  await expect(details(page).getByRole('checkbox')).toHaveCount(1);
  await expect(details(page).getByRole('checkbox', { name: 'Boots', exact: true })).toBeVisible();
  await deleteChecklist(page);
});

test('adding Camping back restores Tent, Torch and Water unchecked', async ({ page, authenticate }) => {
  await authenticate();
  await createChecklist(page, 'Trip', ['Camping', 'Hiking']);
  page.once('dialog', (dialog) => dialog.accept());
  await details(page).getByRole('button', { name: 'Remove Camping' }).click();
  await expect(details(page).getByRole('checkbox')).toHaveCount(1);
  await details(page).getByRole('combobox', { name: 'Add list' }).click();
  await page.getByRole('option', { name: 'Camping' }).click();
  await details(page).getByRole('button', { name: 'Add', exact: true }).click();
  for (const name of ['Tent', 'Torch', 'Water']) {
    await expect(details(page).getByRole('checkbox', { name, exact: true })).not.toBeChecked();
  }
  await expect(details(page).getByRole('checkbox', { name: 'Water', exact: true })).toHaveCount(1);
  await deleteChecklist(page);
});

test('renaming a checklist shows the new title, and deleting it lands on /checklists', async ({ page, authenticate }) => {
  await authenticate();
  await createChecklist(page, 'Trip', ['Camping']);
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByLabel('Title').fill('Weekend trip');
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByRole('heading', { name: 'Weekend trip', level: 2 })).toBeVisible();
  await deleteChecklist(page);
  await expect(page.getByRole('link', { name: 'Weekend trip' })).toHaveCount(0);
});

test('the completed filter shows only completed checklists', async ({ page, authenticate }) => {
  await authenticate();
  await createChecklist(page, 'Done trip', ['Camping']);
  for (const name of ['Tent', 'Torch', 'Water']) {
    await details(page).getByRole('checkbox', { name, exact: true }).check();
  }
  await expect(details(page).getByText(/Completed/)).toBeVisible();
  await createChecklist(page, 'Open trip', ['Hiking']);

  await page.goto('/checklists?status=completed');
  await expect(page.getByRole('link', { name: 'Done trip' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open trip' })).toHaveCount(0);

  await page.goto('/checklists');
  await page.getByRole('link', { name: 'Done trip' }).click();
  await deleteChecklist(page);
  await page.getByRole('link', { name: 'Open trip' }).click();
  await deleteChecklist(page);
});

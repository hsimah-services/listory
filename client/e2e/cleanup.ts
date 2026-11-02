import type { Locator, Page } from '@playwright/test';
import { expect } from './fixtures';

type CleanupTarget = {
  // The index page the rows live on, e.g. /lists.
  path: string;
  // Rows that only exist once the results have loaded. The page shell (its New button) renders
  // before the results do, so waiting on the shell alone can count rows too early.
  loaded: (page: Page) => Locator;
  // Where the app should land after a delete.
  landing: RegExp;
};

export const LIST_TARGET: CleanupTarget = {
  path: '/lists',
  // The seeded Camping list is always present, so its link proves the query resolved.
  loaded: (page) => page.getByRole('link', { name: 'Camping', exact: true }),
  landing: /\/lists$/,
};

export const CHECKLIST_TARGET: CleanupTarget = {
  path: '/checklists',
  // Either a row or the empty-state text, so an empty page also counts as loaded.
  loaded: (page) => page.locator('tbody tr').or(page.getByText(/No checklists/)),
  landing: /\/checklists$/,
};

// Deletes every row with this title, including copies left by an earlier failed run.
export async function deleteAllTitled(page: Page, target: CleanupTarget, title: string) {
  for (;;) {
    await page.goto(target.path);
    await expect(target.loaded(page).first()).toBeVisible();
    const row = page.getByRole('link', { name: title, exact: true });
    if ((await row.count()) === 0) return;
    await row.first().click();
    await expect(page.getByRole('heading', { name: title, level: 2 })).toBeVisible();
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page).toHaveURL(target.landing);
  }
}

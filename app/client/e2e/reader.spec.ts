import type { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { login } from './session';

// Astryx renders a Button with href as a link and one without href as a button. A control
// counts as present if either role matches, so an absence check cannot pass by role mismatch.
function control(scope: Page | Locator, name: string | RegExp, exact = false) {
  return scope.getByRole('button', { name, exact }).or(scope.getByRole('link', { name, exact }));
}

test('reader1 sees lists and checklists with no write controls', async ({ page, authenticate, browser }) => {
  // An editor makes a checklist in its own browser context so the reader has something to view.
  const editorContext = await browser.newContext();
  const editor = await editorContext.newPage();
  try {
    await login(editorContext.request, undefined, 'editor1');
    await editor.goto('/checklists/new');
    await editor.getByLabel('Title').fill('Reader trip');
    await editor.getByRole('checkbox', { name: 'Camping' }).check();
    await editor.getByRole('button', { name: 'Create' }).click();
    await expect(editor.getByRole('heading', { name: 'Reader trip', level: 2 })).toBeVisible();
    // Positive control: the editor sees the Edit and Delete controls the reader must not.
    await expect(control(editor, 'Edit', true)).toBeVisible();
    await expect(control(editor, 'Delete', true)).toBeVisible();

    await authenticate('reader1');

    await page.goto('/lists');
    await expect(page.getByRole('link', { name: 'Camping' })).toBeVisible();
    await expect(control(page, 'New list', true)).toHaveCount(0);
    await page.getByRole('link', { name: 'Camping' }).click();
    await expect(page.getByRole('heading', { name: 'Camping', level: 2 })).toBeVisible();
    await expect(control(page, 'Edit', true)).toHaveCount(0);
    await expect(control(page, 'Delete', true)).toHaveCount(0);
    await expect(control(page, 'Add', true)).toHaveCount(0);
    await expect(control(page, /^Remove /)).toHaveCount(0);

    await page.goto('/checklists');
    await expect(page.getByRole('link', { name: 'Reader trip' })).toBeVisible();
    await expect(control(page, 'New checklist', true)).toHaveCount(0);
    await page.getByRole('link', { name: 'Reader trip' }).click();
    const details = page.getByRole('complementary', { name: 'Checklist details' });
    await expect(details.getByRole('checkbox')).toHaveCount(3);
    for (const checkbox of await details.getByRole('checkbox').all()) {
      await expect(checkbox).toBeDisabled();
    }
    await expect(control(details, 'Edit', true)).toHaveCount(0);
    await expect(control(details, 'Delete', true)).toHaveCount(0);
    await expect(control(details, 'Add', true)).toHaveCount(0);
    await expect(control(details, /^Remove /)).toHaveCount(0);
  } finally {
    // Cleanup: the editor removes the checklist it made, even if an assertion above failed.
    // Removes every copy of the checklist, including ones left by an earlier failed run.
    for (;;) {
      await editor.goto('/checklists');
      // Wait for the loaded page (its New checklist button appears with the rows) before counting.
      await expect(editor.getByRole('link', { name: 'New checklist', exact: true })).toBeVisible();
      const row = editor.getByRole('link', { name: 'Reader trip', exact: true });
      if ((await row.count()) === 0) break;
      await row.first().click();
      editor.once('dialog', (dialog) => dialog.accept());
      await editor.getByRole('button', { name: 'Delete' }).click();
      await expect(editor).toHaveURL(/\/checklists$/);
    }
    await editorContext.close();
  }
});

import { test, expect } from './fixtures';
import { login } from './session';

test('reader1 sees lists and checklists with no write controls', async ({ page, authenticate, browser }) => {
  // An editor makes a checklist in its own browser context so the reader has something to view.
  const editorContext = await browser.newContext();
  await login(editorContext.request, undefined, 'editor1');
  const editor = await editorContext.newPage();
  await editor.goto('/checklists/new');
  await editor.getByLabel('Title').fill('Reader trip');
  await editor.getByRole('checkbox', { name: 'Camping' }).check();
  await editor.getByRole('button', { name: 'Create' }).click();
  await expect(editor.getByRole('heading', { name: 'Reader trip', level: 2 })).toBeVisible();

  await authenticate('reader1');

  await page.goto('/lists');
  await expect(page.getByRole('link', { name: 'Camping' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'New list' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Camping' }).click();
  await expect(page.getByRole('heading', { name: 'Camping', level: 2 })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Delete' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Add' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^Remove / })).toHaveCount(0);

  await page.goto('/checklists');
  await expect(page.getByRole('link', { name: 'Reader trip' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'New checklist' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Reader trip' }).click();
  const details = page.getByRole('complementary', { name: 'Checklist details' });
  await expect(details.getByRole('checkbox')).toHaveCount(3);
  for (const checkbox of await details.getByRole('checkbox').all()) {
    await expect(checkbox).toBeDisabled();
  }
  await expect(details.getByRole('button', { name: 'Edit' })).toHaveCount(0);
  await expect(details.getByRole('button', { name: 'Delete' })).toHaveCount(0);
  await expect(details.getByRole('button', { name: /^Remove / })).toHaveCount(0);

  // Cleanup: the editor removes the checklist it made.
  editor.once('dialog', (dialog) => dialog.accept());
  await editor.getByRole('button', { name: 'Delete' }).click();
  await expect(editor).toHaveURL(/\/checklists$/);
  await editorContext.close();
});

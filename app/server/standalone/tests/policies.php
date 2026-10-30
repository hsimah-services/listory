<?php

declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';

use Listory\Standalone\{Application, Viewer, Schema};
use Eleph\SQLite\Database;

function check(bool $condition, string $message): void { if (!$condition) throw new RuntimeException($message); }
function fails(callable $fn, string $message): void {
    try { $fn(); } catch (Throwable) { return; }
    throw new RuntimeException($message);
}
$db = new Database(':memory:');
Schema::install($db);
$editor = new Application($db, new Viewer('1', 'editor'));
$reader = new Application($db, new Viewer('2', 'reader'));
$anonymous = new Application($db, new Viewer());

$list = $editor->runtime->create('PermanentList', ['title' => 'Groceries']);
$id = $list->id;
$item = $editor->runtime->create('ChecklistItem', ['name' => 'Milk', 'checklist' => (string) $editor->runtime->create('Checklist', ['title' => 'Shop'])->id]);

fails(fn () => $anonymous->runtime->find('PermanentList', $id), 'Anonymous reads are denied');
echo "PASS: anonymous cannot read\n";

check($anonymous->runtime->all('PermanentList')->count() === 0, 'Anonymous list is empty');
echo "PASS: anonymous list is empty\n";

check($reader->runtime->find('PermanentList', $id)?->getTitle() === 'Groceries', 'Reader reads the list');
echo "PASS: reader can read\n";

fails(fn () => $reader->runtime->create('PermanentList', ['title' => 'Denied']), 'Reader creates are denied');
echo "PASS: reader cannot create\n";

fails(fn () => $reader->runtime->update('ChecklistItem', $item->id, ['checked' => true]), 'Reader checks are denied');
echo "PASS: reader cannot check an item\n";

$editor->runtime->create('ListItem', ['name' => 'Bread', 'list' => (string) $id]);
$editor->runtime->update('PermanentList', $id, ['title' => 'Weekly shop']);
check($editor->runtime->find('PermanentList', $id)->getTitle() === 'Weekly shop', 'Editor updates the list');
check($editor->runtime->find('PermanentList', $id)->items()->count() === 1, 'Editor creates items');
echo "PASS: editor can do both\n";

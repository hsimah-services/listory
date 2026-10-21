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
Schema::install($db); Schema::install($db);
$app = new Application($db, new Viewer('1', 'editor'));
$runtime = $app->runtime;

$list = $runtime->create('PermanentList', ['title' => 'Groceries']);
check($list->id !== null, 'Create sets an id');
$id = $list->id;
check($runtime->find('PermanentList', $id)->getTitle() === 'Groceries', 'Create reads back the title');
echo "PASS: create\n";

$found = $runtime->find('PermanentList', $id);
check($found->getCreatedAt() !== null && $found->getUpdatedAt() !== null, 'Timestamps are set');
echo "PASS: timestamps\n";

$runtime->update('PermanentList', $id, ['title' => 'Weekly shop']);
check($runtime->find('PermanentList', $id)->getTitle() === 'Weekly shop', 'Update changes the title');
echo "PASS: update\n";

fails(fn () => $runtime->create('PermanentList', []), 'Title is required');
echo "PASS: required\n";

fails(fn () => $runtime->create('PermanentList', ['title' => str_repeat('x', 201)]), 'Title is limited to 200 characters');
echo "PASS: maxLength\n";

$runtime->delete('PermanentList', $id);
check($runtime->find('PermanentList', $id) === null, 'Delete removes the list');
echo "PASS: delete\n";

foreach (['One', 'Two', 'Three'] as $title) {
    $runtime->create('PermanentList', ['title' => $title]);
}
check($runtime->all('PermanentList')->count() === 3, 'All counts the lists');
echo "PASS: count\n";

$shop = $runtime->create('PermanentList', ['title' => 'Shopping']);
$milk = $runtime->create('ListItem', ['name' => 'Milk', 'list' => (string) $shop->id]);
$bread = $runtime->create('ListItem', ['name' => 'Bread', 'list' => (string) $shop->id]);
check($runtime->find('PermanentList', $shop->id)->items()->count() === 2, 'A list holds the items created for it');
echo "PASS: items belong to a list\n";

fails(fn () => $runtime->create('ListItem', ['name' => 'Orphan']), 'An item requires a list');
echo "PASS: item requires a list\n";

check($runtime->find('ListItem', $milk->id)->getList()?->getId() == $shop->id, 'An item knows its list');
echo "PASS: item knows its list\n";

$other = $runtime->create('PermanentList', ['title' => 'Hardware']);
$nails = $runtime->create('ListItem', ['name' => 'Nails', 'list' => (string) $other->id]);

$runtime->delete('PermanentList', $shop->id);
check($runtime->find('ListItem', $milk->id) === null, 'Deleting a list deletes its items');
echo "PASS: deleting a list deletes its items\n";

check($runtime->find('ListItem', $nails->id) !== null, 'Deleting one list keeps the items of other lists');
echo "PASS: other lists keep their items\n";

$listA = $runtime->create('PermanentList', ['title' => 'A']);
$listB = $runtime->create('PermanentList', ['title' => 'B']);
$trip = $runtime->create('Checklist', ['title' => 'Trip', 'sourceLists' => [(string) $listA->id, (string) $listB->id]]);
check($runtime->find('Checklist', $trip->id)->sourceLists()->count() === 2, 'A checklist records its source lists');
echo "PASS: create with source lists\n";

check($runtime->find('Checklist', $trip->id)->getCompletedAt() === null, 'A new checklist is not completed');
echo "PASS: completedAt starts null\n";

$runtime->update('Checklist', $trip->id, ['sourceLists' => [(string) $listA->id]]);
check($runtime->find('Checklist', $trip->id)->sourceLists()->count() === 1, 'Update replaces the source lists');
echo "PASS: replace source lists\n";

check($runtime->find('PermanentList', $listA->id)->checklists()->count() === 1, 'A list knows the checklists built from it');
echo "PASS: inverse\n";

$runtime->delete('PermanentList', $listA->id);
check($runtime->find('Checklist', $trip->id) !== null, 'Deleting a source list keeps the checklist');
check($runtime->find('Checklist', $trip->id)->sourceLists()->count() === 0, 'Deleting a source list removes it from the checklist');
echo "PASS: deleting a source list keeps the checklist\n";

$runtime->delete('Checklist', $trip->id);
check($runtime->find('PermanentList', $listB->id) !== null, 'Deleting a checklist keeps its source lists');
echo "PASS: deleting a checklist keeps its lists\n";

$packing = $runtime->create('Checklist', ['title' => 'Packing']);
$tent = $runtime->create('ChecklistItem', ['name' => 'Tent', 'checklist' => (string) $packing->id]);
check($runtime->find('ChecklistItem', $tent->id)->getChecked() === false, 'A new item is unchecked');
echo "PASS: unchecked by default\n";

$runtime->update('ChecklistItem', $tent->id, ['checked' => true]);
check($runtime->find('ChecklistItem', $tent->id)->getChecked() === true, 'Update checks the item');
echo "PASS: check an item\n";

$stove = $runtime->create('ChecklistItem', ['name' => 'Stove', 'checklist' => (string) $packing->id]);
check($runtime->find('Checklist', $packing->id)->items()->count() === 2, 'A checklist holds the items created for it');
echo "PASS: items on a checklist\n";

fails(fn () => $runtime->create('ChecklistItem', ['name' => 'Orphan']), 'An item requires a checklist');
echo "PASS: item requires a checklist\n";

$camping = $runtime->create('PermanentList', ['title' => 'Camping']);
$lantern = $runtime->create('ChecklistItem', ['name' => 'Lantern', 'checklist' => (string) $packing->id, 'sourceList' => (string) $camping->id]);
$runtime->delete('PermanentList', $camping->id);
check($runtime->find('ChecklistItem', $lantern->id) !== null, 'Deleting a source list keeps the item');
check($runtime->find('ChecklistItem', $lantern->id)->getSourceList() === null, 'Deleting a source list clears the item\'s source');
echo "PASS: deleting a source list nullifies\n";

$runtime->delete('Checklist', $packing->id);
check($runtime->find('ChecklistItem', $tent->id) === null, 'Deleting a checklist deletes its items');
check($runtime->find('ChecklistItem', $stove->id) === null, 'Deleting a checklist deletes all of its items');
echo "PASS: deleting a checklist deletes its items\n";

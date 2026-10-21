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

// Items of a checklist in creation order, as their names.
$namesOn = function ($id) use ($runtime): array {
    $items = $runtime->find('Checklist', $id)->items()->all();
    usort($items, fn ($a, $b) => strnatcmp((string) $a->getId(), (string) $b->getId()));
    return array_map(fn ($item) => $item->getName(), $items);
};

$camping = $runtime->create('PermanentList', ['title' => 'Camping']);
$runtime->create('ListItem', ['name' => 'Tent', 'list' => (string) $camping->id]);
$runtime->create('ListItem', ['name' => 'Torch', 'list' => (string) $camping->id]);
$runtime->create('ListItem', ['name' => 'Water', 'list' => (string) $camping->id]);

$hiking = $runtime->create('PermanentList', ['title' => 'Hiking']);
$runtime->create('ListItem', ['name' => 'Water', 'list' => (string) $hiking->id]);
$runtime->create('ListItem', ['name' => 'Boots', 'list' => (string) $hiking->id]);

$trip = $runtime->create('Checklist', ['title' => 'Trip', 'sourceLists' => [(string) $camping->id, (string) $hiking->id]]);
check($namesOn($trip->id) === ['Tent', 'Torch', 'Water', 'Boots'], 'Create merges both lists in order, skipping the repeated Water');
$water = array_values(array_filter($runtime->find('Checklist', $trip->id)->items()->all(), fn ($item) => $item->getName() === 'Water'));
check(count($water) === 1 && $water[0]->getSourceList()?->getId() == $camping->id, 'Water is attributed to the first list');
echo "PASS: merge on create\n";

$beach = $runtime->create('PermanentList', ['title' => 'Beach']);
$runtime->create('ListItem', ['name' => 'water', 'list' => (string) $beach->id]);
$runtime->update('Checklist', $trip->id, ['sourceLists' => [(string) $camping->id, (string) $hiking->id, (string) $beach->id]]);
check(count($namesOn($trip->id)) === 4, 'Beach adds nothing when its only item is a case-insensitive duplicate');
echo "PASS: case-insensitive dedupe\n";

$unchecked = array_map(fn ($item) => $item->getChecked(), $runtime->find('Checklist', $trip->id)->items()->all());
check($unchecked === [false, false, false, false], 'Every copied item starts unchecked');
echo "PASS: all new items unchecked\n";

$camp = $runtime->create('Checklist', ['title' => 'Camp', 'sourceLists' => [(string) $camping->id]]);
check(count($namesOn($camp->id)) === 3, 'A checklist from Camping alone has 3 items');
$runtime->update('Checklist', $camp->id, ['sourceLists' => [(string) $camping->id, (string) $hiking->id]]);
check(count($namesOn($camp->id)) === 4, 'Adding Hiking later copies its items');
echo "PASS: add a list later\n";

$runtime->update('Checklist', $trip->id, ['sourceLists' => [(string) $hiking->id]]);
check($namesOn($trip->id) === ['Boots'], 'Removing Camping removes its items and does not re-add Hiking\'s Water');
echo "PASS: remove a list\n";

$runtime->create('ChecklistItem', ['name' => 'Snacks', 'checklist' => (string) $trip->id]);
$runtime->update('Checklist', $trip->id, ['sourceLists' => []]);
check($namesOn($trip->id) === ['Snacks'], 'Ad-hoc items survive when their source list is removed');
echo "PASS: ad-hoc items survive\n";

$before = $namesOn($trip->id);
$runtime->update('Checklist', $trip->id, ['title' => 'Renamed trip']);
check($namesOn($trip->id) === $before, 'Renaming a checklist does not change its items');
echo "PASS: renaming is a no-op\n";

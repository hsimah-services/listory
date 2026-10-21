<?php

declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';

use Listory\Standalone\{Application, Viewer, Schema};
use Eleph\SQLite\Database;

function check(bool $condition, string $message): void { if (!$condition) throw new RuntimeException($message); }
$db = new Database(':memory:');
Schema::install($db);
$app = new Application($db, new Viewer('1', 'editor'));
$runtime = $app->runtime;

$completedAt = fn ($id) => $runtime->find('Checklist', $id)->getCompletedAt();

$empty = $runtime->create('Checklist', ['title' => 'Empty']);
check($completedAt($empty->id) === null, 'A checklist with no items is not complete');
echo "PASS: empty is not complete\n";

$two = $runtime->create('Checklist', ['title' => 'Two']);
$first = $runtime->create('ChecklistItem', ['name' => 'Tent', 'checklist' => (string) $two->id]);
$second = $runtime->create('ChecklistItem', ['name' => 'Torch', 'checklist' => (string) $two->id]);
$runtime->update('ChecklistItem', $first->id, ['checked' => true]);
check($completedAt($two->id) === null, 'Checking one of two items leaves the checklist incomplete');
$runtime->update('ChecklistItem', $second->id, ['checked' => true]);
check($completedAt($two->id) !== null, 'Checking the last item completes the checklist');
echo "PASS: checking the last item completes\n";

$stamp = $completedAt($two->id);
$runtime->update('Checklist', $two->id, ['title' => 'Renamed']);
check($completedAt($two->id) == $stamp, 'Renaming a complete checklist keeps its completedAt');
echo "PASS: completedAt is stable\n";

$runtime->update('ChecklistItem', $first->id, ['checked' => false]);
check($completedAt($two->id) === null, 'Unchecking an item clears completedAt');
echo "PASS: unchecking clears\n";

$lists = fn (array $ids): array => array_map('strval', $ids);
$listA = $runtime->create('PermanentList', ['title' => 'A']);
$runtime->create('ListItem', ['name' => 'Apple', 'list' => (string) $listA->id]);
$listB = $runtime->create('PermanentList', ['title' => 'B']);
$runtime->create('ListItem', ['name' => 'Banana', 'list' => (string) $listB->id]);
$listC = $runtime->create('PermanentList', ['title' => 'C']);
$runtime->create('ListItem', ['name' => 'Cherry', 'list' => (string) $listC->id]);

$reopen = $runtime->create('Checklist', ['title' => 'Reopen', 'sourceLists' => $lists([$listA->id])]);
$runtime->update('ChecklistItem', $runtime->find('Checklist', $reopen->id)->items()->all()[0]->getId(), ['checked' => true]);
check($completedAt($reopen->id) !== null, 'A checklist whose only item is checked is complete');
$runtime->update('Checklist', $reopen->id, ['sourceLists' => $lists([$listA->id, $listC->id])]);
check($completedAt($reopen->id) === null, 'Adding a list with new unchecked items re-opens the checklist');
echo "PASS: adding a list re-opens\n";

$merge = $runtime->create('Checklist', ['title' => 'Merge', 'sourceLists' => $lists([$listA->id, $listB->id])]);
foreach ($runtime->find('Checklist', $merge->id)->items()->all() as $item) {
    if ($item->getSourceList()?->getId() == $listA->id) {
        $runtime->update('ChecklistItem', $item->getId(), ['checked' => true]);
    }
}
check($completedAt($merge->id) === null, 'Checking only list A leaves list B unchecked');
$runtime->update('Checklist', $merge->id, ['sourceLists' => $lists([$listA->id])]);
check($completedAt($merge->id) !== null, 'Removing the unchecked list completes the checklist');
echo "PASS: removing the unchecked list completes\n";

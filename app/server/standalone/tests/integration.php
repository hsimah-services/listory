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

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

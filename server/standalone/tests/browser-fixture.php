<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

use Eleph\SQLite\Database;
use Listory\Standalone\{Application, Schema, Viewer};

$path = getenv('LISTORY_DB');
// Only a file directly inside /tmp with a listory- name may be deleted, so a stray value cannot touch real data.
if (!$path || dirname($path) !== '/tmp' || !str_starts_with(basename($path), 'listory-')) {
    throw new RuntimeException('Browser fixtures require an isolated /tmp/listory- database.');
}
// Every run starts from an empty database, so running the fixture twice does not collide with its own accounts.
foreach ([$path, $path . '-wal', $path . '-shm', $path . '-journal'] as $file) {
    if (is_file($file)) unlink($file);
}

$db = new Database($path);
Schema::install($db);
foreach (['editor1' => 'editor', 'reader1' => 'reader'] as $username => $role) {
    $db->insert('listory_users', ['username' => $username, 'role' => $role, 'password_hash' => password_hash('correct horse battery', PASSWORD_DEFAULT)]);
}

$app = new Application($db, new Viewer('1', 'editor'));
$lists = [
    'Camping' => ['Tent', 'Torch', 'Water'],
    'Hiking' => ['Water', 'Boots'],
];
foreach ($lists as $title => $items) {
    $list = $app->runtime->create('PermanentList', ['title' => $title]);
    foreach ($items as $name) {
        $app->runtime->create('ListItem', ['name' => $name, 'list' => (string) $list->id]);
    }
}

<?php

declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';

use Listory\Standalone\{Schema, User};
use Eleph\SQLite\Database;

function check(bool $condition, string $message): void { if (!$condition) throw new RuntimeException($message); }
function fails(callable $fn, string $message): void {
    try { $fn(); } catch (Throwable) { return; }
    throw new RuntimeException($message);
}

/** Runs the CLI with a temp database and returns the exit code and combined output. */
function cli(string $path, array $args, ?string $stdin): array {
    $process = proc_open(array_merge([PHP_BINARY, 'standalone/cli.php'], $args), [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes, dirname(__DIR__, 2), [...getenv(), 'LISTORY_DB' => $path]);
    fwrite($pipes[0], $stdin ?? '');
    fclose($pipes[0]);
    $output = stream_get_contents($pipes[1]) . stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    return [proc_close($process), $output];
}

$dir = sys_get_temp_dir() . '/listory-accounts-' . bin2hex(random_bytes(5));
mkdir($dir, 0700);
$path = $dir . '/listory.sqlite';
$password = 'correct horse battery';

$db = new Database(':memory:');
Schema::install($db);
check((int) $db->scalar('SELECT COUNT(*) FROM listory_users') === 0, 'The accounts table starts empty');
echo "PASS: table exists\n";

Schema::install($db);
echo "PASS: install is idempotent\n";

$file = new Database($path);
Schema::install($file);
unset($file);

[$code, $output] = cli($path, ['user:add', 'alice', 'editor'], $password . "\n");
check($code === 0, 'user:add exits 0: ' . $output);
check(!str_contains($output, $password), 'user:add does not print the password');
$rows = (new Database($path))->select('SELECT username, role FROM listory_users');
check(count($rows) === 1 && $rows[0]['role'] === 'editor', 'user:add stores one editor');
echo "PASS: cli adds a user\n";

[$code] = cli($path, ['user:add', 'bob', 'reader'], 'short');
check($code !== 0, 'A short password exits non-zero');
check((int) (new Database($path))->scalar('SELECT COUNT(*) FROM listory_users') === 1, 'A short password adds no row');
echo "PASS: short password rejected\n";

[$code] = cli($path, ['user:add', 'carol', 'admin'], $password . "\n");
check($code !== 0, 'An unknown role exits non-zero');
echo "PASS: bad role rejected\n";

[$code] = cli($path, ['user:add', 'ALICE', 'reader'], $password . "\n");
check($code !== 0, 'A duplicate username (case-insensitive) exits non-zero');
echo "PASS: duplicate username rejected\n";

$users = new Database($path);
$alice = User::authenticate($users, 'alice', $password);
check($alice !== null && $alice->role === 'editor' && $alice->sessionVersion === 0, 'The right password authenticates alice');
check(User::authenticate($users, 'alice', 'wrong horse battery') === null, 'A wrong password is rejected');
check(User::findEnabled($users, 'ALICE') !== null, 'Usernames match case-insensitively');
echo "PASS: password verifies\n";

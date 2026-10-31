<?php

declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';

use Listory\Standalone\Schema;
use Eleph\SQLite\Database;

// Needs a built client (app/client/dist). Run with `composer test:spa`, not as part of `composer test`.
function ensure(bool $ok, string $label): void { if (!$ok) throw new RuntimeException($label); }
$cookies = [];
function request(string $address, string $path, string $method = 'GET', ?string $body = null, array $headers = []): array {
    global $cookies;
    $cookie = implode('; ', array_map(fn ($name, $value) => "$name=$value", array_keys($cookies), $cookies));
    $context = stream_context_create(['http'=>['method'=>$method,'header'=>implode("\r\n", [...$headers, 'Cookie: '.$cookie, 'Connection: close']),'content'=>$body ?? '','ignore_errors'=>true,'follow_location'=>0,'timeout'=>10]]);
    $response = file_get_contents('http://'.$address.$path, false, $context);
    if ($response === false || !isset($http_response_header[0])) throw new RuntimeException('No HTTP response for ' . $method . ' ' . $path);
    foreach ($http_response_header as $header) if (preg_match('/^Set-Cookie: ([^=]+)=([^;]*)/i', $header, $m)) $cookies[$m[1]] = $m[2];
    preg_match('/\s(\d{3})\s/', $http_response_header[0], $m);
    return [(int) $m[1], $response, $http_response_header];
}

$dir = sys_get_temp_dir() . '/listory-spa-' . bin2hex(random_bytes(5)); mkdir($dir, 0700);
$db = new Database($dir . '/listory.sqlite'); Schema::install($db);
$password = 'correct horse battery';
$db->insert('listory_users', ['username' => 'editor1', 'role' => 'editor', 'password_hash' => password_hash($password, PASSWORD_DEFAULT)]);
$address = '127.0.0.1:18476';
$command = [PHP_BINARY, '-S', $address, 'standalone/public/router.php'];
$process = proc_open($command, [0=>['pipe','r'],1=>['file',$dir.'/spa.log','a'],2=>['file',$dir.'/spa.log','a']], $pipes, dirname(__DIR__, 2),
    [...getenv(), 'LISTORY_DB'=>$dir.'/listory.sqlite','LISTORY_SESSION_PATH'=>$dir,'LISTORY_ORIGIN'=>'http://'.$address]);
try {
    $started = false;
    for ($i=0;$i<100 && !$started;$i++) { $ready=@stream_socket_client('tcp://'.$address,$errno,$error,.1); if ($ready) { fclose($ready); $started = true; } else usleep(20000); }
    ensure($started, 'Server did not start on ' . $address);

    [, $loginForm] = request($address, '/auth/login');
    ensure(preg_match('/name="csrf" value="([^"]+)"/', $loginForm, $m) === 1, 'Login form has no CSRF token');
    [$loginStatus] = request($address, '/auth/login', 'POST', http_build_query(['csrf' => $m[1], 'username' => 'editor1', 'password' => $password]), ['Content-Type: application/x-www-form-urlencoded']);
    ensure($loginStatus === 303, 'Sign-in did not redirect');

    [$status, $html, $headers] = request($address, '/');
    ensure($status === 200 && str_contains(implode("\n", $headers), 'Content-Type: text/html'), 'Root returns HTML: ' . $status);
    ensure(str_contains($html, '<div id="root">'), 'Root has no #root container');
    echo "PASS: html shell\n";

    ensure(str_contains($html, 'id="tsquid-data"') && str_contains($html, 'HomePageQuery'), 'Signed-in root has no initial route data');
    echo "PASS: initial data\n";

    $cookies = [];
    [$status, $html] = request($address, '/');
    ensure($status === 200 && !str_contains($html, 'tsquid-data'), 'Signed-out root includes initial data');
    echo "PASS: signed out has no data\n";

    [$status, $body] = request($address, '/nope');
    ensure($status === 404 && json_decode($body, true) === ['error' => 'Not found.'], 'Unknown route: ' . $body);
    echo "PASS: unknown route\n";
} catch (Throwable $error) {
    fwrite(STDERR, file_get_contents($dir . '/spa.log'));
    throw $error;
} finally {
    proc_terminate($process); proc_close($process);
    foreach (glob($dir.'/*') as $file) unlink($file); rmdir($dir);
}

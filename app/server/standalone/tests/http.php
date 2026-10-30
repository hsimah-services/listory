<?php

declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';

use Listory\Standalone\Schema;
use Eleph\SQLite\Database;

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

$dir = sys_get_temp_dir() . '/listory-http-' . bin2hex(random_bytes(5)); mkdir($dir, 0700);
$db = new Database($dir . '/listory.sqlite'); Schema::install($db);
$password = 'correct horse battery';
$db->insert('listory_users', ['username' => 'editor1', 'role' => 'editor', 'password_hash' => password_hash($password, PASSWORD_DEFAULT)]);
$address = '127.0.0.1:18475';
$command = [PHP_BINARY, '-S', $address, 'standalone/public/router.php'];
$process = proc_open($command, [0=>['pipe','r'],1=>['file',$dir.'/http.log','a'],2=>['file',$dir.'/http.log','a']], $pipes, dirname(__DIR__, 2),
    [...getenv(), 'LISTORY_DB'=>$dir.'/listory.sqlite','LISTORY_SESSION_PATH'=>$dir,'LISTORY_ORIGIN'=>'http://'.$address]);
try {
    $started = false;
    for ($i=0;$i<100 && !$started;$i++) { $ready=@stream_socket_client('tcp://'.$address,$errno,$error,.1); if ($ready) { fclose($ready); $started = true; } else usleep(20000); }
    ensure($started, 'Server did not start on ' . $address);

    [$status, $body] = request($address, '/healthz');
    ensure($status === 200 && json_decode($body, true) === ['ok' => true], 'Health endpoint: ' . $body);
    echo "PASS: healthz\n";

    [$status] = request($address, '/graphql', 'POST', '{"query":"{ listoryLists(first:1){ totalCount } }"}', ['Content-Type: application/json']);
    ensure($status === 401, 'Signed-out GraphQL returns 401');
    echo "PASS: signed-out graphql\n";

    [$status, $body] = request($address, '/auth/session');
    $session = json_decode($body, true);
    ensure($status === 200 && $session['userId'] === '0' && $session['nonce'] === null, 'Signed-out session: ' . $body);
    echo "PASS: session when signed out\n";

    [$status, $html] = request($address, '/auth/login');
    ensure($status === 200 && str_contains($html, 'Sign in to Listory') && preg_match('/name="csrf" value="([^"]+)"/', $html, $m) === 1, 'Login form: ' . $html);
    $formCsrf = $m[1];
    echo "PASS: login form\n";

    [$status] = request($address, '/auth/login', 'POST', http_build_query(['csrf' => $formCsrf, 'username' => 'editor1', 'password' => 'wrong horse battery']), ['Content-Type: application/x-www-form-urlencoded']);
    ensure($status === 401, 'Wrong password returns 401');
    echo "PASS: bad login\n";

    [$status, , $headers] = request($address, '/auth/login', 'POST', http_build_query(['csrf' => $formCsrf, 'username' => 'editor1', 'password' => $password]), ['Content-Type: application/x-www-form-urlencoded']);
    ensure($status === 303 && in_array('Location: /', $headers, true), 'Good login redirects to root');
    echo "PASS: good login\n";

    [$status, $body] = request($address, '/auth/session');
    $session = json_decode($body, true);
    ensure($status === 200 && $session['userId'] !== '0' && $session['nonce'] !== null && $session['canWrite'] === true, 'Signed-in session: ' . $body);
    $nonce = $session['nonce'];
    echo "PASS: session when signed in\n";

    $graphqlHeaders = ['Content-Type: application/json', 'X-Listory-CSRF: ' . $nonce];
    $query = json_encode(['query' => '{ listoryLists(first:1){ totalCount } }']);
    [$status, $body] = request($address, '/graphql', 'POST', $query, $graphqlHeaders);
    ensure($status === 200 && json_decode($body, true)['data']['listoryLists']['totalCount'] === 0, 'GraphQL query: ' . $body);
    echo "PASS: graphql\n";

    [$status] = request($address, '/graphql', 'POST', $query, ['Content-Type: application/json']);
    ensure($status === 403, 'Authenticated GraphQL without CSRF returns 403');
    [$status] = request($address, '/graphql', 'POST', $query, $graphqlHeaders);
    ensure($status === 200, 'Authenticated GraphQL with CSRF returns 200');
    echo "PASS: graphql needs csrf\n";

    [$status] = request($address, '/graphql');
    ensure($status === 405, 'GraphQL GET rejected');
    echo "PASS: GET rejected\n";

    [$status] = request($address, '/graphql', 'POST', '{"query":"{ listoryLists(first:1){ totalCount } }"}', ['Content-Type: text/plain', 'X-Listory-CSRF: ' . $nonce]);
    ensure($status === 415, 'Non-JSON POST rejected');
    echo "PASS: non-JSON rejected\n";

    [$status] = request($address, '/nope');
    ensure($status === 404, 'Unknown path returns 404');
    echo "PASS: unknown path\n";

    [$status, $body] = request($address, '/auth/logout', 'POST', null, ['X-Listory-CSRF: ' . $nonce]);
    ensure($status === 200 && json_decode($body, true) === ['success' => true], 'Logout: ' . $body);
    [$status] = request($address, '/graphql', 'POST', $query, $graphqlHeaders);
    ensure($status === 401, 'GraphQL after logout returns 401');
    echo "PASS: logout\n";
} catch (Throwable $error) {
    fwrite(STDERR, file_get_contents($dir . '/http.log'));
    throw $error;
} finally {
    proc_terminate($process); proc_close($process);
    foreach (glob($dir.'/*') as $file) unlink($file); rmdir($dir);
}

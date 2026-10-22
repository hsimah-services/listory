<?php

declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';

use Listory\Standalone\Schema;
use Eleph\SQLite\Database;

function ensure(bool $ok, string $label): void { if (!$ok) throw new RuntimeException($label); }
function request(string $address, string $path, string $method = 'GET', ?string $body = null, array $headers = []): array {
    $context = stream_context_create(['http'=>['method'=>$method,'header'=>implode("\r\n", [...$headers, 'Connection: close']),'content'=>$body ?? '','ignore_errors'=>true,'timeout'=>10]]);
    $response = file_get_contents('http://'.$address.$path, false, $context);
    if ($response === false || !isset($http_response_header[0])) throw new RuntimeException('No HTTP response for ' . $method . ' ' . $path);
    preg_match('/\s(\d{3})\s/', $http_response_header[0], $m);
    return [(int) $m[1], $response];
}

$dir = sys_get_temp_dir() . '/listory-http-' . bin2hex(random_bytes(5)); mkdir($dir, 0700);
$db = new Database($dir . '/listory.sqlite'); Schema::install($db);
$address = '127.0.0.1:18475';
$command = [PHP_BINARY, '-S', $address, 'standalone/public/router.php'];
$process = proc_open($command, [0=>['pipe','r'],1=>['file',$dir.'/http.log','a'],2=>['file',$dir.'/http.log','a']], $pipes, dirname(__DIR__, 2),
    [...getenv(), 'LISTORY_DB'=>$dir.'/listory.sqlite','LISTORY_SESSION_PATH'=>$dir,'LISTORY_ORIGIN'=>'http://'.$address]);
try {
    for ($i=0;$i<100;$i++) { $ready=@stream_socket_client('tcp://'.$address,$errno,$error,.1); if ($ready) { fclose($ready); break; } usleep(20000); }

    [$status, $body] = request($address, '/healthz');
    ensure($status === 200 && json_decode($body, true) === ['ok' => true], 'Health endpoint: ' . $body);
    echo "PASS: healthz\n";

    [$status, $body] = request($address, '/graphql', 'POST', json_encode(['query' => '{ listoryLists(first:1){ totalCount } }']), ['Content-Type: application/json']);
    ensure($status === 200 && json_decode($body, true)['data']['listoryLists']['totalCount'] === 0, 'GraphQL query: ' . $body);
    echo "PASS: graphql\n";

    [$status] = request($address, '/graphql');
    ensure($status === 405, 'GraphQL GET rejected');
    echo "PASS: GET rejected\n";

    [$status] = request($address, '/graphql', 'POST', '{"query":"{ listoryLists(first:1){ totalCount } }"}', ['Content-Type: text/plain']);
    ensure($status === 415, 'Non-JSON POST rejected');
    echo "PASS: non-JSON rejected\n";

    [$status] = request($address, '/nope');
    ensure($status === 404, 'Unknown path returns 404');
    echo "PASS: unknown path\n";
} catch (Throwable $error) {
    fwrite(STDERR, file_get_contents($dir . '/http.log'));
    throw $error;
} finally {
    proc_terminate($process); proc_close($process);
    foreach (glob($dir.'/*') as $file) unlink($file); rmdir($dir);
}

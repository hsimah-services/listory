<?php

declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';

use Listory\Standalone\{Application, GraphQL as ListoryGraphQL, Schema, Viewer};
use Eleph\SQLite\Database;
use GraphQL\GraphQL;
use GraphQL\Validator\Rules\{QueryDepth, QueryComplexity};

header('Cache-Control: private, no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('X-Frame-Options: DENY');
function jsonResponse(array $body, int $status = 200): never {
    http_response_code($status); header('Content-Type: application/json');
    echo json_encode($body, JSON_THROW_ON_ERROR); exit;
}
function escape(string $text): string { return htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); }
try {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $method = $_SERVER['REQUEST_METHOD'];
    $db = new Database(getenv('LISTORY_DB') ?: '/var/lib/listory/listory.sqlite');
    Schema::requireReady($db);
    if ($path === '/healthz') jsonResponse(['ok' => true]);
    // TODO(auth): replaced by Session::viewer() in the sessions issue.
    $viewer = new Viewer('1', 'editor');
    if ($path === '/graphql') {
        if ($method !== 'POST') jsonResponse(['error' => 'POST required.'], 405);
        if (!str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) jsonResponse(['error' => 'JSON required.'], 415);
        $raw = file_get_contents('php://input', length: 65537);
        if (strlen($raw) > 65536) jsonResponse(['error' => 'Request too large.'], 413);
        try { $body = json_decode($raw, true, 64, JSON_THROW_ON_ERROR); }
        catch (JsonException) { jsonResponse(['error' => 'Invalid JSON.'], 400); }
        if (!is_array($body) || !is_string($body['query'] ?? null) || (isset($body['variables']) && !is_array($body['variables'])) || (isset($body['operationName']) && !is_string($body['operationName']))) jsonResponse(['error' => 'Invalid GraphQL request.'], 400);
        $app = new Application($db, $viewer);
        $result = GraphQL::executeQuery(ListoryGraphQL::schema($app), $body['query'], variableValues: $body['variables'] ?? null,
            operationName: $body['operationName'] ?? null, validationRules: [...\GraphQL\Validator\DocumentValidator::allRules(), new QueryDepth(12), new QueryComplexity(500)]);
        jsonResponse($result->toArray());
    }
    jsonResponse(['error' => 'Not found.'], 404);
} catch (Throwable $error) {
    error_log((string) $error);
    jsonResponse(['error' => 'Listory could not complete this request.'], 500);
}

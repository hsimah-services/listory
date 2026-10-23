<?php

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

use Listory\Standalone\{Schema, Viewer, Application, GraphQL};
use Eleph\SQLite\Database;

try {
    $path = getenv('LISTORY_DB') ?: '/var/lib/listory/listory.sqlite';
    $db = new Database($path);
    switch ($argv[1] ?? '') {
        case 'install': Schema::install($db); echo "SQLite schema ready.\n"; break;
        case 'schema':
            Schema::requireReady($db);
            echo \GraphQL\Utils\SchemaPrinter::doPrint(GraphQL::schema(new Application($db, new Viewer()))); break;
        default: throw new RuntimeException('Commands: install | schema');
    }
} catch (Throwable $error) { fwrite(STDERR, $error->getMessage() . "\n"); exit(1); }

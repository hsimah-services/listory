<?php

declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';
$db = new Eleph\SQLite\Database(':memory:');
Listory\Standalone\Schema::install($db);
$schema = Listory\Standalone\GraphQL::schema(new Listory\Standalone\Application($db, new Listory\Standalone\Viewer()));
$schema->assertValid();
$printed = rtrim(preg_replace('/[ \t]+$/m', '', GraphQL\Utils\SchemaPrinter::doPrint($schema))) . "\n";
$target = dirname(__DIR__, 3) . '/client/schema.graphql';
if (in_array('--check', $argv, true)) {
    if (!is_file($target) || file_get_contents($target) !== $printed) { fwrite(STDERR, "Standalone GraphQL schema has drifted.\n"); exit(1); }
} else { file_put_contents($target, $printed); }

<?php

declare(strict_types=1);
namespace Listory\Standalone;

use Eleph\SQLite\Database;
use GraphQL\GraphQL as Executor;
use GraphQL\Validator\DocumentValidator;
use GraphQL\Validator\Rules\{QueryDepth, QueryComplexity};

final class InitialRouteData
{
    public static function execute(Database $db, Viewer $viewer, string $text, array $variables, string $operation): array
    {
        $schema = GraphQL::schema(new Application($db, $viewer));
        // Resolve every type before execution, as index.php does. Without this, php -S can crash inside executeQuery.
        $schema->assertValid();
        return Executor::executeQuery(
            $schema, $text, variableValues: $variables,
            operationName: $operation,
            validationRules: [...DocumentValidator::allRules(), new QueryDepth(12), new QueryComplexity(500)],
        )->toArray();
    }
}

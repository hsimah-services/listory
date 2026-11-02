<?php

declare(strict_types=1);
namespace Listory\Standalone;

use Eleph\GraphQL\SchemaBuilder;
use Eleph\GraphQL\Registration\{TypeRegistrar, MutationRegistrar};
use Eleph\GraphQL\Relay\GlobalId;
use Eleph\Runtime\Identity\EntityId;
use GraphQL\Error\UserError;
use GraphQL\Type\Schema;

final class GraphQL
{
    public static function id(mixed $value, string $type): ?EntityId
    {
        if ($value === null) return null;
        $decoded = GlobalId::decode((string) $value);
        if ($decoded && $decoded->type !== $type) throw new UserError('Expected an ID for ' . $type . '.');
        $raw = $decoded?->id ?? (string) $value;
        if (!preg_match('/^[1-9][0-9]*$/D', $raw)) throw new UserError('Invalid entity ID.');
        return EntityId::of($raw);
    }

    private static function assertForwardPage(array $args): void
    {
        if (isset($args['last']) || isset($args['before'])) throw new UserError('Only forward pagination is supported.');
        if (isset($args['first']) && ($args['first'] < 1 || $args['first'] > 100)) throw new UserError('first must be between 1 and 100.');
        if (isset($args['after']) && !preg_match('/^offset:[0-9]+$/D', base64_decode($args['after'], true) ?: '')) throw new UserError('Invalid pagination cursor.');
    }

    public static function schema(Application $app): Schema
    {
        $manifest = require dirname(__DIR__, 2) . '/generated/graphql/graphql-manifest.php';
        $builder = new SchemaBuilder();
        $registrar = new TypeRegistrar($manifest, $app->runtime);
        $builder->interface('Node', ['id' => ['type' => ['non_null' => 'ID']]], static function ($node) use ($builder, $manifest) {
            foreach ($manifest->objects as $object) {
                $class = 'Listory\\Entity\\' . $object->entity . '\\' . $object->entity;
                if ($node instanceof $class) return $builder->type($object->name);
            }
            return null;
        });
        $builder->object('PageInfo', ['fields' => [
            'hasNextPage' => ['type' => ['non_null' => 'Boolean']], 'hasPreviousPage' => ['type' => ['non_null' => 'Boolean']],
            'startCursor' => ['type' => 'String'], 'endCursor' => ['type' => 'String'],
        ]]);
        foreach ($registrar->enumConfigs() as $name => $config) $builder->enum($name, $config);
        foreach ($registrar->objectConfigs() as $name => $config) $builder->object($name, $config);
        foreach ($registrar->rootFieldConfigs() as $config) $builder->field('RootQuery', $config['name'], $config['field']);
        foreach ($registrar->connectionConfigs() as $config) {
            $resolve = $config['resolve'];
            $config['resolve'] = static function ($source, array $args) use ($resolve) {
                self::assertForwardPage($args);
                // Search filters arrive under `where`; the resolver reads them as top-level args.
                return $resolve($source, array_replace($args, $args['where'] ?? []));
            };
            $builder->connection($config);
        }
        foreach ((new MutationRegistrar($manifest, $app->runtime))->configs() as $name => $config) $builder->mutation($name, $config);
        $builder->field('RootQuery', 'node', ['type' => 'Node', 'args' => ['id' => ['type' => ['non_null' => 'ID']]], 'resolve' => static function ($source, $args) use ($app, $manifest) {
            $id = GlobalId::decode($args['id']);
            if (!$id || !isset($manifest->objects[$id->type])) throw new UserError('Invalid node ID.');
            return $app->runtime->find($manifest->objects[$id->type]->entity, self::id($args['id'], $id->type));
        }]);
        return $builder->build();
    }
}

<?php

declare(strict_types=1);

namespace Listory\Query;

use Eleph\Runtime\Gateway\EntityGateway;
use Eleph\Runtime\Policy\ViewerProvider;
use Eleph\Runtime\Query\EntityQuery;
use Eleph\SQLite\Database;
use InvalidArgumentException;

/** Fixed SQL identifiers, parameterized values, and no joins that duplicate entities. */
final readonly class ListoryQueries
{
    /** @var array<string, string> Trusted, quoted names from the generated schema. */
    private array $tables;

    public function __construct(private Database $db, private EntityGateway $gateway, private ViewerProvider $viewers)
    {
        $manifest = require dirname(__DIR__, 2) . '/generated/sqlite/storage-manifest.php';
        $tables = [];
        foreach ($manifest->tables as $entity => $table) {
            $tables[$entity] = Database::identifier($table->name);
        }
        $this->tables = $tables;
    }

    public function search(string $entity, ?string $term = null, ?bool $completed = null): EntityQuery
    {
        $tables = $this->tables;
        if (!isset($tables[$entity])) {
            throw new InvalidArgumentException('Unknown entity for search.');
        }
        $from = $tables[$entity] . ' e';
        $where = ['1=1'];
        $bindings = [];
        $term = trim($term ?? '');
        if ('' !== $term) {
            $where[] = 'e.title LIKE ? ESCAPE \'\\\'';
            $bindings[] = '%' . addcslashes(mb_substr($term, 0, 200), '\\%_') . '%';
        }
        if ('Checklist' === $entity && null !== $completed) {
            $where[] = $completed ? 'e.completed_at IS NOT NULL' : 'e.completed_at IS NULL';
        }
        return new SqlEntityQuery($this->db, $this->gateway, $this->viewers, $entity, $from,
            implode(' AND ', $where), $bindings, 'e.title COLLATE NOCASE ASC, e.id ASC');
    }
}

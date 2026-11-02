<?php

declare(strict_types=1);

namespace Listory\Contract;

use Eleph\Runtime\Query\EntityQuery;
use Listory\Entity\Checklist\Contract\ChecklistSearchQuery;
use Listory\Query\ListoryQueries;

final readonly class ChecklistSearch implements ChecklistSearchQuery
{
    public function __construct(private ListoryQueries $queries) {}

    public function find(?string $term = null, ?bool $completed = null): EntityQuery
    {
        return $this->queries->search('Checklist', $term, $completed);
    }
}

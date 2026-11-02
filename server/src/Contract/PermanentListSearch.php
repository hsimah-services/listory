<?php

declare(strict_types=1);

namespace Listory\Contract;

use Eleph\Runtime\Query\EntityQuery;
use Listory\Entity\PermanentList\Contract\PermanentListSearchQuery;
use Listory\Query\ListoryQueries;

final readonly class PermanentListSearch implements PermanentListSearchQuery
{
    public function __construct(private ListoryQueries $queries) {}

    public function find(?string $term = null): EntityQuery
    {
        return $this->queries->search('PermanentList', $term);
    }
}

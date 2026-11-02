<?php

declare(strict_types=1);

namespace Listory\Contract;

use Eleph\Runtime\Policy\PolicyDecision;
use Eleph\Runtime\Policy\Viewer;
use Eleph\Runtime\Policy\WriteContext;
use Listory\Entity\Pattern\ListoryRecord\Contract\ListoryRecordEditorWritePolicy;
use Listory\Entity\Pattern\ListoryRecord\ListoryRecord;

/** Only editors may change lists and checklists. */
final readonly class EditorsMayWrite implements ListoryRecordEditorWritePolicy
{
    public function decide(?ListoryRecord $entity, WriteContext $context, Viewer $viewer): PolicyDecision
    {
        return $viewer->can('listory.write')
            ? PolicyDecision::allow()
            : PolicyDecision::deny('Only editors can change lists.');
    }
}

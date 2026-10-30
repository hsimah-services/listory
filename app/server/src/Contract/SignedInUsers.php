<?php

declare(strict_types=1);

namespace Listory\Contract;

use Eleph\Runtime\Policy\PolicyDecision;
use Eleph\Runtime\Policy\Viewer;
use Listory\Entity\Pattern\ListoryRecord\Contract\ListoryRecordSignedInReadPolicy;
use Listory\Entity\Pattern\ListoryRecord\ListoryRecord;

final readonly class SignedInUsers implements ListoryRecordSignedInReadPolicy
{
    public function decide(ListoryRecord $entity, Viewer $viewer): PolicyDecision
    {
        return self::allows($viewer)
            ? PolicyDecision::allow()
            : PolicyDecision::deny('Sign in to read your lists.');
    }

    /** Listory's read policy is uniform across rows; aggregates use the same gate. */
    public static function allows(Viewer $viewer): bool
    {
        return $viewer->isAuthenticated();
    }
}

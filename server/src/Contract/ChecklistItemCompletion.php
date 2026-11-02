<?php

declare(strict_types=1);

namespace Listory\Contract;

use Eleph\Runtime\Gateway\EntityGateway;
use Eleph\Runtime\Identity\EntityId;
use Listory\Checklist\ChecklistCompletion;
use Listory\Entity\ChecklistItem\ChecklistItem;
use Listory\Entity\ChecklistItem\ChecklistItemMutationContext;
use Listory\Entity\ChecklistItem\Contract\ChecklistItemCompletionSideEffect;
use LogicException;

/** Recompute the parent checklist's completedAt after an item is created or changed. */
final readonly class ChecklistItemCompletion implements ChecklistItemCompletionSideEffect
{
    public function __construct(
        private EntityGateway $gateway,
        private ChecklistCompletion $completion,
    ) {
    }

    public function handle(ChecklistItemMutationContext $context): void
    {
        $id = $context->id();
        if (!$id instanceof EntityId) {
            throw new LogicException('A committed checklist item has a persisted id.');
        }

        $item = $this->gateway->find('ChecklistItem', $id);
        if (!$item instanceof ChecklistItem) {
            return;
        }

        $checklist = $item->getChecklist();
        if (null !== $checklist) {
            $this->completion->refresh($checklist->getId());
        }
    }
}

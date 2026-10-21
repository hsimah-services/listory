<?php

declare(strict_types=1);

namespace Listory\Checklist;

use DateTimeImmutable;
use DateTimeZone;
use Eleph\Runtime\Gateway\EntityGateway;
use Eleph\Runtime\Identity\EntityId;
use Listory\Entity\Checklist\Checklist;

/**
 * Keep a checklist's completedAt in step with its items.
 *
 * A checklist is complete when it has at least one item and every item is checked. The
 * moment it first became complete is kept until it becomes incomplete again. Writes happen
 * only when the value changes, so the side effects that call this cannot trigger each other
 * forever.
 */
final readonly class ChecklistCompletion
{
    public function __construct(private EntityGateway $gateway)
    {
    }

    /** Recompute completedAt for one checklist; writes only when the value changes. */
    public function refresh(EntityId $checklistId): void
    {
        $checklist = $this->gateway->find('Checklist', $checklistId);
        if (!$checklist instanceof Checklist) {
            return;
        }

        $items = $checklist->items()->all();
        $complete = [] !== $items;
        foreach ($items as $item) {
            if (!$item->getChecked()) {
                $complete = false;

                break;
            }
        }

        $completedAt = $checklist->getCompletedAt();
        if ($complete && null === $completedAt) {
            $this->gateway->update('Checklist', $checklistId, [
                'completedAt' => new DateTimeImmutable('now', new DateTimeZone('UTC')),
            ]);
        } elseif (!$complete && null !== $completedAt) {
            $this->gateway->update('Checklist', $checklistId, ['completedAt' => null]);
        }
    }
}

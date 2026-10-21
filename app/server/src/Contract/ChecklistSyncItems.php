<?php

declare(strict_types=1);

namespace Listory\Contract;

use Eleph\Runtime\Gateway\EntityGateway;
use Eleph\Runtime\Identity\EntityId;
use Listory\Entity\Checklist\Checklist;
use Listory\Entity\Checklist\ChecklistMutationContext;
use Listory\Entity\Checklist\Contract\ChecklistSyncItemsSideEffect;
use Listory\Entity\ChecklistItem\ChecklistItem;
use Listory\Entity\ListItem\ListItem;
use Listory\Entity\PermanentList\PermanentList;
use LogicException;

/**
 * Keep a checklist's items in step with its source lists, after the change is committed.
 *
 * Idempotent: a second run finds every source list already represented and every
 * removed list already gone, so it writes nothing.
 */
final readonly class ChecklistSyncItems implements ChecklistSyncItemsSideEffect
{
    public function __construct(private EntityGateway $gateway)
    {
    }

    public function handle(ChecklistMutationContext $context): void
    {
        $id = $context->id();
        if (!$id instanceof EntityId) {
            throw new LogicException('A committed checklist has a persisted id.');
        }

        $checklist = $this->gateway->find('Checklist', $id);
        if (!$checklist instanceof Checklist) {
            return;
        }

        $sourceLists = $checklist->sourceLists()->all();
        $currentSources = [];
        foreach ($sourceLists as $list) {
            $currentSources[(string) $list->getId()] = true;
        }

        // Remove before merging, so a removed list's names do not block a re-added list.
        $items = $checklist->items()->all();
        $remaining = [];
        foreach ($items as $item) {
            $source = $item->getSourceList();
            if (null !== $source && !isset($currentSources[(string) $source->getId()])) {
                $this->gateway->delete('ChecklistItem', $item->getId());

                continue;
            }

            $remaining[] = $item;
        }

        $represented = [];
        $names = [];
        foreach ($remaining as $item) {
            $names[mb_strtolower($item->getName())] = true;
            $source = $item->getSourceList();
            if (null !== $source) {
                $represented[(string) $source->getId()] = true;
            }
        }

        foreach ($sourceLists as $list) {
            if (isset($represented[(string) $list->getId()])) {
                continue;
            }

            foreach ($this->itemsInCreationOrder($list) as $listItem) {
                $key = mb_strtolower($listItem->getName());
                if (isset($names[$key])) {
                    continue;
                }

                $names[$key] = true;
                $this->gateway->create('ChecklistItem', [
                    'name' => $listItem->getName(),
                    'checklist' => (string) $id,
                    'sourceList' => (string) $list->getId(),
                ]);
            }
        }
    }

    /**
     * @return list<ListItem>
     */
    private function itemsInCreationOrder(PermanentList $list): array
    {
        $items = $list->items()->all();

        // Ids are auto-increment, so id order is creation order. Compare them as strings
        // with natural ordering, which keeps the adaptor's id opaque.
        usort(
            $items,
            static fn (ListItem $a, ListItem $b): int => strnatcmp((string) $a->getId(), (string) $b->getId()),
        );

        return $items;
    }
}

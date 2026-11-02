import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import { CheckboxListItem } from "@astryxdesign/core/CheckboxList";
import { List } from "@astryxdesign/core/List";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import * as stylex from "@stylexjs/stylex";
import { useCanWrite } from "../../relay/useCanWrite";
import { useChecklistDetailsToggleItemMutation } from "./details/useChecklistDetailsToggleItemMutation";
import type { ChecklistDetails_checklist$key } from "./__generated__/ChecklistDetails_checklist.graphql";

export type ChecklistDetailsProps = {
  checklistRef: ChecklistDetails_checklist$key;
};

export function ChecklistDetails({ checklistRef }: ChecklistDetailsProps) {
  const state = useChecklistDetails({ checklistRef });
  const { checklist, items, canWrite } = state;
  return (
    <Stack gap={4}>
      <Stack gap={1}>
        <Text as="h2" type="display-3">
          {checklist.title}
        </Text>
        <Text>{state.summary}</Text>
      </Stack>
      {state.error && <Text role="alert">{state.error}</Text>}
      {items.length === 0 ? (
        <Text>This checklist has no items yet</Text>
      ) : (
        <List hasDividers>
          {items.map((item) => {
            const pending = state.pending.has(item.id);
            const checked = pending
              ? state.pending.get(item.id)!
              : item.checked;
            return (
              <CheckboxListItem
                key={item.id}
                label={
                  <span {...stylex.props(checked && styles.done)}>
                    {item.name}
                  </span>
                }
                description={item.sourceList?.title ?? undefined}
                isChecked={checked}
                isDisabled={!canWrite || pending}
                isLoading={pending}
                onCheck={(next) => state.toggle(item.id, next)}
              />
            );
          })}
        </List>
      )}
    </Stack>
  );
}

function useChecklistDetails({
  checklistRef,
}: {
  checklistRef: ChecklistDetails_checklist$key;
}) {
  const checklist = useFragment(
    graphql`
      fragment ChecklistDetails_checklist on ListoryChecklist {
        id
        title
        completedAt
        items(first: 100) {
          nodes {
            id
            name
            checked
            sourceList {
              title
            }
          }
        }
        sourceLists {
          nodes {
            title
          }
        }
      }
    `,
    checklistRef,
  );
  const items =
    checklist.items?.nodes?.flatMap((node) => (node ? [node] : [])) ?? [];
  const checkedCount = items.filter((item) => item.checked).length;
  const completedDate = checklist.completedAt
    ? formatDate(checklist.completedAt)
    : null;
  const summary = `${checkedCount} of ${items.length} done${
    completedDate ? ` · Completed ${completedDate}` : ""
  }`;
  const canWrite = useCanWrite();
  const toggler = useChecklistDetailsToggleItemMutation();
  // Checkbox values requested but not yet confirmed by the server, keyed by item id.
  const [pending, setPending] = useState<ReadonlyMap<string, boolean>>(
    () => new Map(),
  );
  const [error, setError] = useState("");

  function toggle(id: string, checked: boolean) {
    if (!canWrite || pending.has(id)) return;
    setError("");
    setPending((previous) => new Map(previous).set(id, checked));
    const settle = () =>
      setPending((previous) => {
        const next = new Map(previous);
        next.delete(id);
        return next;
      });
    toggler.save(id, checked, settle, (failure) => {
      // Dropping the pending value reverts the checkbox to the stored state.
      settle();
      setError(`Could not update the item. ${failure.message}`);
    });
  }

  return {
    checklist,
    items,
    summary,
    canWrite,
    pending,
    error,
    toggle,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value),
  );
}

const styles = stylex.create({
  done: {
    textDecoration: "line-through",
    color: "var(--color-text-secondary)",
  },
});

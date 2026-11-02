import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import { Button } from "@astryxdesign/core/Button";
import { CheckboxListItem } from "@astryxdesign/core/CheckboxList";
import { Heading } from "@astryxdesign/core/Heading";
import { List, ListItem } from "@astryxdesign/core/List";
import { Selector } from "@astryxdesign/core/Selector";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import * as stylex from "@stylexjs/stylex";
import { useCanWrite } from "../../relay/useCanWrite";
import { useChecklistDetailsSourceListsMutation } from "./details/useChecklistDetailsSourceListsMutation";
import { useChecklistDetailsToggleItemMutation } from "./details/useChecklistDetailsToggleItemMutation";
import type { ChecklistDetails_checklist$key } from "./__generated__/ChecklistDetails_checklist.graphql";
import type { ChecklistDetails_lists$key } from "./__generated__/ChecklistDetails_lists.graphql";

export type ChecklistDetailsProps = {
  checklistRef: ChecklistDetails_checklist$key;
  listsRef: ChecklistDetails_lists$key;
};

export function ChecklistDetails({ checklistRef, listsRef }: ChecklistDetailsProps) {
  const state = useChecklistDetails({ checklistRef, listsRef });
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
      {canWrite && (
        <Stack gap={2}>
          <Heading level={3}>Source lists</Heading>
          {state.sourceError && <Text role="alert">{state.sourceError}</Text>}
          {state.sourceLists.length === 0 ? (
            <Text>This checklist has no source lists</Text>
          ) : (
            <List hasDividers>
              {state.sourceLists.map((list) => (
                <ListItem
                  key={list.id}
                  label={list.title}
                  endContent={
                    <Button
                      label={`Remove ${list.title}`}
                      variant="ghost"
                      isDisabled={state.sourcePending}
                      onClick={() => state.removeSourceList(list)}
                    >
                      Remove
                    </Button>
                  }
                />
              ))}
            </List>
          )}
          <Stack direction="horizontal" gap={2} vAlign="end">
            <Selector
              label="Add list"
              options={state.availableLists}
              value={state.picked}
              onChange={state.setPicked}
              placeholder="Choose a permanent list"
              emptyText="Every permanent list is already used"
              isDisabled={
                state.sourcePending || state.availableLists.length === 0
              }
            />
            <Button
              label="Add"
              isLoading={state.sourcePending}
              isDisabled={!state.picked || state.sourcePending}
              onClick={state.addSourceList}
            />
          </Stack>
        </Stack>
      )}
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
  listsRef,
}: {
  checklistRef: ChecklistDetails_checklist$key;
  listsRef: ChecklistDetails_lists$key;
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
            id
            title
          }
        }
      }
    `,
    checklistRef,
  );
  const lists = useFragment(
    graphql`
      fragment ChecklistDetails_lists on RootQuery {
        listoryListSearch(first: 100) {
          nodes {
            id
            title
          }
        }
      }
    `,
    listsRef,
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
  const sourceLists =
    checklist.sourceLists?.nodes?.flatMap((node) => (node ? [node] : [])) ?? [];
  const sourceIds = sourceLists.map((list) => list.id);
  const availableLists = (lists.listoryListSearch?.nodes ?? []).flatMap(
    (list) =>
      list && !sourceIds.includes(list.id)
        ? [{ value: list.id, label: list.title }]
        : [],
  );
  const canWrite = useCanWrite();
  const toggler = useChecklistDetailsToggleItemMutation();
  const sourceMutation = useChecklistDetailsSourceListsMutation();
  // Checkbox values requested but not yet confirmed by the server, keyed by item id.
  const [pending, setPending] = useState<ReadonlyMap<string, boolean>>(
    () => new Map(),
  );
  const [error, setError] = useState("");
  const [picked, setPicked] = useState("");
  const [sourceError, setSourceError] = useState("");

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

  // Sends the full new id array; the server adds or removes items to match.
  function saveSourceLists(
    nextIds: string[],
    completed: () => void,
    failure: string,
  ) {
    if (!canWrite || sourceMutation.pending) return;
    setSourceError("");
    sourceMutation.save(
      { input: { id: checklist.id, sourceLists: nextIds } },
      completed,
      (problem) => setSourceError(`${failure} ${problem.message}`),
    );
  }

  function removeSourceList(list: { id: string; title: string }) {
    if (
      !window.confirm(
        `Remove "${list.title}" and its items from this checklist?`,
      )
    )
      return;
    saveSourceLists(
      sourceIds.filter((id) => id !== list.id),
      () => {},
      "Could not remove the list.",
    );
  }

  function addSourceList() {
    if (!picked) return;
    saveSourceLists(
      [...sourceIds, picked],
      () => setPicked(""),
      "Could not add the list.",
    );
  }

  return {
    checklist,
    items,
    summary,
    canWrite,
    pending,
    error,
    toggle,
    sourceLists,
    availableLists,
    sourceError,
    sourcePending: sourceMutation.pending,
    picked,
    setPicked,
    removeSourceList,
    addSourceList,
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

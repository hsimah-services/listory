import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { graphql, useFragment } from "react-relay";
import { Button } from "@astryxdesign/core/Button";
import { List, ListItem } from "@astryxdesign/core/List";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { useCanWrite } from "../../relay/useCanWrite";
import { ListEditURI, ListIndexURI } from "../../routes/__generated__/routes";
import { useListDetailsAddItemMutation } from "./details/useListDetailsAddItemMutation";
import { useListDetailsDeleteMutation } from "./details/useListDetailsDeleteMutation";
import { useListDetailsRemoveItemMutation } from "./details/useListDetailsRemoveItemMutation";
import type { ListDetails_list$key } from "./__generated__/ListDetails_list.graphql";

const ITEM_MAX_LENGTH = 200;

export type ListDetailsProps = {
  listRef: ListDetails_list$key;
};

export function ListDetails({ listRef }: ListDetailsProps) {
  const state = useListDetails({ listRef });
  const { list, heading, items, canWrite } = state;
  return (
    <Stack gap={4}>
      <Text as="h2" type="display-3" tabIndex={-1} ref={heading}>
        {list.title}
      </Text>
      <Text>Created {new Date(list.createdAt).toLocaleDateString()}</Text>
      {canWrite && (
        <Stack direction="horizontal" gap={2}>
          <Button label="Edit" href={ListEditURI.getURI({ id: list.id })} />
          <Button
            label="Delete"
            variant="destructive"
            isLoading={state.deleting}
            isDisabled={state.deleting}
            onClick={state.deleteList}
          />
        </Stack>
      )}
      {state.error && <Text role="alert">{state.error}</Text>}
      {items.length === 0 ? (
        <Text>This list has no items yet</Text>
      ) : (
        <List hasDividers>
          {items.map((item) => (
            <ListItem
              key={item.id}
              label={item.name}
              endContent={
                canWrite && (
                  <Button
                    label={`Remove ${item.name}`}
                    variant="ghost"
                    isDisabled={state.removingIds.has(item.id)}
                    onClick={() => state.remove(item.id)}
                  >
                    Remove
                  </Button>
                )
              }
            />
          ))}
        </List>
      )}
      {canWrite && (
        <form onSubmit={state.submit}>
          <Stack gap={2}>
            <TextInput
              label="New item"
              value={state.name}
              onChange={state.setName}
              placeholder="e.g. Charcoal"
              isDisabled={state.pending}
              status={
                state.tooLong
                  ? {
                      type: "error",
                      message: `Item must be ${ITEM_MAX_LENGTH} characters or fewer.`,
                    }
                  : undefined
              }
            />
            <Stack direction="horizontal" gap={2}>
              <Button
                type="submit"
                label="Add"
                isLoading={state.pending}
                isDisabled={!state.trimmed || state.tooLong}
              />
            </Stack>
          </Stack>
        </form>
      )}
    </Stack>
  );
}

function useListDetails({ listRef }: { listRef: ListDetails_list$key }) {
  const list = useFragment(
    graphql`
      fragment ListDetails_list on ListoryList {
        id
        title
        createdAt
        items(first: 100) @connection(key: "ListDetails_items") {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
    listRef,
  );
  const heading = useRef<HTMLElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [list.id]);
  const items =
    list.items?.edges?.flatMap((edge) => (edge?.node ? [edge.node] : [])) ?? [];
  const canWrite = useCanWrite();
  const add = useListDetailsAddItemMutation(list.id);
  const remove = useListDetailsRemoveItemMutation(list.id);
  const deleter = useListDetailsDeleteMutation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [removingIds, setRemovingIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const trimmed = name.trim();
  const tooLong = trimmed.length > ITEM_MAX_LENGTH;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (add.pending || !canWrite || !trimmed || tooLong) return;
    setError("");
    add.save(
      trimmed,
      () => setName(""),
      (failure) => setError(`Could not add the item. ${failure.message}`),
    );
  }

  function removeItem(id: string) {
    if (!canWrite || removingIds.has(id)) return;
    setError("");
    setRemovingIds((previous) => new Set(previous).add(id));
    const settle = () =>
      setRemovingIds((previous) => {
        const next = new Set(previous);
        next.delete(id);
        return next;
      });
    remove.save(id, settle, (failure) => {
      settle();
      setError(`Could not remove the item. ${failure.message}`);
    });
  }

  function deleteList() {
    if (!canWrite || deleter.pending) return;
    if (
      !window.confirm(
        `Delete "${list.title}"? Checklists made from it keep their items.`,
      )
    )
      return;
    setError("");
    deleter.save(
      { input: { id: list.id } },
      (response) => {
        if (!response.deleteListoryList?.deletedId) {
          setError(
            "The server did not confirm deletion. Check the lists before retrying.",
          );
          return;
        }
        navigate(ListIndexURI.getURI({}));
      },
      (failure) => setError(`Could not delete the list. ${failure.message}`),
    );
  }

  return {
    list,
    heading,
    items,
    canWrite,
    name,
    setName,
    trimmed,
    tooLong,
    pending: add.pending,
    deleting: deleter.pending,
    deleteList,
    error,
    removingIds,
    remove: removeItem,
    submit,
  };
}

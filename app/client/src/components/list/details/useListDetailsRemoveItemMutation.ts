import { useEffect, useRef } from "react";
import { graphql, useMutation } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import type { useListDetailsRemoveItemMutation as useListDetailsRemoveItemMutationOperation } from "./__generated__/useListDetailsRemoveItemMutation.graphql";

/**
 * Removes an item from a permanent list. The item is dropped from the list's
 * `items` connection (key `ListDetails_items`) and from the store.
 */
export function useListDetailsRemoveItemMutation(listId: string) {
  const [commit] = useMutation<useListDetailsRemoveItemMutationOperation>(
    graphql`
      mutation useListDetailsRemoveItemMutation($input: DeleteListoryListItemInput!) {
        deleteListoryListItem(input: $input) {
          deletedId
        }
      }
    `,
  );
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  function save(
    id: string,
    completed: () => void,
    failed: (error: Error) => void,
  ) {
    commit({
      variables: { input: { id } },
      updater: (store) => {
        const list = store.get(listId);
        const connection =
          list && ConnectionHandler.getConnection(list, "ListDetails_items");
        if (connection) ConnectionHandler.deleteNode(connection, id);
        store.delete(id);
      },
      onCompleted: (_response, errors) => {
        if (!mounted.current) return;
        if (errors?.length)
          failed(new Error(errors.map((error) => error.message).join(" ")));
        else completed();
      },
      onError: (error) => {
        if (mounted.current) failed(error);
      },
    });
  }
  return { save };
}

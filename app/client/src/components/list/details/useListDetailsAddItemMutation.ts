import { useEffect, useRef } from "react";
import { graphql, useMutation } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import type { useListDetailsAddItemMutation as useListDetailsAddItemMutationOperation } from "./__generated__/useListDetailsAddItemMutation.graphql";

/**
 * Adds an item to a permanent list. The new item is appended to the list's
 * `items` connection (key `ListDetails_items`, declared in ListDetails.tsx)
 * so the panel updates without a refetch.
 */
export function useListDetailsAddItemMutation(listId: string) {
  const [commit, pending] = useMutation<useListDetailsAddItemMutationOperation>(
    graphql`
      mutation useListDetailsAddItemMutation($input: CreateListoryListItemInput!) {
        createListoryListItem(input: $input) {
          listoryListItem {
            id
            name
          }
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
    name: string,
    completed: () => void,
    failed: (error: Error) => void,
  ) {
    commit({
      variables: { input: { name, list: listId } },
      updater: (store) => {
        const item = store
          .getRootField("createListoryListItem")
          ?.getLinkedRecord("listoryListItem");
        const list = store.get(listId);
        const connection =
          list && ConnectionHandler.getConnection(list, "ListDetails_items");
        if (!item || !connection) return;
        const edge = ConnectionHandler.createEdge(
          store,
          connection,
          item,
          "ListoryListToListoryListItemConnectionEdge",
        );
        ConnectionHandler.insertEdgeAfter(connection, edge);
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
  return { save, pending };
}

import { useEffect, useRef } from "react";
import { graphql, useMutation } from "react-relay";
import type { useChecklistDetailsToggleItemMutation as useChecklistDetailsToggleItemMutationOperation } from "./__generated__/useChecklistDetailsToggleItemMutation.graphql";

/**
 * Checks or unchecks one item on a checklist. The response carries the item's
 * parent checklist, so the server-maintained `completedAt` lands in the store
 * and the "Completed" text updates without a refetch.
 *
 * Never retried: a failed toggle is reported once and the caller reverts it.
 */
export function useChecklistDetailsToggleItemMutation() {
  const [commit] = useMutation<useChecklistDetailsToggleItemMutationOperation>(
    graphql`
      mutation useChecklistDetailsToggleItemMutation($input: UpdateListoryChecklistItemInput!) {
        updateListoryChecklistItem(input: $input) {
          listoryChecklistItem {
            id
            checked
            checklist {
              id
              completedAt
            }
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
    id: string,
    checked: boolean,
    completed: () => void,
    failed: (error: Error) => void,
  ) {
    commit({
      variables: { input: { id, checked } },
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

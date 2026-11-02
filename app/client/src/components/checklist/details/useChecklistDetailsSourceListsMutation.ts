import { graphql } from "react-relay";
import { useSaveMutation } from "../../../relay/useSaveMutation";
import type { useChecklistDetailsSourceListsMutation as useChecklistDetailsSourceListsMutationOperation } from "./__generated__/useChecklistDetailsSourceListsMutation.graphql";

/**
 * Replaces a checklist's source lists. The server adds items from new source lists
 * and removes items from dropped ones, so the response re-reads the items, the
 * source lists and `completedAt` that the details fragment depends on.
 */
export function useChecklistDetailsSourceListsMutation() {
  return useSaveMutation<useChecklistDetailsSourceListsMutationOperation>(graphql`
    mutation useChecklistDetailsSourceListsMutation($input: UpdateListoryChecklistInput!) {
      updateListoryChecklist(input: $input) {
        listoryChecklist {
          id
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
      }
    }
  `);
}

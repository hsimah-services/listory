import { graphql } from "react-relay";
import { useSaveMutation } from "../../../relay/useSaveMutation";
import type { useChecklistFormUpdateMutation as useChecklistFormUpdateMutationOperation } from "./__generated__/useChecklistFormUpdateMutation.graphql";

/** Renames a checklist. Source lists are changed from the details panel, never here. */
export function useChecklistFormUpdateMutation() {
  return useSaveMutation<useChecklistFormUpdateMutationOperation>(graphql`
    mutation useChecklistFormUpdateMutation($input: UpdateListoryChecklistInput!) {
      updateListoryChecklist(input: $input) {
        listoryChecklist {
          id
          title
          ...ChecklistForm_checklist
        }
      }
    }
  `);
}

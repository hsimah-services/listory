import { graphql } from "react-relay";
import { useSaveMutation } from "../../../relay/useSaveMutation";
import type { useChecklistFormCreateMutation as useChecklistFormCreateMutationOperation } from "./__generated__/useChecklistFormCreateMutation.graphql";

export function useChecklistFormCreateMutation() {
  return useSaveMutation<useChecklistFormCreateMutationOperation>(graphql`
    mutation useChecklistFormCreateMutation($title: String!, $sourceLists: [ID]) {
      createListoryChecklist(input: { title: $title, sourceLists: $sourceLists }) {
        listoryChecklist {
          id
          title
        }
      }
    }
  `);
}

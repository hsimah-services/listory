import { graphql } from "react-relay";
import { useSaveMutation } from "../../../relay/useSaveMutation";
import type { useListFormUpdateMutation as useListFormUpdateMutationOperation } from "./__generated__/useListFormUpdateMutation.graphql";

export function useListFormUpdateMutation() {
  return useSaveMutation<useListFormUpdateMutationOperation>(graphql`
    mutation useListFormUpdateMutation($input: UpdateListoryListInput!) {
      updateListoryList(input: $input) {
        listoryList {
          id
          title
          ...ListForm_list
        }
      }
    }
  `);
}

import { graphql } from "react-relay";
import { useSaveMutation } from "../../../relay/useSaveMutation";
import type { useListFormCreateMutation as useListFormCreateMutationOperation } from "./__generated__/useListFormCreateMutation.graphql";

export function useListFormCreateMutation() {
  return useSaveMutation<useListFormCreateMutationOperation>(graphql`
    mutation useListFormCreateMutation($input: CreateListoryListInput!) {
      createListoryList(input: $input) {
        listoryList {
          id
          title
          ...ListForm_list
        }
      }
    }
  `);
}

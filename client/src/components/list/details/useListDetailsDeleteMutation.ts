import { graphql } from "react-relay";
import { useSaveMutation } from "../../../relay/useSaveMutation";
import type { useListDetailsDeleteMutation as useListDetailsDeleteMutationOperation } from "./__generated__/useListDetailsDeleteMutation.graphql";

export function useListDetailsDeleteMutation() {
  return useSaveMutation<useListDetailsDeleteMutationOperation>(graphql`
    mutation useListDetailsDeleteMutation($input: DeleteListoryListInput!) {
      deleteListoryList(input: $input) {
        deletedId @deleteRecord
      }
    }
  `);
}

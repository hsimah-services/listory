import { graphql } from "react-relay";
import { useSaveMutation } from "../../../relay/useSaveMutation";
import type { useChecklistDetailsDeleteMutation as useChecklistDetailsDeleteMutationOperation } from "./__generated__/useChecklistDetailsDeleteMutation.graphql";

export function useChecklistDetailsDeleteMutation() {
  return useSaveMutation<useChecklistDetailsDeleteMutationOperation>(graphql`
    mutation useChecklistDetailsDeleteMutation($input: DeleteListoryChecklistInput!) {
      deleteListoryChecklist(input: $input) {
        deletedId @deleteRecord
      }
    }
  `);
}

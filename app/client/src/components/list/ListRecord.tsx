import { graphql, usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { Text } from "@astryxdesign/core/Text";
import { ListDetails } from "./ListDetails";
import { ListForm } from "./ListForm";
import type { ListRecordQuery } from "./__generated__/ListRecordQuery.graphql";

const QUERY = graphql`
  query ListRecordQuery($id: ID!) {
    listoryList(id: $id) {
      id
      ...ListDetails_list
      ...ListForm_list
    }
  }
`;

export type ListRecordProps = {
  reference: PreloadedQuery<ListRecordQuery>;
  edit?: boolean;
};

export function ListRecord({ reference, edit = false }: ListRecordProps) {
  const { listoryList } = usePreloadedQuery<ListRecordQuery>(QUERY, reference);
  if (!listoryList) return <Text>List not found</Text>;
  return edit ? (
    <ListForm key={listoryList.id} listRef={listoryList} />
  ) : (
    <ListDetails listRef={listoryList} />
  );
}

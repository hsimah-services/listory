import { graphql, usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { Text } from "@astryxdesign/core/Text";
import { ListDetails } from "./ListDetails";
import type { ListRecordQuery } from "./__generated__/ListRecordQuery.graphql";

const QUERY = graphql`
  query ListRecordQuery($id: ID!) {
    listoryList(id: $id) {
      id
      ...ListDetails_list
    }
  }
`;

export type ListRecordProps = {
  reference: PreloadedQuery<ListRecordQuery>;
};

export function ListRecord({ reference }: ListRecordProps) {
  const { listoryList } = usePreloadedQuery<ListRecordQuery>(QUERY, reference);
  if (!listoryList) return <Text>List not found</Text>;
  return <ListDetails listRef={listoryList} />;
}

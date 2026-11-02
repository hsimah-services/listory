import { useState } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { Button } from "@astryxdesign/core/Button";
import { Link } from "@astryxdesign/core/Link";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@astryxdesign/core/Table";
import type { ListList_query$key } from "./__generated__/ListList_query.graphql";
import type { ListListPaginationQuery } from "./__generated__/ListListPaginationQuery.graphql";

const PAGE_SIZE = 25;

export function ListList({
  queryRef,
  term,
}: {
  queryRef: ListList_query$key;
  term: string;
}) {
  const { error, hasNext, isLoadingNext, connection, lists, loadMore } =
    useListList({ queryRef });
  return (
    <Stack gap={3}>
      <Text>{connection?.totalCount ?? 0} lists</Text>
      {lists.length === 0 ? (
        <Text>{term ? `No lists match "${term}"` : "No lists yet"}</Text>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Items</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lists.map((list) => (
              <TableRow key={list.id}>
                <TableCell>
                  <Link href={`/lists/${list.id}`}>{list.title}</Link>
                </TableCell>
                <TableCell>{list.items?.totalCount ?? 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {error && <Text role="alert">{error}</Text>}
      {hasNext && (
        <Button
          label="Load more lists"
          isLoading={isLoadingNext}
          onClick={loadMore}
        />
      )}
    </Stack>
  );
}

function useListList({ queryRef }: { queryRef: ListList_query$key }) {
  const [error, setError] = useState("");
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    ListListPaginationQuery,
    ListList_query$key
  >(
    graphql`
      fragment ListList_query on RootQuery
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 25 }
        cursor: { type: "String" }
        term: { type: "String" }
      )
      @refetchable(queryName: "ListListPaginationQuery") {
        listoryListSearch(first: $count, after: $cursor, where: { term: $term })
          @connection(key: "ListList_listoryListSearch", filters: ["where"]) {
          totalCount
          edges {
            node {
              id
              title
              items {
                totalCount
              }
            }
          }
        }
      }
    `,
    queryRef,
  );
  const connection = data.listoryListSearch;
  const lists =
    connection?.edges?.flatMap((edge) => (edge?.node ? [edge.node] : [])) ?? [];

  function loadMore() {
    setError("");
    loadNext(PAGE_SIZE, {
      onComplete: (failure) => {
        if (failure) setError(failure.message);
      },
    });
  }
  return { error, hasNext, isLoadingNext, connection, lists, loadMore };
}

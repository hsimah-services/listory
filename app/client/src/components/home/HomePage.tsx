import { useState } from "react";
import { graphql, usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { QueryBoundary } from "../../relay/QueryBoundary";
import { useRouteQuery } from "../../relay/useRouteQuery";
import type { HomePageQuery } from "./__generated__/HomePageQuery.graphql";

const QUERY = graphql`
  query HomePageQuery {
    listoryLists(first: 1) {
      totalCount
    }
  }
`;

const VARIABLES = {};

export function HomePage({
  reference: initial,
}: {
  reference: PreloadedQuery<HomePageQuery>;
}) {
  const [revision, setRevision] = useState(0);
  const reference = useRouteQuery<HomePageQuery>(
    QUERY,
    VARIABLES,
    revision,
    initial,
  );
  return (
    <Stack gap={6}>
      <Text as="h1" type="display-2">
        Listory
      </Text>
      <QueryBoundary
        key={reference?.fetchKey ?? "initial"}
        retry={() => setRevision((value) => value + 1)}
      >
        {reference ? (
          <HomePage_Summary reference={reference} />
        ) : (
          <Text role="status">Loading...</Text>
        )}
      </QueryBoundary>
    </Stack>
  );
}

function HomePage_Summary({
  reference,
}: {
  reference: PreloadedQuery<HomePageQuery>;
}) {
  const { listoryLists } = usePreloadedQuery<HomePageQuery>(QUERY, reference);
  const total = listoryLists?.totalCount;
  if (total == null) throw new Error("Permanent list count is unavailable.");
  return <Text>{total} permanent lists</Text>;
}

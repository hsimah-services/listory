import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { graphql, usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { Button } from "@astryxdesign/core/Button";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { ListList } from "./ListList";
import { QueryBoundary } from "../../relay/QueryBoundary";
import { useRouteQuery } from "../../relay/useRouteQuery";
import { useCanWrite } from "../../relay/useCanWrite";
import { useListRouteContext } from "../../routes/__generated__/routes";
import type { ListPageQuery } from "./__generated__/ListPageQuery.graphql";

const QUERY = graphql`
  query ListPageQuery($term: String = "") {
    ...ListList_query @arguments(term: $term)
  }
`;

export function ListPage({
  reference,
}: {
  reference: PreloadedQuery<ListPageQuery>;
}) {
  const state = useListPage(reference);
  return (
    <Stack gap={4}>
      <Text as="h1" type="display-2">
        Lists
      </Text>
      <Stack direction="horizontal" gap={3} wrap="wrap" hAlign="between">
        <TextInput
          label="Search lists"
          placeholder="Search lists"
          value={state.term}
          onChange={state.search}
        />
        {state.canWrite && <Button label="New list" href="/lists/new" />}
      </Stack>
      <QueryBoundary
        key={state.reference.fetchKey ?? "initial"}
        retry={state.refresh}
      >
        <ListPage_Results reference={state.reference} term={state.term} />
      </QueryBoundary>
    </Stack>
  );
}

function useListPage(initial: PreloadedQuery<ListPageQuery>) {
  const route = useListRouteContext();
  const term = route.input.term ?? "";
  const navigate = useNavigate();
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((value) => value + 1);
  const variables = useMemo(() => ({ term }), [term]);
  const reference = useRouteQuery<ListPageQuery>(
    QUERY,
    variables,
    revision,
    initial,
  )!;
  const canWrite = useCanWrite();
  const search = (value: string) =>
    navigate(route.updateURI({ term: value || undefined }), { replace: true });
  return { term, reference, refresh, canWrite, search };
}

function ListPage_Results({
  reference,
  term,
}: {
  reference: PreloadedQuery<ListPageQuery>;
  term: string;
}) {
  const data = usePreloadedQuery<ListPageQuery>(QUERY, reference);
  return <ListList queryRef={data} term={term} />;
}

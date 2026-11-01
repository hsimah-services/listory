import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { graphql, usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { Button } from "@astryxdesign/core/Button";
import { Grid } from "@astryxdesign/core/Grid";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import * as stylex from "@stylexjs/stylex";
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
  detail,
}: {
  reference: PreloadedQuery<ListPageQuery>;
  detail: ReactNode;
}) {
  const state = useListPage(reference);
  return (
    <Stack gap={4}>
      <Text as="h1" type="display-2">
        Lists
      </Text>
      <Grid gap={6} columns={1} xstyle={!!detail && styles.withDetail}>
        <Stack gap={4} xstyle={styles.content}>
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
        {detail && (
          <Stack
            as="aside"
            aria-label="List details"
            gap={4}
            paddingBlockStart={4}
            xstyle={styles.panel}
          >
            {detail}
          </Stack>
        )}
      </Grid>
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

// At 1000px the detail occupies a 24rem end column; below it, details lead a single column.
// These values match clog's location/LocationPage.tsx (lines 104-116) on purpose; keep them in sync.
// --color-border is defined in src/theme/ListoryTheme.ts.
const styles = stylex.create({
  content: { minWidth: 0 },
  withDetail: {
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      "@media (min-width: 1000px)": "minmax(0, 1fr) minmax(0, 24rem)",
    },
  },
  panel: {
    order: { default: -1, "@media (min-width: 1000px)": 1 },
    minWidth: 0,
    borderTop: "1px solid var(--color-border)",
  },
});

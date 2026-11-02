import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { graphql, usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { Button } from "@astryxdesign/core/Button";
import { ButtonGroup } from "@astryxdesign/core/ButtonGroup";
import { Grid } from "@astryxdesign/core/Grid";
import { ToggleButton } from "@astryxdesign/core/ToggleButton";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import * as stylex from "@stylexjs/stylex";
import { ChecklistForm } from "./ChecklistForm";
import { ChecklistList } from "./ChecklistList";
import { CHECKLIST_STATUS, type ChecklistStatus } from "./ChecklistStatus";
import { QueryBoundary } from "../../relay/QueryBoundary";
import { useRouteQuery } from "../../relay/useRouteQuery";
import { useCanWrite } from "../../relay/useCanWrite";
import { useChecklistRouteContext } from "../../routes/__generated__/routes";
import type { ChecklistPageQuery } from "./__generated__/ChecklistPageQuery.graphql";

const QUERY = graphql`
  query ChecklistPageQuery($term: String = "", $completed: Boolean) {
    ...ChecklistList_query @arguments(term: $term, completed: $completed)
    ...ChecklistForm_query
  }
`;

const STATUS_LABELS: Record<ChecklistStatus, string> = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

export function ChecklistPage({
  reference,
  creating = false,
  detail,
}: {
  reference: PreloadedQuery<ChecklistPageQuery>;
  creating?: boolean;
  detail?: ReactNode;
}) {
  const state = useChecklistPage(reference);
  if (creating) return <ChecklistPage_New reference={reference} />;
  return (
    <Stack gap={4}>
      <Text as="h1" type="display-2">
        Checklists
      </Text>
      <Grid gap={6} columns={1} xstyle={!!detail && styles.withDetail}>
        <Stack gap={4} xstyle={styles.content}>
          <Stack direction="horizontal" gap={3} wrap="wrap" hAlign="between">
            <TextInput
              label="Search checklists"
              placeholder="Search checklists"
              value={state.term}
              onChange={state.search}
            />
            <ButtonGroup label="Filter checklists by status">
              {state.filters.map((filter) => (
                <ToggleButton
                  key={filter.status}
                  label={filter.label}
                  isPressed={filter.isPressed}
                  onPressedChange={filter.select}
                />
              ))}
            </ButtonGroup>
            {state.canWrite && (
              <Button label="New checklist" href="/checklists/new" />
            )}
          </Stack>
          <QueryBoundary
            key={state.reference.fetchKey ?? "initial"}
            retry={state.refresh}
          >
            <ChecklistPage_Results
              reference={state.reference}
              emptyMessage={
                state.term || state.status !== "all"
                  ? "No checklists match"
                  : "No checklists yet"
              }
            />
          </QueryBoundary>
        </Stack>
        {detail && (
          <Stack
            as="aside"
            aria-label="Checklist details"
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

function useChecklistPage(initial: PreloadedQuery<ChecklistPageQuery>) {
  const route = useChecklistRouteContext();
  const term = route.input.term ?? "";
  const status = CHECKLIST_STATUS.fromParam(route.input.status);
  const navigate = useNavigate();
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((value) => value + 1);
  const variables = useMemo(
    () => ({
      term,
      completed: CHECKLIST_STATUS.completedFilter(route.input.status),
    }),
    [term, route.input.status],
  );
  const reference = useRouteQuery<ChecklistPageQuery>(
    QUERY,
    variables,
    revision,
    initial,
  )!;
  const canWrite = useCanWrite();
  const search = (value: string) =>
    navigate(route.updateURI({ term: value || undefined }), { replace: true });
  const filter = (value: ChecklistStatus) =>
    navigate(
      route.updateURI({ status: value === "all" ? undefined : value }),
      { replace: true },
    );
  const filters = CHECKLIST_STATUS.options.map((option) => ({
    status: option,
    label: STATUS_LABELS[option],
    isPressed: status === option,
    select: () => filter(option),
  }));
  return { term, status, reference, refresh, canWrite, search, filters };
}

function ChecklistPage_Results({
  reference,
  emptyMessage,
}: {
  reference: PreloadedQuery<ChecklistPageQuery>;
  emptyMessage: string;
}) {
  const data = usePreloadedQuery<ChecklistPageQuery>(QUERY, reference);
  return <ChecklistList queryRef={data} emptyMessage={emptyMessage} />;
}

function ChecklistPage_New({
  reference,
}: {
  reference: PreloadedQuery<ChecklistPageQuery>;
}) {
  const data = usePreloadedQuery<ChecklistPageQuery>(QUERY, reference);
  return (
    <Stack gap={4}>
      <Text as="h1" type="display-2">
        New checklist
      </Text>
      <ChecklistForm queryRef={data} />
    </Stack>
  );
}

// Same breakpoint and styling as ListPage: the detail panel sits in a 24rem end column at 1000px.
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

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { graphql, usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { Button } from "@astryxdesign/core/Button";
import { ButtonGroup } from "@astryxdesign/core/ButtonGroup";
import { ToggleButton } from "@astryxdesign/core/ToggleButton";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
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
  }
`;

const STATUS_LABELS: Record<ChecklistStatus, string> = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

export function ChecklistPage({
  reference,
}: {
  reference: PreloadedQuery<ChecklistPageQuery>;
}) {
  const state = useChecklistPage(reference);
  return (
    <Stack gap={4}>
      <Text as="h1" type="display-2">
        Checklists
      </Text>
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

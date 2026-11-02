import { useState } from "react";
import { graphql, useFragment, usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { Button } from "@astryxdesign/core/Button";
import { Link } from "@astryxdesign/core/Link";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { QueryBoundary } from "../../relay/QueryBoundary";
import { useCanWrite } from "../../relay/useCanWrite";
import { useRouteQuery } from "../../relay/useRouteQuery";
import type { HomePageQuery } from "./__generated__/HomePageQuery.graphql";
import type { HomePage_checklist$key } from "./__generated__/HomePage_checklist.graphql";

const QUERY = graphql`
  query HomePageQuery {
    active: listoryChecklistSearch(where: { completed: false }, first: 5) {
      totalCount
      nodes {
        id
        ...HomePage_checklist
      }
    }
    lists: listoryListSearch(first: 1) {
      totalCount
    }
  }
`;

const VARIABLES = {};

// The first five active checklists are the most useful place to resume work.
const ACTIVE_LIMIT = 5;

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
  const { active, lists } = usePreloadedQuery<HomePageQuery>(QUERY, reference);
  const canWrite = useCanWrite();
  const activeTotal = active?.totalCount;
  const listTotal = lists?.totalCount;
  if (activeTotal == null) throw new Error("Active checklist count is unavailable.");
  if (listTotal == null) throw new Error("Permanent list count is unavailable.");
  const checklists = activeChecklists(active?.nodes);

  return (
    <Stack gap={6}>
      {canWrite && (
        <Stack direction="horizontal" gap={3} wrap="wrap">
          <Button label="New checklist" href="/checklists/new" />
          <Button label="New list" href="/lists/new" />
        </Stack>
      )}
      <Stack gap={3}>
        <Text as="h2" type="display-3">
          Active checklists
        </Text>
        {checklists.length === 0 ? (
          <Text>Nothing to tick off. Start a checklist from your lists.</Text>
        ) : (
          <Stack gap={2}>
            {checklists.map((checklist) => (
              <HomePage_ChecklistRow key={checklist.id} checklistRef={checklist} />
            ))}
            {activeTotal > ACTIVE_LIMIT && (
              <Link href="/checklists?status=active">View all</Link>
            )}
          </Stack>
        )}
      </Stack>
      <Link href="/lists">{`${listTotal} permanent lists`}</Link>
    </Stack>
  );
}

function activeChecklists<T>(nodes: ReadonlyArray<T | null | undefined> | null | undefined) {
  return (nodes ?? []).filter((node): node is T => node != null);
}

// The schema has no checked count, so the first 100 items are counted here.
function checklistProgress(
  items:
    | {
        readonly totalCount?: number | null;
        readonly nodes?: ReadonlyArray<{ readonly checked: boolean } | null | undefined> | null;
      }
    | null
    | undefined,
) {
  const checked = activeChecklists(items?.nodes).filter((item) => item.checked).length;
  return { checked, total: items?.totalCount ?? 0 };
}

function HomePage_ChecklistRow({
  checklistRef,
}: {
  checklistRef: HomePage_checklist$key;
}) {
  const checklist = useFragment(
    graphql`
      fragment HomePage_checklist on ListoryChecklist {
        id
        title
        items(first: 100) {
          totalCount
          nodes {
            checked
          }
        }
      }
    `,
    checklistRef,
  );
  const { checked, total } = checklistProgress(checklist.items);
  return (
    <Stack direction="horizontal" gap={3} hAlign="between">
      <Link href={`/checklists/${checklist.id}`}>{checklist.title}</Link>
      <Text>{`${checked} of ${total}`}</Text>
    </Stack>
  );
}

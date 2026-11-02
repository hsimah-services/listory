import { graphql, useFragment } from "react-relay";
import { Link } from "@astryxdesign/core/Link";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Token } from "@astryxdesign/core/Token";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@astryxdesign/core/Table";
import type { ChecklistList_query$key } from "./__generated__/ChecklistList_query.graphql";

export function ChecklistList({
  queryRef,
  emptyMessage,
}: {
  queryRef: ChecklistList_query$key;
  emptyMessage: string;
}) {
  const data = useFragment(
    graphql`
      fragment ChecklistList_query on RootQuery
      @argumentDefinitions(term: { type: "String" }, completed: { type: "Boolean" }) {
        listoryChecklistSearch(
          first: 100
          where: { term: $term, completed: $completed }
        ) {
          totalCount
          nodes {
            id
            title
            completedAt
            items(first: 100) {
              totalCount
              nodes {
                checked
              }
            }
          }
        }
      }
    `,
    queryRef,
  );
  const checklists = data.listoryChecklistSearch?.nodes ?? [];

  if (checklists.length === 0) {
    return <Text>{emptyMessage}</Text>;
  }
  return (
    <Stack gap={3}>
      <Text>{data.listoryChecklistSearch?.totalCount ?? 0} checklists</Text>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Title</TableHeaderCell>
            <TableHeaderCell>Progress</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checklists.map((checklist) => {
            if (!checklist) return null;
            const completed = checklist.completedAt !== null && checklist.completedAt !== undefined;
            const progress = checklistProgress(checklist.items);
            return (
              <TableRow key={checklist.id}>
                <TableCell>
                  <Link href={`/checklists/${checklist.id}`}>{checklist.title}</Link>
                </TableCell>
                <TableCell>{`${progress.checked} / ${progress.total}`}</TableCell>
                <TableCell>
                  <Token
                    label={completed ? "Completed" : "Active"}
                    color={completed ? "green" : "default"}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Stack>
  );
}

// The schema has no checked count, so the first 100 items are counted here.
function checklistProgress(
  items: {
    readonly totalCount?: number | null;
    readonly nodes?: ReadonlyArray<{ readonly checked: boolean } | null | undefined> | null;
  } | null | undefined,
) {
  const checked = (items?.nodes ?? []).filter((node) => node?.checked).length;
  return { checked, total: items?.totalCount ?? 0 };
}

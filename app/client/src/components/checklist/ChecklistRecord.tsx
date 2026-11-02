import { graphql, usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { Text } from "@astryxdesign/core/Text";
import { ChecklistDetails } from "./ChecklistDetails";
import { ChecklistForm } from "./ChecklistForm";
import type { ChecklistRecordQuery } from "./__generated__/ChecklistRecordQuery.graphql";

const QUERY = graphql`
  query ChecklistRecordQuery($id: ID!) {
    listoryChecklist(id: $id) {
      id
      ...ChecklistDetails_checklist
      ...ChecklistForm_checklist
    }
    ...ChecklistDetails_lists
  }
`;

export type ChecklistRecordProps = {
  reference: PreloadedQuery<ChecklistRecordQuery>;
  edit?: boolean;
};

export function ChecklistRecord({ reference, edit = false }: ChecklistRecordProps) {
  const data = usePreloadedQuery<ChecklistRecordQuery>(QUERY, reference);
  if (!data.listoryChecklist) return <Text>Checklist not found</Text>;
  return edit ? (
    <ChecklistForm key={data.listoryChecklist.id} checklistRef={data.listoryChecklist} />
  ) : (
    <ChecklistDetails checklistRef={data.listoryChecklist} listsRef={data} />
  );
}

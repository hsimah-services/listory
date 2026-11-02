import { graphql, usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { Text } from "@astryxdesign/core/Text";
import { ChecklistDetails } from "./ChecklistDetails";
import type { ChecklistRecordQuery } from "./__generated__/ChecklistRecordQuery.graphql";

const QUERY = graphql`
  query ChecklistRecordQuery($id: ID!) {
    listoryChecklist(id: $id) {
      id
      ...ChecklistDetails_checklist
    }
  }
`;

export type ChecklistRecordProps = {
  reference: PreloadedQuery<ChecklistRecordQuery>;
};

export function ChecklistRecord({ reference }: ChecklistRecordProps) {
  const { listoryChecklist } = usePreloadedQuery<ChecklistRecordQuery>(
    QUERY,
    reference,
  );
  if (!listoryChecklist) return <Text>Checklist not found</Text>;
  return <ChecklistDetails checklistRef={listoryChecklist} />;
}

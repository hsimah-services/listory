import { createElement } from "react";
import { RouteName, useChecklistRouteContext } from "../../routes/__generated__/routes";
import type { EntryPointProps } from "@tsquid/routes/entrypoint";
import type { ChecklistPageQuery } from "./__generated__/ChecklistPageQuery.graphql";
import type { ChecklistRecordQuery } from "./__generated__/ChecklistRecordQuery.graphql";
import { ChecklistPage } from "./ChecklistPage";
import { ChecklistRecord } from "./ChecklistRecord";

export function ChecklistRoute({ queries }: ChecklistRouteProps) {
  const route = useChecklistRouteContext();
  const detail =
    route.currentRoute === RouteName.ChecklistDetail && queries.record
      ? createElement(ChecklistRecord, { reference: queries.record })
      : null;
  return createElement(ChecklistPage, {
    reference: queries.page,
    creating: route.currentRoute === RouteName.ChecklistNew,
    detail,
  });
}

export type ChecklistRouteProps = EntryPointProps<ChecklistRouteQueries>;

export type ChecklistRouteQueries = {
  page: ChecklistPageQuery;
  record?: ChecklistRecordQuery;
};

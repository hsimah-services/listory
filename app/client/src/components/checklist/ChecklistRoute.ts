import { createElement } from "react";
import { RouteName, useChecklistRouteContext } from "../../routes/__generated__/routes";
import type { EntryPointProps } from "@tsquid/routes/entrypoint";
import type { ChecklistPageQuery } from "./__generated__/ChecklistPageQuery.graphql";
import { ChecklistPage } from "./ChecklistPage";

export function ChecklistRoute({ queries }: ChecklistRouteProps) {
  const route = useChecklistRouteContext();
  return createElement(ChecklistPage, {
    reference: queries.page,
    creating: route.currentRoute === RouteName.ChecklistNew,
  });
}

export type ChecklistRouteProps = EntryPointProps<ChecklistRouteQueries>;

export type ChecklistRouteQueries = {
  page: ChecklistPageQuery;
};

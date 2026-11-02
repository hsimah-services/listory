import { createElement } from "react";
import type { EntryPointProps } from "@tsquid/routes/entrypoint";
import type { ChecklistPageQuery } from "./__generated__/ChecklistPageQuery.graphql";
import { ChecklistPage } from "./ChecklistPage";

export function ChecklistRoute({ queries }: ChecklistRouteProps) {
  return createElement(ChecklistPage, { reference: queries.page });
}

export type ChecklistRouteProps = EntryPointProps<ChecklistRouteQueries>;

export type ChecklistRouteQueries = {
  page: ChecklistPageQuery;
};

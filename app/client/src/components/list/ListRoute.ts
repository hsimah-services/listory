import { createElement } from "react";
import type { EntryPointProps } from "@tsquid/routes/entrypoint";
import type { ListPageQuery } from "./__generated__/ListPageQuery.graphql";
import { ListPage } from "./ListPage";

export function ListRoute({ queries }: ListRouteProps) {
  return createElement(ListPage, { reference: queries.page });
}

export type ListRouteProps = EntryPointProps<ListRouteQueries>;

export type ListRouteQueries = {
  page: ListPageQuery;
};

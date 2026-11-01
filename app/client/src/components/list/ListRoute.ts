import { createElement } from "react";
import {
  RouteName,
  useListRouteContext,
} from "../../routes/__generated__/routes";
import type { EntryPointProps } from "@tsquid/routes/entrypoint";
import type { ListPageQuery } from "./__generated__/ListPageQuery.graphql";
import type { ListRecordQuery } from "./__generated__/ListRecordQuery.graphql";
import { ListPage } from "./ListPage";
import { ListRecord } from "./ListRecord";
import { ListForm } from "./ListForm";

export function ListRoute({ queries }: ListRouteProps) {
  const route = useListRouteContext();
  const edit = route.currentRoute === RouteName.ListEdit;
  const detail =
    route.currentRoute === RouteName.ListNew
      ? createElement(ListForm, {})
      : queries.record
        ? createElement(ListRecord, { reference: queries.record, edit })
        : null;
  return createElement(ListPage, { reference: queries.page, detail });
}

export type ListRouteProps = EntryPointProps<ListRouteQueries>;

export type ListRouteQueries = {
  page: ListPageQuery;
  record?: ListRecordQuery;
};

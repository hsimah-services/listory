import { lazyResource, type RouteEntryPoint } from "@tsquid/routes/entrypoint";
import {
  RouteName,
  ListIndexRouteQuery,
  type ListEntryPointParams,
} from "../../routes/__generated__/routes";
import type { ListRouteQueries } from "./ListRoute";
import PAGE_QUERY from "./__generated__/ListPageQuery.graphql";
import RECORD_QUERY from "./__generated__/ListRecordQuery.graphql";

export const LIST_ENTRY_POINT: RouteEntryPoint<
  ListEntryPointParams,
  ListRouteQueries
> = {
  root: lazyResource("ListRoute", () =>
    import("./ListRoute").then((module) => module.ListRoute),
  ),
  getPreloadProps: (route) => ({
    queries: {
      page: {
        parameters: PAGE_QUERY,
        variables: ListIndexRouteQuery.getVariables(route.input),
      },
      record:
        route.currentRoute === RouteName.ListDetail
          ? { parameters: RECORD_QUERY, variables: { id: route.input.id } }
          : undefined,
    },
  }),
};

import { lazyResource, type RouteEntryPoint } from "@tsquid/routes/entrypoint";
import type { ChecklistEntryPointParams } from "../../routes/__generated__/routes";
import type { ChecklistRouteQueries } from "./ChecklistRoute";
import { CHECKLIST_STATUS } from "./ChecklistStatus";
import PAGE_QUERY from "./__generated__/ChecklistPageQuery.graphql";

export const CHECKLIST_ENTRY_POINT: RouteEntryPoint<
  ChecklistEntryPointParams,
  ChecklistRouteQueries
> = {
  root: lazyResource("ChecklistRoute", () =>
    import("./ChecklistRoute").then((module) => module.ChecklistRoute),
  ),
  getPreloadProps: (route) => ({
    queries: {
      page: {
        parameters: PAGE_QUERY,
        variables: {
          term: route.input.term ?? "",
          completed: CHECKLIST_STATUS.completedFilter(route.input.status),
        },
      },
    },
  }),
};

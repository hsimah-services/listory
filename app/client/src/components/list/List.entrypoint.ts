import { resource, type Empty, type RouteEntryPoint } from "@tsquid/routes/entrypoint";
import type { ListEntryPointParams } from "../../routes/__generated__/routes";
import { ListIndex } from "./ListIndex";

export const LIST_ENTRY_POINT: RouteEntryPoint<ListEntryPointParams, Empty> = {
  root: resource("ListIndex", ListIndex),
  getPreloadProps: () => ({}),
};

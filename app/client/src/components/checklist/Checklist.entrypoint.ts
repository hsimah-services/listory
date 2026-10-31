import { resource, type Empty, type RouteEntryPoint } from "@tsquid/routes/entrypoint";
import type { ChecklistEntryPointParams } from "../../routes/__generated__/routes";
import { ChecklistIndex } from "./ChecklistIndex";

export const CHECKLIST_ENTRY_POINT: RouteEntryPoint<ChecklistEntryPointParams, Empty> = {
  root: resource("ChecklistIndex", ChecklistIndex),
  getPreloadProps: () => ({}),
};

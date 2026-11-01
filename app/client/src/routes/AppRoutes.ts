import { defineRoute } from "@tsquid/routes/entrypoint";
import { HOME_ENTRY_POINT } from "../components/home/Home.entrypoint";
import { LIST_ENTRY_POINT } from "../components/list/List.entrypoint";
import { CHECKLIST_ENTRY_POINT } from "../components/checklist/Checklist.entrypoint";
import {
  HomeURI,
  HomeRouteContext,
  ListIndexURI,
  ListIndexRouteContext,
  ListDetailURI,
  ListDetailRouteContext,
  ChecklistIndexURI,
  ChecklistIndexRouteContext,
} from "./__generated__/routes";

export const APP_ROUTES = [
  defineRoute({
    uri: HomeURI,
    context: HomeRouteContext,
    entryPoint: HOME_ENTRY_POINT,
  }),
  defineRoute({
    uri: ListIndexURI,
    context: ListIndexRouteContext,
    entryPoint: LIST_ENTRY_POINT,
  }),
  defineRoute({
    uri: ListDetailURI,
    context: ListDetailRouteContext,
    entryPoint: LIST_ENTRY_POINT,
  }),
  defineRoute({
    uri: ChecklistIndexURI,
    context: ChecklistIndexRouteContext,
    entryPoint: CHECKLIST_ENTRY_POINT,
  }),
];

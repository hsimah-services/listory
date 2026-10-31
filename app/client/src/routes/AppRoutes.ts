import { defineRoute } from "@tsquid/routes/entrypoint";
import { HOME_ENTRY_POINT } from "../components/home/Home.entrypoint";
import { HomeURI, HomeRouteContext } from "./__generated__/routes";

export const APP_ROUTES = [
  defineRoute({
    uri: HomeURI,
    context: HomeRouteContext,
    entryPoint: HOME_ENTRY_POINT,
  }),
];

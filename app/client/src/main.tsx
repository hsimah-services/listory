import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { Theme } from "@astryxdesign/core/theme";
import { LISTORY_THEME } from "./theme/ListoryTheme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme theme={LISTORY_THEME} mode="dark">
      <App />
    </Theme>
  </StrictMode>,
);

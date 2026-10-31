import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { RelayEnvironmentProvider } from "react-relay";
import { Text } from "@astryxdesign/core/Text";
import { ENVIRONMENT } from "./relay/environment";
import { QueryBoundary } from "./relay/QueryBoundary";
import { APP_ROUTES } from "./routes/AppRoutes";
import { useState } from "react";

export function App() {
  return (
    <RelayEnvironmentProvider environment={ENVIRONMENT}>
      <BrowserRouter>
        <App_Routes />
      </BrowserRouter>
    </RelayEnvironmentProvider>
  );
}

function App_Routes() {
  const location = useLocation();
  const [attempt, setAttempt] = useState(0);
  return (
    <QueryBoundary
      key={attempt}
      resetKey={location.pathname + location.search}
      retry={() => setAttempt((value) => value + 1)}
    >
      <Routes>
        {APP_ROUTES.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <route.Root fallback={<Text role="status">Loading…</Text>} />
            }
          />
        ))}
        <Route path="*" element={<Text>Page not found.</Text>} />
      </Routes>
    </QueryBoundary>
  );
}

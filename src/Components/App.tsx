import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
  type Router,
} from "@tanstack/react-router";
import Home from "../pages";
import Weather from "../pages/weather";
import { SSRBodyRoot, SSRHeadRoot, SSRProvider } from "next-ssr";
import { useMemo } from "react";

const rootRoute = createRootRoute({
  component: () => {
    return <Outlet />;
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const weatherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/weather/$code",
  component: Weather,
});

export const routeTree = rootRoute.addChildren([indexRoute, weatherRoute]);

export function App({ router }: { router: Router<any> }) {
  return (
    <html>
      <SSRProvider>
        <head>
          <SSRHeadRoot />
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          {import.meta.env?.DEV && (
            <>
              <script
                type="module"
                dangerouslySetInnerHTML={{
                  __html: `
              import RefreshRuntime from "/@react-refresh"
              RefreshRuntime.injectIntoGlobalHook(window)
              window.$RefreshReg$ = () => {}
              window.$RefreshSig$ = () => (type) => type
              window.__vite_plugin_react_preamble_installed__ = true`,
                }}
              />
              <script type="module" src="/@vite/client" />
            </>
          )}
          <link
            rel="stylesheet"
            href="https://cdn.simplecss.org/simple.min.css"
          />
          {import.meta.env?.DEV ? (
            <script type="module" src="/src/client.tsx"></script>
          ) : (
            <script type="module" src="/static/client.js"></script>
          )}
        </head>
        <body>
          <div id="root">
            <RouterProvider router={router} />
          </div>
          <SSRBodyRoot />
        </body>
      </SSRProvider>
    </html>
  );
}

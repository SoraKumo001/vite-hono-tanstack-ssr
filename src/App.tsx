import {
  RouterProvider,
  type AnyRoute,
  type Router,
} from "@tanstack/react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SSRProvider } from "react-query-ssr";

export function App({ router }: { router: Router<AnyRoute> }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } })
  );
  return (
    <html lang="ja">
      <QueryClientProvider client={queryClient}>
        <head>
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
          <SSRProvider>
            <RouterProvider router={router} />
          </SSRProvider>
        </body>
      </QueryClientProvider>
    </html>
  );
}

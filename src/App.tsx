import { RouterProvider, type AnyRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SSRProvider } from "react-query-ssr";

import "./tailwind.css";

export function App<TRouter extends AnyRouter>({
  router,
}: {
  router: TRouter;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } })
  );
  return (
    <html lang="ja">
      <QueryClientProvider client={queryClient}>
        <SSRProvider>
          <head>
            <meta charSet="utf-8" />
            <meta
              content="width=device-width, initial-scale=1"
              name="viewport"
            />

            <link
              href={
                import.meta.env?.DEV
                  ? "/src/tailwind.css"
                  : "/static/tailwind.css"
              }
              rel="stylesheet"
            />

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
            {import.meta.env?.DEV ? (
              <script type="module" src="/src/client.tsx"></script>
            ) : (
              <script type="module" src="/static/client.js"></script>
            )}
          </head>
          <body className="p-2">
            <RouterProvider router={router} />
          </body>
        </SSRProvider>
      </QueryClientProvider>
    </html>
  );
}

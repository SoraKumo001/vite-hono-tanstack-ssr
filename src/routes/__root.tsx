import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SSRDataRender, SSRProvider } from "react-query-ssr";

import "../tailwind.css";

export const Route = createRootRoute({
  component: RootComponent,
  ssr: true,
});

function RootComponent() {
  const [queryClient] = useState(
    () =>
      new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <SSRProvider>
        <html lang="ja">
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
                  : "/assets/tailwind.css"
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
            <script
              type="module"
              src={
                import.meta.env?.DEV ? "/src/client.tsx" : "/assets/client.js"
              }
            ></script>
            <SSRDataRender />
          </head>
          <body className="p-2">
            <Outlet />
          </body>
        </html>
      </SSRProvider>
    </QueryClientProvider>
  );
}

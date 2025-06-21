import { ReactNode } from "react";
import { RouterProvider } from "./RouterProvider";
import { SSRBodyRoot, SSRHeadRoot, SSRProvider } from "next-ssr";

export const Html = ({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) => {
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
            <RouterProvider url={url}>{children}</RouterProvider>
          </div>
          <SSRBodyRoot />
        </body>
      </SSRProvider>
    </html>
  );
};

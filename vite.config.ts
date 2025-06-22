import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import build from "@hono/vite-build/node";

export default defineConfig(({ mode }) => {
  return {
    ssr: {
      noExternal: process.env.NODE_ENV !== "development" || undefined,
      resolve: {
        externalConditions: ["worker"],
      },
      target: "webworker",
    },
    build:
      mode === "client"
        ? {
            rollupOptions: {
              input: ["src/client.tsx"],
              output: {
                entryFileNames: () => {
                  return "static/[name].js";
                },
              },
            },
          }
        : undefined,
    plugins: [
      react(),
      mode !== "client" &&
        build({
          entry: "src/server.tsx",
        }),
      devServer({
        injectClientScript: false,
        entry: "src/server.tsx",
      }),
    ],
  };
});

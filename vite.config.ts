import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import build from "@hono/vite-build/node";
import tanstackRouter from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  return {
    ssr: {
      noExternal: process.env.NODE_ENV !== "development" || undefined,
      resolve: {
        externalConditions: ["worker"],
      },
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
                assetFileNames: "static/tailwind.css",
              },
            },
          }
        : undefined,
    plugins: [
      tanstackRouter({
        target: "react",
        // autoCodeSplitting: process.env.NODE_ENV !== "development",
      }),
      react(),
      mode !== "client" &&
        build({
          entry: "src/server.tsx",
        }),
      devServer({
        injectClientScript: false,
        entry: "src/server.tsx",
      }),
      tailwindcss(),
    ],
  };
});

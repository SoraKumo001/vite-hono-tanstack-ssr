import { Hono } from "hono";
import { renderToReadableStream } from "react-dom/server.browser";
import { serveStatic } from "@hono/node-server/serve-static";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

type Env = {};

const app = new Hono<Env>();
app.use("/static/*", serveStatic({ root: "./dist" }));
app.use("/assets/*", serveStatic({ root: "./dist" }));
app.use("/favicon.ico", serveStatic({ root: "./dist" }));
app.get("*", async (c) => {
  try {
    const url = new URL(c.req.url);
    const history = createMemoryHistory({
      initialEntries: [url.pathname + url.search + url.hash],
    });
    router.update({
      history,
    });
    await router.load();
    if (router.hasNotFoundMatch()) {
      throw new Error("Not found");
    }
    const stream = await renderToReadableStream(
      <RouterProvider router={router} />,
      {
        onError: () => {},
      }
    );
    await stream.allReady;
    return c.body(stream, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (e) {
    if (e instanceof Error && e.message === "Not found") {
      return c.notFound();
    }
    throw e;
  }
});

export default app;

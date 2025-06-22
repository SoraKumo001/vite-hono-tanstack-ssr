import { hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./root";

const router = createRouter({
  routeTree,
});

hydrateRoot(document, <App router={router} />);

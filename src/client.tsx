import { hydrateRoot } from "react-dom/client";
import { App, routeTree } from "./Components/App";
import { createRouter } from "@tanstack/react-router";

const router = createRouter({
  routeTree,
});

hydrateRoot(document, <App router={router} />);

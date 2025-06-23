import { hydrateRoot } from "react-dom/client";
import { router } from "./router";
import { RouterProvider } from "@tanstack/react-router";

hydrateRoot(document, <RouterProvider router={router} />, {
  onRecoverableError: () => {},
});

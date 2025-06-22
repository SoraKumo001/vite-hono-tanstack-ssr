import { hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { router } from "./router";

hydrateRoot(document, <App router={router} />);

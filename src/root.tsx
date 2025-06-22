import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import Home from "./pages";
import Weather from "./pages/weather";

const rootRoute = createRootRoute({
  component: () => {
    return <Outlet />;
  },
  notFoundComponent: () => {
    return <p>This setting page doesn't exist!</p>;
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const weatherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/weather/$code",
  component: Weather,
});

export const routeTree = rootRoute.addChildren([indexRoute, weatherRoute]);

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { ErrorPage } from "./error-page";
import { RootRoute } from "@/app/router/root";
import type { AppRoute } from "@/app/router";
import { routes } from "@/app/router";
import { NotFoundRoute } from "@/app/router/404";

function generateRoutes(routesConfig: AppRoute[]): ReactNode {
  return routesConfig
    .filter((route) => !route.disabled && !route.external)
    .map((route) => {
      const element = route.element || null;

      const childRoutes = route.children?.map((child) => {
        const childElement = child.element || null;
        return <Route key={child.path} path={child.path} element={childElement} errorElement={<ErrorPage />} />;
      });

      // Return both the parent route and its children as separate routes
      return (
        <Fragment key={route.path}>
          <Route key={route.path} path={route.path} element={element} errorElement={<ErrorPage />} />
          {childRoutes}
        </Fragment>
      );
    });
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootRoute />} errorElement={<ErrorPage />}>
      {generateRoutes(routes)}
      <Route path="*" element={<NotFoundRoute />} errorElement={<ErrorPage />} />
    </Route>,
  ),
);

export const Router = () => <RouterProvider router={router} />;

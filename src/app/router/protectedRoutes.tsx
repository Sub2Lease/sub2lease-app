import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useIsAuthenticated } from "@/app/stores/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoutes({ children }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  // if (!isAuthenticated) {
  //   // TODO Fix later.
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return <>{children}</>;
}
import type { ReactNode } from "react";
import { Landing } from "@/pages/Landing/Landing"
import { Listings, ListingDetails } from "@/pages/Listings";
import { Dashboard } from "@/pages/Dashboard";
import { Login, Signup } from "@/pages/Auth";
import { ProtectedRoutes } from "@/app/router/protectedRoutes";
import { CreateListing } from "@/pages/Create/CreateListing";

export interface AppRoute {
  name: string;
  path: string;
  element?: ReactNode;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  children?: AppRoute[];
  target?: string;
  external?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  noLayout?: boolean;
  label?: string;
  authenticatedOnly?: boolean;
}

export const LISTING_PARAM = "listingId"

export const routes: AppRoute[] = [
  {
    name: "Home",
    path: "/",
    element: <Landing />,
  },
  {
    name: "Login",
    path: "/login",
    element: <Login />,
  },
  {
    name: "Sign Up",
    path: "/signup",
    element: <Signup />,
  },
  {
    name: "Create Listing",
    path: "/listings/create",
    authenticatedOnly: true,
    element: (
      <ProtectedRoutes>
        <CreateListing />
      </ProtectedRoutes>
    ),
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    authenticatedOnly: true,
    element: (
      <ProtectedRoutes>
        <Dashboard />
      </ProtectedRoutes>
    ),
  },
  {
    name: "Listings",
    path: "/listings",
    element: <Listings />,
  },
  {
    name: "Listing Details",
    path: `/listings/:${LISTING_PARAM}`,
    element: <ListingDetails />,
  },
];
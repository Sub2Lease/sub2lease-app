import type { ReactNode } from "react";
import { Landing } from "@/pages/Landing/Landing"
import { Listings, ListingDetails } from "@/pages/Listings";
import { Dashboard } from "@/pages/Dashboard";
import { Login, Signup } from "@/pages/Auth";
import { ProtectedRoutes } from "@/app/router/protectedRoutes";
import { CreateListing } from "@/pages/Create/CreateListing";
import { EditListing } from "@/pages/Create/EditListing";
import { MessagesPage } from "@/pages/Messages/Messages";

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
    name: "Edit Listing",
    path: `/listings/:listingId/edit`,
    authenticatedOnly: true,
    hidden: true,
    element: (
      <ProtectedRoutes>
        <EditListing />
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
  {
    name: "Messages",
    path: "/messages",
    authenticatedOnly: true,
    element: (
      <ProtectedRoutes>
        <MessagesPage />
      </ProtectedRoutes>
    ),
  },
  {
    name: "Messages (conversation)",
    path: "/messages/:userId",
    authenticatedOnly: true,
    hidden: true,
    element: (
      <ProtectedRoutes>
        <MessagesPage />
      </ProtectedRoutes>
    ),
  },
];
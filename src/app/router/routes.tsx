import type { ReactNode } from "react";
import { Landing } from "@/pages/Landing/Landing"

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

export const routes: AppRoute[] = [
  {
    name: "Home",
    path: "/",
    element: <Landing />,
  },
  // {
  //   name: "Partners",
  //   path: ROUTES.PARTNERS,
  //   element: <Partners />,
  //   children: [
  //     {
  //       name: "Partner",
  //       path: ROUTES.PARTNER,
  //       element: <Partner />,
  //       hidden: true,
  //     },
  //   ],
  // },
  // {
  //   name: "Account",
  //   path: ROUTES.ACCOUNT,
  //   element: (
  //     <ProtectedRoute>
  //       <Account />
  //     </ProtectedRoute>
  //   ),
  //   hidden: true,
  //   authenticatedOnly: true,
  // },
];
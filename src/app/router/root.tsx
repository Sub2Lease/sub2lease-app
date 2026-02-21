import { Outlet, matchPath, useLocation } from "react-router";
import { routes } from "./routes";
import { Layout } from "@/widgets/layout/Layout";
import { EmptyLayout } from "@/widgets/layout/EmptyLayout"
import { Toaster } from "@/components/ui/sonner";

export function RootRoute() {
    const location = useLocation();
    const shouldUseEmptyLayout = routes.some((route) => route.noLayout && matchPath(route.path, location.pathname));
    const ConditionalLayout = shouldUseEmptyLayout ? EmptyLayout : Layout;

    return (
        <>
        <ConditionalLayout>
            <Outlet />
        </ConditionalLayout>
        <Toaster richColors expand closeButton />
        </>
    );
}

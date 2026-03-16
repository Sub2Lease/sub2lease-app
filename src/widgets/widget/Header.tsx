import { useNavigate } from "react-router-dom";
import { clearToken, useIsAuthenticated } from "@/app/stores/authStore";
import { Logo } from "./Logo";

export function Header() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-50 h-[88px]">
      <header className="bg-transparent">
        <div className="flex items-center justify-between gap-2 px-8 py-5">
          <Logo />
          <div className="flex items-center gap-2.5">
            {isAuthenticated && (
              <button
                onClick={() => navigate("/listings/create")}
                className="rounded-full border border-black/20 bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-50"
              >
                Post listing
              </button>
            )}
            <button
              onClick={isAuthenticated ? handleLogout : () => navigate("/login")}
              className="rounded-full border border-black/20 bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-50"
            >
              {isAuthenticated ? "👤" : "Login"}
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => navigate("/signup")}
                className="rounded-full border border-black/20 bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-50"
              >
                Sign up
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
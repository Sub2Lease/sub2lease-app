import { useNavigate } from "react-router-dom";
import { clearToken, useIsAuthenticated } from "@/app/stores/authStore";
import { Logo } from "./Logo";

export function LandingHeader() {
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
          {/* Logo */}
          <Logo isLink={false} color="white" />

          {/* Auth buttons */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/listings/create")}
                  className="rounded-full border border-wise-white/60 px-5 py-2 text-sm font-medium text-wise-white transition-colors hover:bg-wise-white/10"
                >
                  Post listing
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-wise-white/60 px-5 py-2 text-sm font-medium text-wise-white transition-colors hover:bg-wise-white/10"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-full border border-wise-white/60 px-5 py-2 text-sm font-medium text-wise-white transition-colors hover:bg-wise-white/10"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="rounded-full border border-wise-white/60 px-5 py-2 text-sm font-medium text-wise-white transition-colors hover:bg-wise-white/10"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
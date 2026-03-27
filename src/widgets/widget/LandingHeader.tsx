import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@/app/stores/authStore";
import { Logo } from "./Logo";
import { useState } from "react";
import { SideDrawer } from "../layout/Layout/SideDrawer";

export function LandingHeader() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-50 h-[88px]">
        <header className="bg-transparent">
          <div className="flex items-center justify-between gap-2 py-6">
            <Logo isLink={false} color="white" />
            <div className="flex items-center gap-2.5">
              {isAuthenticated && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-full border border-wise-white/60 px-5 py-2 text-sm font-medium text-wise-white transition-colors hover:bg-wise-white/10"
                >
                  Dashboard
                </button>
              )}
              {!isAuthenticated && (
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
              {isAuthenticated && (
                <button
                  onClick={() => setMenuOpen(true)}
                  className="flex items-center gap-2 rounded-full border border-wise-white/60 px-4 py-2 text-wise-white transition-colors hover:bg-wise-white/10"
                >
                  <span className="text-base">☰</span>
                  <span className="text-base">👤</span>
                </button>
              )}
            </div>
          </div>
        </header>
      </div>

      <SideDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
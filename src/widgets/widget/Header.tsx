import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@/app/stores/authStore";
import { Logo } from "./Logo";
import { useState } from "react";
import { SideDrawer } from "../layout/Layout/SideDrawer";

export function Header() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-50 h-[88px]">
        <header className="bg-transparent h-full">
          <div className="flex items-center justify-between gap-2 h-full px-0">
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
              {!isAuthenticated && (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="rounded-full border border-black/20 bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="rounded-full border border-black/20 bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-50"
                  >
                    Sign up
                  </button>
                </>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => setMenuOpen(true)}
                  className="flex items-center gap-2 rounded-full border border-black/20 bg-white px-4 py-2 text-black transition-colors hover:bg-gray-50 shadow-sm"
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
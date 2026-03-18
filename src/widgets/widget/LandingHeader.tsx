import { useNavigate } from "react-router-dom";
import { clearToken, useIsAuthenticated } from "@/app/stores/authStore";
import { Logo } from "./Logo";
import { useState } from "react";

export function LandingHeader() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    clearToken();
    navigate("/");
    setMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="sticky top-0 z-50 h-[88px]">
        <header className="bg-transparent">
          <div className="flex items-center justify-between gap-2 py-6">
            <Logo isLink={false} color="white" />
            <div className="flex items-center gap-2.5">
              {isAuthenticated && (
                <button
                  onClick={() => handleNavigate("/dashboard")}
                  className="rounded-full border border-wise-white/60 px-5 py-2 text-sm font-medium text-wise-white transition-colors hover:bg-wise-white/10"
                >
                  Dashboard
                </button>
              )}
              {!isAuthenticated && (
                <>
                  <button
                    onClick={() => handleNavigate("/login")}
                    className="rounded-full border border-wise-white/60 px-5 py-2 text-sm font-medium text-wise-white transition-colors hover:bg-wise-white/10"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigate("/signup")}
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

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Side drawer */}
      <div className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
          <span className="font-semibold text-lg">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col px-4 py-4 gap-1">
          <button
            onClick={() => handleNavigate("/listings")}
            className="text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
          >
            Browse listings
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleNavigate("/listings/create")}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
              >
                Post a listing
              </button>
              <button
                onClick={() => handleNavigate("/dashboard")}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
              >
                Dashboard
              </button>
              <div className="border-t border-black/10 my-2" />
              <button
                onClick={handleLogout}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigate("/login")}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigate("/signup")}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
              >
                Sign up
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
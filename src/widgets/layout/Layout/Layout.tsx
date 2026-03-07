import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useNavigate, useLocation, matchPath } from "react-router";
import hero from "@/assets/video/Hero.mp4";
import { SideMenu } from "./SideMenu";

export function Layout({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = matchPath("/", location.pathname);

  return (
    <div className="relative min-h-screen">
      {isLanding && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
        >
          <source src={hero} type="video/mp4" />
        </video>
      )}

      {/* <div className="fixed inset-0 -z-10 bg-black/70" /> */}

      <div className="mx-auto">
        <div className="relative flex min-h-screen flex-col gap-5 p-6 lg:p-10 lg:pt-6">
          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="sticky top-0 z-50 h-[88px]">
            <header className="bg-transparent">
              <div className="flex items-center justify-between gap-2 px-8 py-5">

                {/* Logo */}
                <button
                  onClick={() => navigate("/")}
                  className="text-wise-white text-2xl font-bold tracking-tight"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  Memento
                </button>

                {/* Auth buttons */}
                <div className="flex items-center gap-2.5">
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
                </div>

              </div>
            </header>
          </div>

          {/* ── Main content ───────────────────────────────────────────── */}
          <main className="full-height-minus-header-and-footer flex flex-col gap-5">
            {children}
          </main>

          <div className="h-[20px]" />
          <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </div>
  );
}
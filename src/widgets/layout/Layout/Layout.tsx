import type { PropsWithChildren } from "react";
import { useState } from "react";
import hero from "@/assets/video/Hero.mp4";
import Menu from "./Menu";
import { BurgerMenuButton } from "./BurgerMenuButton";
import { SideMenu } from "./SideMenu";
import { useLocation, matchPath } from "react-router";

export function Layout({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const isLanding = matchPath("/", location.pathname);

  return (
    <div className="relative min-h-screen">
      {isLanding && (<>
        <video
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
      >
        <source src={hero} type="video/mp4" />
        </video>
      </>)}
      <div className="fixed inset-0 -z-10 bg-black/70" />

      <div className="mx-auto max-w-screen-2xl">
        <div className="relative flex min-h-screen flex-col gap-5 p-6 lg:p-10 lg:pt-6">
          <div className="sticky top-0 z-50 h-[72px]">
            <header
              className="
                gradient-border gradient-border-white gradient-radius-full
                bg-black/60 backdrop-blur-md
                shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
              "
            >
              <div className="flex items-center justify-between gap-2 px-5 py-[15px] transition-all">
                <BurgerMenuButton isOpen={isOpen} setIsOpen={setIsOpen} className="md:hidden" />
                <Menu className="hidden md:flex" />
                <div className="flex h-[40px] gap-2.5 lg:gap-5" />
              </div>
            </header>
          </div>

          <main className="full-height-minus-header-and-footer flex flex-col gap-5">{children}</main>

          <div className="h-[20px]" />
          <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </div>
  );
}
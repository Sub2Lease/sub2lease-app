import type { PropsWithChildren } from "react";
import { useState } from "react";
import Menu from "./Menu";
import { BurgerMenuButton } from "./BurgerMenuButton";
import { SideMenu } from "./SideMenu";
// import { AccountDropdown } from "./AccountDropdown";
// import { Footer } from "./Footer";
// import TurtleLogo from "@/assets/icons/turtle-logo.svg";

export function Layout({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mx-auto max-w-screen-2xl">
      <p>hello?</p>
      <div className="relative flex min-h-screen flex-col gap-5 p-6 lg:p-10 lg:pt-6">
        {/* Fixed header with explicit height */}
        <div className="sticky top-0 z-50 h-[72px]">
          <header className="gradient-border gradient-border-white gradient-radius-full bg-ninja-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-2 px-5 py-[15px] transition-all">
              {/* Mobile menu button */}
              <BurgerMenuButton isOpen={isOpen} setIsOpen={setIsOpen} className="md:hidden" />

              {/* Desktop logo with fixed dimensions */}
              {/* <TurtleLogo className="ml-5 hidden h-5 w-[82px] lg:block" /> */}

              {/* Desktop menu */}
              <Menu className="hidden md:flex" />

              {/* Profile dropdown and connect wallet button */}
              <div className="flex h-[40px] gap-2.5 lg:gap-5">
                {/* <AccountDropdown /> */}
              </div>
            </div>
          </header>
        </div>

        {/* Main content with explicit min-height */}
        <main className="full-height-minus-header-and-footer flex flex-col gap-5">{children}</main>

        {/* Footer with fixed height */}
        <div className="h-[20px]">
          {/* <Footer /> */}
        </div>

        <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
}

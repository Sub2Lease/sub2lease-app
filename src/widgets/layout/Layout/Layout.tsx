import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useLocation, matchPath } from "react-router";
import hero from "@/assets/video/Hero.mp4";
import { SideMenu } from "./SideMenu";
import { LandingHeader } from "../../widget/LandingHeader";
import { Logo } from "@/widgets/widget/Logo";

function Header() {
  return <div className="flex">
    <div className="mr-auto"><Logo /></div>
    <button className="p-2 rounded-full">☰</button>
    <button className="p-2 rounded-full bg-white shadow">👤</button>
  </div>
}

export function Layout({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLanding = matchPath("/", location.pathname);

  return (
    <div className={`relative ${isLanding ? "min-h-screen" : "h-screen overflow-hidden"}`}>
      {isLanding && (
        <video autoPlay muted loop playsInline
          className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover">
          <source src={hero} type="video/mp4" />
        </video>
      )}
      <div className={`mx-auto ${isLanding ? "" : "h-full overflow-hidden"}`}>
        <div className={`relative flex flex-col gap-5 p-6 lg:p-10 lg:pt-6
          ${isLanding ? "min-h-screen" : "h-full overflow-hidden"}`}>
          {isLanding ? <LandingHeader /> : <Header />}
          <main className={`flex flex-col gap-5
            ${isLanding ? "full-height-minus-header-and-footer" : "flex-1 overflow-hidden min-h-0"}`}>
            {children}
          </main>
          {isLanding && <div className="h-[20px]" />}
          <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </div>
  );
}
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useLocation, matchPath } from "react-router";
import { SideMenu } from "./SideMenu";
import { LandingHeader } from "../../widget/LandingHeader";
import { Header } from "../../widget/Header";

export function Layout({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLanding = matchPath("/", location.pathname);
  const madison_video_url = "https://ffeiqqfembwxavvqihpd.supabase.co/storage/v1/object/public/frontend_assets/Hero.mp4";

  return (
    <div className={`relative ${isLanding ? "min-h-screen" : "h-screen"}`}>
      {isLanding && (
        <video autoPlay muted loop playsInline
          preload="auto" 
          className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover">
          <source src={madison_video_url} type="video/mp4" />
        </video>
      )}
      <div className={`mx-auto ${isLanding ? "" : "h-full"}`}>
        <div className={`relative flex flex-col gap-5 p-6 lg:p-10 lg:pt-6
          ${isLanding ? "!py-0" : "h-full overflow-hidden"}`}>
          {isLanding ? <LandingHeader /> : <Header />}
          <main className={`flex flex-col gap-5
            ${isLanding ? "full-height-minus-header-and-footer" : "flex-1 min-h-0"}`}>
            {children}
          </main>
          {isLanding && <div className="h-[20px]" />}
          <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </div>
  );
}
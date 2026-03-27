import type { PropsWithChildren } from "react";
import { useState, useRef, useEffect } from "react";
import { useLocation, matchPath } from "react-router";
import { SideMenu } from "./SideMenu";
import { LandingHeader } from "../../widget/LandingHeader";
import { Header } from "../../widget/Header";
import hero from "@/assets/videos/Hero_noaudio.mp4";

export function Layout({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLanding = matchPath("/", location.pathname);

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      const retry = () => {
        video.play().catch(() => {});
      };
      window.addEventListener("pointerdown", retry, { once: true });
    });
  }, []);

  return (
    <div className={`relative ${isLanding ? "min-h-screen" : "h-screen"}`}>
      {isLanding && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
        >
          <source src={hero} type="video/mp4" />
        </video>
      )}
      <div className={`mx-auto ${isLanding ? "" : "h-full"}`}>
        <div
          className={`relative flex flex-col gap-5 px-6 lg:px-10
            ${isLanding ? "" : "h-full overflow-hidden"}`}
        >
          {isLanding ? <LandingHeader /> : <Header />}
          <main
            className={`flex flex-col gap-5
              ${isLanding ? "full-height-minus-header-and-footer" : "flex-1 min-h-0"}`}
          >
            {children}
          </main>
          {isLanding && <div className="h-[20px]" />}
          <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </div>
  );
}
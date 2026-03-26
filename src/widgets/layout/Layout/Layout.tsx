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

    const tryPlay = () => {
      video.play().catch((err) => {
        console.error("play failed:", err);
      });
    };

    // Make sure these are set on the element itself
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // Force browser to begin loading the media
    video.load();

    // If enough data is already ready, try immediately
    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
      video.addEventListener("loadeddata", tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
    };
  }, []);

  return (
    <div className={`relative ${isLanding ? "min-h-screen" : "h-screen"}`}>
      {isLanding && (
        <video
          ref={videoRef}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
        >
          <source src={hero} type="video/mp4" />
        </video>
      )}
      <div className={`mx-auto ${isLanding ? "" : "h-full"}`}>
        <div
          className={`relative flex flex-col gap-5 px-6 pt-6 lg:px-10 lg:pt-6
          ${isLanding ? "!py-0" : "h-full overflow-hidden"}`}
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
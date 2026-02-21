import { useEffect } from "react";
import Menu from "./Menu";
import { cn } from "@/shared/utils";

export function SideMenu({
  isOpen,
  setIsOpen,
  direction = "left",
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  direction?: "left" | "right";
}) {
  const slideTransform = {
    left: {
      open: "translate-x-0",
      closed: "-translate-x-full",
    },
    right: {
      open: "translate-x-0",
      closed: "translate-x-full",
    },
  };

  useEffect(() => {}, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 bg-ninja-black transition-transform duration-300 ease-in-out",
        isOpen ? slideTransform[direction].open : slideTransform[direction].closed,
        direction === "left" ? "md:-translate-x-full" : "md:translate-x-full",
      )}
      aria-hidden={!isOpen}
    >
      <div className="size-full px-6 pb-5 pt-[125px]">
        <Menu closeSheet={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
